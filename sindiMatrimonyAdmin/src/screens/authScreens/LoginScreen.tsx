import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setToken, setStoredUser, clearSimulatedUser } from '../../storage';
import { toast } from '../../toastMessage/toast';
import { useInputs } from '../../customHooks/useInputs';
import { CustomTextInput } from '../../components/CustomTextInput';
import { emailPattern, isSafeInput } from '../../utils/ValidationsFuctions';
import { LoginBrandHero, CaptchaBox, MfaStepSection } from './component';
import { crmDataService } from '../../services/crmDataService';
import { getDefaultAllowedSectionsForRole } from '../../utils/rbac';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
  mfaCode: string;
  isCaptchaVerified: boolean;
  captchaLoading: boolean;
  loading: boolean;
  mfaStep: boolean;
  submitted: boolean;
  errorMessage: string;
}

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    bind,
    bindCheckbox,
    setFieldValue,
    setValues,
    validateForm,
  } = useInputs<LoginFormValues>(
    {
      email: 'admin@sindhimarriage.in',
      password: 'Admin@1234',
      rememberMe: true,
      mfaCode: '',
      isCaptchaVerified: false,
      captchaLoading: false,
      loading: false,
      mfaStep: false,
      submitted: false,
      errorMessage: '',
    },
    {
      validate: (v) => {
        const errs: Partial<Record<keyof LoginFormValues, string>> = {};
        const trimmedEmail = v.email.trim();
        if (!trimmedEmail) {
          errs.email = 'Please enter your email.';
        } else if (!isSafeInput(trimmedEmail)) {
          errs.email = 'Email contains invalid characters.';
        } else if (!emailPattern.test(trimmedEmail)) {
          errs.email = 'Please enter a valid email address.';
        }

        if (!v.password) {
          errs.password = 'Please enter your password.';
        } else if (v.password.length < 6) {
          errs.password = 'Password must be at least 6 characters.';
        }

        if (v.mfaStep) {
          const trimmedMfa = v.mfaCode.trim();
          if (!trimmedMfa) {
            errs.mfaCode = 'Please enter the 6-digit TOTP code.';
          } else if (trimmedMfa.length !== 6 || !/^\d{6}$/.test(trimmedMfa)) {
            errs.mfaCode = 'Verification code must be exactly 6 numeric digits.';
          }
        }

        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const getFieldError = (field: keyof LoginFormValues) => {
    return touched[field] || values.submitted ? errors[field] : undefined;
  };

  const handleCaptchaClick = () => {
    if (values.isCaptchaVerified) return;
    setFieldValue('captchaLoading', true);
    setTimeout(() => {
      setValues({
        captchaLoading: false,
        isCaptchaVerified: true,
        errorMessage: '',
      });
      toast.success('Security captcha verified successfully');
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldValue('submitted', true);

    if (!validateForm()) {
      const firstErr = errors.email || errors.password || errors.mfaCode;
      if (firstErr) {
        toast.warning(firstErr);
      }
      return;
    }

    if (!values.isCaptchaVerified) {
      setFieldValue('errorMessage', 'Please verify that you are not a robot.');
      toast.warning('Please verify that you are not a robot.');
      return;
    }
    setValues({
      errorMessage: '',
      loading: true,
    });

    setTimeout(() => {
      setFieldValue('loading', false);
      const cleanEmail = values.email.trim();
      const matchedEmployee = crmDataService.getEmployeeByEmail(cleanEmail);

      // If Super Admin role, require 2FA/MFA security step
      if (!values.mfaStep && (cleanEmail.includes('admin') || matchedEmployee?.role === 'SUPER_ADMIN')) {
        setValues({
          mfaStep: true,
          submitted: false,
        });
        toast.info('Super Admin MFA verification code required');
      } else {
        clearSimulatedUser();

        let loggedInUser: any;
        if (matchedEmployee) {
          loggedInUser = {
            id: matchedEmployee.id,
            employeeId: matchedEmployee.employeeId,
            fullName: matchedEmployee.fullName,
            email: matchedEmployee.email,
            mobile: matchedEmployee.mobile,
            role: matchedEmployee.role,
            department: matchedEmployee.department,
            recordScope: matchedEmployee.recordScope,
            permissions: matchedEmployee.permissions,
            allowedSections: matchedEmployee.allowedSections || getDefaultAllowedSectionsForRole(matchedEmployee.role),
            isChatEnabled: matchedEmployee.isChatEnabled,
          };
          toast.success(`Login successful! Welcome ${matchedEmployee.fullName} (${loggedInUser.allowedSections.length} sidebar sections accessible).`);
        } else {
          const isSuper = cleanEmail.includes('admin');
          const defaultRole = isSuper ? 'SUPER_ADMIN' : 'EMPLOYEE';
          loggedInUser = {
            id: `emp_${Date.now()}`,
            employeeId: isSuper ? 'EMP001' : 'EMP_USER',
            fullName: isSuper ? 'Super Administrator' : 'Office Employee',
            email: cleanEmail,
            role: defaultRole,
            department: isSuper ? 'Executive Management' : 'Sales & CRM',
            recordScope: isSuper ? 'ALL' : 'OWN',
            isChatEnabled: true,
            allowedSections: getDefaultAllowedSectionsForRole(defaultRole as any),
            permissions: {
              leads: { view: true, edit: true, call: true },
              members: { view: true },
              chat: { receive: true, initiate: true },
            },
          };
          toast.success(`Login successful! Logged in as ${loggedInUser.fullName}.`);
        }

        setToken(`mock_jwt_${loggedInUser.employeeId}_token_2026`);
        setStoredUser(loggedInUser);
        navigate('/');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white">
      {/* ================= LEFT SIDE: WEDDING BRAND HERO ================= */}
      <LoginBrandHero />

      {/* ================= RIGHT SIDE: ADMIN LOGIN FORM ================= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 min-h-[calc(100vh-16rem)] lg:min-h-screen">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin & Staff Login
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Sign in with your organization account to access your assigned sections
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Test Accounts (Role & Sidebar Access Demo):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setValues({
                    email: 'admin@sindhimarriage.in',
                    password: 'Admin@1234',
                    isCaptchaVerified: true,
                    mfaStep: false,
                    mfaCode: '',
                    errorMessage: '',
                  });
                  toast.info('Selected: Super Admin (All 19 Sections)');
                }}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
              >
                👑 Super Admin (All Access)
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    email: 'amit.b@sindhimarriage.in',
                    password: 'Admin@1234',
                    isCaptchaVerified: true,
                    mfaStep: false,
                    mfaCode: '',
                    errorMessage: '',
                  });
                  toast.info('Selected: Amit Bajaj (3 Sections: Leads, Calls, Tasks)');
                }}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
              >
                🎯 Amit Bajaj (3 Sections)
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    email: 'priya.s@sindhimarriage.in',
                    password: 'Admin@1234',
                    isCaptchaVerified: true,
                    mfaStep: false,
                    mfaCode: '',
                    errorMessage: '',
                  });
                  toast.info('Selected: Priya Sharma (CRM Manager - 10 Sections)');
                }}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
              >
                👩 Priya Sharma (CRM Manager)
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    email: 'meena.a@sindhimarriage.in',
                    password: 'Admin@1234',
                    isCaptchaVerified: true,
                    mfaStep: false,
                    mfaCode: '',
                    errorMessage: '',
                  });
                  toast.info('Selected: Meena Advani (2 Sections: Verifications, Search)');
                }}
                className="px-2 py-1 text-[11px] font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition cursor-pointer"
              >
                ⚖️ Meena Advani (2 Sections)
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-4 pt-1">
            {!values.mfaStep ? (
              <>
                {/* Email Input */}
                <CustomTextInput
                  type="email"
                  placeholder="john@example.com"
                  {...bind('email')}
                  error={getFieldError('email')}
                  size="lg"
                  variant="outline"
                  inputClassName="focus:border-orange-500 focus:ring-orange-500/20"
                />

                {/* Password Input with Show/Hide Toggle */}
                <CustomTextInput
                  type="password"
                  placeholder="Password"
                  {...bind('password')}
                  error={getFieldError('password')}
                  size="lg"
                  variant="outline"
                  inputClassName="focus:border-orange-500 focus:ring-orange-500/20"
                />

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    id="rememberMe"
                    {...bindCheckbox('rememberMe')}
                    className="w-4 h-4 rounded text-orange-500 border-slate-300 focus:ring-orange-400 cursor-pointer"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs font-medium text-slate-700 select-none cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>

                {/* reCAPTCHA Box */}
                <CaptchaBox
                  isVerified={values.isCaptchaVerified}
                  isLoading={values.captchaLoading}
                  onVerify={handleCaptchaClick}
                  errorMessage={values.errorMessage}
                />
              </>
            ) : (
              /* MFA / TOTP Step */
              <MfaStepSection
                bindMfa={bind('mfaCode')}
                error={getFieldError('mfaCode')}
              />
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={values.loading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wide bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {values.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : values.mfaStep ? (
                  <div className="flex items-center gap-2">
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 text-center text-[11px] text-slate-400">
            Protected by Sindhi Matrimony Enterprise Security & Role-Based Access Control.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
