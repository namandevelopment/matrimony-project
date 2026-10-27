/**
 * 🏛️ SINDHI MATRIMONY - UNIFIED MASTER DATA CONSTANTS & DROPDOWN CATALOG
 * High-performance, in-memory reference dictionary for all application dropdowns.
 */

// 1. Sindhi Subcastes
export const SINDHI_SUBCASTES = [
  {
    id: "Bhaiband",
    name: "Bhaiband",
    description: "Historically international traders, industrialists, and global entrepreneurs.",
    historicalRegion: "Hyderabad (Sindh), Karachi",
  },
  {
    id: "Amil",
    name: "Amil",
    description: "Historically scholars, civil servants, judiciary, executives, and professionals.",
    historicalRegion: "Hyderabad (Sindh)",
  },
  {
    id: "Sahiti",
    name: "Sahiti",
    description: "Hailing from Sahiti pargana (Bhiria, Kandiaro, Tharushah). Known for enterprise and agriculture.",
    historicalRegion: "Central Sindh (Sahiti)",
  },
  {
    id: "Larkano",
    name: "Larkano",
    description: "From Larkana region, known for commerce and agriculture.",
    historicalRegion: "Larkana (North-West Sindh)",
  },
  {
    id: "Shikarpuri",
    name: "Shikarpuri",
    description: "From the historic merchant hub of Shikarpur, pioneers of indigenous banking.",
    historicalRegion: "Shikarpur (North Sindh)",
  },
  {
    id: "Dadu",
    name: "Dadu",
    description: "Hailing from Dadu, Sehwan and Kotri belt.",
    historicalRegion: "Dadu (Sindh)",
  },
  {
    id: "Sakhar",
    name: "Sakhar / Sukkur",
    description: "From Sukkur and Rohri across the Indus river.",
    historicalRegion: "Sukkur (Sindh)",
  },
  {
    id: "Thattai",
    name: "Thattai",
    description: "From the ancient capital of Thatta, famous for silk trade and culture.",
    historicalRegion: "Thatta (Lower Sindh)",
  },
  {
    id: "Sindhi",
    name: "Sindhi (General)",
    description: "Sindhi Community General / Pan-Sindhi background.",
    historicalRegion: "Sindh",
  },
  {
    id: "Other",
    name: "Other",
    description: "Inter-community or specific allied lineage.",
    historicalRegion: "Global",
  },
];

// 1b. Sindhi Subcaste by Caste Mapping Dictionary
export const SINDHI_SUBCASTE_MAP = {
  "Sindhi - Bhaiband": [
    "Hyderabadi Bhaiband",
    "Karachi Bhaiband",
    "Sukkur Bhaiband",
    "Larkana Bhaiband",
    "Shikarpuri Bhaiband",
    "Nawabshah",
    "Dadu",
    "Others",
    "Don't wish to specify",
  ],
  "Sindhi - Amil": [
    "Hyderabadi Amil",
    "Karachi Amil",
    "Khudabadi Amil",
    "Sukkur Amil",
    "Others",
    "Don't wish to specify",
  ],
  "Sindhi - Lohana": [
    "Chhapru Lohana",
    "Kutchi Lohana",
    "Halai Lohana",
    "Ghoghari Lohana",
    "Others",
    "Don't wish to specify",
  ],
  "Sindhi - Sahiti": [
    "Kandiaro",
    "Bhiria",
    "Tharu Shah",
    "Darbelo",
    "Others",
    "Don't wish to specify",
  ],
  "Sindhi - Brahmins (Pokharna, Saraswat)": [
    "Pokharna",
    "Pushkarna",
    "Saraswat",
    "Shrimali",
    "Others",
    "Don't wish to specify",
  ],
};

// 1c. Generic Default Subcastes fallback list
export const DEFAULT_SUBCASTES = [
  "Don't wish to specify",
  "Hyderabadi",
  "Sukkur",
  "Larkana",
  "Karachi",
  "Shikarpuri",
  "Sahiti",
  "Kutchi",
  "Others",
];

// 1d. Standard Vedic & Sindhi Gotras
export const GOTHRA_OPTIONS = [
  "Don't wish to specify",
  "Kashyap",
  "Bharadwaj",
  "Vashishta",
  "Gautam",
  "Sandilya",
  "Parashar",
  "Agastya",
  "Haritasya",
  "Kaundinya",
  "Vishwamitra",
  "Angirasa",
  "Jamadagni",
  "Atri",
  "Garg",
  "Mudgal",
  "Upamanyu",
  "Srivatsa",
  "Others",
];

