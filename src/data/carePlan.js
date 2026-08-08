// Condition-specific care guidance for the medication tracker.
//
// DELIBERATE SCOPE LIMIT — read before extending this file:
// This does NOT recommend which medication a user should start, or what dose
// to take. Dose depends on renal/hepatic function, labs, severity, and
// interactions that a self-reported intake form cannot capture (e.g. metformin
// is contraindicated in significant renal impairment), and self-reported
// conditions are frequently incomplete or wrong. Suggesting a drug or dose
// here could cause real harm to a real user.
//
// What it DOES provide, all of which is published, non-individualised
// guidance safe to surface:
//   - which specialist treats the condition (routing)
//   - guideline-based monitoring/check-up intervals
//   - vaccines recommended for people with that condition
//   - lifestyle measures
//   - red-flag symptoms meaning "seek care now"
//
// Sources: ADA Standards of Care in Diabetes (2024/2025), general
// hypertension follow-up guidance (monthly until controlled, then 3–6
// monthly; renal function/electrolytes 1–2×/year), GOLD COPD vaccination
// recommendations, and standard specialist-referral guidance.

export const conditionCarePlans = {
  'Hypertension (high BP)': {
    specialty: 'Cardiology',
    specialist: 'Cardiologist',
    summary: 'Long-term blood pressure control protects your heart, kidneys, brain, and eyes.',
    monitoring: [
      { what: 'Blood pressure check', when: 'Monthly until your target is reached, then every 3–6 months' },
      { what: 'Kidney function & electrolytes (creatinine, potassium)', when: 'At least 1–2 times a year' },
      { what: 'Lipid profile & fasting glucose', when: 'Yearly' },
      { what: 'ECG', when: 'At diagnosis, then as your doctor advises' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal'],
    lifestyle: ['Reduce salt intake', 'Regular aerobic activity', 'Limit alcohol', 'Stop tobacco', 'Maintain a healthy weight'],
    redFlags: ['Chest pain or pressure', 'Sudden severe headache', 'Vision changes', 'Breathlessness at rest', 'BP above 180/120'],
  },
  'Type 2 Diabetes': {
    specialty: 'Endocrinology',
    specialist: 'Endocrinologist / Diabetologist',
    summary: 'Diabetes care is about steady glucose control plus regular screening for eye, kidney, and foot complications.',
    monitoring: [
      { what: 'HbA1c blood test', when: 'Twice a year if stable and at target; every 3 months if not at target or after a medication change' },
      { what: 'Dilated eye exam (retinopathy screening)', when: 'Yearly — every 1–2 years if repeatedly normal' },
      { what: 'Foot examination', when: 'At least yearly; more often with numbness, poor circulation, or past ulcers' },
      { what: 'Kidney check (urine albumin + eGFR)', when: 'Yearly' },
      { what: 'Lipid profile & blood pressure', when: 'Yearly' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'Hepatitis B'],
    lifestyle: ['Consistent meal timing', 'Regular physical activity', 'Weight management', 'Daily foot self-checks'],
    redFlags: ['Repeated hypoglycaemia (shakiness, sweating, confusion)', 'Non-healing foot wound', 'Sudden vision change', 'Excessive thirst with rapid weight loss'],
  },
  'Type 1 Diabetes': {
    specialty: 'Endocrinology',
    specialist: 'Endocrinologist / Diabetologist',
    summary: 'Requires lifelong insulin plus the same complication screening as Type 2.',
    monitoring: [
      { what: 'HbA1c blood test', when: 'Every 3 months, or as advised' },
      { what: 'Dilated eye exam', when: 'Yearly' },
      { what: 'Kidney check (urine albumin + eGFR)', when: 'Yearly' },
      { what: 'Thyroid function', when: 'Periodically — autoimmune thyroid disease is more common' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'Hepatitis B'],
    lifestyle: ['Carbohydrate counting', 'Regular glucose monitoring', 'Carry fast-acting glucose'],
    redFlags: ['Very high glucose with vomiting or abdominal pain (possible DKA)', 'Severe hypoglycaemia', 'Fruity-smelling breath', 'Rapid deep breathing'],
  },
  Prediabetes: {
    specialty: 'General Medicine',
    specialist: 'General Physician',
    summary: 'A reversible stage — lifestyle change at this point often prevents diabetes entirely.',
    monitoring: [{ what: 'Fasting glucose or HbA1c', when: 'Yearly' }, { what: 'Weight & blood pressure', when: 'Every 6 months' }],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Aim for 5–7% weight loss', '150 minutes of activity per week', 'Reduce refined carbohydrates and sugar'],
    redFlags: ['Increased thirst and urination', 'Unexplained weight loss', 'Persistent fatigue'],
  },
  'High cholesterol': {
    specialty: 'Cardiology',
    specialist: 'Cardiologist',
    summary: 'Managing cholesterol lowers your long-term risk of heart attack and stroke.',
    monitoring: [
      { what: 'Lipid profile', when: 'Every 3 months after a treatment change, then yearly once stable' },
      { what: 'Liver function tests', when: 'As advised if on statin therapy' },
    ],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Reduce saturated and trans fats', 'Increase fibre', 'Regular exercise', 'Stop tobacco'],
    redFlags: ['Chest pain on exertion', 'Unexplained muscle pain or weakness while on a statin', 'Dark urine with muscle pain'],
  },
  'Thyroid disorder': {
    specialty: 'Endocrinology',
    specialist: 'Endocrinologist',
    summary: 'Thyroid levels need periodic rechecking, especially after any dose change.',
    monitoring: [
      { what: 'TSH (and T4 if advised)', when: '6–8 weeks after any dose change, then every 6–12 months when stable' },
    ],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Take thyroid medication consistently at the same time', 'Keep 4 hours between thyroid medication and calcium or iron'],
    redFlags: ['Palpitations with weight loss', 'Severe fatigue with weight gain', 'Neck swelling or difficulty swallowing'],
  },
  Asthma: {
    specialty: 'Pulmonology',
    specialist: 'Pulmonologist',
    summary: 'Good control means minimal symptoms, no night waking, and rare reliever inhaler use.',
    monitoring: [
      { what: 'Asthma control review', when: 'Every 3–6 months, or sooner after an attack' },
      { what: 'Inhaler technique check', when: 'At every review — poor technique is a common cause of poor control' },
      { what: 'Spirometry (lung function)', when: 'At diagnosis and periodically after' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'COVID-19'],
    lifestyle: ['Identify and avoid triggers', 'Rinse mouth after steroid inhalers', 'Always carry your reliever inhaler'],
    redFlags: ['Reliever inhaler not helping', 'Difficulty speaking in full sentences', 'Lips or fingertips turning blue', 'Rapidly worsening breathlessness'],
  },
  'COPD / chronic bronchitis': {
    specialty: 'Pulmonology',
    specialist: 'Pulmonologist',
    summary: 'Vaccination and stopping tobacco are the two interventions that most change COPD outcomes.',
    monitoring: [
      { what: 'Lung function (spirometry)', when: 'Yearly, or as advised' },
      { what: 'Symptom & exacerbation review', when: 'Every 3–6 months' },
      { what: 'Oxygen saturation check', when: 'At reviews and during flare-ups' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'COVID-19', 'Tdap (pertussis)', 'Herpes zoster'],
    lifestyle: ['Stop smoking — the single most effective step', 'Pulmonary rehabilitation', 'Avoid smoke and air pollution'],
    redFlags: ['Increasing breathlessness at rest', 'Change in sputum colour or volume', 'Confusion or drowsiness', 'Ankle swelling'],
  },
  'Arthritis / joint disease': {
    specialty: 'Orthopedics',
    specialist: 'Orthopedic surgeon / Rheumatologist',
    summary: 'Staying mobile protects joint function — rest alone tends to make stiffness worse.',
    monitoring: [
      { what: 'Joint & function review', when: 'Every 6–12 months' },
      { what: 'Blood tests (if on long-term anti-inflammatory or DMARD therapy)', when: 'As advised' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal — especially if on immune-suppressing therapy'],
    lifestyle: ['Low-impact exercise (swimming, cycling)', 'Weight management to reduce joint load', 'Physiotherapy'],
    redFlags: ['Hot, red, severely swollen joint', 'Fever with joint pain', 'Sudden inability to bear weight'],
  },
  'Heart disease': {
    specialty: 'Cardiology',
    specialist: 'Cardiologist',
    summary: 'Regular follow-up and never stopping cardiac medication on your own are the essentials.',
    monitoring: [
      { what: 'Cardiology review', when: 'Every 3–6 months, or as advised' },
      { what: 'Lipid profile, blood pressure, ECG', when: 'Yearly or as advised' },
      { what: 'Echocardiogram', when: 'As advised by your cardiologist' },
    ],
    vaccines: ['Influenza (annual) — reduces cardiovascular events', 'Pneumococcal', 'COVID-19'],
    lifestyle: ['Cardiac rehabilitation programme', 'Low-salt diet', 'Stop tobacco', 'Supervised exercise'],
    redFlags: ['Chest pain or pressure, especially spreading to jaw, neck, back or arm', 'Breathlessness at rest', 'Fainting', 'Rapid weight gain with swelling'],
  },
  'Previous stroke': {
    specialty: 'Neurology',
    specialist: 'Neurologist',
    summary: 'Secondary prevention — controlling BP, cholesterol, and glucose — lowers the chance of another stroke.',
    monitoring: [
      { what: 'Neurology review', when: 'Every 3–6 months initially, then as advised' },
      { what: 'Blood pressure', when: 'Regularly, including at home' },
      { what: 'Lipid profile & glucose', when: 'Yearly' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal'],
    lifestyle: ['Physiotherapy and rehabilitation', 'Strict BP control', 'Stop tobacco', 'Take blood thinners exactly as prescribed'],
    redFlags: ['FAST — Face drooping, Arm weakness, Speech difficulty: Time to call emergency services', 'Sudden numbness on one side', 'Sudden severe headache', 'Sudden vision loss'],
  },
  'Kidney disease': {
    specialty: 'Nephrology',
    specialist: 'Nephrologist',
    summary: 'Many common medicines need dose adjustment in kidney disease — always tell any doctor about it.',
    monitoring: [
      { what: 'eGFR & urine albumin', when: 'Between yearly and every 1–3 months, depending on stage and risk' },
      { what: 'Electrolytes (potassium), haemoglobin', when: 'As advised' },
      { what: 'Blood pressure', when: 'At every visit and at home' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'Hepatitis B'],
    lifestyle: ['Avoid NSAIDs (ibuprofen etc.) unless cleared by your doctor', 'Control BP and glucose tightly', 'Follow any prescribed dietary limits'],
    redFlags: ['Marked reduction in urine output', 'Swelling of legs or face', 'Severe fatigue with nausea', 'Breathlessness'],
  },
  'Liver disease': {
    specialty: 'Gastroenterology',
    specialist: 'Gastroenterologist / Hepatologist',
    summary: 'The liver processes most medicines, so dosing and alcohol both matter more here.',
    monitoring: [
      { what: 'Liver function tests', when: 'Every 3–6 months, or as advised' },
      { what: 'Ultrasound / imaging', when: 'As advised' },
    ],
    vaccines: ['Hepatitis A', 'Hepatitis B', 'Influenza (annual)', 'Pneumococcal'],
    lifestyle: ['Avoid alcohol entirely', 'Be cautious with paracetamol — confirm safe limits with your doctor', 'Weight management for fatty liver'],
    redFlags: ['Yellowing of eyes or skin', 'Vomiting blood or black stools', 'Abdominal swelling', 'Confusion or drowsiness'],
  },
  Anaemia: {
    specialty: 'General Medicine',
    specialist: 'General Physician',
    summary: 'Anaemia is a sign, not a diagnosis — finding the underlying cause matters.',
    monitoring: [
      { what: 'Complete blood count', when: 'Every 3 months until corrected, then as advised' },
      { what: 'Iron studies / B12 / folate', when: 'As advised to identify the cause' },
    ],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Iron-rich foods with vitamin C to aid absorption', 'Avoid tea or coffee immediately with iron supplements'],
    redFlags: ['Severe breathlessness', 'Chest pain', 'Fainting', 'Black or bloody stools'],
  },
  'Epilepsy / seizure disorder': {
    specialty: 'Neurology',
    specialist: 'Neurologist',
    summary: 'Never stop or change anti-seizure medication on your own — abrupt stopping can trigger seizures.',
    monitoring: [
      { what: 'Neurology review', when: 'Every 6–12 months when well controlled' },
      { what: 'Drug levels / blood counts / liver function', when: 'As advised for your specific medication' },
    ],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Consistent sleep', 'Limit alcohol', 'Note and avoid personal triggers', 'Discuss driving rules with your doctor'],
    redFlags: ['A seizure lasting more than 5 minutes', 'Repeated seizures without recovery in between', 'Seizure with injury or difficulty breathing', 'First-ever seizure'],
  },
  Migraine: {
    specialty: 'Neurology',
    specialist: 'Neurologist',
    summary: 'Overusing painkillers can itself cause more frequent headaches — track how often you use them.',
    monitoring: [{ what: 'Headache diary review', when: 'Every 3–6 months if frequent' }],
    vaccines: [],
    lifestyle: ['Regular sleep and meals', 'Identify triggers', 'Stay hydrated', 'Limit painkiller use to avoid rebound headache'],
    redFlags: ['Sudden "worst headache of my life"', 'Headache with fever and neck stiffness', 'Headache with weakness or speech difficulty', 'New headache after age 50'],
  },
  'Tuberculosis (past or current)': {
    specialty: 'Pulmonology',
    specialist: 'Pulmonologist',
    summary: 'Completing the full TB course matters enormously — stopping early drives drug resistance.',
    monitoring: [
      { what: 'Sputum tests & treatment review', when: 'As scheduled through your treatment course' },
      { what: 'Liver function tests', when: 'During treatment as advised' },
      { what: 'Chest X-ray', when: 'At intervals during and after treatment' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal'],
    lifestyle: ['Complete the full course without gaps', 'Good nutrition', 'Ensure household contacts are screened'],
    redFlags: ['Coughing blood', 'Worsening breathlessness', 'High fever', 'Yellowing of eyes while on TB medication'],
  },
  'Cancer (past or current)': {
    specialty: 'Oncology',
    specialist: 'Medical Oncologist',
    summary: 'Follow-up and surveillance schedules are highly individual — your oncologist sets yours.',
    monitoring: [
      { what: 'Oncology follow-up', when: 'As set by your treating oncologist' },
      { what: 'Surveillance imaging & blood tests', when: 'Per your individual protocol' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal', 'COVID-19 — timing around treatment should be discussed with your oncologist'],
    lifestyle: ['Nutrition support', 'Gentle activity as tolerated', 'Report new symptoms early'],
    redFlags: ['Unexplained fever during chemotherapy — this is an emergency', 'Unusual bleeding or bruising', 'Severe or persistent pain', 'Rapid unexplained weight loss'],
  },
  'PCOS / PCOD': {
    specialty: 'Gynaecology',
    specialist: 'Gynaecologist',
    summary: 'PCOS raises long-term diabetes risk, so metabolic screening matters alongside cycle management.',
    monitoring: [
      { what: 'Glucose / HbA1c screening', when: 'Every 1–3 years, or yearly with additional risk factors' },
      { what: 'Lipid profile & blood pressure', when: 'Yearly' },
      { what: 'Gynaecology review', when: 'Every 6–12 months' },
    ],
    vaccines: ['HPV (if not already vaccinated)', 'Influenza (annual)'],
    lifestyle: ['Weight management improves symptoms significantly', 'Regular exercise', 'Balanced low-glycaemic diet'],
    redFlags: ['Periods absent for more than 3 months', 'Very heavy bleeding', 'Severe pelvic pain'],
  },
  'Acid reflux / GERD': {
    specialty: 'Gastroenterology',
    specialist: 'Gastroenterologist',
    summary: 'Long-term acid-suppressing medication should be reviewed periodically, not continued indefinitely by default.',
    monitoring: [{ what: 'Symptom review / medication review', when: 'Every 6–12 months' }],
    vaccines: [],
    lifestyle: ['Avoid late meals — leave 3 hours before lying down', 'Raise the head of the bed', 'Reduce spicy, fatty foods, caffeine, alcohol', 'Weight management'],
    redFlags: ['Difficulty swallowing', 'Vomiting blood or black stools', 'Unintentional weight loss', 'Persistent vomiting'],
  },
  'IBS / digestive disorder': {
    specialty: 'Gastroenterology',
    specialist: 'Gastroenterologist',
    summary: 'IBS is managed with diet and trigger identification more than medication.',
    monitoring: [{ what: 'Symptom review', when: 'Every 6–12 months' }],
    vaccines: [],
    lifestyle: ['Food and symptom diary', 'Consider a low-FODMAP trial with dietitian guidance', 'Stress management', 'Regular meals'],
    redFlags: ['Blood in stool', 'Unintentional weight loss', 'Symptoms waking you at night', 'New symptoms after age 50'],
  },
  Depression: {
    specialty: 'Psychiatry',
    specialist: 'Psychiatrist',
    summary: 'Antidepressants take several weeks to work and should never be stopped abruptly.',
    monitoring: [
      { what: 'Review after starting or changing medication', when: 'Within 2–4 weeks' },
      { what: 'Ongoing review', when: 'Every 1–3 months until stable, then as advised' },
    ],
    vaccines: [],
    lifestyle: ['Regular sleep routine', 'Physical activity', 'Talking therapy alongside medication', 'Limit alcohol'],
    redFlags: ['Thoughts of harming yourself — seek help immediately', 'Inability to care for yourself', 'Severe agitation', 'Hearing or seeing things others do not'],
  },
  'Anxiety disorder': {
    specialty: 'Psychiatry',
    specialist: 'Psychiatrist',
    summary: 'Therapy is first-line for most anxiety disorders, with medication as a complement.',
    monitoring: [{ what: 'Review after starting or changing treatment', when: 'Within 2–4 weeks' }, { what: 'Ongoing review', when: 'Every 1–3 months until stable' }],
    vaccines: [],
    lifestyle: ['Reduce caffeine', 'Breathing and relaxation techniques', 'Regular exercise', 'Consistent sleep'],
    redFlags: ['Panic attacks with chest pain — get chest pain assessed medically', 'Inability to leave home or function', 'Thoughts of self-harm'],
  },
  'Sleep apnoea': {
    specialty: 'Pulmonology',
    specialist: 'Pulmonologist / Sleep specialist',
    summary: 'Untreated sleep apnoea worsens blood pressure and heart risk, so treatment adherence matters.',
    monitoring: [
      { what: 'Sleep study / CPAP adherence review', when: 'Within 3 months of starting therapy, then yearly' },
      { what: 'Blood pressure', when: 'Regularly — sleep apnoea raises BP' },
    ],
    vaccines: ['Influenza (annual)', 'Pneumococcal'],
    lifestyle: ['Weight management', 'Sleep on your side', 'Avoid alcohol and sedatives before bed', 'Use CPAP consistently if prescribed'],
    redFlags: ['Falling asleep while driving', 'Witnessed long pauses in breathing', 'Morning headaches with severe daytime sleepiness'],
  },
  Osteoporosis: {
    specialty: 'Orthopedics',
    specialist: 'Orthopedic surgeon / Endocrinologist',
    summary: 'The aim is preventing fractures — bone density plus fall prevention.',
    monitoring: [
      { what: 'Bone density scan (DEXA)', when: 'Every 1–2 years, or as advised' },
      { what: 'Vitamin D & calcium levels', when: 'As advised' },
    ],
    vaccines: ['Influenza (annual)'],
    lifestyle: ['Weight-bearing exercise', 'Adequate calcium and vitamin D', 'Fall-proof your home', 'Stop tobacco'],
    redFlags: ['Sudden severe back pain (possible vertebral fracture)', 'Fracture after a minor fall', 'Loss of height with back pain'],
  },
  'Skin condition (eczema, psoriasis)': {
    specialty: 'Dermatology',
    specialist: 'Dermatologist',
    summary: 'Consistent moisturising often does more than intermittent steroid use.',
    monitoring: [{ what: 'Dermatology review', when: 'Every 6–12 months, or during flares' }],
    vaccines: ['Influenza (annual) — especially if on immune-suppressing treatment'],
    lifestyle: ['Moisturise daily', 'Identify triggers', 'Avoid harsh soaps', 'Use steroid creams only as directed'],
    redFlags: ['Widespread rash with fever', 'Signs of skin infection (pus, warmth, spreading redness)', 'Rapidly spreading blistering rash'],
  },
}

// General administration guidance for medications the user says they ALREADY
// take. This is standard label/pharmacology guidance on HOW to take them —
// never what dose to take. The user's dose comes from their prescription.
export const medicationGuidance = {
  Metformin: {
    timing: 'With or just after food',
    why: 'Food substantially reduces the nausea and stomach upset metformin is known for.',
    cautions: ['Tell any doctor if you have kidney problems — metformin needs review in kidney disease', 'Stop and seek advice before scans using contrast dye'],
  },
  'Sulfonylureas (e.g. glimepiride)': {
    timing: 'With meals, usually before breakfast',
    why: 'Taking it without eating raises the risk of low blood sugar.',
    cautions: ['Carries a real hypoglycaemia risk — always carry fast-acting glucose', 'Do not skip meals after taking it'],
  },
  Insulin: {
    timing: 'Timed to meals exactly as your doctor specified',
    why: 'Insulin timing relative to food is what prevents both high and low glucose swings.',
    cautions: ['Rotate injection sites', 'Never share pens or needles', 'Always carry fast-acting glucose'],
  },
  'DPP-4 inhibitors (e.g. sitagliptin)': {
    timing: 'Once daily, with or without food, at a consistent time',
    why: 'Consistency keeps levels steady; food does not affect absorption meaningfully.',
    cautions: ['Report persistent severe abdominal pain'],
  },
  'SGLT2 inhibitors (e.g. dapagliflozin)': {
    timing: 'Usually in the morning, with or without food',
    why: 'Morning dosing reduces night-time urination.',
    cautions: ['Drink adequate fluids', 'Maintain genital hygiene — increases infection risk', 'Seek advice if you become unwell or stop eating'],
  },
  'GLP-1 agonists (e.g. semaglutide)': {
    timing: 'As prescribed — daily or weekly, on a consistent day',
    why: 'These follow a fixed schedule rather than meal timing.',
    cautions: ['Nausea is common early on and usually settles', 'Report severe persistent abdominal pain'],
  },
  'Thiazolidinediones (e.g. pioglitazone)': {
    timing: 'Once daily, with or without food',
    why: 'Absorption is not meaningfully affected by food.',
    cautions: ['Report swelling of ankles or sudden weight gain'],
  },
  'Statins (e.g. atorvastatin)': {
    timing: 'Atorvastatin and rosuvastatin: any consistent time of day. Simvastatin and lovastatin: at bedtime.',
    why: 'Shorter-acting statins work best overnight, when the body makes most of its cholesterol.',
    cautions: ['Report unexplained muscle pain, tenderness or weakness', 'Avoid grapefruit juice with some statins'],
  },
  'ACE inhibitors (e.g. ramipril)': {
    timing: 'Same time each day',
    why: 'Steady levels give steadier blood pressure control.',
    cautions: ['A dry persistent cough is a known effect — tell your doctor, do not just stop', 'Kidney function and potassium are usually checked 2–4 weeks after starting'],
  },
  'ARBs (e.g. telmisartan)': {
    timing: 'Same time each day, with or without food',
    why: 'Consistency matters more than the specific hour.',
    cautions: ['Kidney function and potassium are usually checked 2–4 weeks after starting', 'Tell your doctor if pregnant or planning pregnancy'],
  },
  'Beta blockers (e.g. metoprolol)': {
    timing: 'Same time each day',
    why: 'Consistent levels keep heart rate and BP stable.',
    cautions: ['Never stop suddenly — this can cause rebound chest pain or rapid heart rate', 'Report a very slow pulse or severe fatigue'],
  },
  'Calcium channel blockers (e.g. amlodipine)': {
    timing: 'Same time each day, with or without food',
    why: 'Food does not significantly change absorption; consistency does.',
    cautions: ['Ankle swelling is a common effect — mention it at your next review'],
  },
  'Diuretics (water pills)': {
    timing: 'In the morning; if twice daily, the second dose by early afternoon',
    why: 'Later doses mean waking through the night to urinate.',
    cautions: ['Electrolytes and kidney function need periodic checks', 'Stand up slowly to avoid dizziness'],
  },
  'Thyroid medication (e.g. levothyroxine)': {
    timing: 'First thing in the morning on an empty stomach, 30–60 minutes before food or coffee',
    why: 'Food, coffee, calcium and iron all substantially block absorption.',
    cautions: ['Keep a 4-hour gap from calcium, iron, and antacids', 'Take at the same time daily — recheck TSH 6–8 weeks after any dose change'],
  },
  'Blood thinners (e.g. warfarin, apixaban)': {
    timing: 'Same time each day, exactly as prescribed',
    why: 'Missing or doubling doses swings you between clot and bleeding risk.',
    cautions: ['Never double up a missed dose — ask your doctor', 'Report unusual bruising, blood in urine or stool', 'Tell every doctor and dentist you take this'],
  },
  'Antiplatelets (e.g. aspirin, clopidogrel)': {
    timing: 'Same time each day, with food',
    why: 'Food reduces stomach irritation.',
    cautions: ['Report black stools or vomiting blood immediately', 'Tell any doctor before surgery or dental work'],
  },
  'Antacids / PPIs (e.g. pantoprazole)': {
    timing: '30–60 minutes before a meal, usually breakfast',
    why: 'PPIs work on actively pumping acid, so they need to be in place before eating.',
    cautions: ['Long-term use should be reviewed periodically with your doctor'],
  },
  'Inhalers (asthma/COPD)': {
    timing: 'As prescribed — preventer inhalers daily even when you feel well',
    why: 'Preventers only work with consistent daily use; relievers are for symptoms.',
    cautions: ['Rinse your mouth after steroid inhalers to prevent oral thrush', 'Have your inhaler technique checked at every review'],
  },
  Antidepressants: {
    timing: 'Same time each day — some are better at night if they cause drowsiness',
    why: 'Consistency matters; full effect typically takes 4–6 weeks.',
    cautions: ['Never stop abruptly — withdrawal effects are common', 'Report worsening mood or self-harm thoughts immediately'],
  },
  'Anti-anxiety medication': {
    timing: 'As prescribed',
    why: 'Some are for regular use, others only as needed — follow your specific instruction.',
    cautions: ['Some types are habit-forming with long-term use', 'Avoid alcohol', 'Do not stop suddenly'],
  },
  Anticonvulsants: {
    timing: 'Same time each day without gaps',
    why: 'Steady blood levels are what prevent seizures.',
    cautions: ['Never stop suddenly — this can trigger seizures', 'Tell your doctor if pregnant or planning pregnancy', 'Some interact with many other medicines'],
  },
  'Steroids (e.g. prednisolone)': {
    timing: 'In the morning, with food',
    why: 'Morning dosing matches the body’s natural cortisol rhythm and reduces sleep disturbance.',
    cautions: ['Never stop long-term steroids abruptly', 'Carry a steroid card if on long-term treatment', 'Raises infection and blood sugar levels'],
  },
  'Painkillers (regular use)': {
    timing: 'With or after food for NSAIDs',
    why: 'NSAIDs irritate the stomach lining when taken on an empty stomach.',
    cautions: ['Avoid NSAIDs if you have kidney disease, ulcers, or are on blood thinners unless cleared', 'Regular painkiller use for headache can cause rebound headache'],
  },
  'Vitamin / mineral supplements': {
    timing: 'Iron on an empty stomach with vitamin C; calcium with food',
    why: 'Absorption differs by supplement.',
    cautions: ['Keep a 4-hour gap between iron/calcium and thyroid medication', 'Avoid tea or coffee within an hour of iron'],
  },
  Ezetimibe: { timing: 'Once daily, with or without food', why: 'Timing is flexible; consistency helps.', cautions: ['Report unexplained muscle pain'] },
  Fibrates: { timing: 'Usually with a meal', why: 'Reduces stomach upset.', cautions: ['Report muscle pain, especially if also on a statin'] },
}

// Standard dosing-interval guidance — how to space doses your doctor has
// already prescribed. Not a recommendation of how many doses to take.
export const dosingIntervals = [
  { label: 'Once daily (OD)', gap: 'Same time every day', note: 'Pick a time you will remember and stick to it.' },
  { label: 'Twice daily (BD)', gap: 'About 12 hours apart', note: 'For example 8 AM and 8 PM.' },
  { label: 'Three times daily (TDS)', gap: 'About 8 hours apart', note: 'For example 7 AM, 3 PM, 11 PM.' },
  { label: 'Four times daily (QDS)', gap: 'About 6 hours apart', note: 'Usually spaced across waking hours.' },
  { label: 'As needed (SOS/PRN)', gap: 'Respect the minimum gap on your label', note: 'Never exceed the stated maximum in 24 hours.' },
]
