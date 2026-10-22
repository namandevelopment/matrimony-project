import { ViewUserProfile } from "./types";

export const mapBackendToViewProfile = (backendData: any): ViewUserProfile | null => {
  if (!backendData) return null;
  const root = backendData?.data !== undefined && backendData?.data !== null && typeof backendData.data === 'object' && !Array.isArray(backendData.data)
    ? (backendData.data.profile ? backendData.data : backendData)
    : backendData;

  const profile = root?.profile || root?.candidate || (root?.userId || (root?.name && (root?.age || root?.gender)) ? root : null);
  const user = root?.user || {};
  const partnerPref = root?.partnerPreference || profile?.partnerPreference || {};

  if (!profile || typeof profile !== "object") return null;

  const id = (profile._id || profile.id || user._id || "profile_live").toString();
  const gender = (profile.gender || "FEMALE").toLowerCase() === "male" ? "male" : "female";
  const name = profile.name || user.name || "Sindhi Member";
  const matrimonyId = profile.matrimonyId || `${gender === "female" ? "SM-F" : "SM-M"}${id.slice(-6).toUpperCase()}`;

  const age =
    Number(profile.age) ||
    (profile.dateOfBirth
      ? Math.floor((Date.now() - Number(profile.dateOfBirth)) / (365.25 * 24 * 3600 * 1000))
      : 26);

  // Height formatting
  let heightFormatted = "5' 5\"";
  if (typeof profile.height === "number") {
    const totalInches = Math.round(profile.height / 2.54);
    heightFormatted = `${Math.floor(totalInches / 12)}'${totalInches % 12}"`;
  } else if (typeof profile.height === "string") {
    heightFormatted = profile.height;
  }

  // Photos
  const photoUrls: string[] = [];
  if (Array.isArray(profile.photos) && profile.photos.length > 0) {
    profile.photos.forEach((p: any) => {
      const url = p?.url || p;
      if (url && typeof url === "string") photoUrls.push(url);
    });
  }
  if (profile.avatar && !photoUrls.includes(profile.avatar)) {
    photoUrls.unshift(profile.avatar);
  }
  if (photoUrls.length === 0) {
    photoUrls.push(
      gender === "female"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    );
  }

  const city = profile.location?.city || "Mumbai";
  const state = profile.location?.state || "Maharashtra";
  const educationStr = profile.education?.degree || profile.education || "Graduate";
  const occupationStr = profile.profession?.occupation || profile.occupation || "Professional";

  return {
    id,
    matrimonyId,
    name,
    age,
    height: heightFormatted,
    education: educationStr,
    profession: occupationStr,
    city,
    state,
    lastSeen: "Active recently",
    photoUrls,
    gender,
    casteSummary: `${profile.subcaste || "Sindhi"}, ${profile.gotra ? `Gotra: ${profile.gotra}` : ""}`,
    maritalStatus:
      profile.maritalStatus === "NEVER_MARRIED" ? "Never married" : profile.maritalStatus || "Unmarried",
    profileCreatedBy: (profile.profileFor || "Self").toLowerCase(),
    isShortlisted: Boolean(profile.isShortlisted),
    interestSent: Boolean(profile.interestSent),
    isNewlyJoined: Boolean(profile.isNewlyJoined),
    aboutText:
      profile.aboutMe ||
      `Hello, I am ${name} based in ${city}, ${state}. Looking for an educated, caring life partner in the Sindhi community.`,
    personalInfo: {
      age: `${age} Years`,
      height: heightFormatted,
      motherTongue: profile.motherTongue || "Sindhi",
      profileCreatedBy: profile.profileFor || "Self",
      maritalStatus:
        profile.maritalStatus === "NEVER_MARRIED" ? "Never married" : profile.maritalStatus || "Unmarried",
      livesIn: `${city}, ${state}`,
      eatingHabits: profile.eatingHabits || profile.diet || "Vegetarian",
      religion: "Hindu",
      caste: "Sindhi",
      subcaste: profile.subcaste || "All",
      gothra: profile.gotra || "Not specified",
      manglik:
        profile.manglik === "NON_MANGLIK"
          ? "No"
          : profile.manglik === "MANGLIK"
          ? "Yes"
          : "Don't Know",
      dateOfBirthMasked: "•• ••• ••••",
      timeOfBirthMasked: "••:•• ••",
      horoscopeAvailable: Boolean(profile.horoscope),
      employment: profile.profession?.companyName || "Private Sector",
      education: educationStr,
      occupation: occupationStr,
    },
    contactInfo: {
      phoneMasked: user.phone ? `+91 ${user.phone.slice(0, 2)} ********` : "+91 98 ********",
      whatsappMasked: user.phone ? `+91 ${user.phone.slice(0, 2)} ********` : "+91 98 ********",
      isUnlocked: Boolean(profile.isContactUnlocked),
    },
    partnerPreferences: {
      matchCount: 5,
      totalCount: 6,
      basicPreferences: [
        {
          id: "pref-age",
          label: "Preferred Age",
          preferenceValue: `${partnerPref.ageRange?.min || 23} - ${partnerPref.ageRange?.max || 30} yrs`,
          isMatched: true,
          category: "basic",
        },
        {
          id: "pref-height",
          label: "Preferred Height",
          preferenceValue: "5'0\" - 6'0\"",
          isMatched: true,
          category: "basic",
        },
        {
          id: "pref-marital-status",
          label: "Preferred Marital Status",
          preferenceValue:
            partnerPref.maritalStatus?.[0] === "NEVER_MARRIED" ? "Never married" : "Unmarried",
          isMatched: true,
          category: "basic",
        },
      ],
      religiousPreferences: [
        {
          id: "pref-subcaste",
          label: "Preferred Subcaste",
          preferenceValue: Array.isArray(partnerPref.subcastes)
            ? partnerPref.subcastes.join(", ")
            : "Sindhi - All",
          isMatched: true,
          category: "religious",
        },
        {
          id: "pref-manglik",
          label: "Manglik Preference",
          preferenceValue: partnerPref.manglik || "Doesn't Matter",
          isMatched: true,
          category: "religious",
        },
      ],
      professionalPreferences: [
        {
          id: "pref-education",
          label: "Preferred Education",
          preferenceValue: partnerPref.education || "Graduate & Above",
          isMatched: true,
          category: "professional",
        },
        {
          id: "pref-occupation",
          label: "Preferred Profession",
          preferenceValue: partnerPref.occupation || "Working Professional",
          isMatched: true,
          category: "professional",
        },
      ],
      locationPreferences: [
        {
          id: "pref-location",
          label: "Preferred Country / State",
          preferenceValue: partnerPref.preferredState || partnerPref.preferredCountry || "India",
          isMatched: true,
          category: "location",
        },
      ],
    },
  };
};
