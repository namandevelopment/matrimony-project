import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Mail,
  Phone,
  ShieldAlert,
  Save,
  CheckCircle2,
  Building,
  Plus,
  Trash2,
  Edit3,
  Search,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from '../../../utils/CustomToast';
import { useInputs } from '../../../customHooks/useInputs';
import { emailPattern, isSafeInput } from '../../../utils/ValidationsFuctions';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import {
  casteReligionService,
  type ReligionMaster,
  type CasteMaster,
} from '../../../services/casteReligionService';
import { getStoredUser, getSimulatedUser, getActiveRole } from '../../../storage';

export interface AdminConfigValues {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  headquartersCity: string;
  enableOtpLogin: boolean;
  autoApproveProfiles: boolean;
  maintenanceMode: boolean;
}

export const AdminConfigSection: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Current session & role check
  const storedUser = getStoredUser();
  const simulatedUser = getSimulatedUser();
  const activeRoleOverride = getActiveRole();
  const effectiveUser = simulatedUser || storedUser;
  const effectiveRole = activeRoleOverride || effectiveUser?.role || 'SUPER_ADMIN';
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  // Sub-tab for Master management: 'CONFIG' | 'RELIGIONS' | 'CASTES'
  const [activeSubTab, setActiveSubTab] = useState<'CONFIG' | 'RELIGIONS' | 'CASTES'>('CONFIG');

  // Religion & Caste state synced with casteReligionService
  const [religions, setReligions] = useState<ReligionMaster[]>(() => casteReligionService.getReligions());
  const [castes, setCastes] = useState<CasteMaster[]>(() => casteReligionService.getCastes());

  // Search & Filter states
  const [religionSearch, setReligionSearch] = useState('');
  const [casteSearch, setCasteSearch] = useState('');
  const [selectedReligionFilter, setSelectedReligionFilter] = useState('ALL');

  // Modals state for Religion
  const [isAddReligionModalOpen, setIsAddReligionModalOpen] = useState(false);
  const [editingReligion, setEditingReligion] = useState<ReligionMaster | null>(null);

  const {
    values: religionForm,
    setFieldValue: setReligionField,
    reset: resetReligionForm,
    errors: religionErrors,
    touched: religionTouched,
    validateForm: validateReligionForm,
  } = useInputs<{ name: string; description: string; active: boolean }>(
    { name: '', description: '', active: true },
    {
      validate: (vals) => {
        if (!vals.name.trim()) return { name: 'Religion name is required.' };
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Modals state for Caste
  const [isAddCasteModalOpen, setIsAddCasteModalOpen] = useState(false);
  const [editingCaste, setEditingCaste] = useState<CasteMaster | null>(null);

  const {
    values: casteForm,
    setFieldValue: setCasteField,
    reset: resetCasteForm,
    errors: casteErrors,
    touched: casteTouched,
    validateForm: validateCasteForm,
  } = useInputs<{ name: string; religionId: string; description: string; active: boolean }>(
    { name: '', religionId: 'rel_1', description: '', active: true },
    {
      validate: (vals) => {
        const errs: Partial<Record<'name' | 'religionId', string>> = {};
        if (!vals.name.trim()) errs.name = 'Caste name is required.';
        if (!vals.religionId) errs.religionId = 'Please select a mapped religion.';
        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'RELIGION' | 'CASTE'; id: string; name: string } | null>(null);

  // Subscribe to reactive updates from casteReligionService
  useEffect(() => {
    const unsub = casteReligionService.subscribe(() => {
      setReligions(casteReligionService.getReligions());
      setCastes(casteReligionService.getCastes());
    });
    return unsub;
  }, []);

  const {
    values,
    setFieldValue,
    errors,
    touched,
    bindCheckbox,
    validateForm,
  } = useInputs<AdminConfigValues>(
    {
      siteName: 'Sindhi Matrimony Official',
      supportPhone: '+91 98765 43210',
      supportEmail: 'support@sindhimarriage.in',
      headquartersCity: 'Mumbai / Ahmedabad',
      enableOtpLogin: true,
      autoApproveProfiles: false,
      maintenanceMode: false,
    },
    {
      validate: (v) => {
        const errs: Partial<Record<keyof AdminConfigValues, string>> = {};

        if (!v.siteName.trim()) {
          errs.siteName = 'Portal title is required.';
        } else if (!isSafeInput(v.siteName)) {
          errs.siteName = 'Portal title contains invalid characters.';
        }

        const phoneDigits = v.supportPhone.replace(/\D/g, '');
        if (!v.supportPhone.trim()) {
          errs.supportPhone = 'Helpline phone number is required.';
        } else if (phoneDigits.length < 10) {
          errs.supportPhone = 'Phone number must have at least 10 digits.';
        }

        const trimmedEmail = v.supportEmail.trim();
        if (!trimmedEmail) {
          errs.supportEmail = 'Support email address is required.';
        } else if (!emailPattern.test(trimmedEmail)) {
          errs.supportEmail = 'Please enter a valid support email address.';
        }

        if (!v.headquartersCity.trim()) {
          errs.headquartersCity = 'Headquarters city is required.';
        }

        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const getFieldError = (field: keyof AdminConfigValues) => {
    return touched[field] || submitted ? errors[field] : undefined;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      const firstErr = errors.siteName || errors.supportPhone || errors.supportEmail || errors.headquartersCity;
      if (firstErr) {
        toast.warning(firstErr);
      }
      return;
    }

    setSaved(true);
    toast.success('Admin portal configuration updated successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  // Filtered Religions
  const filteredReligions = useMemo(() => {
    if (!religionSearch.trim()) return religions;
    const q = religionSearch.toLowerCase().trim();
    return religions.filter(
      (r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))
    );
  }, [religions, religionSearch]);

  // Filtered Castes
  const filteredCastes = useMemo(() => {
    return castes.filter((c) => {
      if (selectedReligionFilter !== 'ALL' && c.religionId !== selectedReligionFilter) {
        return false;
      }
      if (casteSearch.trim()) {
        const q = casteSearch.toLowerCase().trim();
        return (
          c.name.toLowerCase().includes(q) ||
          c.religionName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [castes, selectedReligionFilter, casteSearch]);

  // Open Add Religion
  const handleOpenAddReligion = () => {
    setEditingReligion(null);
    resetReligionForm({ name: '', description: '', active: true });
    setIsAddReligionModalOpen(true);
  };

  // Open Edit Religion
  const handleOpenEditReligion = (rel: ReligionMaster) => {
    setEditingReligion(rel);
    resetReligionForm({
      name: rel.name,
      description: rel.description || '',
      active: rel.active,
    });
    setIsAddReligionModalOpen(true);
  };

  // Save Religion (Create or Edit)
  const handleSaveReligion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReligionForm()) {
      return;
    }

    if (editingReligion) {
      casteReligionService.updateReligion(editingReligion.id, {
        name: religionForm.name.trim(),
        description: religionForm.description.trim(),
        active: religionForm.active,
      });
      toast.success(`Religion "${religionForm.name.trim()}" updated successfully!`);
    } else {
      casteReligionService.addReligion({
        name: religionForm.name.trim(),
        description: religionForm.description.trim(),
        active: religionForm.active,
      });
      toast.success(`New Religion "${religionForm.name.trim()}" added successfully!`);
    }

    setIsAddReligionModalOpen(false);
  };

  // Open Add Caste
  const handleOpenAddCaste = () => {
    setEditingCaste(null);
    resetCasteForm({
      name: '',
      religionId: religions[0]?.id || 'rel_1',
      description: '',
      active: true,
    });
    setIsAddCasteModalOpen(true);
  };

  // Open Edit Caste
  const handleOpenEditCaste = (caste: CasteMaster) => {
    setEditingCaste(caste);
    resetCasteForm({
      name: caste.name,
      religionId: caste.religionId,
      description: caste.description || '',
      active: caste.active,
    });
    setIsAddCasteModalOpen(true);
  };

  // Save Caste (Create or Edit)
  const handleSaveCaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCasteForm()) {
      return;
    }

    if (editingCaste) {
      casteReligionService.updateCaste(editingCaste.id, {
        name: casteForm.name.trim(),
        religionId: casteForm.religionId,
        description: casteForm.description.trim(),
        active: casteForm.active,
      });
      toast.success(`Caste "${casteForm.name.trim()}" updated successfully!`);
    } else {
      casteReligionService.addCaste({
        name: casteForm.name.trim(),
        religionId: casteForm.religionId,
        description: casteForm.description.trim(),
        active: casteForm.active,
      });
      toast.success(`New Caste "${casteForm.name.trim()}" added successfully!`);
    }

    setIsAddCasteModalOpen(false);
  };

  // Delete Execution
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'RELIGION') {
      const res = casteReligionService.deleteReligion(deleteTarget.id);
      if (!res.success) {
        toast.error(res.error || 'Failed to delete religion.');
      } else {
        toast.success(`Religion "${deleteTarget.name}" deleted successfully.`);
      }
    } else {
      const ok = casteReligionService.deleteCaste(deleteTarget.id);
      if (ok) {
        toast.success(`Caste "${deleteTarget.name}" deleted successfully.`);
      } else {
        toast.error('Failed to delete caste.');
      }
    }

    setDeleteTarget(null);
  };

  // Reset to default castes & religions
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to restore default Religions and Castes master seed?')) {
      casteReligionService.resetToDefaults();
      toast.info('Restored default Religions and Castes master list.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Super Admin Notice Banner */}
      <div className="bg-gradient-to-r from-[#88131B]/10 via-rose-50 to-amber-50/60 p-4 rounded-2xl border border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#88131B] text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Super Admin Config & Master Governance
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#88131B] text-white">
                {isSuperAdmin ? 'Super Admin Managed' : 'Admin Managed'}
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              User panel aur registration form me jo bhi Caste aur Religion dikhenge, unhe Super Admin yahan se dynamically create, edit ya disable kar sakta hai.
            </p>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('CONFIG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'CONFIG'
                ? 'bg-[#88131B] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portal Config
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('RELIGIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'RELIGIONS'
                ? 'bg-[#88131B] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Religions ({religions.filter((r) => r.active).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('CASTES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'CASTES'
                ? 'bg-[#88131B] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Castes / Communities ({castes.filter((c) => c.active).length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. PORTAL CONFIG TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'CONFIG' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Portal & General Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage system-wide parameters, support channels and registration verification rules.
            </p>
          </div>

          <form onSubmit={handleSave} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CustomTextInput
                label={
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Portal Title
                  </span>
                }
                value={values.siteName}
                onChange={(e) => setFieldValue('siteName', e.target.value)}
                error={getFieldError('siteName')}
                size="sm"
              />

              <CustomTextInput
                label={
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Helpline Phone Number
                  </span>
                }
                value={values.supportPhone}
                onChange={(e) => setFieldValue('supportPhone', e.target.value)}
                error={getFieldError('supportPhone')}
                size="sm"
              />

              <CustomTextInput
                label={
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Support Email Address
                  </span>
                }
                type="email"
                value={values.supportEmail}
                onChange={(e) => setFieldValue('supportEmail', e.target.value)}
                error={getFieldError('supportEmail')}
                size="sm"
              />

              <CustomTextInput
                label={
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Headquarters City
                  </span>
                }
                value={values.headquartersCity}
                onChange={(e) => setFieldValue('headquartersCity', e.target.value)}
                error={getFieldError('headquartersCity')}
                size="sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">OTP Mobile Verification</span>
                  <span className="text-[11px] text-slate-500">
                    Require 6-digit SMS OTP on candidate phone numbers during signup
                  </span>
                </div>
                <input
                  {...bindCheckbox('enableOtpLogin')}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Auto-Approve Candidate Profiles</span>
                  <span className="text-[11px] text-slate-500">
                    Skip manual verification queue for basic non-confidential details
                  </span>
                </div>
                <input
                  {...bindCheckbox('autoApproveProfiles')}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 border border-amber-200/80 cursor-pointer">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">System Maintenance Mode</span>
                    <span className="text-[11px] text-amber-700">
                      Temporarily restrict public registrations for database migrations
                    </span>
                  </div>
                </div>
                <input
                  {...bindCheckbox('maintenanceMode')}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C81E28] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RELIGIONS MASTER MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'RELIGIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Religions Master Management (धर्म प्रबंधन)
                <span className="text-xs font-normal text-slate-400">
                  ({religions.length} Total, {religions.filter((r) => r.active).length} Active)
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Super Admin can add, edit, or toggle religions. The active religions will be offered on user panel registration & search.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-xs font-medium flex items-center gap-1"
                title="Reset to default seed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddReligion}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Religion</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-sm">
            <CustomTextInput
              placeholder="Search religion name or code..."
              value={religionSearch}
              onChange={(e) => setReligionSearch(e.target.value)}
              size="sm"
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Religions Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Religion Name</th>
                  <th className="p-3">System Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Mapped Castes</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReligions.map((rel, idx) => {
                  const mappedCount = castes.filter((c) => c.religionId === rel.id).length;
                  return (
                    <tr key={rel.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{rel.name}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {rel.code}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-xs truncate">{rel.description || '—'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {mappedCount} Castes
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            casteReligionService.toggleReligionStatus(rel.id);
                            toast.info(`Toggled "${rel.name}" to ${rel.active ? 'Inactive' : 'Active'}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            rel.active
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {rel.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditReligion(rel)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Religion"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'RELIGION', id: rel.id, name: rel.name })}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Religion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredReligions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                      No matching religions found. Click "+ Add Religion" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CASTES / COMMUNITIES MASTER MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'CASTES' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Castes & Communities Master Management (जाति एवं समुदाय प्रबंधन)
                <span className="text-xs font-normal text-slate-400">
                  ({castes.length} Total, {castes.filter((c) => c.active).length} Active)
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Super Admin decides which castes exist on the platform. These will be populated in user signups, profile forms, and search filters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-xs font-medium flex items-center gap-1"
                title="Reset to default seed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddCaste}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Caste / Community</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="w-full sm:w-64">
              <CustomTextInput
                placeholder="Search caste or code..."
                value={casteSearch}
                onChange={(e) => setCasteSearch(e.target.value)}
                size="sm"
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <div className="w-full sm:w-56">
              <CustomDropDown
                value={selectedReligionFilter}
                onChange={(val) => setSelectedReligionFilter(String(val))}
                options={[
                  { value: 'ALL', label: 'All Religions' },
                  ...religions.map((r) => ({ value: r.id, label: r.name })),
                ]}
                size="sm"
              />
            </div>
          </div>

          {/* Castes Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Caste / Community</th>
                  <th className="p-3">Mapped Religion</th>
                  <th className="p-3">System Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCastes.map((caste, idx) => (
                  <tr key={caste.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{caste.name}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {caste.religionName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {caste.code}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{caste.description || '—'}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          casteReligionService.toggleCasteStatus(caste.id);
                          toast.info(`Toggled "${caste.name}" to ${caste.active ? 'Inactive' : 'Active'}`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          caste.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {caste.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditCaste(caste)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit Caste"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ type: 'CASTE', id: caste.id, name: caste.name })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Caste"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCastes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                      No matching castes found. Click "+ Add Caste" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT RELIGION MODAL */}
      {/* ========================================================================= */}
      {isAddReligionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#88131B] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                {editingReligion ? 'Edit Religion' : 'Add New Religion'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddReligionModalOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReligion} className="p-6 space-y-4">
              <CustomTextInput
                label="Religion Name *"
                placeholder="e.g. Hindu, Sikh, Jain"
                value={religionForm.name}
                onChange={(e) => setReligionField('name', e.target.value)}
                error={religionTouched.name ? religionErrors.name : undefined}
                size="sm"
                required
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Optional background or theological details..."
                  value={religionForm.description}
                  onChange={(e) => setReligionField('description', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C81E28]"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <span className="text-xs font-semibold text-slate-800">Active Status</span>
                <input
                  type="checkbox"
                  checked={religionForm.active}
                  onChange={(e) => setReligionField('active', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddReligionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {editingReligion ? 'Update Religion' : 'Save Religion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT CASTE MODAL */}
      {/* ========================================================================= */}
      {isAddCasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-[#88131B] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                {editingCaste ? 'Edit Caste / Community' : 'Add New Caste / Community'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCasteModalOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCaste} className="p-6 space-y-4">
              <CustomTextInput
                label="Caste / Community Name *"
                placeholder="e.g. Sindhi Lohana, Sindhi Amil, Sindhi Bhaibhand"
                value={casteForm.name}
                onChange={(e) => setCasteField('name', e.target.value)}
                error={casteTouched.name ? casteErrors.name : undefined}
                size="sm"
                required
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mapped Religion *</label>
                <CustomDropDown
                  value={casteForm.religionId}
                  onChange={(val) => setCasteField('religionId', String(val))}
                  options={religions.map((r) => ({
                    value: r.id,
                    label: `${r.name} ${!r.active ? '(Inactive)' : ''}`,
                  }))}
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description / Origin</label>
                <textarea
                  rows={3}
                  placeholder="Historical region, lineage or community notes..."
                  value={casteForm.description}
                  onChange={(e) => setCasteField('description', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C81E28]"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <span className="text-xs font-semibold text-slate-800">Active Status</span>
                <input
                  type="checkbox"
                  checked={casteForm.active}
                  onChange={(e) => setCasteField('active', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCasteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#88131B] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {editingCaste ? 'Update Caste' : 'Save Caste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete {deleteTarget.type === 'RELIGION' ? 'Religion' : 'Caste'}?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete <strong>"{deleteTarget.name}"</strong>? This will remove it from the selectable list on the user panel and registration forms.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConfigSection;
