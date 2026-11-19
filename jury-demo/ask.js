// Ask the assistant anything, from the terminal.
//
//   npm run ask
//
// Hand this to the jury: they type a sentence, and it prints which branch the
// router took, why, and where the app would send that person. Same code as the
// chat bubble on the website, with the chat bubble taken off.

import { createInterface } from 'node:readline'
import { buildReply } from './core/triage.js'

const color = process.stdout.isTTY && !process.env.NO_COLOR
const red = (s) => (color ? `\x1b[31m${s}\x1b[0m` : s)
const green = (s) => (color ? `\x1b[32m${s}\x1b[0m` : s)
const cyan = (s) => (color ? `\x1b[36m${s}\x1b[0m` : s)
const dim = (s) => (color ? `\x1b[2m${s}\x1b[0m` : s)
const bold = (s) => (color ? `\x1b[1m${s}\x1b[0m` : s)

const BRANCH = {
  crisis: { label: 'CRISIS', why: 'matched a crisis phrase, checked before everything else' },
  emergency: { label: 'EMERGENCY', why: 'matched an emergency red flag, so 108 comes first' },
  route: { label: 'ROUTE', why: 'highest-scoring keyword match' },
  unknown: { label: 'UNKNOWN', why: 'nothing matched, so it says so instead of guessing' },
}

console.log(bold('\nMediVerse assistant - ask it anything'))
console.log(dim('Type a sentence and press Enter. Ctrl+C to quit.'))
console.log(dim('Try: chest pain  /  baby vaccine due  /  my knee hurts  /  hospital near me\n'))

const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: cyan('you > ') })
rl.prompt()

rl.on('line', (input) => {
  const text = input.trim()
  if (!text) {
    rl.prompt()
    return
  }
  if (text === 'exit' || text === 'quit') {
    rl.close()
    return
  }

  const reply = buildReply(text)
  const branch = BRANCH[reply.kind]
  const urgent = reply.kind === 'emergency' || reply.kind === 'crisis'

  console.log('')
  console.log(`  branch   ${urgent ? red(bold(branch.label)) : green(bold(branch.label))}  ${dim(branch.why)}`)
  if (reply.via) console.log(`  matched  ${reply.via}  ${dim(`(score ${reply.score})`)}`)
  console.log(`  says     ${reply.reply}`)
  for (const action of reply.actions) {
    const where = action.tel
      ? `dial ${action.tel}`
      : action.to
        ? `app page ${action.to}`
        : action.href
    console.log(`  button   ${bold(action.label)}  ${dim('-> ' + where)}`)
  }
  console.log('')
  rl.prompt()
})

rl.on('close', () => {
  console.log(dim('\nbye\n'))
})
