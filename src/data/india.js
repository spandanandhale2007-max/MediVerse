// State/city options for the hospital directory filters.
//
// CONTRACT: mirrors src/data/hospitals.js — every state and city here has at
// least one real hospital. Deliberately NOT a full list of Indian states/cities,
// so the picker never offers a place that returns "no hospitals listed".
//
// Keep in sync by hand (the build won't catch drift): add a state/city when you
// add its first hospital; remove a city when its last hospital goes.
//
// The old full 28-state + 8-UT list is in git history.

export const indiaStates = [
  { name: 'Chandigarh', cities: ['Chandigarh'] },
  { name: 'Delhi', cities: ['New Delhi', 'Delhi'] },
  {
    name: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Anand'],
  },
  {
    name: 'Karnataka',
    cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru'],
  },
  {
    name: 'Kerala',
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Kottayam', 'Palakkad', 'Malappuram'],
  },
  {
    name: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
  },
  {
    // Most cities covered.
    name: 'Maharashtra',
    cities: [
      'Mumbai',
      'Pune',
      'Nagpur',
      'Nashik',
      'Chhatrapati Sambhajinagar',
      'Solapur',
      'Kolhapur',
      'Amravati',
      'Thane',
      'Navi Mumbai',
      'Kalyan-Dombivli',
      'Ulhasnagar',
      'Bhiwandi',
      'Mira-Bhayandar',
      'Sangli',
      'Jalgaon',
      'Akola',
      'Latur',
      'Nanded',
      'Chandrapur',
      'Ahilyanagar',
      'Dhule',
      'Jalna',
    ],
  },
  {
    name: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  },
  { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'] },
  { name: 'West Bengal', cities: ['Kolkata'] },
]

export const indiaStateNames = indiaStates.map((s) => s.name)

export function citiesForState(stateName) {
  return indiaStates.find((s) => s.name === stateName)?.cities ?? []
}
