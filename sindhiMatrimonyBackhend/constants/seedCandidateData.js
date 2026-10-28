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

// 9. Authentic Sindhi Wedding Success Stories
export const SEED_SUCCESS_STORIES = [
  {
    _id: "67b34a12c8e312a0f9000301",
    coupleName: "Naveen Advani & Geeta Chhabria",
    coupleNames: "Naveen & Geeta",
    groomName: "Naveen Advani",
    brideName: "Geeta Chhabria",
    weddingDate: "14 Dec 2025",
    postedOn: "18 Dec 2025",
    city: "Jaipur",
    location: "Jaipur, Rajasthan",
    storySnippet: "We connected on SindhiMatrimony, discovered that our families hailed from adjacent neighborhoods in Ajmer, and found perfect alignment in culture, gotra, and life goals.",
    fullStory: "Our journey began with a simple Connect request on the app. We spent three weeks understanding each other's aspirations and family traditions. When our parents met for the formal 'Kachhi Misri', everyone instantly bonded over authentic Sindhi Dal Pakwan. Truly a match made in heaven!",
    imageUrl: COUPLE_PHOTOS[0],
    photoUrl: COUPLE_PHOTOS[0],
    badge: "Just Married",
    displayOrder: 1,
    isFeatured: true,
    isActive: true,
  },
  {
    _id: "67b34a12c8e312a0f9000302",
    coupleName: "Rahul Vaswani & Priya Jhangiani",
    coupleNames: "Rahul & Priya",
    groomName: "Rahul Vaswani",
    brideName: "Priya Jhangiani",
    weddingDate: "20 Jan 2026",
    postedOn: "25 Jan 2026",
    city: "Mumbai",
    location: "Bandra, Mumbai",
    storySnippet: "Our families exchanged Kundlis using the app's instant 36 Guna Milan feature. With 31/36 score, our wedding was celebrated with vibrant Lada and Santh ceremonies.",
    fullStory: "Both of us were working in fast-paced corporate roles in Mumbai. SindhiMatrimony made the search transparent and dignified. The compatibility report gave both sets of elders immense confidence. We had our Grand wedding at Taj Lands End with authentic Sufi music.",
    imageUrl: COUPLE_PHOTOS[1],
    photoUrl: COUPLE_PHOTOS[1],
    badge: "31/36 Guna Match",
    displayOrder: 2,
    isFeatured: true,
    isActive: true,
  },
  {
    _id: "67b34a12c8e312a0f9000303",
    coupleName: "Mohit Motwani & Divya Bhavnani",
    coupleNames: "Mohit & Divya",
    groomName: "Mohit Motwani",
    brideName: "Divya Bhavnani",
    weddingDate: "05 Feb 2026",
    postedOn: "10 Feb 2026",
    city: "Pune",
    location: "Kalyani Nagar, Pune",
    storySnippet: "Finding someone who shares the same entrepreneurial drive and Sindhi values felt impossible until we matched here. Within 4 months, we tied the knot!",
    fullStory: "Divya runs her own design boutique and I manage a software consultancy. Our partner preferences matched to 96%. After our initial video call on the app, we knew our wavelengths were completely in sync.",
    imageUrl: COUPLE_PHOTOS[2],
    photoUrl: COUPLE_PHOTOS[2],
    badge: "Arranged Love",
    displayOrder: 3,
    isFeatured: true,
    isActive: true,
  },
  {
    _id: "67b34a12c8e312a0f9000304",
    coupleName: "Karan Hingorani & Dr. Sneha Gidwani",
    coupleNames: "Karan & Sneha",
    groomName: "Karan Hingorani",
    brideName: "Dr. Sneha Gidwani",
    weddingDate: "28 Feb 2026",
    postedOn: "04 Mar 2026",
    city: "Dubai",
    location: "Dubai, UAE",
    storySnippet: "Cross-border NRI match: Karan was in Dubai and Sneha was in Mumbai. The verified profiles gave both families complete peace of mind.",
    fullStory: "Being an NRI, verifying profiles was the biggest challenge. SindhiMatrimony's Blue Badge verification and direct contact unlock made communication seamless. We hosted our reception in Dubai with over 300 Sindhi community elders attending.",
    imageUrl: COUPLE_PHOTOS[3],
    photoUrl: COUPLE_PHOTOS[3],
    badge: "NRI Match",
    displayOrder: 4,
    isFeatured: true,
    isActive: true,
  },
  {
    _id: "67b34a12c8e312a0f9000305",
    coupleName: "Deepak Lulla & Karishma Makhija",
    coupleNames: "Deepak & Karishma",
    groomName: "Deepak Lulla",
    brideName: "Karishma Makhija",
    weddingDate: "12 Mar 2026",
    postedOn: "18 Mar 2026",
    city: "Ahmedabad",
    location: "Ahmedabad, Gujarat",
    storySnippet: "Both CA professionals. We matched on career ambition and family ethos. Celebrated Cheti Chand as newlyweds!",
    fullStory: "We both prioritized partners with professional financial background. When we met over coffee in Ahmedabad, conversation flowed effortlessly for 3 hours. Both families agreed immediately, and we couldn't be happier.",
    imageUrl: COUPLE_PHOTOS[4],
    photoUrl: COUPLE_PHOTOS[4],
    badge: "CA Couple",
    displayOrder: 5,
    isFeatured: true,
    isActive: true,
  },
  {
    _id: "67b34a12c8e312a0f9000306",
    coupleName: "Varun Chandiramani & Ananya Hinduja",
    coupleNames: "Varun & Ananya",
    groomName: "Varun Chandiramani",
    brideName: "Ananya Hinduja",
    weddingDate: "02 Apr 2026",
    postedOn: "07 Apr 2026",
    city: "Ulhasnagar",
    location: "Ulhasnagar, Maharashtra",
    storySnippet: "Our grandparents were close friends in pre-partition Sindh. Reconnected through the app after 3 generations!",
    fullStory: "When our Gotras and native place were entered into the app's Gotra detection tool, our families realized our ancestral connections in Sukkur. It brought tears of joy to our elders. Truly a blessed union.",
    imageUrl: COUPLE_PHOTOS[5],
    photoUrl: COUPLE_PHOTOS[5],
    badge: "Historic Heritage",
    displayOrder: 6,
    isFeatured: true,
    isActive: true,
  },
];

