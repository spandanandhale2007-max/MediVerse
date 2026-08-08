// Location options for the hospital directory's state/city filters.
//
// IMPORTANT CONTRACT: this list mirrors src/data/hospitals.js — every state
// and every city named here has at least one real hospital listed. It is
// deliberately NOT a complete list of Indian states and cities.
//
// The reason is plain: a picker that offers Bihar or Manipur and then returns
// "no hospitals listed yet" wastes the time of someone who may be looking for
// care urgently. Better to show only what we can actually answer.
//
// So when you add hospitals for a new state or city, add it here too — and if
// you ever remove the last hospital in a city, remove the city here as well.
// `npm run build` will not catch a mismatch; the check is:
//   every city in this file has hospitals, and every hospital's city is here.
//
// This file previously carried all 28 states + 8 UTs. That version is in git
// history if national coverage is ever completed.

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
    // Our deepest-covered state.
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
