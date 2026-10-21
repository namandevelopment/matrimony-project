import React from 'react';
import { Shield } from 'lucide-react';
import { CustomTextInput } from '../../../components/CustomTextInput';
import type { FieldBinding } from '../../../customHooks/useInputs';

export interface MfaStepSectionProps {
  bindMfa: FieldBinding<string>;
  error?: string;
}

export const MfaStepSection: React.FC<MfaStepSectionProps> = ({
  bindMfa,
  error,
}) => {
  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
        <Shield className="w-4 h-4" />
        Two-Factor Authentication (2FA)
      </div>
      <p className="text-xs text-slate-600">
        Enter the 4-digit verification code to verify privileged access.
      </p>
      <CustomTextInput
        type="text"
        autoFocus
        maxLength={4}
        {...bindMfa}
        placeholder="1234"
        error={error}
        errorClassName="justify-center"
        size="lg"
        variant="outline"
        inputClassName="text-center tracking-widest text-2xl font-mono font-bold focus:border-rose-600 focus:ring-rose-500/20"
      />
    </div>
  );
};

export default MfaStepSection;
