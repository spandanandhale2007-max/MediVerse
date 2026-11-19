// MediVerse mock data layer. Swap these arrays for real API/fetch() calls
// later and every page keeps working unchanged.

export const departments = [
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'General Medicine',
  'Dermatology',
  'Neurology',
  'ENT',
  'Endocrinology',
  'Pulmonology',
  'Nephrology',
  'Gastroenterology',
  'Ophthalmology',
  'Psychiatry',
  'Gynaecology',
  'Oncology',
]

export const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Kerala', 'West Bengal', 'Gujarat']

// `featured`: doctors MediVerse highlights — a curated pick, not a real-fame claim.
// `availableNationwide`: bookable from any state (mostly telehealth/General Medicine).
// All doctors here are fictional; real named practitioners aren't used (see memory note).
export const doctors = [
  { id: 'd1', name: 'Dr. Anjali Rao', specialty: 'Cardiology', state: 'Maharashtra', experience: 12, status: 'available', rating: 4.8, nextSlot: 'Today, 4:30 PM', featured: true, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'MediVerse Heart Institute, Pune', languages: ['English', 'Hindi', 'Marathi'], fee: 900, bio: 'Specialises in interventional cardiology and preventive heart care, with a focus on early diagnosis of coronary disease.' },
  { id: 'd2', name: 'Dr. Vikram Sen', specialty: 'Orthopedics', state: 'Delhi', experience: 9, status: 'in-surgery', rating: 4.6, nextSlot: 'Tomorrow, 10:00 AM', featured: false, qualifications: 'MBBS, MS (Orthopedics)', hospital: 'MediVerse Multispecialty Hospital, Delhi', languages: ['English', 'Hindi'], fee: 700, bio: 'Focuses on sports injuries and joint replacement, working with patients through post-surgery rehab.' },
  { id: 'd3', name: 'Dr. Meera Iyer', specialty: 'Pediatrics', state: 'Karnataka', experience: 15, status: 'available', rating: 4.9, nextSlot: 'Today, 2:00 PM', featured: true, qualifications: 'MBBS, MD (Pediatrics)', hospital: 'MediVerse Health City, Bengaluru', languages: ['English', 'Kannada', 'Hindi'], fee: 650, bio: 'Cares for newborns through teens, with a special interest in childhood immunisation and growth tracking.' },
  { id: 'd4', name: 'Dr. Arjun Nair', specialty: 'Neurology', state: 'Kerala', experience: 7, status: 'off-duty', rating: 4.5, nextSlot: 'Mon, 9:00 AM', featured: false, qualifications: 'MBBS, MD, DM (Neurology)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam'], fee: 950, bio: 'Treats migraine, epilepsy, and stroke recovery, with an emphasis on long-term neurological care plans.' },
  { id: 'd5', name: 'Dr. Kavya Menon', specialty: 'Dermatology', state: 'Tamil Nadu', experience: 6, status: 'available', rating: 4.7, nextSlot: 'Today, 5:15 PM', featured: false, qualifications: 'MBBS, MD (Dermatology)', hospital: 'MediVerse Heart & Vascular Centre, Chennai', languages: ['English', 'Tamil'], fee: 600, bio: 'Manages acne, eczema, and skin allergies, alongside general cosmetic dermatology consults.' },
  { id: 'd6', name: 'Dr. Rahul Verma', specialty: 'General Medicine', state: 'Maharashtra', experience: 20, status: 'available', rating: 4.9, nextSlot: 'Today, 1:00 PM', featured: true, qualifications: 'MBBS, MD (General Medicine)', hospital: 'MediVerse General Hospital, Mumbai', languages: ['English', 'Hindi', 'Marathi'], fee: 500, bio: 'A generalist with two decades of experience managing chronic conditions like diabetes and hypertension.' },
  { id: 'd7', name: 'Dr. Sunita Kulkarni', specialty: 'ENT', state: 'Maharashtra', experience: 14, status: 'available', rating: 4.8, nextSlot: 'Today, 3:00 PM', featured: true, qualifications: 'MBBS, MS (ENT)', hospital: 'MediVerse Heart Institute, Pune', languages: ['English', 'Hindi', 'Marathi'], fee: 700, bio: 'Handles sinus, hearing, and throat conditions, including minor ENT day-care procedures.' },
  { id: 'd8', name: 'Dr. Farhan Sheikh', specialty: 'ENT', state: 'Delhi', experience: 10, status: 'available', rating: 4.6, nextSlot: 'Tomorrow, 11:00 AM', featured: false, qualifications: 'MBBS, MS (ENT)', hospital: 'MediVerse Multispecialty Hospital, Delhi', languages: ['English', 'Hindi', 'Urdu'], fee: 650, bio: 'Focuses on allergic rhinitis and paediatric ENT cases alongside general ear-nose-throat care.' },
  { id: 'd9', name: 'Dr. Priya Deshmukh', specialty: 'Cardiology', state: 'Karnataka', experience: 18, status: 'available', rating: 4.9, nextSlot: 'Today, 6:00 PM', featured: true, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'MediVerse Health City, Bengaluru', languages: ['English', 'Hindi', 'Kannada'], fee: 1000, bio: 'Specialises in heart failure management and cardiac rehabilitation programmes.' },
  { id: 'd10', name: 'Dr. Rajesh Iyengar', specialty: 'Cardiology', state: 'Tamil Nadu', experience: 22, status: 'in-surgery', rating: 4.9, nextSlot: 'Wed, 9:30 AM', featured: true, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'MediVerse Heart & Vascular Centre, Chennai', languages: ['English', 'Tamil'], fee: 1100, bio: 'One of the network’s most senior cardiologists, focused on complex bypass and valve procedures.' },
  { id: 'd11', name: 'Dr. Neha Kapoor', specialty: 'Pediatrics', state: 'Delhi', experience: 11, status: 'available', rating: 4.7, nextSlot: 'Today, 4:00 PM', featured: false, qualifications: 'MBBS, MD (Pediatrics)', hospital: "MediVerse Children's Clinic, Delhi", languages: ['English', 'Hindi'], fee: 600, bio: 'Sees infants through adolescents, with particular focus on nutrition and developmental milestones.' },
  { id: 'd12', name: 'Dr. Sameer Joshi', specialty: 'Orthopedics', state: 'Maharashtra', experience: 13, status: 'available', rating: 4.6, nextSlot: 'Today, 5:30 PM', featured: false, qualifications: 'MBBS, MS (Orthopedics)', hospital: 'MediVerse Ortho Care, Nagpur', languages: ['English', 'Hindi', 'Marathi'], fee: 750, bio: 'Treats fractures and spine conditions, with an interest in minimally invasive orthopaedic surgery.' },
  { id: 'd13', name: 'Dr. Lakshmi Pillai', specialty: 'Neurology', state: 'Kerala', experience: 16, status: 'available', rating: 4.9, nextSlot: 'Today, 12:30 PM', featured: true, qualifications: 'MBBS, MD, DM (Neurology)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam', 'Hindi'], fee: 1000, bio: 'Leads the neuro-rehabilitation programme, focused on post-stroke recovery and movement disorders.' },
  { id: 'd14', name: 'Dr. Anand Krishnan', specialty: 'Cardiology', state: 'Kerala', experience: 8, status: 'off-duty', rating: 4.5, nextSlot: 'Tue, 10:00 AM', featured: false, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam'], fee: 800, bio: 'Focuses on preventive cardiology and lifestyle-linked heart risk screening.' },
  { id: 'd15', name: 'Dr. Ritu Banerjee', specialty: 'Dermatology', state: 'West Bengal', experience: 10, status: 'available', rating: 4.8, nextSlot: 'Today, 3:45 PM', featured: true, qualifications: 'MBBS, MD (Dermatology)', hospital: 'MediVerse Skin & Care Clinic, Kolkata', languages: ['English', 'Bengali', 'Hindi'], fee: 650, bio: 'Treats chronic skin conditions like psoriasis and vitiligo alongside routine dermatology care.' },
  { id: 'd16', name: 'Dr. Sourav Chatterjee', specialty: 'General Medicine', state: 'West Bengal', experience: 17, status: 'available', rating: 4.7, nextSlot: 'Today, 2:15 PM', featured: false, qualifications: 'MBBS, MD (General Medicine)', hospital: 'MediVerse Skin & Care Clinic, Kolkata', languages: ['English', 'Bengali', 'Hindi'], fee: 550, bio: 'General physician managing everyday illness, fevers, and chronic disease follow-ups.' },
  { id: 'd17', name: 'Dr. Devika Nair', specialty: 'ENT', state: 'Kerala', experience: 9, status: 'available', rating: 4.6, nextSlot: 'Tomorrow, 9:30 AM', featured: false, qualifications: 'MBBS, MS (ENT)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam'], fee: 600, bio: 'Handles routine ENT concerns with a focus on paediatric hearing screening.' },
  { id: 'd18', name: 'Dr. Kunal Mehta', specialty: 'Orthopedics', state: 'Gujarat', experience: 19, status: 'available', rating: 4.9, nextSlot: 'Today, 11:00 AM', featured: true, qualifications: 'MBBS, MS (Orthopedics)', hospital: 'MediVerse Ortho & Child Care, Ahmedabad', languages: ['English', 'Gujarati', 'Hindi'], fee: 850, bio: 'Senior orthopaedic surgeon specialising in knee and hip replacement.' },
  { id: 'd19', name: 'Dr. Heena Shah', specialty: 'Pediatrics', state: 'Gujarat', experience: 8, status: 'available', rating: 4.6, nextSlot: 'Today, 4:45 PM', featured: false, qualifications: 'MBBS, MD (Pediatrics)', hospital: 'MediVerse Ortho & Child Care, Ahmedabad', languages: ['English', 'Gujarati', 'Hindi'], fee: 550, bio: 'General paediatrician with a focus on vaccination schedules and newborn care.' },
  { id: 'd20', name: 'Dr. Arvind Rao', specialty: 'Cardiology', state: 'Gujarat', experience: 14, status: 'in-surgery', rating: 4.7, nextSlot: 'Thu, 10:30 AM', featured: false, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'MediVerse Ortho & Child Care, Ahmedabad', languages: ['English', 'Gujarati', 'Hindi'], fee: 900, bio: 'Manages complex arrhythmia cases and pacemaker follow-ups.' },
  { id: 'd21', name: 'Dr. Divya Reddy', specialty: 'Dermatology', state: 'Karnataka', experience: 5, status: 'available', rating: 4.5, nextSlot: 'Today, 6:30 PM', featured: false, qualifications: 'MBBS, MD (Dermatology)', hospital: 'MediVerse Health City, Bengaluru', languages: ['English', 'Kannada', 'Telugu'], fee: 600, bio: 'Sees general skin and hair concerns, with an interest in adolescent acne care.' },
  { id: 'd22', name: 'Dr. Manoj Pillai', specialty: 'ENT', state: 'Tamil Nadu', experience: 12, status: 'available', rating: 4.7, nextSlot: 'Today, 1:30 PM', featured: false, qualifications: 'MBBS, MS (ENT)', hospital: 'MediVerse Heart & Vascular Centre, Chennai', languages: ['English', 'Tamil'], fee: 650, bio: 'Handles chronic sinusitis and voice-related ENT concerns.' },
  { id: 'd23', name: 'Dr. Alok Sharma', specialty: 'General Medicine', state: 'Delhi', experience: 16, status: 'available', rating: 4.8, nextSlot: 'Today, 12:00 PM', featured: true, availableNationwide: true, qualifications: 'MBBS, MD (General Medicine)', hospital: 'MediVerse Telehealth Network', languages: ['English', 'Hindi'], fee: 500, bio: 'Runs MediVerse’s telehealth general medicine service — video consults bookable from any state.' },
  { id: 'd24', name: 'Dr. Fatima Ansari', specialty: 'General Medicine', state: 'Maharashtra', experience: 11, status: 'available', rating: 4.7, nextSlot: 'Today, 3:15 PM', featured: false, availableNationwide: true, qualifications: 'MBBS, MD (General Medicine)', hospital: 'MediVerse Telehealth Network', languages: ['English', 'Hindi', 'Urdu'], fee: 500, bio: 'Offers nationwide video consultations for everyday illness and prescription refills.' },
  { id: 'd25', name: 'Dr. Shalini Gupta', specialty: 'Endocrinology', state: 'Maharashtra', experience: 15, status: 'available', rating: 4.9, nextSlot: 'Today, 2:30 PM', featured: true, qualifications: 'MBBS, MD, DM (Endocrinology)', hospital: 'MediVerse General Hospital, Mumbai', languages: ['English', 'Hindi', 'Marathi'], fee: 950, bio: 'Manages diabetes, thyroid disorders, and hormonal conditions with a focus on long-term glycaemic control.' },
  { id: 'd26', name: 'Dr. Prakash Rangan', specialty: 'Endocrinology', state: 'Tamil Nadu', experience: 12, status: 'available', rating: 4.8, nextSlot: 'Tomorrow, 10:30 AM', featured: false, availableNationwide: true, qualifications: 'MBBS, MD, DM (Endocrinology)', hospital: 'MediVerse Telehealth Network', languages: ['English', 'Tamil'], fee: 900, bio: 'Runs the telehealth diabetes and thyroid clinic, bookable from any state.' },
  { id: 'd27', name: 'Dr. Imran Qureshi', specialty: 'Pulmonology', state: 'Delhi', experience: 13, status: 'available', rating: 4.7, nextSlot: 'Today, 5:00 PM', featured: true, qualifications: 'MBBS, MD (Pulmonary Medicine)', hospital: 'MediVerse Multispecialty Hospital, Delhi', languages: ['English', 'Hindi', 'Urdu'], fee: 800, bio: 'Treats asthma, COPD, sleep apnoea, and post-tuberculosis lung care.' },
  { id: 'd28', name: 'Dr. Anita Bose', specialty: 'Pulmonology', state: 'West Bengal', experience: 9, status: 'available', rating: 4.6, nextSlot: 'Tomorrow, 12:00 PM', featured: false, qualifications: 'MBBS, MD (Pulmonary Medicine)', hospital: 'MediVerse Skin & Care Clinic, Kolkata', languages: ['English', 'Bengali', 'Hindi'], fee: 700, bio: 'Focuses on chronic respiratory disease and smoking-cessation support.' },
  { id: 'd29', name: 'Dr. Suresh Babu', specialty: 'Nephrology', state: 'Karnataka', experience: 17, status: 'available', rating: 4.8, nextSlot: 'Today, 4:00 PM', featured: true, qualifications: 'MBBS, MD, DM (Nephrology)', hospital: 'MediVerse Health City, Bengaluru', languages: ['English', 'Kannada', 'Hindi'], fee: 1000, bio: 'Manages chronic kidney disease, dialysis planning, and diabetic kidney complications.' },
  { id: 'd30', name: 'Dr. Nandita Sarkar', specialty: 'Nephrology', state: 'Delhi', experience: 10, status: 'off-duty', rating: 4.6, nextSlot: 'Mon, 11:00 AM', featured: false, qualifications: 'MBBS, MD, DM (Nephrology)', hospital: 'MediVerse Multispecialty Hospital, Delhi', languages: ['English', 'Hindi', 'Bengali'], fee: 900, bio: 'Specialises in early-stage kidney disease and hypertension-related renal care.' },
  { id: 'd31', name: 'Dr. Girish Patel', specialty: 'Gastroenterology', state: 'Gujarat', experience: 14, status: 'available', rating: 4.7, nextSlot: 'Today, 1:45 PM', featured: true, qualifications: 'MBBS, MD, DM (Gastroenterology)', hospital: 'MediVerse Ortho & Child Care, Ahmedabad', languages: ['English', 'Gujarati', 'Hindi'], fee: 850, bio: 'Treats acid reflux, IBS, liver disease, and performs diagnostic endoscopy.' },
  { id: 'd32', name: 'Dr. Rohit Chandran', specialty: 'Gastroenterology', state: 'Kerala', experience: 11, status: 'available', rating: 4.6, nextSlot: 'Tomorrow, 9:00 AM', featured: false, qualifications: 'MBBS, MD, DM (Gastroenterology)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam'], fee: 800, bio: 'Focuses on digestive disorders and fatty liver management.' },
  { id: 'd33', name: 'Dr. Leela Krishnan', specialty: 'Ophthalmology', state: 'Tamil Nadu', experience: 16, status: 'available', rating: 4.9, nextSlot: 'Today, 3:30 PM', featured: true, qualifications: 'MBBS, MS (Ophthalmology)', hospital: 'MediVerse Heart & Vascular Centre, Chennai', languages: ['English', 'Tamil'], fee: 700, bio: 'Runs the diabetic retinopathy screening programme alongside general eye care.' },
  { id: 'd34', name: 'Dr. Vivek Malhotra', specialty: 'Ophthalmology', state: 'Maharashtra', experience: 8, status: 'available', rating: 4.5, nextSlot: 'Today, 6:00 PM', featured: false, qualifications: 'MBBS, MS (Ophthalmology)', hospital: 'MediVerse Heart Institute, Pune', languages: ['English', 'Hindi', 'Marathi'], fee: 650, bio: 'General eye care, cataract assessment, and routine retinal screening.' },
  { id: 'd35', name: 'Dr. Ayesha Siddiqui', specialty: 'Psychiatry', state: 'Karnataka', experience: 12, status: 'available', rating: 4.8, nextSlot: 'Today, 5:45 PM', featured: true, availableNationwide: true, qualifications: 'MBBS, MD (Psychiatry)', hospital: 'MediVerse Telehealth Network', languages: ['English', 'Hindi', 'Kannada'], fee: 900, bio: 'Provides confidential care for depression, anxiety, and sleep difficulties — available nationwide by video.' },
  { id: 'd36', name: 'Dr. Sanjay Dutta', specialty: 'Psychiatry', state: 'West Bengal', experience: 18, status: 'available', rating: 4.7, nextSlot: 'Tomorrow, 2:00 PM', featured: false, qualifications: 'MBBS, MD (Psychiatry)', hospital: 'MediVerse Skin & Care Clinic, Kolkata', languages: ['English', 'Bengali', 'Hindi'], fee: 800, bio: 'Long-standing practice in mood disorders and stress-related conditions.' },
  { id: 'd37', name: 'Dr. Ritika Chawla', specialty: 'Gynaecology', state: 'Delhi', experience: 14, status: 'available', rating: 4.8, nextSlot: 'Today, 12:30 PM', featured: true, qualifications: 'MBBS, MS (Obstetrics & Gynaecology)', hospital: "MediVerse Children's Clinic, Delhi", languages: ['English', 'Hindi'], fee: 800, bio: 'Manages PCOS, menstrual disorders, and antenatal care.' },
  { id: 'd38', name: 'Dr. Swati Kulkarni', specialty: 'Gynaecology', state: 'Maharashtra', experience: 10, status: 'available', rating: 4.7, nextSlot: 'Today, 4:15 PM', featured: false, qualifications: 'MBBS, MS (Obstetrics & Gynaecology)', hospital: 'MediVerse Heart Institute, Pune', languages: ['English', 'Hindi', 'Marathi'], fee: 750, bio: 'Women’s health, fertility counselling, and routine gynaecological screening.' },
  { id: 'd39', name: 'Dr. Harish Menon', specialty: 'Oncology', state: 'Kerala', experience: 20, status: 'in-surgery', rating: 4.9, nextSlot: 'Thu, 10:00 AM', featured: true, qualifications: 'MBBS, MD, DM (Medical Oncology)', hospital: 'MediVerse Neuro Centre, Kochi', languages: ['English', 'Malayalam', 'Hindi'], fee: 1200, bio: 'Senior medical oncologist focused on treatment planning and survivorship care.' },
  { id: 'd40', name: 'Dr. Pooja Agarwal', specialty: 'Oncology', state: 'Karnataka', experience: 13, status: 'available', rating: 4.8, nextSlot: 'Tomorrow, 3:00 PM', featured: false, qualifications: 'MBBS, MD, DM (Medical Oncology)', hospital: 'MediVerse Health City, Bengaluru', languages: ['English', 'Hindi', 'Kannada'], fee: 1100, bio: 'Medical oncology with a focus on early detection and follow-up screening.' },

  // ---- Demo doctors for the VishwaRaj Hospital console ----
  // Fictional demo practitioners, NOT real VishwaRaj doctors (same rule as above).
  // `hospitalId: 'vishwaraj'` lets the console and appointment flow filter to this
  // hospital for testing. The real VishwaRaj is in hospitals.js (id p28) as a
  // reference listing only, not bookable.
  { id: 'vrh1', hospitalId: 'vishwaraj', name: 'Dr. Aditi Kulkarni', specialty: 'Cardiology', state: 'Maharashtra', experience: 14, status: 'available', rating: 4.8, nextSlot: 'Today, 10:30 AM', featured: true, qualifications: 'MBBS, MD, DM (Cardiology)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 800, bio: 'Demo profile. Interventional cardiology and preventive heart care.' },
  { id: 'vrh2', hospitalId: 'vishwaraj', name: 'Dr. Nikhil Deshpande', specialty: 'Orthopedics', state: 'Maharashtra', experience: 11, status: 'available', rating: 4.7, nextSlot: 'Today, 12:00 PM', featured: false, qualifications: 'MBBS, MS (Orthopedics)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 700, bio: 'Demo profile. Joint replacement and sports injury care.' },
  { id: 'vrh3', hospitalId: 'vishwaraj', name: 'Dr. Sneha Pawar', specialty: 'General Medicine', state: 'Maharashtra', experience: 9, status: 'available', rating: 4.6, nextSlot: 'Today, 2:00 PM', featured: false, qualifications: 'MBBS, MD (General Medicine)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 500, bio: 'Demo profile. Everyday illness and chronic disease follow-ups.' },
  { id: 'vrh4', hospitalId: 'vishwaraj', name: 'Dr. Rohan Jadhav', specialty: 'Pediatrics', state: 'Maharashtra', experience: 12, status: 'available', rating: 4.8, nextSlot: 'Today, 3:30 PM', featured: false, qualifications: 'MBBS, MD (Pediatrics)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 550, bio: 'Demo profile. Newborn to adolescent care and immunisation.' },
  { id: 'vrh5', hospitalId: 'vishwaraj', name: 'Dr. Meghana Shah', specialty: 'Gynaecology', state: 'Maharashtra', experience: 13, status: 'in-surgery', rating: 4.7, nextSlot: 'Tomorrow, 11:00 AM', featured: false, qualifications: 'MBBS, MS (Obstetrics & Gynaecology)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 750, bio: 'Demo profile. Women’s health, antenatal care and screening.' },
  { id: 'vrh6', hospitalId: 'vishwaraj', name: 'Dr. Sameer Patil', specialty: 'Neurology', state: 'Maharashtra', experience: 15, status: 'available', rating: 4.8, nextSlot: 'Today, 5:00 PM', featured: false, qualifications: 'MBBS, MD, DM (Neurology)', hospital: 'VishwaRaj Hospital, Loni Kalbhor', languages: ['English', 'Hindi', 'Marathi'], fee: 900, bio: 'Demo profile. Migraine, epilepsy and stroke recovery care.' },
]

// The demo hospital wired to the ward/doctor console and appointment flow.
// One constant drives the doctors above, staff login, and console filter —
// change it here if the demo hospital changes.
export const DEMO_HOSPITAL = {
  id: 'vishwaraj',
  name: 'VishwaRaj Hospital, Loni Kalbhor',
}

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
