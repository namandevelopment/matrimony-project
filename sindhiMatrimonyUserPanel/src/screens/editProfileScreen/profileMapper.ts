import { EditProfileState, PhotoItem } from "./types";
import { INITIAL_EDIT_PROFILE_DATA, MONTHS_OPTIONS } from "./staticData";

/**
 * Convert Date of Birth (timestamp / ISO) to Form { day, month, year }
 */
export const parseDobToForm = (dob: any) => {
  if (!dob) return { dobDay: "11", dobMonth: "April", dobYear: "1999" };
  const d = new Date(typeof dob === "number" ? dob : isNaN(Number(dob)) ? dob : Number(dob));
  if (isNaN(d.getTime())) return { dobDay: "11", dobMonth: "April", dobYear: "1999" };

  return {
    dobDay: String(d.getDate()),
    dobMonth: MONTHS_OPTIONS[d.getMonth()] || "January",
    dobYear: String(d.getFullYear()),
  };
};

/**
 * Convert Form { day, month, year } to timestamp
 */
export const parseFormToDobTimestamp = (day: string, month: string, year: string): number | undefined => {
  const monthIdx = MONTHS_OPTIONS.indexOf(month);
  if (monthIdx >= 0 && day && year) {
    const d = new Date(Number(year), monthIdx, Number(day));
    if (!isNaN(d.getTime())) {
      return d.getTime();
    }
  }
  return undefined;
};

/**
 * Convert Height in cm to "X feet Y inches"
 */
