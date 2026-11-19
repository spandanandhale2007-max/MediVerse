import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Send, Siren, Phone, ExternalLink, Info, RotateCcw } from 'lucide-react'
import { redFlags, crisisWords, intents, suggestions, specialtyHints, matches } from '../data/assistantIntents'

// MediVerse assistant — a guide to the app, not a clinician.
// Routes people to the right page or government scheme; never diagnoses or
// suggests treatment. See data/assistantIntents.js for the reasoning.
// Matching is simple keyword scoring, not an LLM: there's no backend, and a
// model would sound more confident without being more correct — worse here.

const AMBULANCE = '108'
const TELE_MANAS = '14416'

// Shared by initial state and "Start over" so the greeting stays identical.
const INTRO = {
  from: 'bot',
  kind: 'intro',
  reply:
    "Hello. Tell me what you need and I'll take you to the right place — a hospital, a specialist, or a government scheme that covers the cost.",
}

// Longer phrases score higher, so "baby vaccine" beats a bare "baby".
function scoreList(text, phrases) {
  return phrases.reduce((score, phrase) => (matches(text, phrase) ? Math.max(score, phrase.length) : score), 0)
}

function buildReply(raw) {
  const text = raw.toLowerCase().trim()

  // 1. Crisis first — a helpline, not an ambulance form.
  if (crisisWords.some((w) => matches(text, w))) {
    return {
      kind: 'crisis',
      reply:
        "I'm sorry you're going through this, and I'm not the right thing to be talking to. Please speak to someone now — Tele-MANAS is free, 24×7, and staffed by trained counsellors.",
      actions: [
        { label: `Call Tele-MANAS ${TELE_MANAS}`, tel: TELE_MANAS },
        { label: 'Talk to a doctor free (eSanjeevani)', href: 'https://esanjeevani.mohfw.gov.in/' },
      ],
    }
  }

  // 2. Anything that reads like an emergency — surface 108 before navigating.
  if (redFlags.some((w) => matches(text, w))) {
    return {
      kind: 'emergency',
      reply:
        "That sounds urgent. Please call an ambulance now rather than waiting on this app — I can't assess how serious something is, and a dispatcher can.",
      actions: [
        { label: `Call ${AMBULANCE} now`, tel: AMBULANCE },
        { label: 'Request an ambulance to your area', to: '/emergency' },
      ],
    }
  }

  // 3. Score body-area hints and app intents together, not one before the
  // other, so the longer/more specific phrase wins — e.g. "baby vaccine due"
  // should reach the vaccination schedule, not Pediatrics on "baby".
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
  // department wins regardless of which word was longer.
  const GENERIC = new Set(['specialist', 'appointment', 'support'])
  const intentIsGeneric = intentScored && GENERIC.has(intentScored.intent.id)

  const useIntent =
    intentScored && (!hintScored || (intentIsGeneric ? false : intentScored.score >= hintScored.score))

  if (useIntent) return { kind: 'route', reply: intentScored.intent.reply, actions: intentScored.intent.actions }

  if (hintScored) {
    const { specialty } = hintScored.hint
    return {
      kind: 'route',
      reply: `For that, ${specialty} is usually the right department. I can't tell you what's causing it — a doctor there can.`,
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

// Friendly assistant face. A drawn character (not a chat glyph) invites a
// question, and the blink makes it feel present rather than printed.
function BotFace({ size = 30, thinking = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {/* antenna */}
      <line x1="20" y1="4" x2="20" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="3.5" r="2.4" fill="currentColor" className={thinking ? 'bot-antenna' : undefined} />
      {/* head */}
      <rect x="6" y="9" width="28" height="23" rx="8" fill="currentColor" />
      {/* eyes — what makes the face read as alive */}
      <g className="bot-eyes" fill="var(--brand)">
        <circle cx="15" cy="19" r="2.9" />
        <circle cx="25" cy="19" r="2.9" />
      </g>
      {/* smile */}
      <path
        d="M15.5 25.5c1.4 1.5 7.6 1.5 9 0"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* ears */}
      <rect x="2.5" y="16" width="3.5" height="8" rx="1.75" fill="currentColor" opacity="0.75" />
      <rect x="34" y="16" width="3.5" height="8" rx="1.75" fill="currentColor" opacity="0.75" />
    </svg>
  )
}

// Three bouncing dots while a reply is composed. Even for an instant answer,
// a short beat makes it feel like a conversation, not a lookup.
function TypingDots() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-2xl rounded-bl-sm px-3 py-2.5"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  )
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([INTRO])
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, open, typing])

  // One-time nudge a few seconds in, so people notice the assistant without
  // it grabbing attention on load. Once per session — reappearing on every
  // navigation would nag.
  useEffect(() => {
    if (window.sessionStorage.getItem('mediverse-assistant-nudged')) return
    const t = setTimeout(() => {
      setNudge(true)
      window.sessionStorage.setItem('mediverse-assistant-nudged', '1')
      setTimeout(() => setNudge(false), 7000)
    }, 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Reset transcript to the greeting; also returns the chips to the message area.
  function reset() {
    setTyping(false)
    setMessages([INTRO])
    setInput('')
    inputRef.current?.focus()
  }

  function ask(text) {
    const q = text.trim()
    if (!q) return
    const answer = buildReply(q)
    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')
    inputRef.current?.focus()

    // Emergencies skip the typing beat — never delay an urgent answer.
    const urgent = answer.kind === 'emergency' || answer.kind === 'crisis'
    if (urgent) {
      setMessages((m) => [...m, { from: 'bot', ...answer }])
      return
    }
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { from: 'bot', ...answer }])
    }, 420)
  }

  return (
    <>
      {/* Launcher button — fixed to the right edge, vertically centred, so it
          stays put on every page and through any scrolling. */}
      <div className="is-overlay fixed right-4 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2">
        {/* One-time nudge, dismissible by opening the assistant. */}
        {nudge && !open && (
          <button
            type="button"
            onClick={() => {
              setNudge(false)
              setOpen(true)
            }}
            className="assistant-nudge no-pop hidden max-w-[13rem] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-left text-xs font-medium shadow-lg sm:block"
            style={{ background: 'var(--surface-1)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Need help finding something?
            <span className="mt-0.5 block text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>
              Ask me and I'll take you there.
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setNudge(false)
            setOpen((v) => !v)
          }}
          aria-expanded={open}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          className="assistant-launcher no-pop relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl"
          style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
        >
          {/* Radiating rings — the "live" cue. Decorative and behind the
              button, so they never intercept the click. */}
          {!open && (
            <>
              <span className="assistant-ring" aria-hidden="true" />
              <span className="assistant-ring assistant-ring--delayed" aria-hidden="true" />
            </>
          )}

          {open ? <X size={24} /> : <BotFace size={34} thinking={typing} />}

          {/* Online dot — signals "there is something here that responds". */}
          {!open && (
            <span
              aria-hidden="true"
              className="assistant-online absolute right-1 top-1 h-3.5 w-3.5 rounded-full"
              style={{ background: 'var(--status-good)', border: '2px solid var(--brand)' }}
            />
          )}
        </button>
      </div>

      {/* Opens left of the launcher on desktop so the button stays visible.
          On narrow screens the panel covers the button, which then acts as
          the close control. */}
      {open && (
        <div
          role="dialog"
          aria-label="MediVerse assistant"
          className="is-overlay assistant-panel fixed right-4 top-1/2 z-50 flex w-[min(23rem,calc(100vw-2rem))] -translate-y-1/2 flex-col overflow-hidden rounded-2xl shadow-2xl sm:right-24"
          style={{ maxHeight: 'min(34rem, calc(100vh - 4rem))', background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        >
          {/* header */}
          <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <BotFace size={24} thinking={typing} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">MediVerse Assistant</p>
              <p className="flex items-center gap-1.5 text-xs opacity-85">
                <span className="assistant-online h-1.5 w-1.5 rounded-full" style={{ background: '#7ff0a0' }} />
                {typing ? 'Typing…' : 'Online — finds you the right place'}
              </p>
            </div>
          </div>

          {/* the boundary, stated up front rather than buried */}
          <p
            className="flex items-start gap-1.5 px-3 py-2 text-[11px] leading-snug"
            style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
          >
            <Info size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
            I help you navigate — I can't diagnose anything or advise on medicine. For anything urgent, call {AMBULANCE}.
          </p>

          {/* transcript */}
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) =>
              m.from === 'user' ? (
                <div key={i} className="flex justify-end">
                  <p
                    className="max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-sm"
                    style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
                  >
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={i} className="space-y-2">
                  <p
                    className="max-w-[92%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm"
                    style={{
                      background:
                        m.kind === 'emergency' || m.kind === 'crisis'
                          ? 'color-mix(in srgb, var(--status-critical) 12%, transparent)'
                          : 'var(--surface-2)',
                      color: 'var(--text-primary)',
                      border:
                        m.kind === 'emergency' || m.kind === 'crisis'
                          ? '1px solid color-mix(in srgb, var(--status-critical) 35%, transparent)'
                          : '1px solid var(--border)',
                    }}
                  >
                    {(m.kind === 'emergency' || m.kind === 'crisis') && (
                      <Siren size={14} className="mb-1 inline-block" style={{ color: 'var(--status-critical)' }} />
                    )}{' '}
                    {m.reply}
                  </p>

                  {m.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <Action key={a.label} action={a} urgent={m.kind === 'emergency' || m.kind === 'crisis'} onNavigate={() => setOpen(false)} />
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {typing && <TypingDots />}

            {/* On first open the chips sit in the transcript, reading as an
                invitation rather than a toolbar. */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Once a conversation has started the chips move here, above the
              input, and stay put. They used to disappear after the first
              question, which left no obvious way to start a new search —
              you had to know what to type. Scrolls sideways so all of them
              stay reachable without stealing height from the transcript. */}
          {messages.length > 1 && (
            <div className="shrink-0 px-3 pb-1 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  Ask something else
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RotateCcw size={11} /> Start over
                </button>
              </div>
              <div className="hscroll flex gap-1.5 pb-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex items-center gap-2 px-3 py-2.5"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you need help with?"
              aria-label="Ask the assistant"
              className="w-full rounded-full px-3.5 py-2 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-primary)' }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="no-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
              style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Action({ action, urgent, onNavigate }) {
  const style = urgent
    ? { background: 'var(--status-critical)', color: '#fff' }
    : { color: 'var(--brand)', background: 'var(--brand-soft-2)' }
  const cls = 'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold'

  if (action.tel) {
    return (
      <a href={`tel:${action.tel}`} className={cls} style={style}>
        <Phone size={11} /> {action.label}
      </a>
    )
  }
  if (action.href) {
    return (
      <a href={action.href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {action.label} <ExternalLink size={10} />
      </a>
    )
  }
  return (
    <Link to={action.to} onClick={onNavigate} className={cls} style={style}>
      {action.label}
    </Link>
  )
}
