import React, { useState } from 'react';
import {
  Save,
  Globe,
  Heart,
  Lock,
  Receipt,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useInputs } from '../../customHooks/useInputs';
import { toast } from '../../toastMessage/toast';
import { biodataService } from '../../services/biodataService';
import type {
  BiodataConfigSettings,
  BiodataTemplateId,
  BiodataPrivacyMode,
  ReligiousMotif,
} from '../../types/biodata.types';

const STORAGE_KEY_MASTER_SETTINGS = 'sm_admin_master_settings_v1';

export interface MasterSettingsState {
  // Identity
  portalName: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  headOffice: string;

  // Matchmaking
  maxAgeDifference: number;
  minGroomAge: number;
  minBrideAge: number;
  strictGotraExogamy: boolean;
  horoscopeMode: 'MANDATORY' | 'OPTIONAL' | 'OFF';
  dailyRecommendationLimit: number;

  // Privacy & Safeguards
  photoWatermarking: boolean;
  blurPhotosUnpaid: boolean;
  mandatoryKycPublishing: boolean;
  mobileMaskingStyle: 'PARTIAL' | 'STRICT';
  allowAppScreenshots: boolean;

  // Finance & Tax
  currency: string;
  gstRate: number;
  autoInvoicing: boolean;
  refundWindowDays: number;

  // Gateway IDs
  smsSenderId: string;
  smtpHost: string;
  whatsappApiActive: boolean;
}

const DEFAULT_SETTINGS: MasterSettingsState = {
  portalName: 'Sindhi Matrimony Admin Portal',
  supportPhone: '+91 98765 43210',
  supportWhatsapp: '+91 98765 43210',
  supportEmail: 'admin@sindhimatrimony.com',
  headOffice: 'Bandra West, Mumbai, Maharashtra 400050',

  maxAgeDifference: 5,
  minGroomAge: 21,
  minBrideAge: 18,
  strictGotraExogamy: true,
  horoscopeMode: 'OPTIONAL',
  dailyRecommendationLimit: 10,

  photoWatermarking: true,
  blurPhotosUnpaid: true,
  mandatoryKycPublishing: true,
  mobileMaskingStyle: 'PARTIAL',
  allowAppScreenshots: false,

  currency: 'INR (₹)',
  gstRate: 18,
  autoInvoicing: true,
  refundWindowDays: 7,

  smsSenderId: 'SINDHI',
  smtpHost: 'smtp.sendgrid.net',
  whatsappApiActive: true,
};

