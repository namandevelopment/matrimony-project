import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Users,
  Heart,
  GraduationCap,
  Sparkles,
  Camera,
  FileText,
  CheckCircle2,
  Crown,
  RefreshCw,
  ArrowRight,
  Upload,
  UserPlus,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useInputs } from '../../customHooks/useInputs';
import { memberDataService } from '../../services/memberDataService';
import type { MemberPlan, MemberStatus } from '../../services/memberDataService';
import { subcasteGotraService } from '../../services/subcasteGotraService';
import { casteReligionService } from '../../services/casteReligionService';
import { toast } from '../../utils/CustomToast';
import { emailPattern, isSafeInput } from '../../utils/ValidationsFuctions';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';

export type FormTab =
  | 'general'
  | 'family'
  | 'lifestyle'
  | 'education'
  | 'astrological'
  | 'images'
  | 'other';

export const TABS: { id: FormTab; label: string; stepNumber: number }[] = [
  { id: 'general', label: 'General Info', stepNumber: 1 },
  { id: 'family', label: 'Family Info', stepNumber: 2 },
  { id: 'lifestyle', label: 'Lifestyle', stepNumber: 3 },
  { id: 'education', label: 'Education & Work', stepNumber: 4 },
  { id: 'astrological', label: 'Astrological Info', stepNumber: 5 },
  { id: 'images', label: 'Images', stepNumber: 6 },
  { id: 'other', label: 'Other Info', stepNumber: 7 },
];

export interface AddMemberFormValues {
  // --- TAB 1: General Info ---
  uniqueId: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  mobile: string;
  profileCreatedBy: string;
  gender: 'Male' | 'Female';
  dob: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce' | 'Annulled';
  motherTongue: string;
  religion: string;
  community: string;
  subcaste: string;
  city: string;
  state: string;
  country: string;

  // --- TAB 2: Family Info ---
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  familyType: 'Nuclear' | 'Joint';
  membersLiveWith: string;
  aboutBrother: string;
  aboutSister: string;
  aboutFamily: string;

  // --- TAB 3: Lifestyle ---
  height: string;
  weight: string;
  bodyType: string;
  complexion: string;
  bloodGroup: string;
  diet: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
  smokingHabit: string;
  alcoholConsumption: string;

  // --- TAB 4: Education & Work ---
  educationArea: string;
  education: string;
  workingWith: string;
  workingAs: string;
  annualIncome: string;

  // --- TAB 5: Astrological Info ---
  birthPlace: string;
  gotra: string;
  manglik: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik' | "Don't Know";
  sunSign: string;
  nakshatram: string;

  // --- TAB 6: Images ---
  profilePhoto: string;
  galleryPhoto1: string;
  galleryPhoto2: string;
  photoPrivacy: string;

  // --- TAB 7: Other Info ---
  aboutMe: string;
  desiredProfile: string;
  verifyEmail: string;
  verifyMobile: string;
  verifyAadhaar: string;
  adminComment: string;
  hobbies: string;
  plan: MemberPlan;
  status: MemberStatus;
  isVerified: boolean;
  assignedMatchmaker: string;
}

export const TAB_FIELDS: Record<FormTab, (keyof AddMemberFormValues)[]> = {
  general: [
    'uniqueId',
    'email',
    'password',
    'confirmPassword',
    'fullName',
    'mobile',
    'profileCreatedBy',
    'gender',
    'dob',
    'maritalStatus',
    'motherTongue',
    'religion',
    'community',
    'subcaste',
    'city',
    'state',
    'country',
  ],
  family: [
    'fatherName',
    'fatherOccupation',
    'motherName',
    'motherOccupation',
    'familyType',
    'membersLiveWith',
    'aboutBrother',
    'aboutSister',
    'aboutFamily',
  ],
  lifestyle: [
    'height',
    'weight',
    'bodyType',
    'complexion',
    'bloodGroup',
    'diet',
    'smokingHabit',
    'alcoholConsumption',
  ],
  education: [
    'educationArea',
    'education',
    'workingWith',
    'workingAs',
    'annualIncome',
  ],
  astrological: [
    'birthPlace',
    'gotra',
    'manglik',
    'sunSign',
    'nakshatram',
  ],
  images: [
    'profilePhoto',
    'galleryPhoto1',
    'galleryPhoto2',
    'photoPrivacy',
  ],
  other: [
    'aboutMe',
    'desiredProfile',
    'verifyEmail',
    'verifyMobile',
    'verifyAadhaar',
    'adminComment',
    'hobbies',
    'plan',
    'status',
    'isVerified',
    'assignedMatchmaker',
  ],
};

export const generateInitialValues = (defaultGender: 'Male' | 'Female' = 'Male'): AddMemberFormValues => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = defaultGender === 'Female' ? 'A8' : 'E10';
  return {
    uniqueId: `${prefix}${randomSuffix}P1601`,
    email: '',
    password: 'Member@2026',
    confirmPassword: 'Member@2026',
    fullName: '',
    mobile: '',
    profileCreatedBy: 'Self',
    gender: defaultGender,
    dob: '1998-05-15',
    maritalStatus: 'Never Married',
    motherTongue: 'Sindhi',
    religion: 'Hindu',
    community: 'Sindhi',
    subcaste: 'Amil',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',

    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    familyType: 'Nuclear',
    membersLiveWith: 'Living with Parents',
    aboutBrother: '',
    aboutSister: '',
    aboutFamily: '',

    height: "5'8\"",
    weight: '68 kg',
    bodyType: 'Average',
    complexion: 'Fair',
    bloodGroup: 'B+',
    diet: 'Vegetarian',
    smokingHabit: 'No / Non-Smoker',
    alcoholConsumption: 'No / Non-Drinker',

    educationArea: 'Engineering / Technology',
    education: 'B.Tech in Computer Science',
    workingWith: 'Private Company',
    workingAs: 'Senior Software Engineer',
    annualIncome: '₹20 - 25 Lakhs',

    birthPlace: 'Jaipur, Rajasthan',
    gotra: 'Kashyap',
    manglik: 'Non-Manglik',
    sunSign: 'Aries',
    nakshatram: 'Rohini',

    profilePhoto:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    galleryPhoto1: '',
    galleryPhoto2: '',
    photoPrivacy: 'Visible to All Members',

    aboutMe: '',
    desiredProfile: '',
    verifyEmail: '',
    verifyMobile: '',
    verifyAadhaar: '',
    adminComment: '',
    hobbies: 'Traveling, Reading, Fitness, Sindhi Folk Music',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
  };
};