// 2. Sindhi Surnames, Gotras and Subcaste Mapping (Smart Auto-Detection)
export const SINDHI_SURNAMES_MAPPING = [
  // Amil Lineage
  { surname: "Advani", gotra: "Advani", subcaste: "Amil" },
  { surname: "Ahuja", gotra: "Ahuja", subcaste: "Amil" },
  { surname: "Ajwani", gotra: "Ajwani", subcaste: "Amil" },
  { surname: "Bhavnani", gotra: "Bhavnani", subcaste: "Amil" },
  { surname: "Chainani", gotra: "Chainani", subcaste: "Amil" },
  { surname: "Chhabria", gotra: "Chhabria", subcaste: "Amil" },
  { surname: "Dudani", gotra: "Dudani", subcaste: "Amil" },
  { surname: "Gidwani", gotra: "Gidwani", subcaste: "Amil" },
  { surname: "Hingorani", gotra: "Hingorani", subcaste: "Amil" },
  { surname: "Jagtiani", gotra: "Jagtiani", subcaste: "Amil" },
  { surname: "Jhangiani", gotra: "Jhangiani", subcaste: "Amil" },
  { surname: "Karamchandani", gotra: "Karamchandani", subcaste: "Amil" },
  { surname: "Kripalani", gotra: "Kripalani", subcaste: "Amil" },
  { surname: "Lalvani", gotra: "Lalvani", subcaste: "Amil" },
  { surname: "Makhija", gotra: "Makhija", subcaste: "Amil" },
  { surname: "Malkani", gotra: "Malkani", subcaste: "Amil" },
  { surname: "Mansukhani", gotra: "Mansukhani", subcaste: "Amil" },
  { surname: "Mirchandani", gotra: "Mirchandani", subcaste: "Amil" },
  { surname: "Motwani", gotra: "Motwani", subcaste: "Amil" },
  { surname: "Panjwani", gotra: "Panjwani", subcaste: "Amil" },
  { surname: "Ramchandani", gotra: "Ramchandani", subcaste: "Amil" },
  { surname: "Rijhwani", gotra: "Rijhwani", subcaste: "Amil" },
  { surname: "Shahani", gotra: "Shahani", subcaste: "Amil" },
  { surname: "Sipahimalani", gotra: "Sipahimalani", subcaste: "Amil" },
  { surname: "Thadhani", gotra: "Thadhani", subcaste: "Amil" },
  { surname: "Vaswani", gotra: "Vaswani", subcaste: "Amil" },
  { surname: "Wadhwani", gotra: "Wadhwani", subcaste: "Amil" },

  // Bhaiband Lineage
  { surname: "Bajaj", gotra: "Bajaj", subcaste: "Bhaiband" },
  { surname: "Balani", gotra: "Balani", subcaste: "Bhaiband" },
  { surname: "Bathija", gotra: "Bathija", subcaste: "Bhaiband" },
  { surname: "Bhagwandas", gotra: "Bhagwandas", subcaste: "Bhaiband" },
  { surname: "Chawla", gotra: "Chawla", subcaste: "Bhaiband" },
  { surname: "Chellaram", gotra: "Chellaram", subcaste: "Bhaiband" },
  { surname: "Daryani", gotra: "Daryani", subcaste: "Bhaiband" },
  { surname: "Gangwani", gotra: "Gangwani", subcaste: "Bhaiband" },
  { surname: "Gulrajani", gotra: "Gulrajani", subcaste: "Bhaiband" },
  { surname: "Harjani", gotra: "Harjani", subcaste: "Bhaiband" },
  { surname: "Hiranandani", gotra: "Hiranandani", subcaste: "Bhaiband" },
  { surname: "Israni", gotra: "Israni", subcaste: "Bhaiband" },
  { surname: "Jethwani", gotra: "Jethwani", subcaste: "Bhaiband" },
  { surname: "Kalwani", gotra: "Kalwani", subcaste: "Bhaiband" },
  { surname: "Kataria", gotra: "Kataria", subcaste: "Bhaiband" },
  { surname: "Kewalramani", gotra: "Kewalramani", subcaste: "Bhaiband" },
  { surname: "Khemani", gotra: "Khemani", subcaste: "Bhaiband" },
  { surname: "Khubchandani", gotra: "Khubchandani", subcaste: "Bhaiband" },
  { surname: "Kishnani", gotra: "Kishnani", subcaste: "Bhaiband" },
  { surname: "Kotwani", gotra: "Kotwani", subcaste: "Bhaiband" },
  { surname: "Kukreja", gotra: "Kukreja", subcaste: "Bhaiband" },
  { surname: "Lakhani", gotra: "Lakhani", subcaste: "Bhaiband" },
  { surname: "Madnani", gotra: "Madnani", subcaste: "Bhaiband" },
  { surname: "Mahtani", gotra: "Mahtani", subcaste: "Bhaiband" },
  { surname: "Melwani", gotra: "Melwani", subcaste: "Bhaiband" },
  { surname: "Narang", gotra: "Narang", subcaste: "Bhaiband" },
  { surname: "Nihalani", gotra: "Nihalani", subcaste: "Bhaiband" },
  { surname: "Parwani", gotra: "Parwani", subcaste: "Bhaiband" },
  { surname: "Punwani", gotra: "Punwani", subcaste: "Bhaiband" },
  { surname: "Raheja", gotra: "Raheja", subcaste: "Bhaiband" },
  { surname: "Rajpal", gotra: "Rajpal", subcaste: "Bhaiband" },
  { surname: "Relwani", gotra: "Relwani", subcaste: "Bhaiband" },
  { surname: "Rohra", gotra: "Rohra", subcaste: "Bhaiband" },
  { surname: "Sajnani", gotra: "Sajnani", subcaste: "Bhaiband" },
  { surname: "Shamdasani", gotra: "Shamdasani", subcaste: "Bhaiband" },
  { surname: "Shivdasani", gotra: "Shivdasani", subcaste: "Bhaiband" },
  { surname: "Somaiya", gotra: "Somaiya", subcaste: "Bhaiband" },
  { surname: "Talreja", gotra: "Talreja", subcaste: "Bhaiband" },
  { surname: "Teckchandani", gotra: "Teckchandani", subcaste: "Bhaiband" },
  { surname: "Tolani", gotra: "Tolani", subcaste: "Bhaiband" },
  { surname: "Utamsing", gotra: "Utamsing", subcaste: "Bhaiband" },
  { surname: "Vazirani", gotra: "Vazirani", subcaste: "Bhaiband" },

  // Sahiti Lineage
  { surname: "Anandani", gotra: "Anandani", subcaste: "Sahiti" },
  { surname: "Bakhru", gotra: "Bakhru", subcaste: "Sahiti" },
  { surname: "Bodani", gotra: "Bodani", subcaste: "Sahiti" },
  { surname: "Gurnani", gotra: "Gurnani", subcaste: "Sahiti" },
  { surname: "Jagiasi", gotra: "Jagiasi", subcaste: "Sahiti" },
  { surname: "Kalani", gotra: "Kalani", subcaste: "Sahiti" },
  { surname: "Lund", gotra: "Lund", subcaste: "Sahiti" },
  { surname: "Manghnani", gotra: "Manghnani", subcaste: "Sahiti" },
  { surname: "Nathani", gotra: "Nathani", subcaste: "Sahiti" },
  { surname: "Pamnani", gotra: "Pamnani", subcaste: "Sahiti" },
  { surname: "Pahuja", gotra: "Pahuja", subcaste: "Sahiti" },
  { surname: "Soneji", gotra: "Soneji", subcaste: "Sahiti" },
  { surname: "Virwani", gotra: "Virwani", subcaste: "Sahiti" },

  // Shikarpuri & Northern Sindh
  { surname: "Nagpal", gotra: "Nagpal", subcaste: "Shikarpuri" },
  { surname: "Nagrani", gotra: "Nagrani", subcaste: "Shikarpuri" },
  { surname: "Soni", gotra: "Soni", subcaste: "Shikarpuri" },
  { surname: "Tulsiani", gotra: "Tulsiani", subcaste: "Shikarpuri" },
  { surname: "Chandiramani", gotra: "Chandiramani", subcaste: "Sakhar" },
  { surname: "Bhambhani", gotra: "Bhambhani", subcaste: "Sakhar" },
  { surname: "Jawaharani", gotra: "Jawaharani", subcaste: "Sakhar" },
  { surname: "Lahori", gotra: "Lahori", subcaste: "Larkano" },
  { surname: "Masand", gotra: "Masand", subcaste: "Larkano" },
  { surname: "Moriani", gotra: "Moriani", subcaste: "Larkano" },
  { surname: "Wadhwa", gotra: "Wadhwa", subcaste: "Larkano" },
];

