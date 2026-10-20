// System & Generic Messages
export const SUCCESS = "SUCCESS";
export const SUCCESS_MSG = "Success.";
export const FAILED = "FAILURE";
export const FAILED_MSG =
  "There was an issue processing your request. Please check your input and try again.";
export const SERVER_ERROR =
  "An internal server error occurred while processing your request. Please try again.";
export const TOO_MANY_ATTEMPTS = "Too many requests. Please try again after some time.";
export const DATA_NOT_FOUND = "Requested data not found.";
export const RECORD_FOUND = "Data retrieved successfully.";
export const USER_NOT_FOUND = "User account not found with the provided details.";
export const PROFILE_NOT_FOUND = "Candidate profile not found.";
export const MISSING_FIELDS = "Missing required fields.";
export const INVALID_SIGNATURE = "Invalid security signature.";
export const UNAUTHORIZED_ACCESS = "You are not authorized to perform this action.";
export const ACCESS_DENIED = "You do not have permission to access this resource.";
export const DUPLICATE_CANDIDATE = "A candidate with identical details (Name, DOB, Gender, Subcaste) is already registered.";
export const MAX_PROFILE_LIMIT_REACHED = "Maximum profile limit reached. You cannot create more profiles under this account.";
export const MAINTENANCE_ACTIVE = "The system is currently undergoing scheduled maintenance. Please check back shortly.";

// File & Media Messages
export const INVALID_FILE_TYPE = "Invalid file type. Please upload a supported format (JPEG, PNG, WEBP, PDF).";
export const FILE_REQUIRED = "Please upload a file.";
export const FILE_TOO_LARGE = "The uploaded file exceeds the maximum allowed size.";
export const UPLOAD_FILE_SUCCESS = "File uploaded successfully.";
export const FILE_UPLOAD_FAILED = "File upload failed. Please try again.";

// Authentication & Account Messages
export const ACCOUNT_DISABLED = "Your account has been deactivated. Please contact support.";
export const ACCOUNT_SUSPENDED = "Your account has been suspended due to policy violations.";
export const STRONG_PASSWORD_ERROR =
  "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
export const INVALID_PASSWORD = "Incorrect password. Please enter the correct password to continue.";
export const INVALID_EMAIL = "No account found with the provided email. Please check and try again.";
export const INVALID_PHONE = "Please provide a valid 10-digit Indian mobile number.";
export const INVALID_OTP = "The OTP entered is invalid. Please try again.";
export const OTP_EXPIRED = "The OTP has expired. Please request a new one.";
export const OTP_VERIFIED = "OTP verified successfully.";
export const OTP_SENT_PHONE = "A 4-digit verification code has been sent to your mobile number.";
export const RESEND_OTP_SUCCESS = "A new verification code has been sent.";
export const REGISTRATION_SUCCESS = "Registration successful. Welcome to Sindhi Matrimony!";
export const LOGIN_SUCCESS = "Login successful.";
export const LOGOUT_SUCCESS = "You have been logged out successfully.";
export const PASSWORD_RESET_SUCCESS = "Password has been updated successfully.";

// Leads & CRM Pipeline Messages
export const LEAD_CREATED = "Lead received successfully. Our matchmaker will contact you shortly.";
export const LEAD_UPDATED = "Lead details updated successfully.";
export const LEAD_ASSIGNED = "Lead successfully assigned to telecaller.";
export const LEAD_CONVERTED = "Lead successfully converted to verified member.";

// Matrimonial Profile & Onboarding Messages
export const PROFILE_FETCH_SUCCESS = "Profile fetched successfully.";
export const PROFILE_SAVED = "Profile details saved successfully.";
export const PROFILE_UPDATED = "Profile updated successfully.";
export const ONBOARDING_STEP_SAVED = "Onboarding step saved successfully.";
export const PHOTO_UPLOADED = "Profile photo uploaded successfully.";
export const PHOTO_DELETED = "Profile photo deleted successfully.";
export const PREFERENCES_SAVED = "Partner preferences updated successfully.";

// Matchmaking & Kundli Messages
export const RECOMMENDATIONS_FETCHED = "Match recommendations retrieved successfully.";
export const INTEREST_SENT = "Interest proposal sent successfully.";
export const INTEREST_ACCEPTED = "Congratulations! Mutual interest has been accepted.";
export const INTEREST_DECLINED = "Interest declined.";
export const HOROSCOPE_CALCULATED = "Kundli Milan 36-Gunas calculated successfully.";

// KYC & Verification Messages
export const KYC_SUBMITTED = "KYC documents submitted for moderation. Review takes up to 24 hours.";
export const KYC_APPROVED = "Candidate identity verified successfully. Green Shield badge awarded.";
export const KYC_REJECTED = "KYC verification rejected with specified reason code.";

// Membership Plans & Billing Messages
export const PLANS_FETCHED = "Membership packages retrieved successfully.";
export const RAZORPAY_ORDER_CREATED = "Payment order initiated successfully.";
export const PAYMENT_VERIFIED = "Payment verified successfully. Membership plan activated!";
export const REFUND_REQUESTED = "Refund request submitted for managerial review.";
export const REFUND_PROCESSED = "Refund approved and processed to source account.";

// WatermelonDB Sync Messages
export const SYNC_PULL_SUCCESS = "Delta synchronization pull completed successfully.";
export const SYNC_PUSH_SUCCESS = "Offline changes merged successfully.";
