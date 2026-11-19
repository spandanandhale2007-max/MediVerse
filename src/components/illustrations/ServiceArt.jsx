// Custom SVG artwork for service tiles and health-concern rails.
//
// Drawn, not photographed: ~1KB each, sharp at any size, no network, no
// licensing risk (stock photos are generic and heavy). Each takes a `tone`
// accent colour and paints from that plus a soft tint, so art and card match.
// aria-hidden throughout — the tile's text label is the accessible name, so
// announcing the art too would just repeat it.

const box = { viewBox: '0 0 64 64', 'aria-hidden': true, focusable: 'false' }

// Soft rounded backdrop every piece sits on, so the set reads as one family.
function Plate({ tone }) {
  return <rect x="2" y="2" width="60" height="60" rx="18" fill={tone} opacity="0.13" />
}

export function AppointmentArt({ tone = '#1c7a72', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <rect x="15" y="16" width="34" height="32" rx="5" fill="#fff" opacity="0.95" />
      <rect x="15" y="16" width="34" height="9" rx="5" fill={tone} />
      <rect x="21" y="12" width="3.5" height="8" rx="1.75" fill={tone} />
      <rect x="39.5" y="12" width="3.5" height="8" rx="1.75" fill={tone} />
      <rect x="20" y="30" width="7" height="6" rx="1.5" fill={tone} opacity="0.25" />
      <rect x="30" y="30" width="7" height="6" rx="1.5" fill={tone} opacity="0.25" />
      <rect x="20" y="39" width="7" height="6" rx="1.5" fill={tone} opacity="0.25" />
      <circle cx="41" cy="42" r="9" fill={tone} />
      <path d="M37 42.2l2.8 2.8 5.4-5.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function DoctorArt({ tone = '#2a78d6', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <circle cx="32" cy="23" r="8" fill="#fff" opacity="0.95" />
      <path d="M18 50c0-7.7 6.3-14 14-14s14 6.3 14 14" fill="#fff" opacity="0.95" />
      <path d="M25 37.5v5a7 7 0 0014 0v-5" stroke={tone} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="49" r="4.5" fill={tone} />
      <circle cx="32" cy="49" r="1.8" fill="#fff" />
      <rect x="27" y="14" width="10" height="4" rx="2" fill={tone} opacity="0.55" />
    </svg>
  )
}