// 3. Cultural Sampradayas / Religious Sects in Sindhi Community
export const SINDHI_SAMPRADAYAS = [
  { id: "SINDHI_HINDU", label: "Sindhi Hindu / Sanatan Dharma" },
  { id: "JHULELAL_PANTHI", label: "Jhulelal / Varun Dev Upasak" },
  { id: "NANAKPANTHI_SIKH", label: "Nanakpanthi / Sahajdhari Sikh" },
  { id: "RADHASOAMI", label: "Radhasoami (Beas / Dayalbagh)" },
  { id: "NIRANKARI", label: "Sant Nirankari Mission" },
  { id: "BRAHMA_KUMARIS", label: "Brahma Kumaris" },
  { id: "ARYA_SAMAJ", label: "Arya Samaj" },
  { id: "OTHER", label: "Other / Secular" },
];

// 4. Profile Created For (Relationship)
export const PROFILE_FOR_OPTIONS = [
  { id: "MYSELF", label: "Myself" },
  { id: "SON", label: "Son" },
  { id: "DAUGHTER", label: "Daughter" },
  { id: "BROTHER", label: "Brother" },
  { id: "SISTER", label: "Sister" },
  { id: "FRIEND", label: "Friend" },
  { id: "RELATIVE", label: "Relative" },
];