export const formatHeightFromBackend = (height: any): string => {
  if (!height) return "5 feet 5 inches";
  if (typeof height === "string" && height.includes("feet")) return height;
  const num = Number(height);
  if (!isNaN(num) && num > 0) {
    const totalInches = Math.round(num / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet} feet ${inches} inches`;
  }
  return String(height);
};

/**
 * Maps Backend GET Profile Response to EditProfileState
 */
export const mapBackendProfileToEditState = (
  backendRes: any,
  fallback: EditProfileState = INITIAL_EDIT_PROFILE_DATA
): EditProfileState => {
  if (!backendRes) return fallback;

  // Response might be wrapped in { profile, user, partnerPreference } or directly profile
  const profile = backendRes?.profile || (backendRes?.userId ? backendRes : backendRes);
  const user = backendRes?.user || {};
  const partnerPref = backendRes?.partnerPreference || profile?.partnerPreference || {};

  if (!profile || typeof profile !== "object") return fallback;

  // 1. DOB
  const dobFields = parseDobToForm(profile.dateOfBirth);

  // 2. Marital Status
  let maritalStatus = fallback.basicInfo.maritalStatus;
  const rawMarital = (profile.maritalStatus || "").toUpperCase();
  if (rawMarital === "NEVER_MARRIED" || rawMarital === "UNMARRIED") maritalStatus = "Unmarried";
  else if (rawMarital === "DIVORCED") maritalStatus = "Divorced";
  else if (rawMarital === "WIDOWED" || rawMarital.includes("WIDOW")) maritalStatus = "Widow / Widower";
  else if (rawMarital === "SEPARATED") maritalStatus = "Separated";

  // 3. Manglik Status
  let manglikStatus = fallback.basicInfo.manglik;
  const rawManglik = (profile.manglik || "").toUpperCase();
  if (rawManglik === "NON_MANGLIK" || rawManglik === "NO") manglikStatus = "No";
  else if (rawManglik === "MANGLIK" || rawManglik === "YES") manglikStatus = "Yes";
  else if (rawManglik === "ANY" || rawManglik.includes("DONT") || rawManglik.includes("DON'T")) manglikStatus = "Don't Know";

  // 4. Photos mapping
  const photosList: PhotoItem[] = [];
  if (Array.isArray(profile.photos) && profile.photos.length > 0) {
    profile.photos.forEach((p: any, idx: number) => {
      if (p && (p.url || typeof p === "string")) {
        const url = p.url || p;
        photosList.push({
          id: p._id || p.id || `photo_${idx}`,
          url,
          isPrimary: Boolean(p.isMain ?? (url === profile.avatar || idx === 0)),
          isApproved: Boolean(p.isApproved ?? true),
          uploadedAt: p.uploadedAt ? new Date(p.uploadedAt).toISOString() : new Date().toISOString(),
        });
      }
    });
  } else if (profile.avatar) {
    photosList.push({
      id: "photo_avatar",
      url: profile.avatar,
      isPrimary: true,
      isApproved: true,
      uploadedAt: new Date().toISOString(),
    });
  }

  // Ensure at least one primary photo if photos exist
  if (photosList.length > 0 && !photosList.some((p) => p.isPrimary)) {
    photosList[0].isPrimary = true;
  }

  return {
    basicInfo: {
      ...fallback.basicInfo,
      name: profile.name || user.name || fallback.basicInfo.name,
      profileCreatedBy: profile.profileFor || fallback.basicInfo.profileCreatedBy,
      dobDay: dobFields.dobDay,
      dobMonth: dobFields.dobMonth,
      dobYear: dobFields.dobYear,
      maritalStatus,
      height: formatHeightFromBackend(profile.height) || fallback.basicInfo.height,
      subcaste: profile.subcaste || fallback.basicInfo.subcaste,
      casteDivision: profile.casteDivision || (profile.gender === "FEMALE" ? "Sindhi - Bride" : "Sindhi - Groom"),
      gothra: profile.gotra || profile.gothra || fallback.basicInfo.gothra,
      motherTongue: profile.motherTongue || fallback.basicInfo.motherTongue,
      eatingHabits: profile.eatingHabits || profile.diet || fallback.basicInfo.eatingHabits,
      smokingHabits: profile.smokingHabits || fallback.basicInfo.smokingHabits,
      drinkingHabits: profile.drinkingHabits || fallback.basicInfo.drinkingHabits,
      manglik: manglikStatus,
      aboutMe: profile.aboutMe || fallback.basicInfo.aboutMe,
    },
    educationOccupation: {
      ...fallback.educationOccupation,
      highestEducation: profile.education?.degree || profile.education || fallback.educationOccupation.highestEducation,
      educationDetail: profile.education?.field || fallback.educationOccupation.educationDetail,
      collegeInstitute: profile.education?.college || fallback.educationOccupation.collegeInstitute,
      occupation: profile.profession?.occupation || profile.occupation || fallback.educationOccupation.occupation,
      occupationDetail: profile.profession?.companyName || fallback.educationOccupation.occupationDetail,
      annualIncome: typeof profile.profession?.annualIncome === "number"
        ? `₹${profile.profession.annualIncome / 100000} Lakhs`
        : profile.profession?.annualIncome || profile.annualIncome || fallback.educationOccupation.annualIncome,
      workCity: profile.location?.city || fallback.educationOccupation.workCity,
      workState: profile.location?.state || fallback.educationOccupation.workState,
      workCountry: profile.location?.country || fallback.educationOccupation.workCountry,
    },
    familyDetails: {
      ...fallback.familyDetails,
      familyValues: profile.family?.familyValues || fallback.familyDetails.familyValues,
      familyType: profile.family?.familyType === "NUCLEAR" ? "Nuclear Family" : profile.family?.familyType === "JOINT" ? "Joint Family" : profile.family?.familyType || fallback.familyDetails.familyType,
      familyStatus: profile.family?.familyStatus || fallback.familyDetails.familyStatus,
      fatherOccupation: profile.family?.fatherOccupation || fallback.familyDetails.fatherOccupation,
      motherOccupation: profile.family?.motherOccupation || fallback.familyDetails.motherOccupation,
      brothersCount: String(profile.family?.brothersCount ?? fallback.familyDetails.brothersCount),
      brothersMarried: String(profile.family?.brothersMarried ?? fallback.familyDetails.brothersMarried),
      sistersCount: String(profile.family?.sistersCount ?? fallback.familyDetails.sistersCount),
      sistersMarried: String(profile.family?.sistersMarried ?? fallback.familyDetails.sistersMarried),
      aboutFamily: profile.family?.aboutFamily || fallback.familyDetails.aboutFamily,
      familyLocation: profile.family?.familyLocation || [profile.location?.city, profile.location?.state].filter(Boolean).join(", ") || fallback.familyDetails.familyLocation,
    },
    hobbiesInterests: {
      hobbies: Array.isArray(profile.hobbies) && profile.hobbies.length > 0 ? profile.hobbies : fallback.hobbiesInterests.hobbies,
      interests: Array.isArray(profile.interests) && profile.interests.length > 0 ? profile.interests : fallback.hobbiesInterests.interests,
      music: Array.isArray(profile.music) && profile.music.length > 0 ? profile.music : fallback.hobbiesInterests.music,
      sports: Array.isArray(profile.sports) && profile.sports.length > 0 ? profile.sports : fallback.hobbiesInterests.sports,
      food: Array.isArray(profile.food) && profile.food.length > 0 ? profile.food : fallback.hobbiesInterests.food,
    },
    partnerPreference: {
      ...fallback.partnerPreference,
      ageFrom: String(partnerPref.ageRange?.min ?? fallback.partnerPreference.ageFrom),
      ageTo: String(partnerPref.ageRange?.max ?? fallback.partnerPreference.ageTo),
      maritalStatus: Array.isArray(partnerPref.maritalStatus)
        ? partnerPref.maritalStatus.map((s: string) => (s === "NEVER_MARRIED" ? "Unmarried" : s))
        : fallback.partnerPreference.maritalStatus,
      castePreference: Array.isArray(partnerPref.subcastes) ? partnerPref.subcastes : fallback.partnerPreference.castePreference,
      educationPreference: Array.isArray(partnerPref.education)
        ? partnerPref.education
        : partnerPref.education ? [partnerPref.education] : fallback.partnerPreference.educationPreference,
      occupationPreference: Array.isArray(partnerPref.occupation)
        ? partnerPref.occupation
        : partnerPref.occupation ? [partnerPref.occupation] : fallback.partnerPreference.occupationPreference,
      preferredCountry: partnerPref.preferredCountry || profile.location?.country || fallback.partnerPreference.preferredCountry,
      preferredState: partnerPref.preferredState || profile.location?.state || fallback.partnerPreference.preferredState,
    },
    contactDetails: {
      ...fallback.contactDetails,
      city: profile.location?.city || fallback.contactDetails.city,
      state: profile.location?.state || fallback.contactDetails.state,
      country: profile.location?.country || fallback.contactDetails.country,
      email: user.email || fallback.contactDetails.email,
      isEmailVerified: Boolean(user.isEmailVerified),
      mobileNumber: user.phone || fallback.contactDetails.mobileNumber,
      isMobileVerified: Boolean(user.isPhoneVerified),
      mobileCountryCode: user.countryCode || "+91",
    },
    photos: photosList.length > 0 ? photosList : fallback.photos,
    horoscope: {
      ...fallback.horoscope,
      manglikStatus: rawManglik === "NON_MANGLIK" ? "Non-Manglik" : rawManglik === "MANGLIK" ? "Manglik" : fallback.horoscope.manglikStatus,
      raasi: profile.horoscope?.raasi || profile.rashi || fallback.horoscope.raasi,
      nakshatra: profile.horoscope?.nakshatra || fallback.horoscope.nakshatra,
      placeOfBirth: profile.horoscope?.placeOfBirth || profile.location?.city || fallback.horoscope.placeOfBirth,
      timeOfBirth: profile.horoscope?.timeOfBirth || fallback.horoscope.timeOfBirth,
    },
    trustBadge: {
      identityBadgeStatus: profile.verificationBadge === "VERIFIED" || user.isKycVerified ? "verified" : "not_submitted",
      professionalBadgeStatus: profile.isProfessionalVerified ? "verified" : "not_submitted",
    },
  };
};

/**
 * Maps EditProfileState to Backend Update Payload for /api/v1/profile/editProfile
 */
export const mapEditStateToBackendPayload = (state: EditProfileState): Record<string, any> => {
  const dobTimestamp = parseFormToDobTimestamp(
    state.basicInfo.dobDay,
    state.basicInfo.dobMonth,
    state.basicInfo.dobYear
  );

  const maritalStatusBackend =
    state.basicInfo.maritalStatus === "Unmarried"
      ? "NEVER_MARRIED"
      : state.basicInfo.maritalStatus.toUpperCase().replace(/\s+/g, "_");

  const manglikBackend =
    state.basicInfo.manglik === "No"
      ? "NON_MANGLIK"
      : state.basicInfo.manglik === "Yes"
      ? "MANGLIK"
      : "ANY";

  const primaryPhoto = state.photos.find((p) => p.isPrimary)?.url || state.photos[0]?.url || "";

  return {
    name: state.basicInfo.name,
    aboutMe: state.basicInfo.aboutMe,
    profileFor: state.basicInfo.profileCreatedBy,
    maritalStatus: maritalStatusBackend,
    subcaste: state.basicInfo.subcaste,
    gotra: state.basicInfo.gothra,
    motherGotra: state.basicInfo.gothra,
    motherTongue: state.basicInfo.motherTongue,
    height: state.basicInfo.height,
    manglik: manglikBackend,
    eatingHabits: state.basicInfo.eatingHabits,
    diet: state.basicInfo.eatingHabits,
    smokingHabits: state.basicInfo.smokingHabits,
    drinkingHabits: state.basicInfo.drinkingHabits,
    ...(dobTimestamp ? { dateOfBirth: dobTimestamp } : {}),
    avatar: primaryPhoto,
    education: {
      degree: state.educationOccupation.highestEducation,
      field: state.educationOccupation.educationDetail,
      college: state.educationOccupation.collegeInstitute,
    },
    profession: {
      occupation: state.educationOccupation.occupation,
      companyName: state.educationOccupation.occupationDetail,
      annualIncome: state.educationOccupation.annualIncome,
    },
    location: {
      city: state.contactDetails.city || state.educationOccupation.workCity,
      state: state.contactDetails.state || state.educationOccupation.workState,
      country: state.contactDetails.country || state.educationOccupation.workCountry,
    },
    family: {
      familyValues: state.familyDetails.familyValues,
      familyType: state.familyDetails.familyType?.toUpperCase().includes("NUCLEAR") ? "NUCLEAR" : "JOINT",
      familyStatus: state.familyDetails.familyStatus,
      fatherOccupation: state.familyDetails.fatherOccupation,
      motherOccupation: state.familyDetails.motherOccupation,
      brothersCount: Number(state.familyDetails.brothersCount) || 0,
      brothersMarried: Number(state.familyDetails.brothersMarried) || 0,
      sistersCount: Number(state.familyDetails.sistersCount) || 0,
      sistersMarried: Number(state.familyDetails.sistersMarried) || 0,
      aboutFamily: state.familyDetails.aboutFamily,
      familyLocation: state.familyDetails.familyLocation,
    },
    hobbies: state.hobbiesInterests.hobbies,
    interests: state.hobbiesInterests.interests,
    horoscope: {
      raasi: state.horoscope.raasi,
      nakshatra: state.horoscope.nakshatra,
      placeOfBirth: state.horoscope.placeOfBirth,
      timeOfBirth: state.horoscope.timeOfBirth,
      manglik: manglikBackend,
    },
    partnerPreference: {
      ageRange: {
        min: parseInt(state.partnerPreference.ageFrom, 10) || 21,
        max: parseInt(state.partnerPreference.ageTo, 10) || 32,
      },
      maritalStatus: state.partnerPreference.maritalStatus.map((s) =>
        s === "Unmarried" ? "NEVER_MARRIED" : s.toUpperCase().replace(/\s+/g, "_")
      ),
      subcastes: state.partnerPreference.castePreference,
      education: state.partnerPreference.educationPreference?.join(", "),
      occupation: state.partnerPreference.occupationPreference?.join(", "),
      preferredCountry: state.partnerPreference.preferredCountry,
      preferredState: state.partnerPreference.preferredState,
    },
  };
};
