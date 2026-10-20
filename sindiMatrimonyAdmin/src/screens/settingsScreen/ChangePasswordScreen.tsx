import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { getStoredUser, getSimulatedUser } from '../../storage';
import { ROLE_DEFINITIONS } from '../../utils/rbac';
import type { Role } from '../../types/auth.types';
import { toast } from '../../utils/CustomToast';
import { useInputs } from '../../customHooks/useInputs';

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  logoutOtherDevices: boolean;
  twoFactorEnabled: boolean;
}

export const ChangePasswordScreen: React.FC = () => {
  const storedUser = getStoredUser() || {
    fullName: 'Super Administrator',
    email: 'admin@sindhimarriage.in',
    role: 'SUPER_ADMIN',
  };
  const simulatedUser = getSimulatedUser();
  const currentUser = simulatedUser || storedUser;
  const userRole = (currentUser.role || 'SUPER_ADMIN') as Role;
  const roleMeta = ROLE_DEFINITIONS[userRole] || ROLE_DEFINITIONS.SUPER_ADMIN;

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    values,
    setFieldValue,
    errors,
    touched,
    bindCheckbox,
    validateForm,
    reset,
  } = useInputs<ChangePasswordFormValues>(
    {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      logoutOtherDevices: true,
      twoFactorEnabled: true,
    },
    {
      validate: (v) => {
        const errs: Partial<Record<keyof ChangePasswordFormValues, string>> = {};

        if (!v.currentPassword) {
          errs.currentPassword = 'Please enter your current password.';
        }

        const newPass = v.newPassword;
        if (!newPass) {
          errs.newPassword = 'New password is required.';
        } else if (newPass.length < 8) {
          errs.newPassword = 'New password must be at least 8 characters long.';
        } else if (v.currentPassword && v.currentPassword === newPass) {
          errs.newPassword = 'New password must be different from current password.';
        }

        if (!v.confirmPassword) {
          errs.confirmPassword = 'Please confirm your new password.';
        } else if (v.confirmPassword !== newPass) {
          errs.confirmPassword = 'New password and confirmation password do not match.';
        }

        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Password rules validation metrics
  const hasMinLength = values.newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(values.newPassword);
  const hasLowercase = /[a-z]/.test(values.newPassword);
  const hasNumber = /[0-9]/.test(values.newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(values.newPassword);
  const isMatch = values.newPassword.length > 0 && values.newPassword === values.confirmPassword;

  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  const getFieldError = (field: keyof ChangePasswordFormValues) => {
    return touched[field] || submitted ? errors[field] : undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      const firstErr = errors.currentPassword || errors.newPassword || errors.confirmPassword;
      if (firstErr) {
        setErrorMessage(firstErr);
        toast.warning(firstErr);
      }
      return;
    }

    if (strengthScore < 4) {
      const err = 'Please create a stronger password adhering to security guidelines.';
      setErrorMessage(err);
      toast.warning(err);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const msg = 'Password updated successfully! Your account credentials have been refreshed.';
      setSuccessMessage(msg);
      toast.success(msg);
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        logoutOtherDevices: values.logoutOtherDevices,
        twoFactorEnabled: values.twoFactorEnabled,
      });
      setSubmitted(false);
    }, 800);
  };

  const handleCancel = () => {
    reset();
    setSubmitted(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Change Password & Security"
        description="Manage your portal account credentials, multi-factor authentication, and security preferences"
      />

      {/* User Identity Pill Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#88131B] to-[#DB2F3C] flex items-center justify-center text-white text-lg font-bold shadow-xs">
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {currentUser.fullName || 'Admin User'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.badgeBg} ${roleMeta.badgeText} ${roleMeta.badgeBorder}`}
              >
                {roleMeta.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.email || 'admin@sindhimarriage.in'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Last password changed: <strong>14 days ago</strong>
          </span>
        </div>
      </div>

      {/* Alert Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Password Change Form (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <div className="flex items-center gap-2.5 pb-5 border-b border-slate-100 mb-6">
            <div className="p-2 rounded-xl bg-red-50 text-[#DB2F3C]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Update Password</h2>
              <p className="text-xs text-slate-500">
                Enter your existing password and choose a strong new one
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Current Password */}
            <CustomTextInput
              label="Current Password"
              required={true}
              type="password"
              value={values.currentPassword}
              onChange={(e) => setFieldValue('currentPassword', e.target.value)}
              placeholder="Enter current portal password"
              error={getFieldError('currentPassword')}
              leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              size="sm"
            />

            {/* New Password */}
            <div>
              <CustomTextInput
                label="New Password"
                required={true}
                type="password"
                value={values.newPassword}
                onChange={(e) => setFieldValue('newPassword', e.target.value)}
                placeholder="Enter strong new password"
                error={getFieldError('newPassword')}
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                size="sm"
              />

              {/* Password Strength Meter */}
              {values.newPassword.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Password Strength:</span>
                    <span
                      className={`font-bold ${
                        strengthScore <= 2
                          ? 'text-rose-600'
                          : strengthScore === 3
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {strengthScore <= 2 ? 'Weak' : strengthScore === 3 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full flex-1 transition-all rounded-full ${
                        strengthScore >= 1
                          ? strengthScore <= 2
                            ? 'bg-rose-500'
                            : strengthScore === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 transition-all rounded-full ${
                        strengthScore >= 3
                          ? strengthScore === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-full flex-1 transition-all rounded-full ${
                        strengthScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <CustomTextInput
              label="Confirm New Password"
              required={true}
              type="password"
              value={values.confirmPassword}
              onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
              placeholder="Re-type new password"
              error={
                getFieldError('confirmPassword') ||
                (values.confirmPassword && !isMatch ? 'Passwords do not match.' : undefined)
              }
              leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              size="sm"
            />

            {/* Additional Security Options */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  {...bindCheckbox('logoutOtherDevices')}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] border-slate-300"
                />
                <span>Sign out from all other active browser sessions & devices</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  {...bindCheckbox('twoFactorEnabled')}
                  className="w-4 h-4 rounded text-[#DB2F3C] focus:ring-[#DB2F3C] border-slate-300"
                />
                <span>Require 2-Factor OTP verification on future logins</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <CustomButton
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </CustomButton>

              <CustomButton
                type="submit"
                variant="primary"
                isLoading={loading}
              >
                Update Password
              </CustomButton>
            </div>
          </form>
        </div>

        {/* Sidebar Info & Password Guidelines (1 Column) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Password Guidelines
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              To protect member data and CRM operations, your password must meet the following enterprise criteria:
            </p>

            <ul className="space-y-2 text-xs">
              <li
                className={`flex items-center gap-2 transition ${
                  hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    hasMinLength ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
                <span>At least 8 characters long</span>
              </li>
              <li
                className={`flex items-center gap-2 transition ${
                  hasUppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    hasUppercase ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
                <span>At least one uppercase letter (A-Z)</span>
              </li>
              <li
                className={`flex items-center gap-2 transition ${
                  hasLowercase ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    hasLowercase ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
                <span>At least one lowercase letter (a-z)</span>
              </li>
              <li
                className={`flex items-center gap-2 transition ${
                  hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    hasNumber ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
                <span>At least one number (0-9)</span>
              </li>
              <li
                className={`flex items-center gap-2 transition ${
                  hasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    hasSpecial ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
                <span>At least one special character (!@#$%^&*)</span>
              </li>
            </ul>
          </div>

          {/* Active Devices / Sessions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Sessions
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Current
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                  <span>Chrome / macOS</span>
                  <span className="text-[10px] text-emerald-600 font-bold">This Device</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>IP: 192.168.1.1 (Mumbai)</span>
                  <span>Active now</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs opacity-75">
                <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                  <span>Safari / iOS</span>
                  <span className="text-[10px] text-slate-400">Mobile</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>IP: 114.143.2.80 (Delhi)</span>
                  <span>Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordScreen;