// 5. Marital Status Options
export const MARITAL_STATUS_OPTIONS = [
  { id: "NEVER_MARRIED", label: "Never Married" },
  { id: "DIVORCED", label: "Divorced" },
  { id: "WIDOWED", label: "Widowed" },
  { id: "AWAITING_DIVORCE", label: "Awaiting Divorce" },
  { id: "ANNULLED", label: "Annulled" },
];

// 6. Have Children Options
export const HAVE_CHILDREN_OPTIONS = [
  { id: "NO", label: "No" },
  { id: "YES_LIVING_TOGETHER", label: "Yes, living together" },
  { id: "YES_NOT_LIVING_TOGETHER", label: "Yes, living separately" },
];

// 7. Height Ranges (134 cm to 213 cm)
export const HEIGHT_OPTIONS = [
  { cm: 134, label: "4 ft 5 in (134 cm)" },
  { cm: 137, label: "4 ft 6 in (137 cm)" },
  { cm: 140, label: "4 ft 7 in (140 cm)" },
  { cm: 142, label: "4 ft 8 in (142 cm)" },
  { cm: 145, label: "4 ft 9 in (145 cm)" },
  { cm: 147, label: "4 ft 10 in (147 cm)" },
  { cm: 150, label: "4 ft 11 in (150 cm)" },
  { cm: 152, label: "5 ft 0 in (152 cm)" },
  { cm: 155, label: "5 ft 1 in (155 cm)" },
  { cm: 157, label: "5 ft 2 in (157 cm)" },
  { cm: 160, label: "5 ft 3 in (160 cm)" },
  { cm: 162, label: "5 ft 4 in (162 cm)" },
  { cm: 165, label: "5 ft 5 in (165 cm)" },
  { cm: 168, label: "5 ft 6 in (168 cm)" },
  { cm: 170, label: "5 ft 7 in (170 cm)" },
  { cm: 173, label: "5 ft 8 in (173 cm)" },
  { cm: 175, label: "5 ft 9 in (175 cm)" },
  { cm: 178, label: "5 ft 10 in (178 cm)" },
  { cm: 180, label: "5 ft 11 in (180 cm)" },
  { cm: 183, label: "6 ft 0 in (183 cm)" },
  { cm: 185, label: "6 ft 1 in (185 cm)" },
  { cm: 188, label: "6 ft 2 in (188 cm)" },
  { cm: 190, label: "6 ft 3 in (190 cm)" },
  { cm: 193, label: "6 ft 4 in (193 cm)" },
  { cm: 196, label: "6 ft 5 in (196 cm)" },
  { cm: 201, label: "6 ft 7 in (201 cm)" },
  { cm: 213, label: "7 ft 0 in (213 cm)" },
];

// 8. Diets & Food Habits
export const DIET_OPTIONS = [
  { id: "VEGETARIAN", label: "Pure Vegetarian" },
  { id: "EGGETARIAN", label: "Eggetarian" },
  { id: "NON_VEGETARIAN", label: "Non-Vegetarian" },
  { id: "VEGAN", label: "Vegan" },
  { id: "JAIN", label: "Jain" },
];

// 9. Habit Options (Smoking & Drinking)
export const HABIT_OPTIONS = [
  { id: "NO", label: "No / Non-Drinker / Non-Smoker" },
  { id: "OCCASIONALLY", label: "Occasionally / Socially" },
  { id: "YES", label: "Yes / Regular" },
];

