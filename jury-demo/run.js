// MediVerse core logic - terminal walkthrough.
//
// Runs every extracted module and checks it behaves the way the web app does.
// No dependencies, no network, no database.
//
//   node run.js            run it straight through
//   node run.js --step     pause after each section, Enter to continue
//
// Each section prints what went in, what came out, and a PASS/FAIL line for
// the behaviour that matters. The exit code is non-zero if anything fails.

import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { verifyStaffCredentials } from './core/auth.js'
import { requestOtp, confirmOtp, normaliseEmail, isValidEmail } from './core/otp.js'
import { buildReply, destinationOf } from './core/triage.js'
import { getBeds, setBeds, DEFAULT_BEDS } from './core/beds.js'
import { createStore } from './core/appointments.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const color = process.stdout.isTTY && !process.env.NO_COLOR
const green = (s) => (color ? `\x1b[32m${s}\x1b[0m` : s)
const red = (s) => (color ? `\x1b[31m${s}\x1b[0m` : s)
const dim = (s) => (color ? `\x1b[2m${s}\x1b[0m` : s)
const bold = (s) => (color ? `\x1b[1m${s}\x1b[0m` : s)

// --step turns the walkthrough into slides: it waits for Enter between
// sections so there is room to talk over each one.
const STEP = process.argv.includes('--step')
let rl = null
let noMoreInput = false

function pause() {
  if (!STEP || noMoreInput) return Promise.resolve()
  rl ??= createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    // If input is piped rather than typed it can run out. Carry on to the end
    // instead of hanging: a demo that stalls is worse than one that runs on.
    const onClose = () => {
      noMoreInput = true
      resolve()
    }
    rl.once('close', onClose)
    rl.question(dim('  -- Enter to continue --  '), () => {
      rl.removeListener('close', onClose)
      resolve()
    })
  })
}

let checks = 0
let failures = 0

function check(ok, what) {
  checks++
  if (!ok) failures++
  console.log(ok ? `  ${green('[PASS]')} ${what}` : `  ${red('[FAIL]')} ${what}`)
}

function heading(title) {
  console.log(`\n${bold('== ' + title + ' ==')}`)
}

function note(text) {
  console.log(dim('  ' + text))
}

console.clear()
console.log(bold('MediVerse core logic - terminal walkthrough'))
console.log(dim('The same functions the website runs, with the browser removed.'))
console.log(dim(`Node ${process.version}  |  0 dependencies  |  0 network calls`))

// --------------------------------------------------------------- 1. auth
heading('1. Staff credential check   (from src/lib/auth.js)')

const good = verifyStaffCredentials('staff', 'vishwaraj', 'vishwaraj@123')
console.log('  input   : vishwaraj / vishwaraj@123')
console.log(`  sha-256 : ${good.attempted}`)
console.log('  stored  : 561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324')
check(good.ok && good.user.name === 'VishwaRaj Hospital - Ward Desk', 'the correct password signs in')
check(good.user.hospitalId === 'vishwaraj', 'the session carries hospitalId, so the console scopes to one hospital')

const wrong = verifyStaffCredentials('staff', 'vishwaraj', 'vishwaraj@1234')
check(!wrong.ok && wrong.reason === 'wrong-password', 'one extra character is rejected')
check(!verifyStaffCredentials('staff', 'ghost', 'anything').ok, 'an unknown user is rejected')
check(verifyStaffCredentials('staff', 'VISHWARAJ', 'vishwaraj@123').ok, 'the username is case-insensitive')
check(!verifyStaffCredentials('staff', 'vishwaraj', 'VISHWARAJ@123').ok, 'the password is not')

// The admin hash comes from the environment. With none set it must fail
// closed: an empty password must NOT match an empty stored hash.
const adminEmail = process.env.VITE_ADMIN_EMAIL || 'admin@example.com'
check(!verifyStaffCredentials('admin', adminEmail, '').ok, 'an unconfigured admin account fails closed')
note('The web app says this in the same file: with no backend the check runs in')
note('the browser, so it is bypassable. Real enforcement is supabase/schema.sql.')

await pause()

// ---------------------------------------------------------------- 2. otp
heading('2. Passwordless login code   (from src/lib/otp.js)')

check(normaliseEmail('  Spandan@Gmail.com ') === 'spandan@gmail.com', 'the address is normalised, so one person is one account')
check(!isValidEmail('spandan@gmail'), 'an address with no top-level domain is refused')

const sent = requestOtp('Spandan@Gmail.com')
console.log(`  code issued for spandan@gmail.com : ${bold(sent.devCode)}`)
check(/^\d{6}$/.test(sent.devCode), 'the code is six digits')
check(confirmOtp('spandan@gmail.com', '000000') === false, 'a wrong code is rejected')
check(confirmOtp('  SPANDAN@gmail.com  ', sent.devCode) === true, 'the right code signs in however it was typed')
check(confirmOtp('spandan@gmail.com', sent.devCode) === false, 'the same code cannot be replayed: it is consumed on use')
note('Production does not verify here. The deployed app calls Supabase')
note('(signInWithOtp / verifyOtp) and the code is checked on their server.')

await pause()

// ------------------------------------------------------------- 3. triage
heading('3. Assistant routing   (from src/components/ChatAssistant.jsx)')