export const MasterSettingsScreen: React.FC = () => {
  const {
    values: settings,
    setFieldValue: update,
    setValues: setAllSettings,
  } = useInputs<MasterSettingsState>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MASTER_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const {
    values: biodataSettings,
    setFieldValue: updateBiodata,
    setValues: setAllBiodataSettings,
  } = useInputs<BiodataConfigSettings>(() => biodataService.getSettings());

  const [activeSection, setActiveSection] = useState<
    'all' | 'identity' | 'matching' | 'privacy' | 'finance' | 'biodata'
  >('all');

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_MASTER_SETTINGS, JSON.stringify(settings));
        biodataService.updateSettings(biodataSettings);
        setIsSaving(false);
        toast.success('Master Settings & Biodata configurations applied successfully.');
      } catch {
        setIsSaving(false);
        toast.error('Failed to save settings.');
      }
    }, 400);
  };

  const handleReset = () => {
    if (window.confirm('Reset Master Settings to factory defaults?')) {
      setAllSettings(DEFAULT_SETTINGS);
      localStorage.removeItem(STORAGE_KEY_MASTER_SETTINGS);
      setAllBiodataSettings(biodataService.getSettings());
      toast.success('Reset to standard platform defaults.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Platform Settings"
        description="Global configuration engine: Portal identity, algorithmic matchmaking parameters, photo privacy watermarking, GST & billing defaults."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <CustomButton
              variant="primary"
              size="md"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={() => handleSave()}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Master Changes'}
            </CustomButton>
          </div>
        }
      />

      {/* Section Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'all'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Settings
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('identity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'identity'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Platform Identity
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('matching')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'matching'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Matchmaking Rules
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('privacy')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'privacy'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Privacy & Watermarking
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('finance')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'finance'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Financial & GST
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('biodata')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'biodata'
              ? 'bg-[#C81E28] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>WhatsApp Biodata</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ================= SECTION 1: IDENTITY ================= */}
        {(activeSection === 'all' || activeSection === 'identity') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#C81E28] flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Platform Identity & Public Helplines</h3>
                  <p className="text-xs text-slate-500">Official contact touchpoints displayed across customer portals and invoices.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomTextInput
                label="Platform Brand Title"
                type="text"
                value={settings.portalName}
                onChange={(e) => update('portalName', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="Official Support Phone"
                type="text"
                value={settings.supportPhone}
                onChange={(e) => update('supportPhone', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="Official WhatsApp Helpline"
                type="text"
                value={settings.supportWhatsapp}
                onChange={(e) => update('supportWhatsapp', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="Executive Notification Email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update('supportEmail', e.target.value)}
                size="sm"
              />

              <div className="md:col-span-2">
                <CustomTextInput
                  label="Registered Headquarters Address"
                  type="text"
                  value={settings.headOffice}
                  onChange={(e) => update('headOffice', e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: MATCHMAKING ================= */}
        {(activeSection === 'all' || activeSection === 'matching') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Matchmaking Engine Parameters</h3>
                  <p className="text-xs text-slate-500">Core parameters governing automated match curation, age limits & gotra rules.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomTextInput
                label="Max Age Difference (Years)"
                type="number"
                min={1}
                max={20}
                value={settings.maxAgeDifference}
                onChange={(e) => update('maxAgeDifference', Number(e.target.value) || 5)}
                size="sm"
              />

              <CustomTextInput
                label="Min Groom Age"
                type="number"
                min={21}
                max={50}
                value={settings.minGroomAge}
                onChange={(e) => update('minGroomAge', Number(e.target.value) || 21)}
                size="sm"
              />

              <CustomTextInput
                label="Min Bride Age"
                type="number"
                min={18}
                max={50}
                value={settings.minBrideAge}
                onChange={(e) => update('minBrideAge', Number(e.target.value) || 18)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-bold text-slate-900">Strict Gotra Exogamy Rule</p>
                  <p className="text-[11px] text-slate-500">Block recommendations when bride & groom share the same gotra.</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('strictGotraExogamy', !settings.strictGotraExogamy)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.strictGotraExogamy ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      settings.strictGotraExogamy ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <CustomDropDown
                  label="Kundali / Horoscope Matching"
                  helperText="Require Manglik dosha & Guna Milan checking."
                  value={settings.horoscopeMode}
                  onChange={(val) => update('horoscopeMode', val as any)}
                  size="sm"
                  options={[
                    { label: 'Optional', value: 'OPTIONAL' },
                    { label: 'Mandatory', value: 'MANDATORY' },
                    { label: 'Disabled', value: 'OFF' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: PRIVACY ================= */}
        {(activeSection === 'all' || activeSection === 'privacy') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Photo Privacy & Safeguards</h3>
                  <p className="text-xs text-slate-500">Prevent image misuse, enforce watermark stamps and Aadhaar KYC gating.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto Watermark Member Photos</p>
                  <p className="text-[11px] text-slate-500">Embeds &quot;Sindhi Matrimony&quot; semi-transparent watermark logo on all uploaded photos.</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('photoWatermarking', !settings.photoWatermarking)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.photoWatermarking ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      settings.photoWatermarking ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-bold text-slate-900">Blur Photos for Unpaid Visitors</p>
                  <p className="text-[11px] text-slate-500">Free members must subscribe to Gold/Platinum tier to view clear portrait photos.</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('blurPhotosUnpaid', !settings.blurPhotosUnpaid)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.blurPhotosUnpaid ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      settings.blurPhotosUnpaid ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <div>
                  <p className="text-xs font-bold text-slate-900">Mandatory KYC Before Profile Publishing</p>
                  <p className="text-[11px] text-slate-500">Requires verified Aadhaar document before profile is visible to other members.</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('mandatoryKycPublishing', !settings.mandatoryKycPublishing)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.mandatoryKycPublishing ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      settings.mandatoryKycPublishing ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                <CustomDropDown
                  label="Mobile Number Masking"
                  helperText="Masks candidate phone numbers (+91 98****3210) for relationship executives."
                  value={settings.mobileMaskingStyle}
                  onChange={(val) => update('mobileMaskingStyle', val as any)}
                  size="sm"
                  options={[
                    { label: 'Partial Mask (Middle 4)', value: 'PARTIAL' },
                    { label: 'Strict Mask (6 Digits)', value: 'STRICT' },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: FINANCE ================= */}
        {(activeSection === 'all' || activeSection === 'finance') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Financial, GST & Invoicing Defaults</h3>
                  <p className="text-xs text-slate-500">Tax compliance parameters and automated receipt delivery rules.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CustomTextInput
                label="Standard GST Rate (%)"
                type="number"
                min={0}
                max={28}
                value={settings.gstRate}
                onChange={(e) => update('gstRate', Number(e.target.value) || 18)}
                size="sm"
              />

              <CustomTextInput
                label="Base Currency"
                type="text"
                value={settings.currency}
                onChange={(e) => update('currency', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="Refund Request Window (Days)"
                type="number"
                min={1}
                max={30}
                value={settings.refundWindowDays}
                onChange={(e) => update('refundWindowDays', Number(e.target.value) || 7)}
                size="sm"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 max-w-md">
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto-Generate Invoices & GST Bills</p>
                  <p className="text-[11px] text-slate-500">Dispatches PDF invoices immediately upon payment confirmation.</p>
                </div>
                <button
                  type="button"
                  onClick={() => update('autoInvoicing', !settings.autoInvoicing)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    settings.autoInvoicing ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      settings.autoInvoicing ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Biodata PDF & WhatsApp Engine */}
        {(activeSection === 'all' || activeSection === 'biodata') && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">WhatsApp Biodata PDF & Branding Engine</h3>
                <p className="text-xs text-slate-500">Configure global PDF template defaults, privacy gating rules, and branding header.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <CustomDropDown
                label="Default Template Style"
                value={biodataSettings.defaultTemplate}
                onChange={(val) => updateBiodata('defaultTemplate', val as BiodataTemplateId)}
                size="sm"
                options={[
                  { label: 'Traditional (Royal Maroon & Gold Borders)', value: 'TRADITIONAL' },
                  { label: 'Modern Minimal (Contemporary Ruby & Slate)', value: 'MODERN_MINIMAL' },
                ]}
              />

              <CustomDropDown
                label="Default Privacy Mode"
                value={biodataSettings.defaultPrivacyMode}
                onChange={(val) => updateBiodata('defaultPrivacyMode', val as BiodataPrivacyMode)}
                size="sm"
                options={[
                  { label: 'Blind Biodata (Mask Phone, Email & Address)', value: 'BLIND' },
                  { label: 'Full Biodata (Include Verified Contact Details)', value: 'FULL' },
                ]}
              />

              <CustomDropDown
                label="Default Auspicious Motif"
                value={biodataSettings.defaultMotif}
                onChange={(val) => updateBiodata('defaultMotif', val as ReligiousMotif)}
                size="sm"
                options={[
                  { label: 'ॐ Om', value: 'OM' },
                  { label: '卐 Ganesh Shlok / Mangal', value: 'GANESH_SHLOK' },
                  { label: '卐 Swastik', value: 'SWASTIK' },
                  { label: 'None (Secular)', value: 'NONE' },
                ]}
              />

              <div className="md:col-span-2">
                <CustomTextInput
                  label="Confidentiality Tagline in Footer"
                  type="text"
                  value={biodataSettings.footerText}
                  onChange={(e) => updateBiodata('footerText', e.target.value)}
                  size="sm"
                />
              </div>

              <div>
                <CustomTextInput
                  label="Hotline Helpline Phone"
                  type="text"
                  value={biodataSettings.supportPhone}
                  onChange={(e) => updateBiodata('supportPhone', e.target.value)}
                  size="sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 max-w-md">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enable Confidential Watermark</p>
                  <p className="text-[11px] text-slate-500">Prints subtle security watermark to prevent unauthorized offline distribution.</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateBiodata('watermarkEnabled', !biodataSettings.watermarkEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    biodataSettings.watermarkEnabled ? 'bg-[#C81E28]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                      biodataSettings.watermarkEnabled ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel & Reset
          </button>
          <CustomButton
            variant="primary"
            size="md"
            icon={<Save className="w-3.5 h-3.5" />}
            disabled={isSaving}
          >
            {isSaving ? 'Saving Master Settings...' : 'Save & Apply Master Settings'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default MasterSettingsScreen;