// 10. Education Degrees Grouped by Category
export const EDUCATION_CATEGORIES = [
  {
    category: "Engineering & Technology",
    degrees: ["B.Tech", "B.E.", "M.Tech", "M.E.", "M.S. (Engineering)", "BCA", "MCA", "B.Sc (IT/CS)", "M.Sc (IT/CS)"],
  },
  {
    category: "Management & Business",
    degrees: ["MBA", "PGDM", "BBA", "BMS", "Executive MBA"],
  },
  {
    category: "Finance, Commerce & Banking",
    degrees: ["CA (Chartered Accountant)", "CS (Company Secretary)", "CFA", "ICWA / CMA", "B.Com", "M.Com"],
  },
  {
    category: "Medicine & Healthcare",
    degrees: ["MBBS", "MD", "MS (Surgery)", "BDS", "MDS", "B.Pharm", "M.Pharm", "BPT (Physiotherapy)", "BHMS/BAMS"],
  },
  {
    category: "Law & Legal Studies",
    degrees: ["LLB", "LLM", "Integrated Law (BA LLB / BBA LLB)"],
  },
  {
    category: "Doctorate & Research",
    degrees: ["Ph.D.", "Post Doctorate"],
  },
  {
    category: "Arts, Science & Design",
    degrees: ["B.A.", "M.A.", "B.Sc", "M.Sc", "B.Arch", "M.Arch", "B.Des (Design)", "NIFT / Fashion"],
  },
  {
    category: "Other Qualifications",
    degrees: ["Diploma", "High School / Intermediate", "Trade Certification"],
  },
];

// 11. Employment Sectors
export const EMPLOYED_IN_SECTORS = [
  { id: "PRIVATE_SECTOR", label: "Private Company / Corporate / MNC" },
  { id: "BUSINESS_SELF_EMPLOYED", label: "Business Owner / Entrepreneur / Self-Employed" },
  { id: "GOVERNMENT_PSU", label: "Government / Public Sector Unit (PSU)" },
  { id: "CIVIL_SERVICES_DEFENSE", label: "Civil Services (IAS/IPS/IRS) / Defense" },
  { id: "NOT_WORKING", label: "Not Currently Working" },
];

// 12. Popular Matrimonial Occupations
export const POPULAR_OCCUPATIONS = [
  "Software Engineer / Architect / IT Lead",
  "Business Owner / Manufacturer / Trader",
  "Chartered Accountant (CA) / Auditor",
  "Doctor / Surgeon / Medical Specialist",
  "Banker / Investment Banker / Fund Manager",
  "Corporate Executive / General Manager / VP",
  "Civil / Mechanical / Electrical Engineer",
  "Lawyer / Advocate / Legal Consultant",
  "Architect / Interior Designer",
  "Professor / Lecturer / Academician",
  "Civil Services / Govt Officer",
  "Pilot / Aviation Professional",
  "Merchant Navy Officer",
  "Fashion Designer / Jewellery Designer",
  "Real Estate Builder / Developer",
  "Dentist",
  "HR / Talent Acquisition Professional",
  "Marketing & Digital Brand Specialist",
  "Data Scientist / AI Engineer",
  "Pharmacist / Biotech Specialist",
];

// 13. Annual Income Slabs
export const ANNUAL_INCOME_SLABS = {
  INR: [
    { id: "UNDER_3_LPA", min: 0, max: 300000, label: "Under ₹3 Lakhs" },
    { id: "3_TO_5_LPA", min: 300000, max: 500000, label: "₹3 - ₹5 Lakhs" },
    { id: "5_TO_7_5_LPA", min: 500000, max: 750000, label: "₹5 - ₹7.5 Lakhs" },
    { id: "7_5_TO_10_LPA", min: 750000, max: 1000000, label: "₹7.5 - ₹10 Lakhs" },
    { id: "10_TO_15_LPA", min: 1000000, max: 1500000, label: "₹10 - ₹15 Lakhs" },
    { id: "15_TO_25_LPA", min: 1500000, max: 2500000, label: "₹15 - ₹25 Lakhs" },
    { id: "25_TO_50_LPA", min: 2500000, max: 5000000, label: "₹25 - ₹50 Lakhs" },
    { id: "50_TO_1_CR", min: 5000000, max: 10000000, label: "₹50 Lakhs - ₹1 Crore" },
    { id: "ABOVE_1_CR", min: 10000000, max: 999999999, label: "₹1 Crore and Above" },
  ],
  USD: [
    { id: "UNDER_30K", min: 0, max: 30000, label: "Under $30,000" },
    { id: "30K_TO_50K", min: 30000, max: 50000, label: "$30,000 - $50,000" },
    { id: "50K_TO_75K", min: 50000, max: 75000, label: "$50,000 - $75,000" },
    { id: "75K_TO_100K", min: 75000, max: 100000, label: "$75,000 - $100,000" },
    { id: "100K_TO_150K", min: 100000, max: 150000, label: "$100,000 - $150,000" },
    { id: "150K_TO_250K", min: 150000, max: 250000, label: "$150,000 - $250,000" },
    { id: "ABOVE_250K", min: 250000, max: 999999999, label: "$250,000 and Above" },
  ],
  AED: [
    { id: "UNDER_60K", min: 0, max: 60000, label: "Under 60,000 AED" },
    { id: "60K_TO_120K", min: 60000, max: 120000, label: "60,000 - 120,000 AED" },
    { id: "120K_TO_240K", min: 120000, max: 240000, label: "120,000 - 240,000 AED" },
    { id: "240K_TO_480K", min: 240000, max: 480000, label: "240,000 - 480,000 AED" },
    { id: "ABOVE_480K", min: 480000, max: 999999999, label: "480,000 AED and Above" },
  ],
};

