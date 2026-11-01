/**
 * 💍 SINDHI MATRIMONY - COMPREHENSIVE REALISTIC DATASET & SEED POOL
 * High-volume, high-fidelity matrimonial dataset for API performance testing,
 * realistic search, filters, pagination, and UI demonstration.
 */

// 1. Curated working Unsplash portraits (high quality, authentic portraits)
const FEMALE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509783236416-c9ad59bae472?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
];

const MALE_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
];

// 2. Curated realistic couple photos for Success Stories
export const COUPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&auto=format&fit=crop&q=80",
];

// 3. Sindhi Names & Archetypes Pool
const FEMALE_NAMES = [
  "Pooja Chhabria", "Simran Advani", "Dr. Roshni Jhangiani", "Muskaan Motwani",
  "Komal Chawla", "Divya Makhija", "Mehek Hinduja", "Karishma Motwani",
  "Anjali Gidwani", "Riya Dubey", "Aisha Pandit", "S Sreyashi",
  "Kajal Kumari", "Sneha Vaswani", "Payal Thadani", "Barkha Bhavnani",
  "Lavina Mansukhani", "Jaya Dudani", "Neelam Kriplani", "Priya Mirchandani",
  "Neha Panjwani", "Varsha Sippy", "Sangeeta Rijhwani", "Twinkle Vazirani",
  "Hansika Kalro", "Disha Khemlani", "Aarti Melwani", "Chandni Narang",
  "Dimple Ramchandani", "Rashmi Sadarangani", "Ishika Shahani", "Khushi Talreja",
  "Manju Bathija", "Ritu Jagtiani", "Deepa Lalvani", "Sunita Malkani",
  "Anita Sipahimalani", "Meena Wadhwani", "Nisha Bajaj", "Bhavna Balani",
  "Geeta Bhagwandas", "Hema Chellaram", "Kavita Daryani", "Mamta Gangwani",
  "Monika Gulrajani", "Neetu Harjani", "Pooja Hiranandani", "Preeti Israni",
  "Rekha Jethwani", "Roma Kalwani", "Sapna Kataria", "Shalini Kewalramani",
  "Shilpa Khemani", "Sonam Khubchandani", "Tamanna Kishnani", "Vandana Kotwani",
  "Vidhi Kukreja", "Vinita Lakhani", "Anamika Madnani", "Archana Mahtani",
  "Bina Nihalani", "Chitra Parwani", "Deepali Punwani", "Gunjan Raheja",
  "Heena Rajpal", "Indu Relwani", "Juhi Rohra", "Kanchan Sajnani",
  "Lata Shamdasani", "Madhu Shivdasani", "Nandini Somaiya", "Pallavi Teckchandani",
  "Prerna Uttamchandani", "Reema Valecha", "Sapna Varindani",
];

const MALE_NAMES = [
  "Karan Hingorani", "Rohan Advani", "Kunal Bhavnani", "Mohit Chhabria",
  "Varun Chandiramani", "Rahul Lulla", "Deepak Makhija", "Ritesh Jagtiani",
  "Amit Panjwani", "Vishal Rijhwani", "Manish Kriplani", "Nikhil Gidwani",
  "Sunny Vazirani", "Sagar Chawla", "Akshay Vaswani", "Vicky Motwani",
  "Jatin Hinduja", "Dinesh Thadani", "Mahesh Mansukhani", "Girish Mirchandani",
  "Haresh Dudani", "Bharat Sippy", "Kailash Kalro", "Ajay Khemlani",
  "Sanjay Melwani", "Manoj Narang", "Vijay Ramchandani", "Anil Sadarangani",
  "Sunil Shahani", "Govind Talreja", "Vinod Bathija", "Ashok Lalvani",
  "Chandan Malkani", "Tarun Wadhwani", "Naveen Bajaj", "Kamal Balani",
  "Ramesh Bhagwandas", "Suresh Chellaram", "Naresh Daryani", "Dheeraj Gangwani",
  "Gautam Gulrajani", "Harish Harjani", "Hemant Hiranandani", "Inder Israni",
  "Jaiprakash Jethwani", "Kishore Kalwani", "Lalit Kataria", "Murli Kewalramani",
  "Mukesh Khemani", "Narendra Khubchandani", "Om Kishnani", "Prakash Kotwani",
  "Pradeep Kukreja", "Rajesh Lakhani", "Raju Madnani", "Ravi Mahtani",
  "Sachin Nihalani", "Sandeep Parwani", "Satish Punwani", "Shankar Raheja",
  "Shyam Rajpal", "Subhash Relwani", "Suraj Rohra", "Vikas Sajnani",
  "Vinay Shamdasani", "Vivek Shivdasani", "Yash Somaiya", "Alok Teckchandani",
  "Arjun Uttamchandani", "Bhisham Valecha", "Chetan Varindani", "Devdas Wadhwani",
  "Dilip Ahuja", "Doulat Ajwani", "Ghanshyam Chainani",
];