// 10. Initial Realistic Interests Clearinghouse (15 Diverse Requests)
export const SEED_INTERESTS = [
  {
    _id: "67b34a12c8e312a0f9000005",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000004",
      name: "Pooja Chhabria",
      age: 26,
      subcaste: "Bhaiband",
      city: "Mumbai",
      profession: "Senior Audit Manager",
      avatar: FEMALE_AVATARS[0],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "Namaste, we really liked your profile. Would love to connect and discuss further.",
    status: "PENDING",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 4,
  },
  {
    _id: "67b34a12c8e312a0f9000021",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000014",
      name: "Simran Advani",
      age: 25,
      subcaste: "Amil",
      city: "Pune",
      profession: "Brand Strategist",
      avatar: FEMALE_AVATARS[1],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "We find your education and family background very compatible with our family values.",
    status: "PENDING",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 18,
  },
  {
    _id: "67b34a12c8e312a0f9000022",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000015",
      name: "Dr. Roshni Jhangiani",
      age: 27,
      subcaste: "Bhaiband",
      city: "Mumbai",
      profession: "Consultant Dermatologist",
      avatar: FEMALE_AVATARS[2],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "Looking forward to initiating communication and exchanging horoscopes.",
    status: "ACCEPTED",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 48,
  },
  {
    _id: "67b34a12c8e312a0f9000023",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000016",
      name: "Muskaan Motwani",
      age: 24,
      subcaste: "Sahiti",
      city: "Jaipur",
      profession: "Software Engineer",
      avatar: FEMALE_AVATARS[3],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "Hello, loved your biodata and your hobbies. Would like to know more about you.",
    status: "PENDING",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 12,
  },
  {
    _id: "67b34a12c8e312a0f9000024",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000018",
      name: "Mehek Hinduja",
      age: 25,
      subcaste: "Amil",
      city: "Delhi",
      profession: "Software Engineer",
      avatar: FEMALE_AVATARS[6],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "Pranam, my parents were very impressed by your family background.",
    status: "PENDING",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 26,
  },
  {
    _id: "67b34a12c8e312a0f9000025",
    senderProfile: {
      _id: "67b34a12c8e312a0f9000019",
      name: "Karishma Motwani",
      age: 26,
      subcaste: "Bhaiband",
      city: "Mumbai",
      profession: "Marketing Lead",
      avatar: FEMALE_AVATARS[7],
    },
    receiverProfileId: "my_profile",
    personalizedNote: "Greetings! Let's connect and see if our goals align.",
    status: "DECLINED",
    direction: "RECEIVED",
    sentAt: Date.now() - 3600000 * 72,
  },
  // Sent Interests
  {
    _id: "67b34a12c8e312a0f9000026",
    receiverProfile: {
      _id: "67b34a12c8e312a0f9000020",
      name: "Anjali Gidwani",
      age: 24,
      subcaste: "Sahiti",
      city: "Ahmedabad",
      profession: "Professor",
      avatar: FEMALE_AVATARS[8],
    },
    senderProfileId: "my_profile",
    personalizedNote: "Namaste, we saw your profile and feel we share common cultural values.",
    status: "PENDING",
    direction: "SENT",
    sentAt: Date.now() - 3600000 * 8,
  },
  {
    _id: "67b34a12c8e312a0f9000027",
    receiverProfile: {
      _id: "67b34a12c8e312a0f9000017",
      name: "Karan Hingorani",
      age: 28,
      subcaste: "Bhaiband",
      city: "Dubai",
      profession: "Lead AI Engineer",
      avatar: MALE_AVATARS[0],
    },
    senderProfileId: "my_profile",
    personalizedNote: "Hi Karan, impressed with your profile and career standing in Dubai.",
    status: "ACCEPTED",
    direction: "SENT",
    sentAt: Date.now() - 3600000 * 36,
  },
];

