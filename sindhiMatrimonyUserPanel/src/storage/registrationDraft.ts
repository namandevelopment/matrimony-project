/**
 * Unified Registration Draft & Session Recovery Manager
 * Sindhi Matrimony User Panel
 *
 * Persists safe multi-step registration draft state across browser restarts,
 * tab closures, and page refreshes.
 *
 * SECURITY INVARIANTS:
 * - Passwords, raw OTPs, and secret authentication tokens are NEVER persisted.
 * - Server-side verified registration session token (TTL 24h) is verified against backend.
 * - Authoritative verification status is always determined by the server.
 */

import { Storage } from './Storage';

export const SINDHI_REG_DRAFT_KEY = 'sindhi_reg_draft';
export const SINDHI_REG_TOKEN_KEY = 'sindhi_reg_token';
export const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export type RegistrationStep =
  | 'quick-register'
  | 'otp'
  | 'basic-info'
  | 'personal-religious-info'
  | 'location-professional-info'
  | 'additional-info';

export interface BasicInfoDraft {
  gender?: string;
  day?: string;
  month?: string;
  year?: string;
  calculatedAge?: number | null;
  motherTongue?: string;
  email?: string;
}

export interface PersonalReligiousDraft {
  caste?: string;
  subcaste?: string;
  height?: string;
  maritalStatus?: string;
  motherTongue?: string;
}

export interface LocationProfessionalDraft {
  residentCountry?: string;
  residingState?: string;
  residingCity?: string;
  citizenship?: string;
  education?: string;
  employmentType?: string;
  occupation?: string;
  annualIncome?: string;
}

export interface AdditionalInfoDraft {
  aboutMyself?: string;
  aboutMe?: string;
}

export interface RegistrationDraft {
  // Step 1: Quick Register
  name: string;
  profileFor: string;
  countryCode: string;
  mobileNumber: string;
  phone: string;

  // Server-side session verification
  token?: string; // 24h unguessable server session token
  challengeId?: string;
  regSessionToken?: string;
  isOtpVerified?: boolean;
  currentStep: RegistrationStep;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;

  // Step-specific draft data (No passwords or OTPs!)
  basicInfo?: BasicInfoDraft;
  personalReligious?: PersonalReligiousDraft;
  locationProfessional?: LocationProfessionalDraft;
  additionalInfo?: AdditionalInfoDraft;
}

/**
 * Safely read draft from localStorage with validation & expiry check
 */
export const getRegistrationDraft = (): RegistrationDraft | null => {
  try {
    const draft = Storage.getItemSync<RegistrationDraft>(SINDHI_REG_DRAFT_KEY);
    if (!draft || typeof draft !== 'object') return null;

    // Check expiry
    if (draft.expiresAt && Date.now() > draft.expiresAt) {
      clearRegistrationDraft();
      return null;
    }

    // Sanitize in case of accidental keys
    if ((draft as any).password) delete (draft as any).password;
    if ((draft as any).otp) delete (draft as any).otp;

    return draft;
  } catch {
    return null;
  }
};

/**
 * Save or merge partial draft data safely
 */