// 14. Locations (Countries, States & Major Sindhi Hubs)
export const SINDHI_DIASPORA_COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "AE", name: "United Arab Emirates (UAE)" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "SG", name: "Singapore" },
  { code: "ES", name: "Spain" },
  { code: "PH", name: "Philippines" },
  { code: "HK", name: "Hong Kong" },
  { code: "NG", name: "Nigeria" },
  { code: "AU", name: "Australia" },
];

export const MAJOR_SINDHI_CITIES = [
  { city: "Mumbai", state: "Maharashtra", country: "India" },
  { city: "Pune", state: "Maharashtra", country: "India" },
  { city: "Ulhasnagar", state: "Maharashtra", country: "India" },
  { city: "Thane", state: "Maharashtra", country: "India" },
  { city: "Nagpur", state: "Maharashtra", country: "India" },
  { city: "Ahmedabad", state: "Gujarat", country: "India" },
  { city: "Vadodara", state: "Gujarat", country: "India" },
  { city: "Surat", state: "Gujarat", country: "India" },
  { city: "Gandhidham", state: "Gujarat", country: "India" },
  { city: "Adipur", state: "Gujarat", country: "India" },
  { city: "Rajkot", state: "Gujarat", country: "India" },
  { city: "Jaipur", state: "Rajasthan", country: "India" },
  { city: "Ajmer", state: "Rajasthan", country: "India" },
  { city: "Jodhpur", state: "Rajasthan", country: "India" },
  { city: "Kota", state: "Rajasthan", country: "India" },
  { city: "Indore", state: "Madhya Pradesh", country: "India" },
  { city: "Bhopal", state: "Madhya Pradesh", country: "India" },
  { city: "Gwalior", state: "Madhya Pradesh", country: "India" },
  { city: "Jabalpur", state: "Madhya Pradesh", country: "India" },
  { city: "Katni", state: "Madhya Pradesh", country: "India" },
  { city: "New Delhi", state: "Delhi", country: "India" },
  { city: "Gurgaon", state: "Haryana", country: "India" },
  { city: "Noida", state: "Uttar Pradesh", country: "India" },
  { city: "Bengaluru", state: "Karnataka", country: "India" },
  { city: "Hyderabad", state: "Telangana", country: "India" },
  { city: "Raipur", state: "Chhattisgarh", country: "India" },
  { city: "Bilaspur", state: "Chhattisgarh", country: "India" },
  { city: "Agra", state: "Uttar Pradesh", country: "India" },
  { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
  { city: "Kanpur", state: "Uttar Pradesh", country: "India" },
  { city: "Dubai", state: "Dubai", country: "United Arab Emirates (UAE)" },
  { city: "Abu Dhabi", state: "Abu Dhabi", country: "United Arab Emirates (UAE)" },
  { city: "Sharjah", state: "Sharjah", country: "United Arab Emirates (UAE)" },
  { city: "London", state: "England", country: "United Kingdom" },
  { city: "New York", state: "New York", country: "United States" },
  { city: "San Jose", state: "California", country: "United States" },
  { city: "Chicago", state: "Illinois", country: "United States" },
  { city: "Toronto", state: "Ontario", country: "Canada" },
  { city: "Vancouver", state: "British Columbia", country: "Canada" },
  { city: "Singapore", state: "Central", country: "Singapore" },
  { city: "Tenerife", state: "Canary Islands", country: "Spain" },
  { city: "Las Palmas", state: "Canary Islands", country: "Spain" },
  { city: "Madrid", state: "Community of Madrid", country: "Spain" },
  { city: "Manila", state: "Metro Manila", country: "Philippines" },
];

// 15. Astrology & Horoscope Master Reference
export const HOROSCOPE_REFERENCE = {
  manglikOptions: [
    { id: "NON_MANGLIK", label: "Non-Manglik" },
    { id: "MANGLIK", label: "Manglik" },
    { id: "ANSHIK_MANGLIK", label: "Anshik / Partial Manglik" },
    { id: "DON_T_KNOW", label: "Don't Know / Need Kundli Analysis" },
  ],
  raasOptions: [
    { id: "MESH", label: "Mesh (Aries)" },
    { id: "VRISHABH", label: "Vrishabh (Taurus)" },
    { id: "MITHUN", label: "Mithun (Gemini)" },
    { id: "KARK", label: "Kark (Cancer)" },
    { id: "SINGH", label: "Singh (Leo)" },
    { id: "KANYA", label: "Kanya (Virgo)" },
    { id: "TULA", label: "Tula (Libra)" },
    { id: "VRISHCHIK", label: "Vrishchik (Scorpio)" },
    { id: "DHANU", label: "Dhanu (Sagittarius)" },
    { id: "MAKAR", label: "Makar (Capricorn)" },
    { id: "KUMBH", label: "Kumbh (Aquarius)" },
    { id: "MEEN", label: "Meen (Pisces)" },
  ],
  nakshatras: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
  ],
};