/**
 * Validation function for member form
 */
export const validateMemberForm = (
  values: AddMemberFormValues
): Partial<Record<keyof AddMemberFormValues, string>> => {
  const errs: Partial<Record<keyof AddMemberFormValues, string>> = {};

  // TAB 1: General Info
  const trimmedName = values.fullName?.trim() || '';
  if (!trimmedName) {
    errs.fullName = 'Full Name is required.';
  } else if (trimmedName.length < 3) {
    errs.fullName = 'Full Name must be at least 3 characters.';
  } else if (!isSafeInput(trimmedName)) {
    errs.fullName = 'Full Name contains invalid characters.';
  }

  const trimmedMobile = values.mobile?.trim() || '';
  if (!trimmedMobile) {
    errs.mobile = 'Mobile number is required.';
  } else if (!isSafeInput(trimmedMobile)) {
    errs.mobile = 'Mobile number contains invalid characters.';
  } else {
    const digitsOnly = trimmedMobile.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      errs.mobile = 'Please enter a valid 10-digit mobile number.';
    } else if (digitsOnly.length > 15) {
      errs.mobile = 'Mobile number cannot exceed 15 digits.';
    }
  }

  const trimmedEmail = values.email?.trim() || '';
  if (trimmedEmail) {
    if (!isSafeInput(trimmedEmail)) {
      errs.email = 'Email contains invalid characters.';
    } else if (!emailPattern.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }
  }

  if (!values.password) {
    errs.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errs.password = 'Password must be at least 6 characters.';
  }

  if (!values.confirmPassword) {
    errs.confirmPassword = 'Confirm Password is required.';
  } else if (values.confirmPassword !== values.password) {
    errs.confirmPassword = 'Passwords do not match.';
  }

  if (!values.dob) {
    errs.dob = 'Date of Birth is required.';
  } else {
    const birthDate = new Date(values.dob);
    if (isNaN(birthDate.getTime())) {
      errs.dob = 'Invalid date format.';
    } else {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        errs.dob = 'Member must be at least 18 years old.';
      } else if (age > 100) {
        errs.dob = 'Please enter a realistic Date of Birth.';
      }
    }
  }

  if (!values.city?.trim()) {
    errs.city = 'City is required.';
  }
  if (!values.state?.trim()) {
    errs.state = 'State is required.';
  }
  if (!values.subcaste?.trim()) {
    errs.subcaste = 'Sub community is required.';
  }

  // TAB 6: Images (Profile Photo URL format)
  if (values.profilePhoto?.trim()) {
    try {
      new URL(values.profilePhoto.trim());
    } catch {
      errs.profilePhoto = 'Please enter a valid image URL.';
    }
  }

  // TAB 7: Optional Verifications (validate only if provided)
  if (values.verifyEmail?.trim()) {
    if (!emailPattern.test(values.verifyEmail.trim())) {
      errs.verifyEmail = 'Please enter a valid verification email.';
    }
  }

  if (values.verifyMobile?.trim()) {
    const rawDigits = values.verifyMobile.replace(/\D/g, '');
    if (rawDigits.length < 10) {
      errs.verifyMobile = 'Verification mobile must be at least 10 digits.';
    }
  }

  if (values.verifyAadhaar?.trim()) {
    const rawAadhaar = values.verifyAadhaar.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(rawAadhaar)) {
      errs.verifyAadhaar = 'Aadhaar must be a 12-digit number.';
    }
  }

  return errs;
};

export interface AddMemberUIState {
  activeTab: FormTab;
  loading: boolean;
  submitted: boolean;
  createdSuccess: {
    id: string;
    uniqueId: string;
    fullName: string;
    plan: MemberPlan;
  } | null;
}