export function BedArt({ tone = '#7a5af8', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <rect x="12" y="42" width="40" height="4" rx="2" fill={tone} />
      <rect x="13" y="46" width="3.5" height="7" rx="1.75" fill={tone} opacity="0.6" />
      <rect x="47.5" y="46" width="3.5" height="7" rx="1.75" fill={tone} opacity="0.6" />
      <path d="M12 42V27a4 4 0 014-4h4v19" fill="#fff" opacity="0.95" />
      <rect x="24" y="32" width="28" height="10" rx="4" fill="#fff" opacity="0.95" />
      <rect x="25" y="26" width="11" height="7" rx="3" fill={tone} opacity="0.35" />
      <circle cx="39" cy="27" r="4.5" fill={tone} />
      <path d="M43.5 20.5h7M47 17v7" stroke={tone} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

export function PillArt({ tone = '#c98500', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <rect x="14" y="26" width="26" height="13" rx="6.5" transform="rotate(-35 14 26)" fill="#fff" opacity="0.95" />
      <path d="M18.7 33.4l9.3-6.5" stroke={tone} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="41" cy="40" r="11" fill={tone} />
      <path d="M41 34.5v11M35.5 40h11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function VaccineArt({ tone = '#ec835a', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M38 16l10 10" stroke={tone} strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="24" width="22" height="11" rx="3" transform="rotate(45 22 24)" fill="#fff" opacity="0.95" />
      <path d="M26.5 28.5l7.8 7.8" stroke={tone} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M16 44l4-4" stroke={tone} strokeWidth="3" strokeLinecap="round" />
      <path d="M45 40c4.5 0 8 3.4 8 7.6 0 3-2 5.4-8 8.4-6-3-8-5.4-8-8.4 0-4.2 3.5-7.6 8-7.6z" fill={tone} />
      <path d="M41.5 47.8l2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function CampaignArt({ tone = '#2f8f4e', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M20 28l20-9v26l-20-9z" fill="#fff" opacity="0.95" />
      <rect x="13" y="27" width="8" height="10" rx="3" fill={tone} />
      <path d="M22 38l3 10h5l-2.5-10" fill={tone} opacity="0.6" />
      <circle cx="45" cy="24" r="3" fill={tone} opacity="0.45" />
      <circle cx="50" cy="32" r="2.2" fill={tone} opacity="0.35" />
      <circle cx="45" cy="40" r="2.8" fill={tone} opacity="0.45" />
    </svg>
  )
}

export function AmbulanceArt({ tone = '#d03b3b', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <rect x="10" y="28" width="26" height="15" rx="3" fill="#fff" opacity="0.95" />
      <path d="M36 33h8l7 7v3H36z" fill="#fff" opacity="0.95" />
      <rect x="38" y="34.5" width="6.5" height="5" rx="1.5" fill={tone} opacity="0.3" />
      <path d="M20 32.5v7M16.5 36h7" stroke={tone} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="21" cy="45.5" r="4.5" fill={tone} />
      <circle cx="21" cy="45.5" r="1.8" fill="#fff" />
      <circle cx="43" cy="45.5" r="4.5" fill={tone} />
      <circle cx="43" cy="45.5" r="1.8" fill="#fff" />
      <rect x="19" y="23" width="8" height="5" rx="2" fill={tone} opacity="0.7" />
    </svg>
  )
}

export function SpecialistArt({ tone = '#c2447a', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <circle cx="32" cy="26" r="11" fill="#fff" opacity="0.95" />
      <circle cx="32" cy="26" r="7" fill={tone} opacity="0.3" />
      <path d="M32 21.5l1.5 3.2 3.5.4-2.6 2.4.7 3.5-3.1-1.7-3.1 1.7.7-3.5-2.6-2.4 3.5-.4z" fill={tone} />
      <path d="M24 36l-3 15 11-5 11 5-3-15" fill={tone} opacity="0.75" />
    </svg>
  )
}

export function HospitalArt({ tone = '#0e7490', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <rect x="14" y="22" width="22" height="30" rx="3" fill="#fff" opacity="0.95" />
      <rect x="36" y="30" width="14" height="22" rx="3" fill="#fff" opacity="0.8" />
      <rect x="22" y="14" width="6" height="9" rx="2" fill={tone} opacity="0.6" />
      <path d="M25 27v7M21.5 30.5h7" stroke={tone} strokeWidth="2.6" strokeLinecap="round" />
      <rect x="19" y="38" width="5" height="5" rx="1.2" fill={tone} opacity="0.28" />
      <rect x="27" y="38" width="5" height="5" rx="1.2" fill={tone} opacity="0.28" />
      <rect x="19" y="46" width="5" height="5" rx="1.2" fill={tone} opacity="0.28" />
      <rect x="27" y="46" width="5" height="5" rx="1.2" fill={tone} opacity="0.28" />
      <rect x="39" y="36" width="4" height="4" rx="1" fill={tone} opacity="0.28" />
      <rect x="45" y="36" width="4" height="4" rx="1" fill={tone} opacity="0.28" />
      <rect x="39" y="43" width="4" height="4" rx="1" fill={tone} opacity="0.28" />
      <rect x="45" y="43" width="4" height="4" rx="1" fill={tone} opacity="0.28" />
    </svg>
  )
}

export function SupportArt({ tone = '#5b6ee1', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M32 16c-8.8 0-16 7-16 15.6V40h6a3 3 0 003-3v-6a3 3 0 00-3-3h-5.7" fill="none" stroke={tone} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 31.6C48 23 40.8 16 32 16" fill="none" stroke={tone} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 28.3v8.4a3 3 0 01-3 3h-3v-14.4h3a3 3 0 013 3z" fill={tone} />
      <path d="M16 28.3v8.4a3 3 0 003 3h3V25.3h-3a3 3 0 00-3 3z" fill={tone} />
      <path d="M45 40v2.5a5 5 0 01-5 5h-6" fill="none" stroke={tone} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="31" cy="47.5" r="3.6" fill="#fff" stroke={tone} strokeWidth="2.4" />
    </svg>
  )
}

// -------------------------------------------------- health-concern artwork
export function HeartArt({ tone = '#e0364f', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M32 49s-14-8.6-14-18a8 8 0 0114-5.3A8 8 0 0146 31c0 9.4-14 18-14 18z" fill={tone} />
      <path d="M20 34h6l2.5-5 4 10 3-5h8" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DiabetesArt({ tone = '#c98500', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M32 15c7 9 12 14.6 12 20.5A12 12 0 0132 48a12 12 0 01-12-12.5C20 29.6 25 24 32 15z" fill={tone} />
      <path d="M27 36a5 5 0 005 5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function BoneArt({ tone = '#6b7a99', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M24 24l16 16" stroke={tone} strokeWidth="7" strokeLinecap="round" />
      <circle cx="21" cy="21" r="5.5" fill={tone} />
      <circle cx="26.5" cy="26.5" r="5" fill={tone} />
      <circle cx="43" cy="43" r="5.5" fill={tone} />
      <circle cx="37.5" cy="37.5" r="5" fill={tone} />
    </svg>
  )
}

export function ChildArt({ tone = '#e08a3c', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <circle cx="32" cy="25" r="9" fill="#fff" opacity="0.95" />
      <circle cx="28.5" cy="24" r="1.7" fill={tone} />
      <circle cx="35.5" cy="24" r="1.7" fill={tone} />
      <path d="M28.5 29a5 5 0 007 0" stroke={tone} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M19 50a13 13 0 0126 0z" fill={tone} opacity="0.8" />
      <circle cx="22" cy="18" r="3.5" fill={tone} opacity="0.5" />
      <circle cx="42" cy="18" r="3.5" fill={tone} opacity="0.5" />
    </svg>
  )
}

export function EyeArt({ tone = '#2f8f8f', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M13 32s8-11 19-11 19 11 19 11-8 11-19 11-19-11-19-11z" fill="#fff" opacity="0.95" />
      <circle cx="32" cy="32" r="8" fill={tone} />
      <circle cx="32" cy="32" r="3.4" fill="#0b1220" />
      <circle cx="29.5" cy="29.5" r="1.6" fill="#fff" opacity="0.9" />
    </svg>
  )
}

export function MindArt({ tone = '#8b5cf6', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M32 16c-7.5 0-13 5.2-13 11.8 0 3 1 5 1 7.2 0 2.6-2 3.5-2 5.5 0 1.7 1.4 2.8 3.4 2.8H24v3.2a3 3 0 003 3h10a3 3 0 003-3V43h2.6c2 0 3.4-1.1 3.4-2.8 0-2-2-2.9-2-5.5 0-2.2 1-4.2 1-7.2C45 21.2 39.5 16 32 16z" fill="#fff" opacity="0.95" />
      <path d="M32 22v18M32 27l-5-3M32 33l5-3M32 39l-4.5 2.5" stroke={tone} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="22" r="2.4" fill={tone} />
      <circle cx="27" cy="24" r="2" fill={tone} />
      <circle cx="37" cy="30" r="2" fill={tone} />
    </svg>
  )
}

export function LungArt({ tone = '#3aa0c9', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M32 16v16" stroke={tone} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 26c-2 0-4 1.5-5 3.5M32 26c2 0 4 1.5 5 3.5" stroke={tone} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <path d="M27 29.5C24 34 18 36 18 42c0 5 2.5 8 6 8 3 0 4.5-2 4.5-5V33z" fill={tone} opacity="0.85" />
      <path d="M37 29.5C40 34 46 36 46 42c0 5-2.5 8-6 8-3 0-4.5-2-4.5-5V33z" fill={tone} opacity="0.85" />
    </svg>
  )
}

export function KidneyArt({ tone = '#a15ba1', size = 56 }) {
  return (
    <svg width={size} height={size} {...box}>
      <Plate tone={tone} />
      <path d="M28 18c-6 0-10 6-10 14s4 14 10 14c4 0 4-4 4-7s0-4 2-4h-6" fill={tone} opacity="0.9" />
      <path d="M36 18c6 0 10 6 10 14s-4 14-10 14c-4 0-4-4-4-7s0-4-2-4h6" fill={tone} opacity="0.65" />
      <path d="M32 32v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}
