// Intent table for the MediVerse assistant: maps typed input to the right
// page or government service.
//
// NOT a symptom checker — never diagnoses or suggests a medicine/dose. A
// keyword-guessed diagnosis carries the app's authority without a clinician's
// judgement, so every route ends at a real doctor, hospital, or gov service.
//
// ORDER MATTERS: `redFlags` is tested first, so "chest pain" gets 108
// immediately instead of an appointment offer.

// Word-PREFIX matching, not plain substring. `text.includes(word)` matched
// "ear" inside "n-ear", "fit" inside "benefit", "bp" inside anything.
// Anchoring to a word start fixes that but still catches inflections:
// "depress" matches "depressed", "pregnan" matches "pregnancy". No trailing
// boundary, so stems keep working.
export function matches(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}`, 'i').test(text)
}

// Phrases meaning "stop navigating, call for help now". Kept broad on purpose:
// a false positive costs a few seconds; a false negative could cost far more.
export const redFlags = [
  'chest pain',
  'heart attack',
  'cardiac',
  'stroke',
  'unconscious',
  'not breathing',
  "can't breathe",
  'cant breathe',
  'breathless',
  'severe bleeding',
  'bleeding heavily',
  'blood loss',
  'accident',
  'collapsed',
  'seizure',
  'fit',
  'poison',
  'overdose',
  'suicide',
  'kill myself',
  'end my life',
  'severe burn',
  'choking',
  'emergency',
  'ambulance',
  'dying',
]

// Mental-health crisis needs a helpline, not an ambulance. Tele-MANAS is the
// Government of India's free 24x7 mental health line.
export const crisisWords = ['suicide', 'kill myself', 'end my life', 'self harm', 'want to die']

export const intents = [
  {
    id: 'appointment',
    match: ['appointment', 'book', 'consult', 'see a doctor', 'checkup', 'check up', 'opd'],
    reply: 'You can book an appointment by department and pick a slot.',
    actions: [{ label: 'Book an appointment', to: '/appointments' }],
  },
  {
    id: 'specialist',
    match: ['specialist', 'which doctor', 'what doctor', 'refer', 'expert'],
    reply: 'Tell me your state and the field you need, and I can narrow it down. Or browse them all.',
    actions: [
      { label: 'Find a specialist', to: '/specialists' },
      { label: 'All doctors', to: '/doctors' },
    ],
  },
  {
    id: 'hospital',
    match: ['hospital', 'near me', 'nearby', 'address', 'directions', 'map', 'clinic'],
    reply: '234 real hospitals with verified addresses, phone numbers and one-tap directions.',
    actions: [{ label: 'Find hospitals near you', to: '/hospitals' }],
  },
  {
    id: 'medicine-cost',
    match: ['cheap medicine', 'medicine cost', 'expensive', 'afford', 'generic', 'jan aushadhi', 'discount', 'save money'],
    reply:
      'Jan Aushadhi Kendras are government outlets selling the same generic medicines at 50–80% below branded prices. No card or registration needed.',
    actions: [
      { label: 'About the scheme', to: '/campaigns' },
      { label: 'Find a Kendra', href: 'https://janaushadhi.gov.in/KendraDetails.aspx' },
    ],
  },
  {
    id: 'free-treatment',
    match: ['free treatment', 'cannot pay', "can't pay", 'no money', 'insurance', 'ayushman', 'pmjay', 'surgery cost', 'operation cost'],
    reply:
      'Ayushman Bharat PM-JAY covers ₹5 lakh a year of cashless hospital treatment. Everyone aged 70+ qualifies regardless of income.',
    actions: [
      { label: 'About PM-JAY', to: '/campaigns' },
      { label: 'Check eligibility', href: 'https://beneficiary.nha.gov.in/' },
    ],
  },
  {
    id: 'free-consult',
    match: ['free consultation', 'free doctor', 'online doctor', 'video call', 'telemedicine', 'esanjeevani'],
    reply:
      'eSanjeevani is the Health Ministry’s free telemedicine service — video consultation with a government doctor, 24×7, in 22 languages. Helpline 14416.',
    actions: [{ label: 'Start a free consultation', href: 'https://esanjeevani.mohfw.gov.in/' }],
  },
  {
    id: 'vaccination',
    match: ['vaccine', 'vaccination', 'immunisation', 'immunization', 'jab', 'shot', 'baby vaccine', 'child vaccine'],
    reply: 'There’s a full schedule from birth to older adulthood, showing what’s due and when.',
    actions: [{ label: 'Vaccination schedule', to: '/vaccinations' }],
  },
  {
    id: 'blood',
    match: ['blood', 'donate', 'donation', 'blood bank', 'blood group'],
    reply:
      'e-RaktKosh is the national blood bank network — live stock by group, and where donation camps are actually listed.',
    actions: [
      { label: 'Find blood banks', href: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt' },
      { label: 'Donation camps', href: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/campSchedule.cnt' },
    ],
  },
  {
    id: 'medication',
    match: ['medication', 'my medicines', 'dose', 'reminder', 'tablet', 'pill', 'refill', 'forgot to take'],
    reply:
      'You can track what you take and when. It shows timing guidance for medicines already prescribed to you — it never suggests starting one.',
    actions: [{ label: 'Medication tracker', to: '/medications' }],
  },
  {
    id: 'beds',
    match: ['bed', 'admission', 'admit', 'icu', 'ward'],
    reply: 'Here’s current bed occupancy by ward.',
    actions: [{ label: 'Bed availability', to: '/beds' }],
  },
  {
    id: 'schemes',
    match: ['scheme', 'government', 'yojana', 'benefit', 'camp', 'campaign'],
    reply: 'Six government health schemes you can use — free treatment, cheaper medicine, free consultations and more.',
    actions: [{ label: 'Government schemes', to: '/campaigns' }],
  },
  {
    id: 'support',
    match: ['support', 'help', 'complaint', 'problem', 'not working', 'bug', 'contact'],
    reply: 'Send us a message and a real person will reply by email.',
    actions: [{ label: 'Contact support', to: '/support' }],
  },
  {
    id: 'profile',
    match: ['profile', 'my details', 'change my', 'update my', 'my reports', 'my account'],
    reply: 'Your profile and everything you’ve raised with us are here.',
    actions: [
      { label: 'Your profile', to: '/profile' },
      { label: 'Your reports', to: '/reports' },
    ],
  },
]

// Tappable chips so the assistant is useful without guessing what to type —
// a blank input is intimidating, concrete examples are not.
export const suggestions = [
  'Find a hospital near me',
  'Medicines are too expensive',
  'I need a heart specialist',
  'Book an appointment',
  "I can't afford treatment",
  'Vaccination schedule',
]

// Body-area words → the department that treats them. ROUTING, not diagnosis:
// "chest" lists cardiologists, it doesn't say what's wrong.
export const specialtyHints = [
  { words: ['heart', 'cardiac', 'bp', 'blood pressure', 'palpitation'], specialty: 'Cardiology' },
  { words: ['sugar', 'diabetes', 'thyroid', 'hormone'], specialty: 'Endocrinology' },
  { words: ['bone', 'joint', 'knee', 'back pain', 'fracture', 'spine'], specialty: 'Orthopedics' },
  { words: ['child', 'kid', 'baby', 'infant', 'paediatric', 'pediatric'], specialty: 'Pediatrics' },
  { words: ['eye', 'vision', 'sight', 'spectacles'], specialty: 'Ophthalmology' },
  { words: ['mental', 'depress', 'anxiet', 'stress', 'sleep', 'psychiatr'], specialty: 'Psychiatry' },
  { words: ['lung', 'asthma', 'cough', 'chest infection', 'breathing problem'], specialty: 'Pulmonology' },
  { words: ['kidney', 'renal', 'dialysis', 'urine'], specialty: 'Nephrology' },
  { words: ['stomach', 'digest', 'liver', 'acidity', 'gastric'], specialty: 'Gastroenterology' },
  { words: ['skin', 'rash', 'acne', 'hair'], specialty: 'Dermatology' },
  { words: ['ear', 'nose', 'throat', 'sinus', 'tonsil'], specialty: 'ENT' },
  { words: ['pregnan', 'gynae', 'period', 'menstrual', 'maternity'], specialty: 'Gynaecology' },
  { words: ['cancer', 'tumour', 'tumor', 'oncolog', 'chemo'], specialty: 'Oncology' },
  { words: ['brain', 'nerve', 'headache', 'migraine', 'neuro'], specialty: 'Neurology' },
]