const copy = createHash('sha256').update(readFileSync(join(HERE, 'core/assistantIntents.js'))).digest('hex')
let original = null
try {
  original = createHash('sha256').update(readFileSync(join(HERE, '../src/data/assistantIntents.js'))).digest('hex')
} catch {
  /* demo folder moved away from the app, so skip the comparison */
}
if (original) {
  check(copy === original, `the intent table is byte-identical to the website's (sha-256 ${copy.slice(0, 12)})`)
} else {
  note('(app sources not alongside this folder, skipping the checksum compare)')
}

const samples = [
  'chest pain since morning',
  'i want to end my life',
  'is there a hospital near me',
  'i have no money for the operation',
  'medicines are too expensive',
  'baby vaccine due',
  'heart specialist in pune',
  'my knee hurts',
  'what benefit schemes are there',
  'blah blah random text',
]

console.log('')
for (const text of samples) {
  const reply = buildReply(text)
  const label = reply.kind.toUpperCase().padEnd(9)
  const urgent = reply.kind === 'emergency' || reply.kind === 'crisis'
  console.log(`  ${('"' + text + '"').padEnd(37)} ${urgent ? red(label) : green(label)} ${destinationOf(reply)}`)
}
console.log('')

check(buildReply('chest pain since morning').kind === 'emergency', 'a red flag reaches 108 before anything else is considered')
check(buildReply('i want to end my life').actions[0].tel === '14416', 'a mental-health crisis gets Tele-MANAS, not an ambulance')
check(buildReply('what benefit schemes are there').kind === 'route', "'fit' inside 'benefit' does NOT trigger the ambulance path")
check(buildReply('is there a hospital near me').via === 'intent:hospital', "'ear' inside 'near' does NOT route to ENT")
check(buildReply('baby vaccine due').via === 'intent:vaccination', "'baby vaccine' beats a bare 'baby': the longer phrase wins")
check(buildReply('heart specialist in pune').via === 'specialty:Cardiology', "a body area beats the generic word 'specialist'")
check(buildReply('blah blah random text').kind === 'unknown', 'nonsense gets an honest fallback, not a guess')
note('Keyword scoring, not an LLM. It never diagnoses: every answer ends at a')
note('real doctor, hospital or government service.')

await pause()

// --------------------------------------------------------------- 4. beds
heading('4. Ward bed count   (from src/hooks/useBedAvailability.js)')

check(getBeds('vishwaraj') === DEFAULT_BEDS, `a new ward starts at the default of ${DEFAULT_BEDS}`)
console.log(`  ward desk types 42     -> ${setBeds('vishwaraj', 42)}`)
console.log(`  ward desk types -5     -> ${setBeds('kem', -5)}`)
console.log(`  ward desk types 12.7   -> ${setBeds('sassoon', 12.7)}`)
console.log(`  ward desk types "abc"  -> ${setBeds('ruby', 'abc')}`)
check(getBeds('kem') === 0, 'a negative count is clamped to 0, never displayed as negative')
check(getBeds('sassoon') === 13, 'a fraction is rounded to a whole bed')
check(getBeds('ruby') === 0, 'junk input does not corrupt the count')
check(getBeds('vishwaraj') === 42 && getBeds('kem') === 0, 'each hospital keeps its own count, keyed separately')

await pause()

// ------------------------------------------------------- 5. appointments
heading('5. Appointments   (from src/context/AppointmentsContext.jsx)')

const store = createStore()
store.book({ hospitalId: 'vishwaraj', patientEmail: 'spandan@gmail.com', patientName: 'Spandan A.', department: 'Cardiology', date: '2026-11-21', slot: '10:30' })
const second = store.book({ hospitalId: 'vishwaraj', patientEmail: 'asha@gmail.com', patientName: 'Asha K.', department: 'Orthopedics', date: '2026-11-21', slot: '11:00' })
store.book({ hospitalId: 'kem', patientEmail: 'spandan@gmail.com', patientName: 'Spandan A.', department: 'ENT', date: '2026-11-24', slot: '09:15' })

console.log('  what the VishwaRaj ward console sees:')
for (const appt of store.forHospital('vishwaraj')) {
  console.log(`    ${appt.date}  ${appt.slot}  ${appt.department.padEnd(12)} ${appt.patientName.padEnd(11)} ${appt.status}`)
}
check(store.forHospital('vishwaraj').length === 2, "the ward console sees only its own hospital's bookings")
check(store.forPatient('spandan@gmail.com').length === 2, 'a patient sees only their own, across hospitals')
check(store.forHospital('kem').length === 1, 'a second hospital is isolated from the first')

store.cancel(second.id)
const cancelled = store.forHospital('vishwaraj').find((a) => a.id === second.id)
check(cancelled.status === 'cancelled', 'cancelling at the console updates the record both sides read')
check(store.all().length === 3, 'a cancelled appointment is kept, not deleted, so there is a history')
note('One store, two views. The React version saves to localStorage, so this is')
note('per-browser today; swapping this one file for Supabase makes it shared.')

// ------------------------------------------------------------- summary
console.log('')
const line = `${checks} checks, ${failures} ${failures === 1 ? 'failure' : 'failures'}`
console.log(failures === 0 ? green(bold('  ' + line)) : red(bold('  ' + line)))
console.log(dim('  Ask it a question yourself:  npm run ask'))
console.log('')

rl?.close()
process.exitCode = failures === 0 ? 0 : 1