// 16. Family Values, Status & Types
export const FAMILY_OPTIONS = {
  values: [
    { id: "TRADITIONAL", label: "Traditional" },
    { id: "MODERATE", label: "Moderate" },
    { id: "LIBERAL", label: "Liberal" },
  ],
  types: [
    { id: "JOINT", label: "Joint Family" },
    { id: "NUCLEAR", label: "Nuclear Family" },
  ],
  status: [
    { id: "MIDDLE_CLASS", label: "Middle Class" },
    { id: "UPPER_MIDDLE_CLASS", label: "Upper Middle Class" },
    { id: "RICH_AFFLUENT", label: "Rich / Affluent" },
  ],
  parentOccupations: [
    "Business / Entrepreneur",
    "Private Sector Service",
    "Government / PSU Service",
    "Retired",
    "Homemaker",
    "Self-Employed / Consultant",
    "Late / Deceased",
  ],
};

// 17. Gender Options
export const GENDER_OPTIONS = [
  { id: "MALE", label: "Male" },
  { id: "FEMALE", label: "Female" },
];

// 18. Religion Options
export const RELIGION_OPTIONS = [
  { id: "HINDU", label: "Hindu" },
  { id: "SIKH", label: "Sikh" },
  { id: "JAIN", label: "Jain" },
  { id: "OTHER", label: "Other" },
];

// 19. Caste / Community Options
export const CASTE_OPTIONS = [
  { id: "SINDHI", label: "Sindhi (General)" },
  { id: "SINDHI_BHAIBAND", label: "Sindhi - Bhaiband" },
  { id: "SINDHI_AMIL", label: "Sindhi - Amil" },
  { id: "SINDHI_LOHANA", label: "Sindhi - Lohana" },
  { id: "SINDHI_SAHITI", label: "Sindhi - Sahiti" },
  { id: "SINDHI_LARKANA", label: "Sindhi - Larkana" },
  { id: "SINDHI_SAKHAR", label: "Sindhi - Sakhar" },
  { id: "SINDHI_DADU", label: "Sindhi - Dadu" },
  { id: "SINDHI_SHIKARPURI", label: "Sindhi - Shikarpuri" },
  { id: "SINDHI_THARI", label: "Sindhi - Thari" },
  { id: "SINDHI_SEHWANI", label: "Sindhi - Sehwani" },
  { id: "SINDHI_HYDERABADI", label: "Sindhi - Hyderabadi" },
  { id: "SINDHI_BHATIA", label: "Sindhi - Bhatia" },
  { id: "SINDHI_BRAHMINS", label: "Sindhi - Brahmins (Pokharna, Saraswat)" },
  { id: "SINDHI_CHHAPRU", label: "Sindhi - Chhapru" },
  { id: "CASTE_NO_BAR", label: "Caste No Bar" },
  { id: "OTHER", label: "Other" },
];

// 20. Mother Tongue / Languages
export const MOTHER_TONGUE_OPTIONS = [
  { id: "SINDHI", label: "Sindhi" },
  { id: "HINDI", label: "Hindi" },
  { id: "ENGLISH", label: "English" },
  { id: "GUJARATI", label: "Gujarati" },
  { id: "MARATHI", label: "Marathi" },
  { id: "PUNJABI", label: "Punjabi" },
  { id: "BENGALI", label: "Bengali" },
  { id: "OTHER", label: "Other" },
];

