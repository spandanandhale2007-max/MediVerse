// MediVerse "Signal Cross" brand mark: a medical cross with an ECG pulse.
// The cross uses currentColor (inherits container text colour); the pulse is
// a fixed ECG-rose accent. Drop-in for the old <Activity> icon — same `size`.
export default function BrandGlyph({ size = 24, className, style }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M50 24 V76 M24 50 H76" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      <path
        d="M12 50 H33 l4 -15 l6 28 l5 -19 l4 6 H88"
        stroke="#ff5a76"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
