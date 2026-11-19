import {
  CalendarCheck,
  Stethoscope,
  BedDouble,
  Pill,
  Syringe,
  Megaphone,
  LifeBuoy,
  Building2,
} from 'lucide-react'
import { doctors, departments } from './mock'

// Homepage search targets, built from existing mock data to avoid duplication.
export const quickLinks = [
  { type: 'Quick link', label: 'Book an appointment', to: '/appointments', icon: CalendarCheck },
  { type: 'Quick link', label: 'Find a doctor', to: '/doctors', icon: Stethoscope },
  { type: 'Quick link', label: 'Check bed availability', to: '/beds', icon: BedDouble },
  { type: 'Quick link', label: 'Track medications', to: '/medications', icon: Pill },
  { type: 'Quick link', label: 'Vaccination alerts', to: '/vaccinations', icon: Syringe },
  { type: 'Quick link', label: 'Healthcare campaigns', to: '/campaigns', icon: Megaphone },
  { type: 'Quick link', label: 'Contact support', to: '/support', icon: LifeBuoy },
]

export const searchIndex = [
  ...quickLinks,
  ...doctors.map((d) => ({
    type: 'Doctor',
    label: d.name,
    sub: `${d.specialty} · ${d.experience} yrs`,
    to: `/doctors?q=${encodeURIComponent(d.name)}`,
    icon: Stethoscope,
  })),
  ...departments.map((dept) => ({
    type: 'Department',
    label: dept,
    sub: 'View doctors in this department',
    to: `/doctors?q=${encodeURIComponent(dept)}`,
    icon: Building2,
  })),
]

export function searchMediVerse(query, limit = 7) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return searchIndex
    .filter((item) => item.label.toLowerCase().includes(q) || item.sub?.toLowerCase().includes(q))
    .slice(0, limit)
}