// 21. Physical Status & Body Types
export const PHYSICAL_STATUS_OPTIONS = [
  { id: "NORMAL", label: "Normal" },
  { id: "PHYSICALLY_CHALLENGED", label: "Physically Challenged" },
];

export const BODY_TYPE_OPTIONS = [
  { id: "SLIM", label: "Slim" },
  { id: "ATHLETIC", label: "Athletic" },
  { id: "AVERAGE", label: "Average" },
  { id: "HEAVY", label: "Heavy" },
];

export const COMPLEXION_OPTIONS = [
  { id: "VERY_FAIR", label: "Very Fair" },
  { id: "FAIR", label: "Fair" },
  { id: "WHEATISH", label: "Wheatish" },
  { id: "DUSKY", label: "Dusky" },
];

export const BLOOD_GROUP_OPTIONS = [
  { id: "A_POSITIVE", label: "A+" },
  { id: "A_NEGATIVE", label: "A-" },
  { id: "B_POSITIVE", label: "B+" },
  { id: "B_NEGATIVE", label: "B-" },
  { id: "O_POSITIVE", label: "O+" },
  { id: "O_NEGATIVE", label: "O-" },
  { id: "AB_POSITIVE", label: "AB+" },
  { id: "AB_NEGATIVE", label: "AB-" },
];

// 22. Indian States and Union Territories
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// 23. Currency Options
export const CURRENCY_OPTIONS = [
  { id: "INR", label: "INR - India (₹)", symbol: "₹" },
  { id: "AED", label: "AED - UAE (AED)", symbol: "AED" },
  { id: "USD", label: "USD - USA ($)", symbol: "$" },
  { id: "GBP", label: "GBP - UK (£)", symbol: "£" },
  { id: "EUR", label: "EUR - Europe (€)", symbol: "€" },
  { id: "CAD", label: "CAD - Canada ($)", symbol: "CA$" },
  { id: "SGD", label: "SGD - Singapore ($)", symbol: "SG$" },
  { id: "AUD", label: "AUD - Australia ($)", symbol: "A$" },
];

// 24. Admin CRM Dropdowns
export const LEAD_STATUS_OPTIONS = [
  { id: "NEW", label: "New Lead" },
  { id: "CONTACTED", label: "Contacted" },
  { id: "INTERESTED", label: "Interested" },
  { id: "DEMO_SCHEDULED", label: "Demo Scheduled" },
  { id: "WON", label: "Won / Converted" },
  { id: "LOST", label: "Lost" },
  { id: "JUNK", label: "Junk" },
];

export const LEAD_SOURCE_OPTIONS = [
  { id: "WEBSITE", label: "Website / Organic" },
  { id: "REFERRAL", label: "Member Referral" },
  { id: "FACEBOOK_ADS", label: "Meta / Facebook Ads" },
  { id: "GOOGLE_ADS", label: "Google Ads" },
  { id: "CAMPAIGN", label: "Marketing Campaign" },
  { id: "WALK_IN", label: "Walk-in Center" },
  { id: "OTHER", label: "Other" },
];

export const VERIFICATION_STATUS_OPTIONS = [
  { id: "PENDING", label: "Pending Verification" },
  { id: "VERIFIED", label: "Verified" },
  { id: "REJECTED", label: "Rejected" },
  { id: "NEEDS_REVIEW", label: "Needs Review" },
];

export const DOCUMENT_TYPE_OPTIONS = [
  { id: "AADHAAR", label: "Aadhaar Card" },
  { id: "PAN", label: "PAN Card" },
  { id: "PASSPORT", label: "Passport" },
  { id: "DRIVING_LICENSE", label: "Driving License" },
  { id: "VOTER_ID", label: "Voter ID" },
];

export const EMPLOYEE_ROLE_OPTIONS = [
  { id: "SUPER_ADMIN", label: "Super Admin" },
  { id: "ADMIN", label: "Admin" },
  { id: "CRM_MANAGER", label: "CRM Manager" },
  { id: "CRM_AGENT", label: "CRM Agent / Telecaller" },
  { id: "FINANCE_MANAGER", label: "Finance Manager" },
  { id: "FINANCE_STAFF", label: "Finance Staff" },
  { id: "MODERATOR", label: "Profile Moderator" },
  { id: "SUPPORT_AGENT", label: "Support Agent" },
  { id: "ANALYST", label: "Data Analyst" },
];