export const AddMemberScreen: React.FC = () => {
  const navigate = useNavigate();

  // Screen UI state managed via useInputs
  const {
    values: uiState,
    setFieldValue: setUiField,
  } = useInputs<AddMemberUIState>({
    activeTab: 'general',
    loading: false,
    submitted: false,
    createdSuccess: null,
  });

  const {
    activeTab,
    loading,
    submitted,
    createdSuccess,
  } = uiState;

  const setActiveTab = (tab: FormTab) => setUiField('activeTab', tab);
  const setLoading = (val: boolean) => setUiField('loading', val);
  const setSubmitted = (val: boolean) => setUiField('submitted', val);
  const setCreatedSuccess = (val: AddMemberUIState['createdSuccess']) => setUiField('createdSuccess', val);

  // Unified form management hook
  const {
    values,
    errors,
    touched,
    bind,
    bindCheckbox,
    setFieldValue,
    setFieldTouched,
    validateForm,
    reset,
    dirty,
    hasErrors,
  } = useInputs<AddMemberFormValues>(() => generateInitialValues('Male'), {
    validate: validateMemberForm,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Automatically calculate age from DOB
  const calculatedAge = useMemo(() => {
    if (!values.dob) return 26;
    const birthYear = new Date(values.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return isNaN(age) || age < 18 ? 24 : age;
  }, [values.dob]);

  // Dynamic Subcastes & Gotras options loaded from verified master database
  const subcasteOptions = useMemo(() => {
    const list = subcasteGotraService.getSubcastes().filter((s) => s.active);
    const opts = list.map((s) => ({ value: s.name, label: s.name }));
    opts.push({ value: 'Other', label: 'Other Subcaste' });
    return opts;
  }, []);

  const gotraOptions = useMemo(() => {
    const list = subcasteGotraService.getGotras().filter((g) => g.active);
    return list.map((g) => ({ value: g.name, label: `${g.name} (${g.lineage})` }));
  }, []);

  const religionOptions = useMemo(() => {
    const list = casteReligionService.getActiveReligions();
    return list.map((r) => ({ value: r.name, label: r.name }));
  }, []);

  const communityCasteOptions = useMemo(() => {
    const list = casteReligionService.getActiveCastes();
    const opts = list.map((c) => ({ value: c.name, label: `${c.name} (${c.religionName})` }));
    if (!opts.some((o) => o.value === 'Sindhi')) {
      opts.unshift({ value: 'Sindhi', label: 'Sindhi (General)' });
    }
    return opts;
  }, []);

  // Error state helpers
  const getFieldError = (field: keyof AddMemberFormValues): string | undefined => {
    return touched[field] || submitted ? errors[field] : undefined;
  };

  const getTabErrorCount = (tabId: FormTab): number => {
    const fields = TAB_FIELDS[tabId] || [];
    return fields.filter((f) => Boolean(errors[f]) && (touched[f] || submitted)).length;
  };

  const touchTabFields = (tabId: FormTab) => {
    (TAB_FIELDS[tabId] || []).forEach((field) => {
      setFieldTouched(field, true);
    });
  };

  const touchAllFields = () => {
    (Object.keys(TAB_FIELDS) as FormTab[]).forEach((tab) => {
      touchTabFields(tab);
    });
  };

  // Input styling with error awareness
  const getTextareaClass = (field: keyof AddMemberFormValues, extra = '') => {
    const hasFieldError = Boolean(getFieldError(field));
    return `w-full px-3.5 py-2.5 rounded-xl text-xs transition-colors focus:outline-none ${
      hasFieldError
        ? 'bg-rose-50/40 border-2 border-red-500 text-slate-900 focus:border-red-600 focus:ring-2 focus:ring-red-100'
        : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-[#C81E28]'
    } ${extra}`;
  };

  // Regenerate random unique ID if needed
  const handleRegenerateUniqueId = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = values.gender === 'Female' ? 'A8' : 'E10';
    const newId = `${prefix}${randomSuffix}P${Math.floor(1500 + Math.random() * 200)}`;
    setFieldValue('uniqueId', newId);
    toast.success('Generated new Unique ID');
  };

  // Switch tabs in order
  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);

  const handleNext = () => {
    // Touch all fields in current tab so any errors are exposed
    touchTabFields(activeTab);

    // Validate current tab fields before advancing
    const tabFieldsWithErrors = (TAB_FIELDS[activeTab] || []).filter((f) => Boolean(errors[f]));
    if (tabFieldsWithErrors.length > 0) {
      const firstField = tabFieldsWithErrors[0];
      const errorMessage = errors[firstField] || 'Please resolve the highlighted errors.';
      toast.warning(errorMessage);
      return;
    }

    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit form and create new member
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    touchAllFields();

    const isValid = validateForm();
    if (!isValid) {
      // Find the first tab containing validation errors and switch to it
      const firstErrorTab = TABS.find((t) =>
        (TAB_FIELDS[t.id] || []).some((f) => Boolean(errors[f]))
      );
      if (firstErrorTab) {
        setActiveTab(firstErrorTab.id);
        const errField = (TAB_FIELDS[firstErrorTab.id] || []).find((f) => Boolean(errors[f]));
        const message = errField ? errors[errField] : 'Please fix the highlighted errors.';
        toast.error(`Please fix errors in ${firstErrorTab.label}: ${message}`);
      } else {
        toast.error('Please fix the highlighted errors in the form.');
      }
      return;
    }

    setLoading(true);

    try {
      const created = memberDataService.addMember({
        uniqueId: values.uniqueId,
        fullName: values.fullName.trim(),
        mobile: values.mobile.trim(),
        email:
          values.email.trim() ||
          `${values.fullName.toLowerCase().replace(/\s+/g, '.')}@sindhiconnect.com`,
        gender: values.gender,
        age: calculatedAge,
        dateOfBirth: values.dob,
        maritalStatus: values.maritalStatus,
        profileCreatedBy: values.profileCreatedBy,
        motherTongue: values.motherTongue,
        religion: values.religion,
        community: values.community,
        subcaste: values.subcaste,
        city: values.city.trim() || 'Mumbai',
        state: values.state,
        country: values.country,

        // Family Info
        fatherName: values.fatherName.trim(),
        fatherOccupation: values.fatherOccupation.trim(),
        motherName: values.motherName.trim(),
        motherOccupation: values.motherOccupation.trim(),
        familyType: values.familyType,
        membersLiveWith: values.membersLiveWith,
        aboutBrother: values.aboutBrother.trim(),
        aboutSister: values.aboutSister.trim(),
        aboutFamily: values.aboutFamily.trim(),

        // Lifestyle
        height: values.height,
        weight: values.weight,
        bodyType: values.bodyType,
        complexion: values.complexion,
        bloodGroup: values.bloodGroup,
        diet: values.diet,
        smokingHabit: values.smokingHabit,
        alcoholConsumption: values.alcoholConsumption,

        // Education & Work
        educationArea: values.educationArea,
        education: values.education.trim(),
        workingWith: values.workingWith,
        workingAs: values.workingAs.trim(),
        profession: values.workingAs.trim() || 'Professional',
        employedIn: values.workingWith,
        annualIncome: values.annualIncome,

        // Astrological Info
        birthPlace: values.birthPlace.trim(),
        gotra: values.gotra.trim(),
        manglik: values.manglik,
        sunSign: values.sunSign,
        nakshatram: values.nakshatram,

        // Images & Bio
        profilePhoto: values.profilePhoto,
        galleryPhotos: [values.galleryPhoto1, values.galleryPhoto2].filter(Boolean),
        photoPrivacy: values.photoPrivacy,
        aboutCandidate: values.aboutMe.trim(),
        aboutMe: values.aboutMe.trim(),
        desiredProfile: values.desiredProfile.trim(),
        hobbies: values.hobbies,

        // Verifications & CRM Admin Notes
        verifyEmail: values.verifyEmail.trim(),
        verifyMobile: values.verifyMobile.trim(),
        verifyAadhaar: values.verifyAadhaar.trim(),
        adminComment: values.adminComment.trim(),

        // Plan & Admin
        plan: values.plan,
        status: values.status,
        isVerified: values.isVerified,
        assignedMatchmaker: values.assignedMatchmaker,
        notes: values.adminComment.trim() || `Registered directly by CRM Admin. Plan: ${values.plan}.`,
      });

      setCreatedSuccess({
        id: created.id,
        uniqueId: created.uniqueId,
        fullName: created.fullName,
        plan: created.plan,
      });

      toast.success(`🎉 Member ${created.fullName} registered successfully with ID: ${created.id}!`);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to register member. Please check form inputs.';
      toast.error(errorMsg);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span
              onClick={() => navigate('/members')}
              className="hover:text-slate-600 cursor-pointer font-medium"
            >
              Members
            </span>
            <span>/</span>
            <span className="text-[#C81E28] font-bold">Add New Member</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Add New Member</h1>
            <span className="text-[11px] font-bold bg-rose-50 text-[#C81E28] px-2.5 py-0.5 rounded-full border border-rose-100 flex items-center gap-1">
              <UserPlus className="w-3 h-3" />
              Direct CRM Onboarding
            </span>
          </div>
        </div>

        {/* Live ID badge, Reset button and fast jump */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs">
            <span className="text-slate-400">Unique ID:</span>
            <span className="font-mono font-bold text-slate-800">{values.uniqueId}</span>
            <button
              type="button"
              onClick={handleRegenerateUniqueId}
              title="Generate new ID"
              className="text-slate-400 hover:text-[#C81E28] transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {dirty && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard all unsaved changes and reset the form to defaults?')) {
                  reset();
                  setSubmitted(false);
                  toast.info('Form reset to initial defaults');
                }
              }}
              title="Reset form"
              className="px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/members')}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Global Validation Alert Banner */}
      {submitted && hasErrors && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              There are unresolved form errors. Please inspect the highlighted tabs and correct the fields.
            </span>
          </div>
          <span className="font-bold bg-white text-red-600 px-2.5 py-0.5 rounded-md border border-rose-200 shrink-0">
            {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} found
          </span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-max gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabErrors = getTabErrorCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#C81E28] text-white shadow-md shadow-rose-900/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <span>{tab.label}</span>
                {tabErrors > 0 && (
                  <span
                    className={`flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-red-600' : 'bg-red-500 text-white'
                    }`}
                    title={`${tabErrors} field error(s)`}
                  >
                    {tabErrors}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content Container */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          {/* TAB 1: GENERAL INFO */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">General Information</h2>
                    <p className="text-xs text-slate-400">
                      Account credentials & primary personal coordinates
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 1 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Unique ID */}
                <CustomTextInput
                  label="Unique ID"
                  {...bind('uniqueId')}
                  placeholder="Unique ID"
                  inputClassName="font-mono font-medium"
                  error={getFieldError('uniqueId')}
                  size="sm"
                />

                {/* Email */}
                <CustomTextInput
                  label="Email"
                  type="email"
                  {...bind('email')}
                  placeholder="Email"
                  error={getFieldError('email')}
                  size="sm"
                />

                {/* Password with Eye toggle */}
                <CustomTextInput
                  label="Password"
                  required
                  type="password"
                  {...bind('password')}
                  placeholder="Password"
                  error={getFieldError('password')}
                  size="sm"
                />

                {/* Confirm Password with Eye toggle */}
                <CustomTextInput
                  label="Confirm Password"
                  required
                  type="password"
                  {...bind('confirmPassword')}
                  placeholder="Re-enter password"
                  error={getFieldError('confirmPassword')}
                  size="sm"
                />

                {/* Full Name */}
                <CustomTextInput
                  label="Full Name"
                  required
                  {...bind('fullName')}
                  placeholder="Full Name"
                  error={getFieldError('fullName')}
                  size="sm"
                />

                {/* Mobile */}
                <CustomTextInput
                  label="Mobile"
                  required
                  type="tel"
                  {...bind('mobile')}
                  placeholder="Mobile"
                  error={getFieldError('mobile')}
                  size="sm"
                />

                {/* Profile Created By */}
                <CustomDropDown
                  label="Profile Created By"
                  value={values.profileCreatedBy}
                  onChange={(val) => setFieldValue('profileCreatedBy', String(val))}
                  options={[
                    { value: 'Self', label: 'Self' },
                    { value: 'Parents', label: 'Parents' },
                    { value: 'Sibling', label: 'Sibling' },
                    { value: 'Relative', label: 'Relative' },
                    { value: 'Friend', label: 'Friend' },
                    { value: 'Matchmaker', label: 'Matchmaker / Agent' },
                  ]}
                  size="sm"
                />

                {/* Gender */}
                <CustomDropDown
                  label="Gender"
                  value={values.gender}
                  onChange={(val) => setFieldValue('gender', val as 'Male' | 'Female')}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                  ]}
                  size="sm"
                />

                {/* Date of Birth with auto-age */}
                <CustomTextInput
                  label="Date of Birth"
                  required
                  type="date"
                  optionalBadge={
                    <span className="text-[11px] font-bold text-[#C81E28] bg-rose-50 px-2 py-0.5 rounded-md">
                      Age: {calculatedAge} yrs
                    </span>
                  }
                  {...bind('dob')}
                  error={getFieldError('dob')}
                  size="sm"
                />

                {/* Marital Status */}
                <CustomDropDown
                  label="Marital Status"
                  value={values.maritalStatus}
                  onChange={(val) => setFieldValue('maritalStatus', val as any)}
                  options={[
                    { value: 'Never Married', label: 'Never Married' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Widowed', label: 'Widowed' },
                    { value: 'Awaiting Divorce', label: 'Awaiting Divorce' },
                    { value: 'Annulled', label: 'Annulled' },
                  ]}
                  size="sm"
                />

                {/* Mother Tongue */}
                <CustomDropDown
                  label="Mother Tongue"
                  value={values.motherTongue}
                  onChange={(val) => setFieldValue('motherTongue', String(val))}
                  options={[
                    { value: 'Sindhi', label: 'Sindhi' },
                    { value: 'Hindi', label: 'Hindi' },
                    { value: 'English', label: 'English' },
                    { value: 'Gujarati', label: 'Gujarati' },
                    { value: 'Punjabi', label: 'Punjabi' },
                    { value: 'Marathi', label: 'Marathi' },
                  ]}
                  size="sm"
                />

                {/* Religion */}
                <CustomDropDown
                  label="Religion"
                  value={values.religion}
                  onChange={(val) => setFieldValue('religion', String(val))}
                  options={religionOptions}
                  size="sm"
                />

                {/* Community / Caste */}
                <CustomDropDown
                  label="Community / Caste"
                  value={values.community}
                  onChange={(val) => setFieldValue('community', String(val))}
                  options={communityCasteOptions}
                  size="sm"
                />

                {/* Sub Community / Subcaste */}
                <CustomDropDown
                  label="Sub Community"
                  required
                  value={values.subcaste}
                  onChange={(val) => setFieldValue('subcaste', String(val))}
                  options={subcasteOptions}
                  error={getFieldError('subcaste')}
                  size="sm"
                />

                {/* City */}
                <CustomTextInput
                  label="City"
                  required
                  {...bind('city')}
                  placeholder="Select City"
                  error={getFieldError('city')}
                  size="sm"
                />

                {/* State */}
                <CustomTextInput
                  label="State"
                  required
                  {...bind('state')}
                  placeholder="Select State"
                  error={getFieldError('state')}
                  size="sm"
                />

                {/* Country */}
                <CustomDropDown
                  label="Country"
                  value={values.country}
                  onChange={(val) => setFieldValue('country', String(val))}
                  options={[
                    { value: 'India', label: 'India' },
                    { value: 'United Arab Emirates', label: 'United Arab Emirates (UAE)' },
                    { value: 'United States', label: 'United States (USA)' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'United Kingdom', label: 'United Kingdom (UK)' },
                    { value: 'Singapore', label: 'Singapore' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: FAMILY INFO */}
          {activeTab === 'family' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Family Information</h2>
                    <p className="text-xs text-slate-400">
                      Parents background, siblings & family lifestyle
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 2 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Father's Name */}
                <CustomTextInput
                  label="Father's Name"
                  {...bind('fatherName')}
                  placeholder="Father's Name"
                  size="sm"
                />

                {/* Father's Occupation */}
                <CustomTextInput
                  label="Father's Occupation"
                  {...bind('fatherOccupation')}
                  placeholder="Father's Occupation"
                  size="sm"
                />

                {/* Mother's Name */}
                <CustomTextInput
                  label="Mother's Name"
                  {...bind('motherName')}
                  placeholder="Mother's Name"
                  size="sm"
                />

                {/* Mother's Occupation */}
                <CustomTextInput
                  label="Mother's Occupation"
                  {...bind('motherOccupation')}
                  placeholder="Mother's Occupation"
                  size="sm"
                />

                {/* Family Type */}
                <CustomDropDown
                  label="Family Type"
                  value={values.familyType}
                  onChange={(val) => setFieldValue('familyType', val as any)}
                  options={[
                    { value: 'Nuclear', label: 'Nuclear' },
                    { value: 'Joint', label: 'Joint' },
                  ]}
                  size="sm"
                />

                {/* Members Live With */}
                <CustomTextInput
                  label="Members Live With"
                  {...bind('membersLiveWith')}
                  placeholder="Members Live With"
                  size="sm"
                />

                {/* About Brother */}
                <CustomTextInput
                  label="About Brother"
                  {...bind('aboutBrother')}
                  placeholder="About Brother"
                  size="sm"
                />

                {/* About Sister */}
                <CustomTextInput
                  label="About Sister"
                  {...bind('aboutSister')}
                  placeholder="About Sister"
                  size="sm"
                />

                {/* About Family (Textarea) */}
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1.5">About Family</label>
                  <textarea
                    rows={4}
                    {...bind('aboutFamily')}
                    placeholder="About Family"
                    className={getTextareaClass('aboutFamily')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIFESTYLE */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Lifestyle & Physical Attributes</h2>
                    <p className="text-xs text-slate-400">
                      Physical build, dietary choices & personal habits
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 3 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Height */}
                <CustomDropDown
                  label="Height"
                  value={values.height}
                  onChange={(val) => setFieldValue('height', String(val))}
                  options={[
                    { value: '4\'10"', label: '4\'10" (147 cm)' },
                    { value: '5\'0"', label: '5\'0" (152 cm)' },
                    { value: '5\'2"', label: '5\'2" (157 cm)' },
                    { value: '5\'4"', label: '5\'4" (162 cm)' },
                    { value: '5\'5"', label: '5\'5" (165 cm)' },
                    { value: '5\'6"', label: '5\'6" (167 cm)' },
                    { value: '5\'7"', label: '5\'7" (170 cm)' },
                    { value: '5\'8"', label: '5\'8" (172 cm)' },
                    { value: '5\'9"', label: '5\'9" (175 cm)' },
                    { value: '5\'10"', label: '5\'10" (178 cm)' },
                    { value: '5\'11"', label: '5\'11" (180 cm)' },
                    { value: '6\'0"', label: '6\'0" (183 cm)' },
                    { value: '6\'1"', label: '6\'1" (185 cm)' },
                    { value: '6\'2"', label: '6\'2" (188 cm)' },
                  ]}
                  size="sm"
                />

                {/* Weight */}
                <CustomTextInput
                  label="Weight"
                  {...bind('weight')}
                  placeholder="Select Weight"
                  size="sm"
                />

                {/* Body Type */}
                <CustomDropDown
                  label="Body Type"
                  value={values.bodyType}
                  onChange={(val) => setFieldValue('bodyType', String(val))}
                  options={[
                    { value: 'Slim', label: 'Slim' },
                    { value: 'Average', label: 'Average' },
                    { value: 'Athletic', label: 'Athletic' },
                    { value: 'Heavy', label: 'Heavy' },
                  ]}
                  size="sm"
                />

                {/* Complexion */}
                <CustomDropDown
                  label="Complexion"
                  value={values.complexion}
                  onChange={(val) => setFieldValue('complexion', String(val))}
                  options={[
                    { value: 'Very Fair', label: 'Very Fair' },
                    { value: 'Fair', label: 'Fair' },
                    { value: 'Wheatish', label: 'Wheatish' },
                    { value: 'Dark', label: 'Dark' },
                  ]}
                  size="sm"
                />

                {/* Blood Group */}
                <CustomDropDown
                  label="Blood Group"
                  value={values.bloodGroup}
                  onChange={(val) => setFieldValue('bloodGroup', String(val))}
                  options={[
                    { value: 'A+', label: 'A+' },
                    { value: 'A-', label: 'A-' },
                    { value: 'B+', label: 'B+' },
                    { value: 'B-', label: 'B-' },
                    { value: 'O+', label: 'O+' },
                    { value: 'O-', label: 'O-' },
                    { value: 'AB+', label: 'AB+' },
                    { value: 'AB-', label: 'AB-' },
                  ]}
                  size="sm"
                />

                {/* Diet */}
                <CustomDropDown
                  label="Diet"
                  value={values.diet}
                  onChange={(val) => setFieldValue('diet', val as any)}
                  options={[
                    { value: 'Vegetarian', label: 'Pure Vegetarian' },
                    { value: 'Eggetarian', label: 'Eggetarian' },
                    { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
                    { value: 'Jain', label: 'Jain Vegetarian' },
                    { value: 'Vegan', label: 'Vegan' },
                  ]}
                  size="sm"
                />

                {/* Smoking Habit */}
                <CustomDropDown
                  label="Smoking Habit"
                  value={values.smokingHabit}
                  onChange={(val) => setFieldValue('smokingHabit', String(val))}
                  options={[
                    { value: 'No / Non-Smoker', label: 'No / Non-Smoker' },
                    { value: 'Occasionally', label: 'Occasionally' },
                    { value: 'Regularly', label: 'Regularly' },
                  ]}
                  size="sm"
                />

                {/* Alcohol Consumption */}
                <CustomDropDown
                  label="Alcohol Consumption"
                  value={values.alcoholConsumption}
                  onChange={(val) => setFieldValue('alcoholConsumption', String(val))}
                  options={[
                    { value: 'No / Non-Drinker', label: 'No / Non-Drinker' },
                    { value: 'Socially', label: 'Socially' },
                    { value: 'Regularly', label: 'Regularly' },
                  ]}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION & WORK */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Education & Work</h2>
                    <p className="text-xs text-slate-400">
                      Academic pedigree, career profile & annual package
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 4 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Education Area */}
                <CustomDropDown
                  label="Education Area"
                  value={values.educationArea}
                  onChange={(val) => setFieldValue('educationArea', String(val))}
                  options={[
                    { value: 'Engineering / Technology', label: 'Engineering / Technology' },
                    { value: 'Management / MBA', label: 'Management / MBA' },
                    { value: 'Commerce / CA / Finance', label: 'Commerce / CA / Finance' },
                    { value: 'Medicine / Healthcare', label: 'Medicine / Healthcare' },
                    { value: 'Law / Legal', label: 'Law / Legal' },
                    { value: 'Civil Services', label: 'Civil Services' },
                    { value: 'Arts / Humanities / Design', label: 'Arts / Humanities / Design' },
                    { value: 'Other', label: 'Other Field' },
                  ]}
                  size="sm"
                />

                {/* Education */}
                <CustomTextInput
                  label="Education"
                  {...bind('education')}
                  placeholder="Education"
                  size="sm"
                />

                {/* Working With */}
                <CustomTextInput
                  label="Working With"
                  {...bind('workingWith')}
                  placeholder="Working With"
                  size="sm"
                />

                {/* Working As */}
                <CustomTextInput
                  label="Working As"
                  {...bind('workingAs')}
                  placeholder="Select working as"
                  size="sm"
                />

                {/* Salary / Annual Income */}
                <CustomDropDown
                  label="Salary"
                  value={values.annualIncome}
                  onChange={(val) => setFieldValue('annualIncome', String(val))}
                  options={[
                    { value: '₹5 - 10 Lakhs', label: '₹5 - 10 Lakhs' },
                    { value: '₹10 - 15 Lakhs', label: '₹10 - 15 Lakhs' },
                    { value: '₹15 - 20 Lakhs', label: '₹15 - 20 Lakhs' },
                    { value: '₹20 - 25 Lakhs', label: '₹20 - 25 Lakhs' },
                    { value: '₹25 - 35 Lakhs', label: '₹25 - 35 Lakhs' },
                    { value: '₹35 - 50 Lakhs', label: '₹35 - 50 Lakhs' },
                    { value: '₹50 Lakhs+', label: '₹50 Lakhs+ (NRI / HNI)' },
                  ]}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 5: ASTROLOGICAL INFO */}
          {activeTab === 'astrological' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Astrological Information</h2>
                    <p className="text-xs text-slate-400">
                      Horoscope, Gotra, Mangalik dosha & Rashi coordinates
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 5 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* Birth Place */}
                <CustomTextInput
                  label="Birth Place"
                  {...bind('birthPlace')}
                  placeholder="Birth Place"
                  size="sm"
                />

                {/* Gotra */}
                <CustomDropDown
                  label="Gotra"
                  value={values.gotra}
                  onChange={(val) => setFieldValue('gotra', String(val))}
                  options={[
                    { value: '', label: 'Select Vedic Gotra...' },
                    ...gotraOptions,
                    { value: 'Other', label: 'Other / Not Mentioned' },
                  ]}
                  size="sm"
                />

                {/* Mangalik */}
                <CustomDropDown
                  label="Mangalik"
                  value={values.manglik}
                  onChange={(val) => setFieldValue('manglik', val as any)}
                  options={[
                    { value: 'Non-Manglik', label: 'Non-Manglik' },
                    { value: 'Manglik', label: 'Manglik' },
                    { value: 'Anshik Manglik', label: 'Anshik Manglik' },
                    { value: "Don't Know", label: "Don't Know" },
                  ]}
                  size="sm"
                />

                {/* Sun Sign */}
                <CustomDropDown
                  label="Sun Sign"
                  value={values.sunSign}
                  onChange={(val) => setFieldValue('sunSign', String(val))}
                  options={[
                    { value: 'Aries', label: 'Aries (Mesha)' },
                    { value: 'Taurus', label: 'Taurus (Vrishabha)' },
                    { value: 'Gemini', label: 'Gemini (Mithuna)' },
                    { value: 'Cancer', label: 'Cancer (Karka)' },
                    { value: 'Leo', label: 'Leo (Simha)' },
                    { value: 'Virgo', label: 'Virgo (Kanya)' },
                    { value: 'Libra', label: 'Libra (Tula)' },
                    { value: 'Scorpio', label: 'Scorpio (Vrischika)' },
                    { value: 'Sagittarius', label: 'Sagittarius (Dhanu)' },
                    { value: 'Capricorn', label: 'Capricorn (Makara)' },
                    { value: 'Aquarius', label: 'Aquarius (Kumbha)' },
                    { value: 'Pisces', label: 'Pisces (Meena)' },
                  ]}
                  size="sm"
                />

                {/* Nakshatram */}
                <CustomDropDown
                  label="Nakshatram"
                  value={values.nakshatram}
                  onChange={(val) => setFieldValue('nakshatram', String(val))}
                  options={[
                    { value: 'Rohini', label: 'Rohini' },
                    { value: 'Ashwini', label: 'Ashwini' },
                    { value: 'Bharani', label: 'Bharani' },
                    { value: 'Krittika', label: 'Krittika' },
                    { value: 'Mrigashirsha', label: 'Mrigashirsha' },
                    { value: 'Ardra', label: 'Ardra' },
                    { value: 'Punarvasu', label: 'Punarvasu' },
                    { value: 'Pushya', label: 'Pushya' },
                    { value: 'Ashlesha', label: 'Ashlesha' },
                    { value: 'Magha', label: 'Magha' },
                    { value: 'Purva Phalguni', label: 'Purva Phalguni' },
                    { value: 'Uttara Phalguni', label: 'Uttara Phalguni' },
                    { value: 'Hasta', label: 'Hasta' },
                    { value: 'Chitra', label: 'Chitra' },
                    { value: 'Swati', label: 'Swati' },
                    { value: 'Vishakha', label: 'Vishakha' },
                    { value: 'Anuradha', label: 'Anuradha' },
                    { value: 'Jyeshtha', label: 'Jyeshtha' },
                    { value: 'Mula', label: 'Mula' },
                    { value: 'Purva Ashadha', label: 'Purva Ashadha' },
                    { value: 'Uttara Ashadha', label: 'Uttara Ashadha' },
                    { value: 'Shravana', label: 'Shravana' },
                    { value: 'Dhanishta', label: 'Dhanishta' },
                    { value: 'Shatabhisha', label: 'Shatabhisha' },
                    { value: 'Purva Bhadrapada', label: 'Purva Bhadrapada' },
                    { value: 'Uttara Bhadrapada', label: 'Uttara Bhadrapada' },
                    { value: 'Revati', label: 'Revati' },
                    { value: "Don't Know", label: "Don't Know" },
                  ]}
                  searchable
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 6: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Profile Images & Photos</h2>
                    <p className="text-xs text-slate-400">
                      High-resolution photo gallery & privacy permissions
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 6 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Primary Profile Photo Preview */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md mb-3 bg-white">
                    <img
                      src={values.profilePhoto}
                      alt="Primary Photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          values.gender === 'Female'
                            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-800">Primary Photo</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Displayed on main matrimonial search card
                  </p>
                  <CustomTextInput
                    {...bind('profilePhoto')}
                    placeholder="Paste image URL"
                    error={getFieldError('profilePhoto')}
                    containerClassName="w-full mt-3"
                    size="sm"
                  />
                </div>

                {/* Gallery Photo 1 */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-3 bg-white overflow-hidden">
                    {values.galleryPhoto1 ? (
                      <img
                        src={values.galleryPhoto1}
                        alt="Gallery 1"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <span className="font-bold text-slate-800">Gallery Photo 1</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Full portrait or family photo</p>
                  <CustomTextInput
                    {...bind('galleryPhoto1')}
                    placeholder="Paste image URL (optional)"
                    containerClassName="w-full mt-3"
                    size="sm"
                  />
                </div>

                {/* Gallery Photo 2 */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-3 bg-white overflow-hidden">
                    {values.galleryPhoto2 ? (
                      <img
                        src={values.galleryPhoto2}
                        alt="Gallery 2"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <span className="font-bold text-slate-800">Gallery Photo 2</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Casual or traditional attire photo</p>
                  <CustomTextInput
                    {...bind('galleryPhoto2')}
                    placeholder="Paste image URL (optional)"
                    containerClassName="w-full mt-3"
                    size="sm"
                  />
                </div>
              </div>

              {/* Photo Privacy */}
              <div className="text-xs">
                <CustomDropDown
                  label="Photo Privacy Mode"
                  value={values.photoPrivacy}
                  onChange={(val) => setFieldValue('photoPrivacy', String(val))}
                  options={[
                    { value: 'Visible to All Members', label: 'Visible to All Verified Members' },
                    { value: 'Visible to Accepted Requests', label: 'Visible Only to Accepted Requests' },
                    { value: 'Blur until Approved', label: 'Blur with Watermark until Approved' },
                  ]}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 7: OTHER INFO */}
          {activeTab === 'other' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#C81E28] flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Other Information</h2>
                    <p className="text-xs text-slate-400">
                      About Me, partner expectations, identity verification & admin notes
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400">Step 7 of 7</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* About Me (Left Column) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">About Me</label>
                  <textarea
                    rows={4}
                    {...bind('aboutMe')}
                    placeholder="About Me"
                    className={getTextareaClass('aboutMe')}
                  />
                </div>

                {/* Desired Profile (Right Column) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Desired Profile</label>
                  <textarea
                    rows={4}
                    {...bind('desiredProfile')}
                    placeholder="Desired Profile"
                    className={getTextareaClass('desiredProfile')}
                  />
                </div>

                {/* Verify Email */}
                <CustomTextInput
                  label="Verify Email"
                  {...bind('verifyEmail')}
                  placeholder="Verify Email"
                  error={getFieldError('verifyEmail')}
                  size="sm"
                />

                {/* Verify Mobile */}
                <CustomTextInput
                  label="Verify Mobile"
                  {...bind('verifyMobile')}
                  placeholder="Verify Mobile"
                  error={getFieldError('verifyMobile')}
                  size="sm"
                />

                {/* Verify Aadhaar */}
                <CustomTextInput
                  label="Verify Aadhaar"
                  {...bind('verifyAadhaar')}
                  placeholder="12-digit Aadhaar number"
                  error={getFieldError('verifyAadhaar')}
                  size="sm"
                />

                {/* Admin Comment */}
                <CustomTextInput
                  label="Admin Comment"
                  {...bind('adminComment')}
                  placeholder="Admin Comment"
                  size="sm"
                />
              </div>

              {/* CRM Administration & Plan Allocation */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  CRM Plan & Account Setup
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Membership Plan */}
                  <div className="bg-gradient-to-br from-rose-50/60 to-white p-3.5 rounded-2xl border border-rose-200/80">
                    <CustomDropDown
                      label={
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-[#C81E28]" />
                          Membership Plan
                        </span>
                      }
                      value={values.plan}
                      onChange={(val) => setFieldValue('plan', val as any)}
                      options={[
                        { value: 'PLATINUM', label: 'PLATINUM' },
                        { value: 'GOLD', label: 'GOLD' },
                        { value: 'SILVER', label: 'SILVER' },
                        { value: 'FREE', label: 'FREE' },
                        { value: 'TILL_MARRIAGE', label: 'VIP TILL MARRIAGE' },
                      ]}
                      size="sm"
                    />
                  </div>

                  {/* Account Status */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <CustomDropDown
                      label="Account Status"
                      value={values.status}
                      onChange={(val) => setFieldValue('status', val as any)}
                      options={[
                        { value: 'ACTIVE', label: 'ACTIVE' },
                        { value: 'INACTIVE', label: 'INACTIVE' },
                        { value: 'SUSPENDED', label: 'SUSPENDED' },
                      ]}
                      size="sm"
                    />
                  </div>

                  {/* Assigned Matchmaker */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <CustomDropDown
                      label="Assigned Matchmaker"
                      value={values.assignedMatchmaker}
                      onChange={(val) => setFieldValue('assignedMatchmaker', String(val))}
                      options={[
                        { value: 'Priya Sharma', label: 'Priya Sharma' },
                        { value: 'Kavita Chhabria', label: 'Kavita Chhabria' },
                        { value: 'Rajesh Mulchandani', label: 'Rajesh Mulchandani' },
                        { value: 'Deepak Ahuja', label: 'Deepak Ahuja' },
                      ]}
                      size="sm"
                    />
                  </div>
                </div>

                {/* KYC Verification Toggle */}
                <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 mt-4 text-xs">
                  <input
                    id="kycVerified"
                    {...bindCheckbox('isVerified')}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor="kycVerified"
                    className="text-xs text-emerald-950 font-bold cursor-pointer"
                  >
                    KYC Verified Profile (Aadhaar & Mobile Confirmed)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={currentTabIndex === 0}
              onClick={handlePrevious}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5A6A80] hover:bg-[#475569] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <span>← Previous</span>
            </button>

            {currentTabIndex < TABS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#C81E28] hover:bg-[#a61720] shadow-sm shadow-rose-900/20 transition cursor-pointer"
              >
                <span>Next →</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-bold text-white bg-[#15803D] hover:bg-[#166534] shadow-md shadow-emerald-900/20 transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit'}</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Success Modal Celebration */}
      {createdSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Member Created Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong className="text-slate-800">{createdSuccess.fullName}</strong> has been registered in
                the CRM directory.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Unique ID:</span>
                <span className="font-mono font-bold text-slate-800">{createdSuccess.uniqueId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member Serial ID:</span>
                <span className="font-mono font-bold text-slate-800">{createdSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Plan:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {createdSuccess.plan}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => navigate('/members/paid')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>View in Paid Members List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedSuccess(null);
                  setSubmitted(false);
                  setActiveTab('general');
                  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                  const prefix = values.gender === 'Female' ? 'A8' : 'E10';
                  reset({
                    ...generateInitialValues(values.gender),
                    uniqueId: `${prefix}${randomSuffix}P1601`,
                  });
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                + Register Another Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMemberScreen;
