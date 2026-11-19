# MediVerse core logic, in a terminal

The same functions the MediVerse website runs, extracted so they can be read and
executed without a browser, a server or an internet connection.

## Running it in front of someone

Three ways, all already set up in this folder. No `npm install`, zero
dependencies, zero network calls. Node 18 or newer.

| How | What happens |
| --- | --- |
| **Ctrl+`** | opens a terminal that runs the walkthrough immediately, then leaves a live prompt |
| **Ctrl+Shift+B** | runs the walkthrough as a build task in its own panel |
| **Ctrl+Shift+P** then `Run Task` | choose section-by-section mode, or the interactive assistant |

By hand, from any terminal in this folder:

```
node run.js            # the walkthrough, straight through
node run.js --step      # pauses after each section, Enter to continue
node ask.js            # type a question, see where the app sends you
.\demo.cmd             # step mode, then the interactive prompt
```

## What is in here

| File | Taken from | What it decides |
| --- | --- | --- |
| `core/auth.js` | `src/lib/auth.js` | SHA-256 staff/admin credential check |
| `core/otp.js` | `src/lib/otp.js` | passwordless six-digit login code |
| `core/assistantIntents.js` | `src/data/assistantIntents.js` | the keyword table, copied byte for byte |
| `core/triage.js` | `src/components/ChatAssistant.jsx` | crisis / emergency / routing decision |
| `core/beds.js` | `src/hooks/useBedAvailability.js` | ward bed count and its input clamping |
| `core/appointments.js` | `src/context/AppointmentsContext.jsx` | one booking store, patient and ward views |

`run.js` prints 31 checks. `core/assistantIntents.js` is verified against the
app's copy by checksum at the start of section 3, so "it is the same code" is a
claim you can watch being tested rather than one you have to take on trust.

## What is honestly different from the deployed app

Three substitutions, each marked in the file that makes it:

1. **Hashing.** The browser uses `crypto.subtle.digest('SHA-256')`; Node uses
   `node:crypto`. Same digest, same comparison.
2. **Login codes.** Production verifies the code through Supabase, server-side,
   and gets back a signed JWT. This runs the local fallback path, which is the
   same state machine with the mail provider removed.
3. **Storage.** The React versions persist to `localStorage`. Here the stores are
   in memory, which is also why the keying is visible: `mediverse-beds:kem` is a
   different key from `mediverse-beds:vishwaraj`.

Nothing else is changed. The routing logic, the clamping, the scoring and the
failure cases are the code that ships.

## What this does not do

It is not a symptom checker and it never diagnoses. The router maps words to a
destination: a department, a hospital page, or a government service. The three
branches exist in that order on purpose, and section 3 of the walkthrough shows
why: a crisis phrase has to be caught before an emergency phrase, and an
emergency phrase before anything that would offer to book an appointment.