// 4. Sindhi Subcastes & Gotras Catalog
const SINDHI_SUBCASTES = [
  "Bhaiband", "Amil", "Sahiti", "Larkano", "Shikarpuri",
  "Sakhar", "Dadu", "Thattai", "Sindhi", "Hyderabadi",
];

const SINDHI_GOTRAS = [
  "Advani", "Chhabria", "Vaswani", "Jhangiani", "Motwani",
  "Hingorani", "Bathija", "Gidwani", "Lulla", "Makhija",
  "Hinduja", "Chandiramani", "Jagtiani", "Thadani", "Mansukhani",
  "Bhavnani", "Kriplani", "Mirchandani", "Panjwani", "Sippy",
  "Rijhwani", "Vazirani", "Chawla", "Dudani", "Kalro",
  "Khemlani", "Melwani", "Narang", "Ramchandani", "Sadarangani",
  "Shahani", "Talreja", "Valecha", "Wadhwani", "Ahuja",
];

// 5. Locations Pool
const CITIES = [
  { city: "Mumbai", state: "Maharashtra", country: "India", nativePlace: "Hyderabad (Sindh)" },
  { city: "Pune", state: "Maharashtra", country: "India", nativePlace: "Karachi (Sindh)" },
  { city: "Jaipur", state: "Rajasthan", country: "India", nativePlace: "Ajmer" },
  { city: "Ahmedabad", state: "Gujarat", country: "India", nativePlace: "Sukkur (Sindh)" },
  { city: "Ulhasnagar", state: "Maharashtra", country: "India", nativePlace: "Larkana (Sindh)" },
  { city: "Indore", state: "Madhya Pradesh", country: "India", nativePlace: "Shikarpur (Sindh)" },
  { city: "Bhopal", state: "Madhya Pradesh", country: "India", nativePlace: "Dadu (Sindh)" },
  { city: "Nagpur", state: "Maharashtra", country: "India", nativePlace: "Rohri (Sindh)" },
  { city: "Delhi", state: "Delhi", country: "India", nativePlace: "Thatta (Sindh)" },
  { city: "Bengaluru", state: "Karnataka", country: "India", nativePlace: "Hyderabad (Sindh)" },
  { city: "Dubai", state: "Dubai", country: "UAE", nativePlace: "Ulhasnagar" },
  { city: "London", state: "England", country: "UK", nativePlace: "Mumbai" },
];

// 6. Professional Profiles Pool
const PROFESSIONS = [
  { occupation: "Senior Software Engineer", companyName: "Google", degree: "B.Tech Computer Science", field: "Computer Science", college: "IIT Bombay", income: 3800000 },
  { occupation: "Chartered Accountant", companyName: "Deloitte India", degree: "CA (Chartered Accountant)", field: "Audit & Tax", college: "ICAI Mumbai", income: 2200000 },
  { occupation: "Consultant Dermatologist", companyName: "Lilavati Hospital", degree: "MBBS, MD", field: "Dermatology", college: "KEM Hospital Mumbai", income: 3200000 },
  { occupation: "Investment Banker", companyName: "Goldman Sachs", degree: "MBA Finance", field: "Finance", college: "IIM Ahmedabad", income: 4500000 },
  { occupation: "Lead Product Manager", companyName: "Swiggy", degree: "B.Tech + MBA", field: "Product Management", college: "BITS Pilani", income: 3400000 },
  { occupation: "Textile Business Director", companyName: "Family Enterprise (Radha Textiles)", degree: "BBA International Business", field: "Business Commerce", college: "NMIMS Mumbai", income: 5500000 },
  { occupation: "Civil & Structural Engineer", companyName: "L&T Construction", degree: "M.Tech Structural Engg", field: "Civil Engineering", college: "COEP Pune", income: 1900000 },
  { occupation: "Corporate Lawyer", companyName: "Shardul Amarchand Mangaldas", degree: "BA LLB (Hons)", field: "Corporate Law", college: "NLU Delhi", income: 2800000 },
  { occupation: "Data Scientist / AI Specialist", companyName: "Microsoft", degree: "MS Data Science", field: "AI / ML", college: "Columbia University", income: 4200000 },
  { occupation: "Senior Architect", companyName: "Morphogenesis", degree: "B.Arch", field: "Architecture & Design", college: "CEPT Ahmedabad", income: 2100000 },
  { occupation: "General Physician", companyName: "Fortis Healthcare", degree: "MBBS", field: "Medicine", college: "SMS Medical College Jaipur", income: 2400000 },
  { occupation: "Senior Brand Strategist", companyName: "Hindustan Unilever", degree: "MBA Marketing", field: "Marketing", college: "MICA Ahmedabad", income: 2600000 },
  { occupation: "Diamond Merchant & Jeweller", companyName: "Vaswani Jewellers", degree: "Graduate", field: "Gemology & Jewellery", college: "GIA Mumbai", income: 6500000 },
  { occupation: "Real Estate Developer", companyName: "Advani Group Developers", degree: "B.E. Civil + MBA", field: "Real Estate", college: "SPJIMR Mumbai", income: 7500000 },
  { occupation: "Financial Analyst", companyName: "Morgan Stanley", degree: "CFA, B.Com", field: "Equity Research", college: "HR College Mumbai", income: 1800000 },
  { occupation: "Interior Designer", companyName: "Studio Sindhi Designs", degree: "B.Des Interior Design", field: "Design", college: "NID Ahmedabad", income: 1500000 },
  { occupation: "HR Business Partner", companyName: "Amazon", degree: "MBA HR", field: "Human Resources", college: "XLRI Jamshedpur", income: 2300000 },
  { occupation: "Commercial Pilot", companyName: "Air India", degree: "Commercial Pilot License (CPL)", field: "Aviation", college: "IGRUA", income: 4800000 },
];

