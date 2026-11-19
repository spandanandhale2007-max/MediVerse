import { CheckCircle2, AlertTriangle, AlertOctagon, XCircle, Clock } from 'lucide-react'

// Always pairs color with an icon + text — never color alone (colorblind/print-safe).
const VARIANTS = {
  good: { color: 'var(--status-good)', bg: 'color-mix(in srgb, var(--status-good) 14%, transparent)', Icon: CheckCircle2 },
  warning: { color: 'var(--warn-fg)', bg: 'color-mix(in srgb, var(--status-warning) 22%, transparent)', Icon: AlertTriangle },
  serious: { color: 'var(--serious-fg)', bg: 'color-mix(in srgb, var(--status-serious) 20%, transparent)', Icon: AlertOctagon },
  critical: { color: 'var(--status-critical)', bg: 'color-mix(in srgb, var(--status-critical) 14%, transparent)', Icon: XCircle },
  neutral: { color: 'var(--text-secondary)', bg: 'var(--surface-2)', Icon: Clock },
}

export default function Badge({ variant = 'neutral', children, showIcon = true }) {
  const v = VARIANTS[variant] ?? VARIANTS.neutral
  const { Icon } = v
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: v.color, background: v.bg }}
    >
      {showIcon && <Icon size={13} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