// 11. Multi-Conversation Real-Time Chat Histories
export const SEED_CONVERSATIONS = [
  {
    _id: "67b34a12c8e312a0f9000006",
    participant: {
      _id: "67b34a12c8e312a0f9000004",
      name: "Pooja Chhabria",
      age: 26,
      subcaste: "Bhaiband",
      city: "Mumbai",
      profession: "Senior Audit Manager",
      avatar: FEMALE_AVATARS[0],
      isOnline: true,
      lastSeen: Date.now(),
    },
    lastMessage: {
      text: "Namaste! It was wonderful speaking with your family. Looking forward to our video call tomorrow at 7 PM.",
      senderId: "67b34a12c8e312a0f9000004",
      timestamp: Date.now() - 1000 * 60 * 15,
      isRead: false,
    },
    unreadCount: 1,
    status: "ACTIVE",
    messages: [
      { id: "m1", text: "Namaste Pooja, we received your interest request. Thank you for connecting!", senderId: "my_profile", timestamp: Date.now() - 3600000 * 24, isRead: true },
      { id: "m2", text: "Namaste! Very happy to connect. My parents and I really liked your education and family background.", senderId: "67b34a12c8e312a0f9000004", timestamp: Date.now() - 3600000 * 22, isRead: true },
      { id: "m3", text: "That is great to hear. Are you originally from Mumbai?", senderId: "my_profile", timestamp: Date.now() - 3600000 * 18, isRead: true },
      { id: "m4", text: "Yes, born and brought up in Bandra, though our ancestral roots are in Ajmer. And yourself?", senderId: "67b34a12c8e312a0f9000004", timestamp: Date.now() - 3600000 * 12, isRead: true },
      { id: "m5", text: "Same here, family has lived in Jaipur for 40 years! Should our families speak over the weekend?", senderId: "my_profile", timestamp: Date.now() - 3600000 * 2, isRead: true },
      { id: "m6", text: "Namaste! It was wonderful speaking with your family. Looking forward to our video call tomorrow at 7 PM.", senderId: "67b34a12c8e312a0f9000004", timestamp: Date.now() - 1000 * 60 * 15, isRead: false },
    ],
  },
  {
    _id: "67b34a12c8e312a0f9000007",
    participant: {
      _id: "67b34a12c8e312a0f9000014",
      name: "Simran Advani",
      age: 25,
      subcaste: "Amil",
      city: "Pune",
      profession: "Brand Strategist",
      avatar: FEMALE_AVATARS[1],
      isOnline: false,
      lastSeen: Date.now() - 1000 * 60 * 45,
    },
    lastMessage: {
      text: "Yes, our parents also spoke yesterday and seemed very happy with the Kundli match (30 Gunas).",
      senderId: "67b34a12c8e312a0f9000014",
      timestamp: Date.now() - 3600000 * 3,
      isRead: true,
    },
    unreadCount: 0,
    status: "ACTIVE",
    messages: [
      { id: "m7", text: "Hello Simran! Hope you are having a productive week.", senderId: "my_profile", timestamp: Date.now() - 3600000 * 40, isRead: true },
      { id: "m8", text: "Hello! Yes, quite busy with a new campaign launch. How about you?", senderId: "67b34a12c8e312a0f9000014", timestamp: Date.now() - 3600000 * 35, isRead: true },
      { id: "m9", text: "Did your panditji review the horoscopes we shared?", senderId: "my_profile", timestamp: Date.now() - 3600000 * 10, isRead: true },
      { id: "m10", text: "Yes, our parents also spoke yesterday and seemed very happy with the Kundli match (30 Gunas).", senderId: "67b34a12c8e312a0f9000014", timestamp: Date.now() - 3600000 * 3, isRead: true },
    ],
  },
  {
    _id: "67b34a12c8e312a0f9000008",
    participant: {
      _id: "67b34a12c8e312a0f9000015",
      name: "Dr. Roshni Jhangiani",
      age: 27,
      subcaste: "Bhaiband",
      city: "Mumbai",
      profession: "Consultant Dermatologist",
      avatar: FEMALE_AVATARS[2],
      isOnline: true,
      lastSeen: Date.now(),
    },
    lastMessage: {
      text: "I finished my clinic shift. Will give you a call around 8:30 PM if that suits you?",
      senderId: "67b34a12c8e312a0f9000015",
      timestamp: Date.now() - 1000 * 60 * 30,
      isRead: false,
    },
    unreadCount: 1,
    status: "ACTIVE",
    messages: [
      { id: "m11", text: "Pranam Roshni ji, hope your rounds went well.", senderId: "my_profile", timestamp: Date.now() - 3600000 * 5, isRead: true },
      { id: "m12", text: "I finished my clinic shift. Will give you a call around 8:30 PM if that suits you?", senderId: "67b34a12c8e312a0f9000015", timestamp: Date.now() - 1000 * 60 * 30, isRead: false },
    ],
  },
];

