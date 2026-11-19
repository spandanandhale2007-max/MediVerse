// Real Government of India health schemes and services.
//
// Only durable facts go here. National schemes are stable for years, but
// specific camps (dates, venues) go stale within days — hardcoding them would
// send someone to a camp that already finished, worse than showing nothing.
// So date/location-specific data links out to the government finders in
// `liveFinders` below, which own the live data.
//
// Every entry checked against its official source on 2026-08-09; figures move,
// so they're written as "as of" rather than fixed.

export const govPrograms = [
  {
    id: 'pmbjp',
    category: 'Medicine savings',
    name: 'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (Jan Aushadhi)',
    short: 'Generic medicines at 50–80% below branded prices',
    body: 'Government-run outlets selling quality-assured generic medicines. Prices are capped at a maximum of 50% of the average price of the top three branded equivalents, and in many cases run 80–90% cheaper. All stock is sourced from WHO-GMP certified manufacturers and tested in NABL-accredited labs.',
    facts: ['19,502 Kendras nationwide (as of April 2026)', '~₹38,000 crore saved by patients to date'],
    who: 'Open to everyone — no card, no registration, no income test.',
    url: 'https://janaushadhi.gov.in/',
    action: 'Find a Jan Aushadhi Kendra',
    tone: '#2f8f4e',
  },
  {
    id: 'pmjay',
    category: 'Free treatment',
    name: 'Ayushman Bharat PM-JAY',
    short: '₹5 lakh a year of cashless hospital treatment',
    body: 'Cashless secondary and tertiary hospital care for eligible families, with no premium to pay, no waiting period, and no cap on family size or age. Citizens aged 70+ get an additional ₹5 lakh cover of their own regardless of income.',
    facts: ['32,000+ empanelled hospitals, public and private', 'Apply free on the portal or the Ayushman app with Aadhaar e-KYC'],
    who: 'Families on the SECC deprivation criteria, plus everyone aged 70 and above.',
    url: 'https://beneficiary.nha.gov.in/',
    action: 'Check your eligibility',
    tone: '#1c7a72',
  },
  {
    id: 'esanjeevani',
    category: 'Free consultation',
    name: 'eSanjeevani — National Telemedicine Service',
    short: 'Free video consultation with a government doctor',
    body: "The Health Ministry's telemedicine service. Consult a qualified government doctor by video from home and receive a digital prescription, at no cost. Useful for fever, skin complaints, follow-ups, prescription refills, second opinions and mental-health counselling.",
    facts: ['Available 24×7 in 22 Indian languages', 'Helpline 14416', 'Token wait is typically 5–30 minutes'],
    who: 'Any Indian resident with a mobile number.',
    url: 'https://esanjeevani.mohfw.gov.in/',
    action: 'Start a free consultation',
    tone: '#2a78d6',
  },
  {
    id: 'eraktkosh',
    category: 'Blood donation',
    name: 'e-RaktKosh',
    short: 'National blood bank network, live stock and donation camps',
    body: 'The Health Ministry and NHM blood-bank system, built by C-DAC. Shows blood availability by group at banks near you, lists upcoming donation camps, and lets you register as a donor. This is where camp listings actually live and stay current.',
    facts: ['Covers blood banks nationwide', 'Live stock by blood group', 'Camp listings updated by the banks themselves'],
    who: 'Donors aged 18–65 meeting the standard health criteria.',
    url: 'https://eraktkosh.mohfw.gov.in/',
    action: 'Find camps & blood banks',
    tone: '#d03b3b',
  },
  {
    id: 'indradhanush',
    category: 'Immunisation',
    name: 'Mission Indradhanush',
    short: 'Catch-up immunisation for missed children and pregnant women',
    body: 'A targeted drive to reach children and pregnant women who missed routine immunisation, concentrating on low-coverage and hard-to-reach areas. Vaccines under the Universal Immunisation Programme are free at government facilities.',
    facts: ['Full immunisation coverage 62% (2015) → 98.4% (January 2026)', '5.46 crore infants and 1.32 crore pregnant women reached across 12 phases'],
    who: 'Children who have missed doses, and pregnant women.',
    url: 'https://mohfw.gov.in/',
    action: 'Read the programme details',
    tone: '#ec835a',
  },
  {
    id: 'hpv',
    category: 'Immunisation',
    name: 'National HPV Vaccination Campaign',
    short: 'Free cervical-cancer vaccination for 14-year-old girls',
    body: 'A nationwide campaign launched on 28 February 2026 offering HPV vaccination to protect against cervical cancer. Delivered through government health facilities and schools.',
    facts: ['Launched 28 February 2026 from Ajmer, Rajasthan', 'Target group: girls aged 14'],
    who: '14-year-old girls, through government facilities and schools.',
    url: 'https://mohfw.gov.in/',
    action: 'Find your nearest centre',
    tone: '#c2447a',
  },
]

// Time- or location-specific data lives on these portals, not in our bundle,
// so users always see today's data kept current by the people responsible.
export const liveFinders = [
  {
    id: 'find-blood',
    label: 'Blood donation camps near you',
    body: 'Camp dates, venues and organisers — listed and kept current by the blood banks running them.',
    url: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/campSchedule.cnt',
    tone: '#d03b3b',
  },
  {
    id: 'find-stock',
    label: 'Live blood stock by group',
    body: 'Check which nearby blood bank currently holds the group you need before travelling.',
    url: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt',
    tone: '#e0364f',
  },
  {
    id: 'find-kendra',
    label: 'Nearest Jan Aushadhi Kendra',
    body: 'Locate a government generic-medicine outlet by state, district and PIN code.',
    url: 'https://janaushadhi.gov.in/KendraDetails.aspx',
    tone: '#2f8f4e',
  },
  {
    id: 'find-vaccine',
    label: 'Vaccination centres (CoWIN)',
    body: 'Government vaccination centre finder and registration.',
    url: 'https://www.cowin.gov.in/',
    tone: '#7a5af8',
  },
  {
    id: 'find-hospital',
    label: 'Hospitals empanelled under PM-JAY',
    body: "Search the 32,000+ hospitals where an Ayushman card is accepted, by state and speciality.",
    url: 'https://hospitals.pmjay.gov.in/Search/',
    tone: '#1c7a72',
  },
]
