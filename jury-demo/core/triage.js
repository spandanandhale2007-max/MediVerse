// Assistant routing.
// Extracted from buildReply() in src/components/ChatAssistant.jsx, with the
// JSX removed. The decision logic below is unchanged, and the table it reads
// (core/assistantIntents.js) is a byte-for-byte copy of the file the website
// imports - run.js verifies that with a checksum.
//
// It is keyword scoring, not an LLM, on purpose: there is no backend, and a
// model would sound more confident without being more correct. It never
// diagnoses. Every path ends at a real doctor, hospital or government service.

import { redFlags, crisisWords, intents, specialtyHints, matches } from './assistantIntents.js'

const AMBULANCE = '108'
const TELE_MANAS = '14416'

// Longer phrases score higher, so "baby vaccine" beats a bare "baby".
function scoreList(text, phrases) {
  return phrases.reduce(
    (score, phrase) => (matches(text, phrase) ? Math.max(score, phrase.length) : score),
    0,
  )
}

export function buildReply(raw) {
  const text = raw.toLowerCase().trim()

  // 1. Crisis first - a helpline, not an ambulance.
  if (crisisWords.some((w) => matches(text, w))) {
    return {
      kind: 'crisis',
      reply:
        "I'm sorry you're going through this, and I'm not the right thing to be talking to. Please speak to someone now - Tele-MANAS is free, 24x7, and staffed by trained counsellors.",
      actions: [
        { label: `Call Tele-MANAS ${TELE_MANAS}`, tel: TELE_MANAS },
        { label: 'Talk to a doctor free (eSanjeevani)', href: 'https://esanjeevani.mohfw.gov.in/' },
      ],
    }
  }

  // 2. Anything that reads like an emergency - surface 108 before navigating.
  if (redFlags.some((w) => matches(text, w))) {
    return {
      kind: 'emergency',
      reply:
        "That sounds urgent. Please call an ambulance now rather than waiting on this app - I can't assess how serious something is, and a dispatcher can.",
      actions: [
        { label: `Call ${AMBULANCE} now`, tel: AMBULANCE },
        { label: 'Request an ambulance to your area', to: '/emergency' },
      ],
    }
  }

  // 3. Score body-area hints and app intents TOGETHER, not one before the
  // other, so the longer and more specific phrase wins.
  const hintScored = specialtyHints
    .map((h) => ({ hint: h, score: scoreList(text, h.words) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)[0]

  const intentScored = intents
    .map((i) => ({ intent: i, score: scoreList(text, i.match) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)[0]

  // Generic intents ("specialist", "appointment", "support") don't say WHICH
  // one. When a body area is also mentioned ("heart specialist"), the specific
  // department wins regardless of which word happened to be longer.
  const GENERIC = new Set(['specialist', 'appointment', 'support'])
  const intentIsGeneric = intentScored && GENERIC.has(intentScored.intent.id)

  const useIntent =
    intentScored &&
    (!hintScored || (intentIsGeneric ? false : intentScored.score >= hintScored.score))

  if (useIntent) {
    return {
      kind: 'route',
      via: `intent:${intentScored.intent.id}`,
      score: intentScored.score,
      reply: intentScored.intent.reply,
      actions: intentScored.intent.actions,
    }
  }

  if (hintScored) {
    const { specialty } = hintScored.hint
    return {
      kind: 'route',
      via: `specialty:${specialty}`,
      score: hintScored.score,
      reply: `For that, ${specialty} is usually the right department. I can't tell you what's causing it - a doctor there can.`,
      actions: [
        { label: `${specialty} doctors`, to: `/doctors?q=${encodeURIComponent(specialty)}` },
        { label: 'Find one near you', to: '/specialists' },
      ],
    }
  }

  return {
    kind: 'unknown',
    reply:
      "I didn't catch that. I can help you find hospitals, book appointments, reach the right specialist, or point you at government schemes for free treatment and cheaper medicine.",
    actions: [
      { label: 'Find hospitals', to: '/hospitals' },
      { label: 'Government schemes', to: '/campaigns' },
    ],
  }
}

// Where the reply sends you, as one short string for the walkthrough table.
export function destinationOf(reply) {
  const a = reply.actions?.[0]
  if (!a) return '-'
  if (a.tel) return `dial ${a.tel}`
  if (a.to) return a.to
  if (a.href) return a.href.replace(/^https?:\/\//, '')
  return '-'
}
