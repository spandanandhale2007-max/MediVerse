// Live ECG trace behind the page, like a hospital monitor.
//
// Two layers: a slower, taller, fainter back layer and a normal-speed front
// layer. The speed difference gives a parallax depth effect.
//
// Each layer is one svg holding the beat pattern twice, end to end, in a track
// that translates 0% to -50%. When the first copy scrolls off, the second is
// exactly where the first began, so the loop is seamless.
//
// Only `transform` animates, so both layers stay on the compositor thread with
// no per-frame repaint. (Animating background-position would repaint each frame
// and is why most animated backgrounds feel sluggish.)
//
// Colour is --status-critical, the existing emergency red, so no new hue. Low
// opacity over an opaque background keeps body-copy contrast. Reduced-motion
// users see the same trace, held still.

// One cardiac cycle over 240 units: baseline, P wave, sharp QRS spike, then
// the broader T wave — shaped like a real rhythm strip, not a zigzag.
const BEAT = `
  M0,40 H52
  q10,-9 20,0
  H96
  L104,52 L112,10 L122,64 L130,40
  H160
  q14,-13 28,0
  H240
`

function Track({ className }) {
  return (
    <div className={className}>
      {[0, 1].map((copy) => (
        <svg key={copy} className="ecg-svg" viewBox="0 0 240 80" preserveAspectRatio="none" focusable="false">
          <path d={BEAT} className="ecg-path" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </div>
  )
}

export default function EcgBackdrop() {
  return (
    <div className="ecg-backdrop" aria-hidden="true">
      {/* Soft red bloom the beats pass through, so the trace looks lit. */}
      <div className="ecg-bloom" />
      <Track className="ecg-track ecg-track--back" />
      <Track className="ecg-track ecg-track--front" />
    </div>
  )
}