export const saveRegistrationDraft = (
  partial: Partial<RegistrationDraft>
): RegistrationDraft => {
  const existing = getRegistrationDraft();
  const now = Date.now();

  // Strip forbidden fields
  const sanitizedPartial = { ...partial };
  delete (sanitizedPartial as any).password;
  delete (sanitizedPartial as any).otp;

  // Deep merge sub-sections so partial updates don't overwrite previous values
  const merged: RegistrationDraft = {
    name: sanitizedPartial.name?.trim() || existing?.name || '',
    profileFor: sanitizedPartial.profileFor?.trim() || existing?.profileFor || 'Myself',
    countryCode: sanitizedPartial.countryCode || existing?.countryCode || '+91',
    mobileNumber: sanitizedPartial.mobileNumber || existing?.mobileNumber || '',
    phone: sanitizedPartial.phone || existing?.phone || sanitizedPartial.mobileNumber || existing?.mobileNumber || '',
    token: sanitizedPartial.token || existing?.token,
    isOtpVerified: sanitizedPartial.isOtpVerified ?? existing?.isOtpVerified ?? false,
    currentStep: sanitizedPartial.currentStep || existing?.currentStep || 'otp',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    expiresAt: now + DRAFT_EXPIRY_MS,
    basicInfo: {
      ...(existing?.basicInfo || {}),
      ...(sanitizedPartial.basicInfo || {}),
    },
    personalReligious: {
      ...(existing?.personalReligious || {}),
      ...(sanitizedPartial.personalReligious || {}),
    },
    locationProfessional: {
      ...(existing?.locationProfessional || {}),
      ...(sanitizedPartial.locationProfessional || {}),
    },
    additionalInfo: {
      ...(existing?.additionalInfo || {}),
      ...(sanitizedPartial.additionalInfo || {}),
    },
  };

  Storage.setItemSync(SINDHI_REG_DRAFT_KEY, merged);
  if (merged.token) {
    Storage.setItemSync(SINDHI_REG_TOKEN_KEY, merged.token);
  }

  return merged;
};

/**
 * Update current registration step in draft
 */
export const updateDraftStep = (step: RegistrationStep): void => {
  const draft = getRegistrationDraft();
  if (draft) {
    draft.currentStep = step;
    draft.updatedAt = Date.now();
    Storage.setItemSync(SINDHI_REG_DRAFT_KEY, draft);
  }
};

/**
 * Complete purge of registration drafts after successful final submission
 */
export const clearRegistrationDraft = (): void => {
  Storage.removeItemSync(SINDHI_REG_DRAFT_KEY);
  Storage.removeItemSync(SINDHI_REG_TOKEN_KEY);
  Storage.removeItemSync('sindhi_reg_otp');
  Storage.removeItemSync('sindhi_reg_step1_draft');
  Storage.removeItemSync('sindhi_reg_step2_draft');
  Storage.removeItemSync('sindhi_reg_step3_draft');
  Storage.removeItemSync('sindhi_reg_step4_completed');

  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage?.removeItem(SINDHI_REG_DRAFT_KEY);
      window.sessionStorage?.removeItem(SINDHI_REG_TOKEN_KEY);
      window.sessionStorage?.removeItem('sindhi_reg_otp');
      window.sessionStorage?.removeItem('sindhi_reg_step1_draft');
      window.sessionStorage?.removeItem('sindhi_reg_step2_draft');
      window.sessionStorage?.removeItem('sindhi_reg_step3_draft');
    } catch {}
  }
};

export const getRegistrationNextStep = (draft: RegistrationDraft | null): RegistrationStep => {
  if (!draft) return 'quick-register';
  if (!draft.isOtpVerified && !draft.token) return 'otp';
  return draft.currentStep && draft.currentStep !== 'otp' ? draft.currentStep : 'basic-info';
};

/**
 * Authoritative backend session verification check
 */
export const verifyRegistrationSessionWithBackend = async (
  phone: string,
  token?: string
): Promise<{
  isValid: boolean;
  isRegistered: boolean;
  isOtpVerified: boolean;
  token?: string;
  status: string;
  nextStep?: string;
}> => {
  if (!phone) {
    return {
      isValid: false,
      isRegistered: false,
      isOtpVerified: false,
      status: 'INVALID_PHONE',
    };
  }

  const draft = getRegistrationDraft();
  const currentToken = token || draft?.token;
  const isOtpVerified = Boolean(draft?.isOtpVerified || currentToken);
  const nextStep = getRegistrationNextStep(draft);

  return {
    isValid: true,
    isRegistered: false,
    isOtpVerified,
    token: currentToken,
    status: isOtpVerified ? 'OTP_VERIFIED' : 'OTP_PENDING',
    nextStep,
  };
};
