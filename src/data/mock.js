// MediVerse — mock/local data layer.
// Structured so it's a drop-in seam for a real API later: swap the arrays
// below for fetch() calls and every page keeps working unchanged.

export const departments = [
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'General Medicine',
  'Dermatology',
  'Neurology',
]

export const doctors = [
  { id: 'd1', name: 'Dr. Anjali Rao', specialty: 'Cardiology', experience: 12, status: 'available', rating: 4.8, nextSlot: 'Today, 4:30 PM' },
  { id: 'd2', name: 'Dr. Vikram Sen', specialty: 'Orthopedics', experience: 9, status: 'in-surgery', rating: 4.6, nextSlot: 'Tomorrow, 10:00 AM' },
  { id: 'd3', name: 'Dr. Meera Iyer', specialty: 'Pediatrics', experience: 15, status: 'available', rating: 4.9, nextSlot: 'Today, 2:00 PM' },
  { id: 'd4', name: 'Dr. Arjun Nair', specialty: 'Neurology', experience: 7, status: 'off-duty', rating: 4.5, nextSlot: 'Mon, 9:00 AM' },
  { id: 'd5', name: 'Dr. Kavya Menon', specialty: 'Dermatology', experience: 6, status: 'available', rating: 4.7, nextSlot: 'Today, 5:15 PM' },
  { id: 'd6', name: 'Dr. Rahul Verma', specialty: 'General Medicine', experience: 20, status: 'available', rating: 4.9, nextSlot: 'Today, 1:00 PM' },
]

export const bedStats = [
  { id: 'icu', label: 'ICU', total: 20, occupied: 18 },
  { id: 'general', label: 'General Ward', total: 120, occupied: 74 },
  { id: 'pediatric', label: 'Pediatric', total: 40, occupied: 15 },
  { id: 'maternity', label: 'Maternity', total: 30, occupied: 27 },
  { id: 'emergency', label: 'Emergency', total: 15, occupied: 6 },
  { id: 'isolation', label: 'Isolation', total: 10, occupied: 3 },
]

export const initialMedications = [
  { id: 'm1', name: 'Amoxicillin 500mg', schedule: '8:00 AM, 8:00 PM', remaining: 6, taken: false },
  { id: 'm2', name: 'Metformin 500mg', schedule: '9:00 AM', remaining: 12, taken: true },
  { id: 'm3', name: 'Atorvastatin 10mg', schedule: '10:00 PM', remaining: 20, taken: false },
]

export const vaccinations = [
  { id: 'v1', name: 'Influenza (Flu) Shot', dueDate: '2026-08-14', status: 'due-soon' },
  { id: 'v2', name: 'Tdap Booster', dueDate: '2026-09-30', status: 'scheduled' },
  { id: 'v3', name: 'Hepatitis B — Dose 2', dueDate: '2026-07-28', status: 'overdue' },
  { id: 'v4', name: 'COVID-19 Booster', dueDate: '2026-11-05', status: 'scheduled' },
]

export const campaigns = [
  {
    id: 'c1',
    title: 'Free Blood Donation Camp',
    date: '2026-08-15',
    tag: 'Community',
    description: 'Join our city-wide blood donation drive at the main campus atrium. Walk-ins welcome, 9 AM – 5 PM.',
  },
  {
    id: 'c2',
    title: 'Childhood Vaccination Drive',
    date: '2026-08-20',
    tag: 'Vaccination',
    description: 'Free scheduled vaccinations for children under 5, in partnership with the district health office.',
  },
  {
    id: 'c3',
    title: 'Diabetes Screening Week',
    date: '2026-09-01',
    tag: 'Screening',
    description: 'Complimentary blood sugar screening and consultation for all registered patients.',
  },
]

export const appointmentSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM', '5:00 PM']
