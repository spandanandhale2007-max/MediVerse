// Option lists for the medication tracker's health-profile intake.
// Field structure follows standard clinical intake forms.
// Conditions are ordered by prevalence in India (hypertension, diabetes, etc.).
// Drug allergies lead with the most common culprits (penicillins, sulfa, NSAIDs).
// Medication classes follow standard pharmacological grouping.

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't know"]

export const genders = ['Male', 'Female', 'Other', 'Prefer not to say']

export const chronicConditions = [
  'Hypertension (high BP)',
  'Type 2 Diabetes',
  'Type 1 Diabetes',
  'Prediabetes',
  'High cholesterol',
  'Thyroid disorder',
  'Asthma',
  'COPD / chronic bronchitis',
  'Arthritis / joint disease',
  'Heart disease',
  'Previous stroke',
  'Kidney disease',
  'Liver disease',
  'Anaemia',
  'Epilepsy / seizure disorder',
  'Migraine',
  'Tuberculosis (past or current)',
  'Cancer (past or current)',
  'PCOS / PCOD',
  'Acid reflux / GERD',
  'IBS / digestive disorder',
  'Depression',
  'Anxiety disorder',
  'Sleep apnoea',
  'Osteoporosis',
  'Skin condition (eczema, psoriasis)',
]

export const surgicalHistory = [
  'Appendectomy',
  'Gallbladder removal',
  'Hernia repair',
  'Caesarean section',
  'Hysterectomy',
  'Knee / hip replacement',
  'Cardiac bypass / angioplasty',
  'Cataract surgery',
  'Tonsillectomy',
  'Spine surgery',
  'Fracture surgery',
  'Other major surgery',
]

export const drugAllergies = [
  'Penicillin / amoxicillin',
  'Sulfa drugs (sulfonamides)',
  'NSAIDs (ibuprofen, aspirin, naproxen)',
  'Paracetamol / acetaminophen',
  'Cephalosporins',
  'Opioids (morphine, codeine)',
  'Local anaesthetics',
  'Contrast dye (imaging)',
  'Anticonvulsants',
  'Insulin',
]

export const otherAllergies = [
  'Peanuts / tree nuts',
  'Shellfish',
  'Eggs',
  'Milk / dairy',
  'Wheat / gluten',
  'Soy',
  'Dust mites',
  'Pollen',
  'Latex',
  'Insect stings',
]

export const medicationClasses = [
  { group: 'Blood pressure', items: ['ACE inhibitors (e.g. ramipril)', 'ARBs (e.g. telmisartan)', 'Beta blockers (e.g. metoprolol)', 'Calcium channel blockers (e.g. amlodipine)', 'Diuretics (water pills)'] },
  { group: 'Diabetes', items: ['Metformin', 'Sulfonylureas (e.g. glimepiride)', 'DPP-4 inhibitors (e.g. sitagliptin)', 'SGLT2 inhibitors (e.g. dapagliflozin)', 'GLP-1 agonists (e.g. semaglutide)', 'Thiazolidinediones (e.g. pioglitazone)', 'Insulin'] },
  { group: 'Cholesterol', items: ['Statins (e.g. atorvastatin)', 'Fibrates', 'Ezetimibe'] },
  { group: 'Heart & blood', items: ['Blood thinners (e.g. warfarin, apixaban)', 'Antiplatelets (e.g. aspirin, clopidogrel)'] },
  { group: 'Other long-term', items: ['Thyroid medication (e.g. levothyroxine)', 'Inhalers (asthma/COPD)', 'Antacids / PPIs (e.g. pantoprazole)', 'Antidepressants', 'Anti-anxiety medication', 'Anticonvulsants', 'Steroids (e.g. prednisolone)', 'Painkillers (regular use)', 'Vitamin / mineral supplements'] },
]

export const familyHistory = [
  'Heart disease',
  'Stroke',
  'Diabetes',
  'Hypertension',
  'Cancer',
  'Kidney disease',
  'Thyroid disorder',
  'Asthma / allergies',
  'Mental health conditions',
  'Genetic / inherited disorder',
]

export const lifestyleFields = [
  {
    key: 'smoking',
    label: 'Tobacco use',
    options: ['Never', 'Former user', 'Occasional', 'Daily'],
  },
  {
    key: 'alcohol',
    label: 'Alcohol',
    options: ['Never', 'Occasional', 'Weekly', 'Daily'],
  },
  {
    key: 'activity',
    label: 'Physical activity',
    options: ['Sedentary', '1–2 days/week', '3–4 days/week', '5+ days/week'],
  },
  {
    key: 'diet',
    label: 'Diet',
    options: ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Eggetarian'],
  },
  {
    key: 'sleep',
    label: 'Average sleep',
    options: ['Less than 5 hrs', '5–6 hrs', '7–8 hrs', 'More than 8 hrs'],
  },
]

export const pregnancyOptions = ['Not applicable', 'Currently pregnant', 'Breastfeeding', 'Planning pregnancy']