const NAKSHATRAS = [
  "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya",
  "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const RASHIS = [
  "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
  "Singh (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)",
];

const MANGLIK_TYPES = ["NON_MANGLIK", "ANSHIK_MANGLIK", "DONT_KNOW", "MANGLIK"];
const MEMBERSHIP_LEVELS = ["FREE", "SILVER", "GOLD", "DIAMOND", "VIP"];

// 7. Deterministic ObjectId Generator
function makeObjectId(index, prefix = "67b34a12c8e312a0f9") {
  const hex = index.toString(16).padStart(6, "0");
  return `${prefix}${hex}`;
}

// 8. Generate 150 High-Fidelity Realistic Candidates (75 Female, 75 Male)
export function generateCandidates(count = 150) {
  const candidates = [];
  const total = Number(count) || 150;

  for (let i = 0; i < total; i++) {
    const isFemale = i % 2 === 0;
    const gender = isFemale ? "FEMALE" : "MALE";
    const nameList = isFemale ? FEMALE_NAMES : MALE_NAMES;
    const name = nameList[Math.floor(i / 2) % nameList.length];

    const avatarList = isFemale ? FEMALE_AVATARS : MALE_AVATARS;
    const avatar = avatarList[i % avatarList.length];

    const subcaste = SINDHI_SUBCASTES[i % SINDHI_SUBCASTES.length];
    const gotra = SINDHI_GOTRAS[i % SINDHI_GOTRAS.length];
    const motherGotra = SINDHI_GOTRAS[(i + 7) % SINDHI_GOTRAS.length];

    const loc = CITIES[i % CITIES.length];
    const prof = PROFESSIONS[i % PROFESSIONS.length];

    // Age between 23 and 34
    const age = 23 + (i % 12);
    const birthYear = 2026 - age;
    const birthMonth = (i % 12);
    const birthDay = 1 + (i % 28);
    const dob = new Date(birthYear, birthMonth, birthDay).getTime();

    // Height: Female 152cm - 172cm, Male 168cm - 188cm
    const height = isFemale ? 152 + (i % 18) : 168 + (i % 20);
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    const heightFormatted = `${feet}'${inches}"`;

    const manglik = MANGLIK_TYPES[i % MANGLIK_TYPES.length];
    const nakshatra = NAKSHATRAS[i % NAKSHATRAS.length];
    const rashi = RASHIS[i % RASHIS.length];

    const membershipTier = MEMBERSHIP_LEVELS[i % MEMBERSHIP_LEVELS.length];
    const isVerified = (i % 5 !== 3); // 80% verified
    const isFeatured = (i % 6 === 0);

    const matrimonyNum = (4517001 + i).toString();
    const matrimonyId = `SM${matrimonyNum}`;
    const _id = makeObjectId(i + 10);
    const userId = makeObjectId(i + 1000);

    // Dynamic join date: between 1 and 60 days ago
    const daysAgo = 1 + (i % 58);
    const createdAtTime = Date.now() - (daysAgo * 86400000);

    const compatibilityScore = 98 - (i % 22);

    const matchReasons = [
      `Preferred ${subcaste} community alignment`,
      manglik === "NON_MANGLIK" ? "Non-Manglik astrological compatibility" : "Manglik dosha compatibility",
      `Mutual career alignment in ${loc.city}`,
      `Educational parity in ${prof.field}`,
    ];

    candidates.push({
      _id,
      userId,
      name,
      profileFor: i % 4 === 0 ? "MYSELF" : i % 4 === 1 ? "DAUGHTER" : i % 4 === 2 ? "SON" : "MYSELF",
      gender,
      age,
      dateOfBirth: dob,
      height,
      heightFormatted,
      maritalStatus: i % 15 === 0 ? "DIVORCED" : "NEVER_MARRIED",
      subcaste,
      gotra,
      motherGotra,
      manglik,
      horoscope: {
        nakshatra,
        rashi,
        charan: 1 + (i % 4),
        birthTime: `${9 + (i % 12)}:${(i * 5) % 60 < 10 ? "0" : ""}${(i * 5) % 60} ${i % 2 === 0 ? "AM" : "PM"}`,
        birthPlace: loc.city,
      },
      education: {
        degree: prof.degree,
        field: prof.field,
        college: prof.college,
      },
      profession: {
        occupation: prof.occupation,
        companyName: prof.companyName,
        annualIncome: prof.income,
        currency: loc.country === "UAE" ? "AED" : loc.country === "UK" ? "GBP" : "INR",
      },
      location: {
        city: loc.city,
        state: loc.state,
        country: loc.country,
        nativePlace: loc.nativePlace,
      },
      family: {
        familyType: i % 3 === 0 ? "JOINT" : "NUCLEAR",
        familyValues: i % 4 === 0 ? "TRADITIONAL" : i % 4 === 1 ? "LIBERAL" : "MODERATE",
        fatherName: `Shri ${(name.split(" ")[1] || "Sindhi")} Senior`,
        fatherOccupation: i % 2 === 0 ? "Businessman (Retail & Wholesale)" : "Retired Senior Bank Manager",
        motherName: `Smt. Kavita ${name.split(" ")[1] || "Sindhi"}`,
        motherOccupation: i % 3 === 0 ? "Teacher (High School)" : "Homemaker",
        brothersCount: i % 3,
        sistersCount: (i + 1) % 3,
      },
      partnerPreference: {
        ageMin: Math.max(21, age - 4),
        ageMax: age + 4,
        heightMin: isFemale ? 165 : 150,
        heightMax: isFemale ? 190 : 175,
        maritalStatus: ["NEVER_MARRIED"],
        subcastes: [subcaste, "Bhaiband", "Amil"],
        manglikPreference: ["NON_MANGLIK", "DONT_KNOW"],
        preferredCities: [loc.city, "Mumbai", "Pune"],
        minAnnualIncome: Math.max(0, prof.income - 1000000),
      },
      aboutMe: `Namaste. I am born and raised in ${loc.city} with deep roots in Sindhi traditions. Work as a ${prof.occupation} with ${prof.companyName}. In my leisure time, I enjoy cooking traditional Sindhi food, exploring heritage places, and reading. Looking for a respectful, ambitious, and family-oriented companion.`,
      avatar,
      photos: [
        { url: avatar, isProfilePicture: true, privacy: "PUBLIC", createdAt: createdAtTime },
        { url: avatarList[(i + 3) % avatarList.length], isProfilePicture: false, privacy: "PUBLIC", createdAt: createdAtTime + 10000 },
      ],
      photoUrl: avatar,
      isSilhouette: false,
      verificationBadge: isVerified ? "VERIFIED" : "NOT_SUBMITTED",
      isVerified,
      membershipTier,
      isFeatured,
      status: i % 30 === 7 ? "INACTIVE" : "ACTIVE",
      compatibilityScore,
      matchScore: compatibilityScore,
      matrimonyId,
      matchReasons,
      caste: subcaste,
      city: loc.city,
      joinedDaysAgo: `Joined ${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`,
      createdAt: createdAtTime,
      updatedAt: createdAtTime,
    });
  }

  return candidates;
}

export const SEED_CANDIDATE_POOL = generateCandidates();

// 9. Dynamic Collections (Managed & Populated via Bulk APIs)
export const SEED_SUCCESS_STORIES = [];
export const SEED_INTERESTS = [];
export const SEED_CONVERSATIONS = [];
export const SEED_NOTIFICATIONS = [];
export const DEFAULT_PARTNER_DEALS = [];