// 12. Rich Notifications Pool (15 alerts)
export const SEED_NOTIFICATIONS = [
  {
    _id: "notif_001",
    type: "INTEREST_RECEIVED",
    title: "New Rishta Connect Request 💌",
    body: "Pooja Chhabria (CA, Mumbai) expressed interest in your profile.",
    data: { candidateId: "67b34a12c8e312a0f9000004", interestId: "67b34a12c8e312a0f9000005" },
    avatar: FEMALE_AVATARS[0],
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    _id: "notif_002",
    type: "INTEREST_ACCEPTED",
    title: "Interest Accepted! 🎉",
    body: "Dr. Roshni Jhangiani accepted your Rishta request. You can now chat directly.",
    data: { candidateId: "67b34a12c8e312a0f9000015" },
    avatar: FEMALE_AVATARS[2],
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 65,
  },
  {
    _id: "notif_003",
    type: "PROFILE_VIEWED",
    title: "Profile Visitor 👁️",
    body: "Simran Advani (Brand Strategist, Pune) viewed your profile 2 hours ago.",
    data: { candidateId: "67b34a12c8e312a0f9000014" },
    avatar: FEMALE_AVATARS[1],
    isRead: false,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    _id: "notif_004",
    type: "NEW_MATCH",
    title: "New Compatible Match Found 🌟",
    body: "Muskaan Motwani (Software Engineer, Amazon) just registered from Jaipur.",
    data: { candidateId: "67b34a12c8e312a0f9000016" },
    avatar: FEMALE_AVATARS[3],
    isRead: false,
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    _id: "notif_005",
    type: "VERIFICATION_APPROVED",
    title: "Blue Trust Badge Activated! 🛡️",
    body: "Your government ID verification has been approved. Your profile trust rating increased to 100%.",
    data: {},
    avatar: "",
    isRead: true,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    _id: "notif_006",
    type: "HOROSCOPE_MATCH",
    title: "Auspicious Kundli Match (32/36) 🕉️",
    body: "Astrological Guna Milan scored 32/36 points with Dr. Roshni Jhangiani.",
    data: { candidateId: "67b34a12c8e312a0f9000015" },
    avatar: FEMALE_AVATARS[2],
    isRead: true,
    createdAt: Date.now() - 3600000 * 30,
  },
  {
    _id: "notif_007",
    type: "DAILY_RECOMMENDATIONS_READY",
    title: "Daily Matches are Ready! ✨",
    body: "12 new curated matches matching your partner preferences have been selected for today.",
    data: {},
    avatar: "",
    isRead: true,
    createdAt: Date.now() - 3600000 * 14,
  },
  {
    _id: "notif_008",
    type: "CHAT_MESSAGE",
    title: "New Message from Pooja Chhabria",
    body: "Looking forward to our video call tomorrow at 7 PM.",
    data: { conversationId: "67b34a12c8e312a0f9000006" },
    avatar: FEMALE_AVATARS[0],
    isRead: false,
    createdAt: Date.now() - 1000 * 60 * 15,
  },
];

