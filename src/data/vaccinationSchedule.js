// Lifetime India vaccination schedule (birth to older age).
// Sources: Govt UIP national schedule, IAP/ACVIP 2023, FOGSI/IAP pregnancy
// guidance, and general adult guidance (India has no single official adult
// schedule — flagged where relevant).
//
// tier: 'free' (govt UIP, no cost), 'recommended' (IAP/medical-society,
// usually private), or 'situational' (travel/outbreak/risk-based).
//
// General reference only, not personalised medical advice — see the
// disclaimer on the Vaccinations page.
export const vaccinationSchedule = [
  {
    stage: 'At Birth',
    doses: [
      { vaccine: 'BCG', protects: 'Tuberculosis', tier: 'free', note: 'Single dose, given intradermally, ideally within days of birth.' },
      { vaccine: 'OPV — Birth Dose (OPV-0)', protects: 'Polio', tier: 'free', note: 'Oral polio drops given within the first 15 days.' },
      { vaccine: 'Hepatitis B — Birth Dose', protects: 'Hepatitis B', tier: 'free', note: 'Given within 24 hours of birth.' },
    ],
  },
  {
    stage: '6 Weeks',
    doses: [
      { vaccine: 'Pentavalent — Dose 1', protects: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', tier: 'free' },
      { vaccine: 'OPV — Dose 1', protects: 'Polio', tier: 'free' },
      { vaccine: 'IPV — Dose 1', protects: 'Polio (injectable, fractional dose)', tier: 'free' },
      { vaccine: 'Rotavirus — Dose 1', protects: 'Rotavirus diarrhoea', tier: 'free' },
      { vaccine: 'PCV — Dose 1', protects: 'Pneumococcal disease (pneumonia, meningitis)', tier: 'free' },
    ],
  },
  {
    stage: '10 Weeks',
    doses: [
      { vaccine: 'Pentavalent — Dose 2', protects: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', tier: 'free' },
      { vaccine: 'OPV — Dose 2', protects: 'Polio', tier: 'free' },
      { vaccine: 'Rotavirus — Dose 2', protects: 'Rotavirus diarrhoea', tier: 'free' },
      { vaccine: 'PCV — Dose 2', protects: 'Pneumococcal disease', tier: 'free' },
    ],
  },
  {
    stage: '14 Weeks',
    doses: [
      { vaccine: 'Pentavalent — Dose 3', protects: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib', tier: 'free' },
      { vaccine: 'OPV — Dose 3', protects: 'Polio', tier: 'free' },
      { vaccine: 'IPV — Dose 2', protects: 'Polio (injectable, fractional dose)', tier: 'free' },
      { vaccine: 'Rotavirus — Dose 3', protects: 'Rotavirus diarrhoea', tier: 'free' },
      { vaccine: 'PCV — Booster', protects: 'Pneumococcal disease', tier: 'free' },
    ],
  },
  {
    stage: '6–9 Months',
    doses: [
      { vaccine: 'Typhoid Conjugate Vaccine', protects: 'Typhoid fever', tier: 'recommended', note: 'IAP-recommended from 6 months, single dose.' },
      { vaccine: 'Influenza — first series', protects: 'Seasonal flu', tier: 'recommended', note: 'Two doses, 4 weeks apart, then annually.' },
    ],
  },
  {
    stage: '9–12 Months',
    doses: [
      { vaccine: 'MR (Measles-Rubella) — Dose 1', protects: 'Measles, Rubella', tier: 'free' },
      { vaccine: 'Japanese Encephalitis — Dose 1', protects: 'Japanese Encephalitis', tier: 'free', note: 'Given in JE-endemic districts as part of UIP.' },
      { vaccine: 'MMR — Dose 1', protects: 'Measles, Mumps, Rubella', tier: 'recommended', note: 'IAP-preferred alternative/addition to MR, from 12 months.' },
    ],
  },
  {
    stage: '12–15 Months',
    doses: [
      { vaccine: 'Hepatitis A — Dose 1', protects: 'Hepatitis A', tier: 'recommended', note: 'Two doses, 6 months apart, from 12 months.' },
      { vaccine: 'Varicella — Dose 1', protects: 'Chickenpox', tier: 'recommended', note: 'From 15 months.' },
    ],
  },
  {
    stage: '16–24 Months',
    doses: [
      { vaccine: 'DPT — Booster 1', protects: 'Diphtheria, Pertussis, Tetanus', tier: 'free' },
      { vaccine: 'OPV — Booster', protects: 'Polio', tier: 'free' },
      { vaccine: 'MR — Dose 2', protects: 'Measles, Rubella', tier: 'free' },
      { vaccine: 'Japanese Encephalitis — Dose 2', protects: 'Japanese Encephalitis', tier: 'free', note: 'JE-endemic districts only.' },
      { vaccine: 'MMR — Dose 2 / Varicella — Dose 2', protects: 'Measles, Mumps, Rubella / Chickenpox', tier: 'recommended' },
    ],
  },
  {
    stage: '4–6 Years',
    doses: [
      { vaccine: 'DPT — Booster 2', protects: 'Diphtheria, Pertussis, Tetanus', tier: 'free' },
      { vaccine: 'Typhoid Conjugate — Booster', protects: 'Typhoid fever', tier: 'recommended', note: 'Every 3 years if using older typhoid vaccines.' },
    ],
  },
  {
    stage: '9–14 Years',
    doses: [
      { vaccine: 'HPV (Human Papillomavirus)', protects: 'Cervical & other HPV-related cancers', tier: 'recommended', note: '2-dose schedule (0, 6 months); IAP recommends for both girls and boys.' },
      { vaccine: 'Td — 10-year Booster', protects: 'Tetanus, Diphtheria', tier: 'free' },
    ],
  },
  {
    stage: '15–18 Years',
    doses: [
      { vaccine: 'Td — 16-year Booster', protects: 'Tetanus, Diphtheria', tier: 'free' },
      { vaccine: 'HPV — Catch-up', protects: 'HPV-related cancers', tier: 'recommended', note: '3-dose schedule (0, 2, 6 months) if not vaccinated at 9–14 years.' },
      { vaccine: 'Hepatitis B — Catch-up', protects: 'Hepatitis B', tier: 'recommended', note: 'If missed earlier and not immune.' },
    ],
  },
  {
    stage: 'Adults (19–49 years)',
    doses: [
      { vaccine: 'Td/Tdap Booster', protects: 'Tetanus, Diphtheria, Pertussis', tier: 'recommended', note: 'Every 10 years.' },
      { vaccine: 'Influenza', protects: 'Seasonal flu', tier: 'recommended', note: 'Annually.' },
      { vaccine: 'Hepatitis B', protects: 'Hepatitis B', tier: 'recommended', note: 'If not previously vaccinated.' },
      { vaccine: 'MMR / Varicella', protects: 'Measles, Mumps, Rubella / Chickenpox', tier: 'recommended', note: 'If no prior vaccination and not immune.' },
      { vaccine: 'HPV', protects: 'HPV-related cancers', tier: 'recommended', note: 'Can be considered up to 45 years on a doctor’s advice.' },
    ],
  },
  {
    stage: 'During Pregnancy',
    doses: [
      { vaccine: 'Td/Tdap', protects: 'Tetanus, Diphtheria, Pertussis', tier: 'recommended', note: 'Ideally 27–36 weeks; repeated every pregnancy, per FOGSI/IAP guidance.' },
      { vaccine: 'Influenza', protects: 'Seasonal flu', tier: 'recommended', note: 'Safe in any trimester; also protects the newborn.' },
    ],
  },
  {
    stage: 'Older Adults (50/60+ years)',
    doses: [
      { vaccine: 'Influenza', protects: 'Seasonal flu', tier: 'recommended', note: 'Annually.' },
      { vaccine: 'Pneumococcal (PCV/PPSV)', protects: 'Pneumococcal disease', tier: 'recommended' },
      { vaccine: 'Herpes Zoster (Shingles)', protects: 'Shingles', tier: 'recommended', note: 'Typically from 50 years.' },
      { vaccine: 'Td/Tdap Booster', protects: 'Tetanus, Diphtheria, Pertussis', tier: 'recommended', note: 'Every 10 years.' },
    ],
  },
  {
    stage: 'Situational / Travel / Risk-based (any age)',
    doses: [
      { vaccine: 'Typhoid', protects: 'Typhoid fever', tier: 'situational' },
      { vaccine: 'Rabies (pre-exposure)', protects: 'Rabies', tier: 'situational', note: 'For high animal-exposure risk (vets, animal handlers, frequent travellers).' },
      { vaccine: 'Meningococcal', protects: 'Meningococcal disease', tier: 'situational', note: 'Outbreak areas, hajj/travel requirements, specific risk groups.' },
      { vaccine: 'Yellow Fever', protects: 'Yellow fever', tier: 'situational', note: 'Only required for travel to/from certain endemic countries.' },
      { vaccine: 'Cholera', protects: 'Cholera', tier: 'situational', note: 'Outbreak or high-risk travel situations.' },
      { vaccine: 'COVID-19', protects: 'COVID-19', tier: 'situational', note: 'Per current national guidance, especially for high-risk and elderly groups.' },
    ],
  },
]