// Canonical seed partner deals for advertisement campaigns
export const DEFAULT_PARTNER_DEALS = [
  {
    adId: "AD_COUPLE_RINGS",
    name: "Sterling Silver Couple Promise Rings",
    categoryLabel: "💍 Rings",
    categories: ["Rings", "Jewellery", "Engagement", "Silver"],
    price: 599,
    originalPrice: 1999,
    discountPercent: 70,
    platform: "Amazon",
    platformLogoBg: "bg-[#232F3E]",
    platformTextColor: "text-amber-400",
    badge: "Top Engagement Gift",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    imageSrc: "/images/dashboard/gift_couple_rings.jpg",
    images: [
      "/images/dashboard/gift_couple_rings.jpg",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
    ],
    description: "Adjustable pure 925 silver couple rings with solitaire crystal & luxury gift box.",
    couponCode: "AMZMATCH50",
    affiliateUrl: "https://www.amazon.in/s?k=couple+rings+silver&tag=sindhimatrimony-21",
    status: "ACTIVE",
    priority: 10,
    targetAudience: "ALL",
    createdBy: "SUPER_ADMIN",
  },
  {
    adId: "AD_HEART_LOCKET",
    name: "Rose Gold Heart Neck Locket & Chain",
    categoryLabel: "💖 Lockets",
    categories: ["Lockets", "Pendants", "Jewellery", "Rose Gold"],
    price: 249,
    originalPrice: 899,
    discountPercent: 72,
    platform: "Meesho",
    platformLogoBg: "bg-[#570741]",
    platformTextColor: "text-fuchsia-300",
    badge: "Trending on Meesho",
    badgeColor: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
    imageSrc: "/images/dashboard/gift_neck_locket.jpg",
    images: [
      "/images/dashboard/gift_neck_locket.jpg",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    ],
    description: "Delicate opening heart pendant with crystal border for photos & initials.",
    couponCode: "MEESHOLOVE",
    affiliateUrl: "https://www.meesho.com/search?q=heart+locket+pendant&ref=sindhimatrimony",
    status: "ACTIVE",
    priority: 8,
    targetAudience: "ALL",
    createdBy: "SUPER_ADMIN",
  },
  {
    adId: "AD_CHARM_BRACELET",
    name: "Crystal Heart Charm Bracelet for Girls",
    categoryLabel: "✨ Bracelets",
    categories: ["Bracelets", "Accessories", "Gifts", "Crystal"],
    price: 399,
    originalPrice: 1299,
    discountPercent: 69,
    platform: "Flipkart",
    platformLogoBg: "bg-[#2874F0]",
    platformTextColor: "text-yellow-300",
    badge: "Most Loved by Girls",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    imageSrc: "/images/dashboard/gift_crystal_bracelet.jpg",
    images: [
      "/images/dashboard/gift_crystal_bracelet.jpg",
      "https://images.unsplash.com/photo-1611591475846-f94db12aa319?w=600&auto=format&fit=crop&q=80",
    ],
    description: "Sparkling rose gold & silver charm bracelet with velvet presentation box.",
    couponCode: "FLIPWED40",
    affiliateUrl: "https://www.flipkart.com/search?q=charm+bracelet+for+girls&affid=sindhimatrimony",
    status: "ACTIVE",
    priority: 6,
    targetAudience: "ALL",
    createdBy: "SUPER_ADMIN",
  },
  {
    adId: "AD_TEDDY_HAMPER",
    name: "Cute Teddy Bear & Chocolate Gift Hamper",
    categoryLabel: "🧸 Soft Toys",
    categories: ["Hampers", "Soft Toys", "Chocolates", "Combo"],
    price: 699,
    originalPrice: 1599,
    discountPercent: 56,
    platform: "Amazon",
    platformLogoBg: "bg-[#232F3E]",
    platformTextColor: "text-amber-400",
    badge: "Romantic Surprise",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    imageSrc: "/images/dashboard/gift_teddy_hamper.jpg",
    images: [
      "/images/dashboard/gift_teddy_hamper.jpg",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80",
    ],
    description: "Fluffy LOVE teddy bear with luxury chocolates & roses in a satin bow box.",
    couponCode: "AMZTEDDY",
    affiliateUrl: "https://www.amazon.in/s?k=teddy+bear+chocolate+gift+box&tag=sindhimatrimony-21",
    status: "ACTIVE",
    priority: 4,
    targetAudience: "ALL",
    createdBy: "SUPER_ADMIN",
  },
];
