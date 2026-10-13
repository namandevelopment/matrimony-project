import React, { useEffect } from 'react';
import {
  X,
  Save,
  User,
  Heart,
  GraduationCap,
  Users,
  MapPin,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import type { MatrimonialMember } from '../../../services/memberDataService';
import { memberDataService } from '../../../services/memberDataService';
import { subcasteGotraService } from '../../../services/subcasteGotraService';
import { casteReligionService } from '../../../services/casteReligionService';
import { toast } from '../../../toastMessage/toast';
import { useInputs } from '../../../customHooks/useInputs';
import { validateName, validateEmail, validateMobileNumber } from '../../../utils/ValidationsFuctions';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';

export interface EditProfileModalProps {
  isOpen: boolean;
  member: MatrimonialMember;
  initialTab?: 'PERSONAL' | 'CAREER' | 'FAMILY' | 'RELIGION' | 'ADDRESS' | 'ABOUT' | 'PHOTOS';
  onClose: () => void;
  onSaved: (updatedMember: MatrimonialMember) => void;
}

export interface EditProfileUIState {
  activeTab: 'PERSONAL' | 'CAREER' | 'FAMILY' | 'RELIGION' | 'ADDRESS' | 'ABOUT' | 'PHOTOS';
  saving: boolean;
  submitAttempted: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  member,
  initialTab,
  onClose,
  onSaved,
}) => {
  const { values: uiState, setFieldValue: setUiField } = useInputs<EditProfileUIState>({
    activeTab: initialTab || 'PERSONAL',
    saving: false,
    submitAttempted: false,
  });

  const { activeTab, saving, submitAttempted } = uiState;
  const setActiveTab = (tab: EditProfileUIState['activeTab']) => setUiField('activeTab', tab);
  const setSaving = (val: boolean) => setUiField('saving', val);
  const setSubmitAttempted = (val: boolean) => setUiField('submitAttempted', val);

  const {
    values: formData,
    setFieldValue,
    reset,
    dirty,
    errors,
    touched,
    validateForm,
  } = useInputs<MatrimonialMember>(member, {
    validate: (vals) => {
      const errs: Partial<Record<keyof MatrimonialMember, string>> = {};
      const nameErr = validateName(vals.fullName);
      if (nameErr) errs.fullName = nameErr;

      if (vals.email) {
        const emailErr = validateEmail(vals.email);
        if (emailErr) errs.email = emailErr;
      }

      if (vals.mobile) {
        const mobileErr = validateMobileNumber(vals.mobile);
        if (mobileErr) errs.mobile = mobileErr;
      }

      return errs;
    },
    validateOnChange: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setSubmitAttempted(false);
      reset(member);
    }
  }, [isOpen, initialTab, member, reset]);

  if (!isOpen) return null;

  const handleChange = (field: keyof MatrimonialMember, value: any) => {
    setFieldValue(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!validateForm()) {
      if (errors.fullName) {
        toast.error(errors.fullName);
        setActiveTab('PERSONAL');
      } else if (errors.email) {
        toast.error(errors.email);
        setActiveTab('ADDRESS');
      } else if (errors.mobile) {
        toast.error(errors.mobile);
        setActiveTab('ADDRESS');
      }
      return;
    }

    setSaving(true);
    try {
      const updated = memberDataService.updateMember(member.id, formData);
      if (updated) {
        toast.success(`Profile for ${updated.fullName} updated successfully!`);
        onSaved(updated);
        onClose();
      } else {
        toast.error('Failed to update member profile.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error updating member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#991B1B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-black tracking-tight">Edit Member Profile</h3>
            <p className="text-xs text-white/80 mt-0.5">
              Editing details for <strong className="text-white">{member.fullName}</strong> (ID: {member.uniqueId})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {[
              { key: 'PERSONAL', label: 'Personal & Lifestyle', icon: User },
              { key: 'CAREER', label: 'Education & Work', icon: GraduationCap },
              { key: 'FAMILY', label: 'Family Info', icon: Users },
              { key: 'RELIGION', label: 'Religion & Horoscope', icon: Heart },
              { key: 'ADDRESS', label: 'Contact & Addresses', icon: MapPin },
              { key: 'ABOUT', label: 'Bio & Preferences', icon: Sparkles },
              { key: 'PHOTOS', label: 'Photos & Avatar', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 py-3 px-2 text-xs font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#C81E28] text-[#C81E28]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* TAB 1: PERSONAL & LIFESTYLE */}
          {activeTab === 'PERSONAL' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <CustomTextInput
                  label="Full Name *"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  error={(submitAttempted || touched.fullName) ? errors.fullName : undefined}
                  size="sm"
                />

                <CustomDropDown
                  label="Gender *"
                  value={formData.gender}
                  onChange={(val) => handleChange('gender', val as any)}
                  options={[
                    { value: 'Male', label: 'Groom (Male)' },
                    { value: 'Female', label: 'Bride (Female)' },
                  ]}
                  size="sm"
                />

                <CustomTextInput
                  label="Age (Years) *"
                  type="number"
                  required
                  value={String(formData.age || '')}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                  size="sm"
                />

                <CustomTextInput
                  label="Date of Birth"
                  placeholder="DD/MM/YYYY or YYYY-MM-DD"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Birth Time"
                  placeholder="e.g. 02:20 PM"
                  value={formData.birthTime || ''}
                  onChange={(e) => handleChange('birthTime', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Birth Place"
                  placeholder="e.g. NEW DELHI"
                  value={formData.birthPlace || ''}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  size="sm"
                />

                <CustomDropDown
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={(val) => handleChange('maritalStatus', val as any)}
                  options={[
                    { value: 'Never Married', label: 'Never Married (Single)' },
                    { value: 'Divorced', label: 'Divorced' },
                    { value: 'Widowed', label: 'Widowed' },
                    { value: 'Awaiting Divorce', label: 'Awaiting Divorce' },
                    { value: 'Annulled', label: 'Annulled' },
                  ]}
                  size="sm"
                />

                <CustomTextInput
                  label="Mother Tongue"
                  placeholder="e.g. Sindhi / Hindi"
                  value={formData.motherTongue || ''}
                  onChange={(e) => handleChange('motherTongue', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Blood Group"
                  placeholder="e.g. B+, O+, AB+"
                  value={formData.bloodGroup || ''}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  size="sm"
                />

                <CustomDropDown
                  label="Diet Habit"
                  value={formData.diet || 'Vegetarian'}
                  onChange={(val) => handleChange('diet', val as any)}
                  options={[
                    { value: 'Vegetarian', label: 'Vegetarian' },
                    { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
                    { value: 'Eggetarian', label: 'Eggetarian' },
                    { value: 'Jain', label: 'Jain' },
                    { value: 'Vegan', label: 'Vegan' },
                  ]}
                  size="sm"
                />
              </div>

              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28] pt-4">
                Appearance & Lifestyle
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <CustomTextInput
                  label="Height"
                  placeholder="e.g. 5-5 or 5ft 8in"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Weight"
                  placeholder="e.g. 54 kg or 65 kg"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Body Type"
                  placeholder="e.g. Slim, Athletic, Average"
                  value={formData.bodyType || ''}
                  onChange={(e) => handleChange('bodyType', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Complexion"
                  placeholder="e.g. Fair, Wheatish"
                  value={formData.complexion || ''}
                  onChange={(e) => handleChange('complexion', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Smoking Habit"
                  placeholder="e.g. No / Occasionally"
                  value={formData.smokingHabit || 'No'}
                  onChange={(e) => handleChange('smokingHabit', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Alcohol Consumption"
                  placeholder="e.g. No / Socially"
                  value={formData.alcoholConsumption || 'No'}
                  onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CAREER & EDUCATION */}
          {activeTab === 'CAREER' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Education & Career Qualifications
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomTextInput
                  label="Highest Education"
                  placeholder="e.g. B.Tech in Computer Science, MBA, MBBS"
                  value={formData.education || ''}
                  onChange={(e) => handleChange('education', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Education Area"
                  placeholder="e.g. Engineering, Management, Commerce"
                  value={formData.educationArea || ''}
                  onChange={(e) => handleChange('educationArea', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Employed In"
                  placeholder="e.g. Private Sector, Business / Entrepreneur, Government"
                  value={formData.employedIn || ''}
                  onChange={(e) => handleChange('employedIn', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Profession / Role"
                  placeholder="e.g. Senior Tech Lead, Director, CA"
                  value={formData.profession || ''}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Working With (Company / Business)"
                  placeholder="e.g. Google, Own Business, Private Ltd"
                  value={formData.workingWith || ''}
                  onChange={(e) => handleChange('workingWith', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Working As"
                  placeholder="e.g. Senior Executive, Others, Manager"
                  value={formData.workingAs || ''}
                  onChange={(e) => handleChange('workingAs', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Extra Education"
                  placeholder="e.g. Certifications, Diploma"
                  value={formData.extraEducation || ''}
                  onChange={(e) => handleChange('extraEducation', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Annual Income (Salary / Turnover)"
                  placeholder="e.g. ₹20 - 25 Lakhs"
                  value={formData.annualIncome || ''}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Physical Disabilities"
                  placeholder="e.g. None / No"
                  value={formData.disabilities || ''}
                  onChange={(e) => handleChange('disabilities', e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY INFO */}
          {activeTab === 'FAMILY' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Family Background & Members
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomTextInput
                  label="Father's Name"
                  value={formData.fatherName || ''}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Father's Occupation"
                  value={formData.fatherOccupation || ''}
                  onChange={(e) => handleChange('fatherOccupation', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Mother's Name"
                  value={formData.motherName || ''}
                  onChange={(e) => handleChange('motherName', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Mother's Occupation"
                  value={formData.motherOccupation || ''}
                  onChange={(e) => handleChange('motherOccupation', e.target.value)}
                  size="sm"
                />

                <CustomDropDown
                  label="Family Type"
                  value={formData.familyType || 'Nuclear'}
                  onChange={(val) => handleChange('familyType', val as any)}
                  options={[
                    { value: 'Nuclear', label: 'Nuclear Family' },
                    { value: 'Joint', label: 'Joint Family' },
                  ]}
                  size="sm"
                />

                <CustomTextInput
                  label="Members Live With"
                  placeholder="e.g. Parents, Independent, 3 members"
                  value={formData.membersLiveWith || ''}
                  onChange={(e) => handleChange('membersLiveWith', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="About Brother"
                  placeholder="e.g. 1 Younger Brother (Engineer)"
                  value={formData.aboutBrother || ''}
                  onChange={(e) => handleChange('aboutBrother', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="About Sister"
                  placeholder="e.g. 1 Elder Sister (Married) / None"
                  value={formData.aboutSister || ''}
                  onChange={(e) => handleChange('aboutSister', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Family Value"
                  placeholder="e.g. MIDDLE CLASS / UPPER MIDDLE / ORTHODOX"
                  value={formData.familyValue || ''}
                  onChange={(e) => handleChange('familyValue', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="House (Residential Status)"
                  placeholder="e.g. Owned / Rented"
                  value={formData.house || ''}
                  onChange={(e) => handleChange('house', e.target.value)}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">About Family & Cultural Background</label>
                <textarea
                  rows={3}
                  value={formData.aboutFamily || ''}
                  onChange={(e) => handleChange('aboutFamily', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#C81E28]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: RELIGION & HOROSCOPE */}
          {activeTab === 'RELIGION' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Religion & Astrological Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <CustomDropDown
                  label="Religion"
                  value={formData.religion || 'Hindu'}
                  onChange={(val) => handleChange('religion', String(val))}
                  options={casteReligionService.getActiveReligions().map((r) => ({
                    value: r.name,
                    label: r.name,
                  }))}
                  size="sm"
                />

                <CustomDropDown
                  label="Community / Caste"
                  value={formData.community || 'Sindhi'}
                  onChange={(val) => handleChange('community', String(val))}
                  options={casteReligionService.getActiveCastes().map((c) => ({
                    value: c.name,
                    label: c.name === 'Sindhi' ? 'Sindhi' : `${c.name} (${c.religionName})`,
                  }))}
                  size="sm"
                />

                <CustomDropDown
                  label="Sindhi Subcaste *"
                  required
                  value={formData.subcaste || 'Amil'}
                  onChange={(val) => handleChange('subcaste', String(val))}
                  options={[
                    ...subcasteGotraService.getSubcastes().filter((s) => s.active).map((s) => ({
                      value: s.name,
                      label: s.name,
                    })),
                    { value: 'Other', label: 'Other Subcaste' },
                  ]}
                  size="sm"
                />

                <CustomDropDown
                  label="Gotra"
                  value={formData.gotra || ''}
                  onChange={(val) => handleChange('gotra', String(val))}
                  options={[
                    { value: '', label: 'Select Vedic Gotra...' },
                    ...subcasteGotraService.getGotras().filter((g) => g.active).map((g) => ({
                      value: g.name,
                      label: `${g.name} (${g.lineage})`,
                    })),
                    { value: 'Other', label: 'Other / Not Mentioned' },
                  ]}
                  size="sm"
                />

                <CustomDropDown
                  label="Manglik"
                  value={formData.manglik || 'Non-Manglik'}
                  onChange={(val) => handleChange('manglik', val as any)}
                  options={[
                    { value: 'Non-Manglik', label: 'Non-Manglik' },
                    { value: 'Manglik', label: 'Manglik' },
                    { value: 'Anshik Manglik', label: 'Anshik Manglik' },
                    { value: "Don't Know", label: "Don't Know" },
                  ]}
                  size="sm"
                />

                <CustomTextInput
                  label="Sun Sign / Rashi"
                  value={formData.sunSign || ''}
                  onChange={(e) => handleChange('sunSign', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Nakshatram"
                  value={formData.nakshatram || ''}
                  onChange={(e) => handleChange('nakshatram', e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT & ADDRESS */}
          {activeTab === 'ADDRESS' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28] mb-3">
                  Contact & Login Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <CustomTextInput
                    label="Primary Mobile *"
                    required
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    error={(submitAttempted || touched.mobile) ? errors.mobile : undefined}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Alternate Mobile"
                    placeholder="e.g. 9811234567"
                    value={formData.alternateMobile || ''}
                    onChange={(e) => handleChange('alternateMobile', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Landline"
                    placeholder="e.g. 011-29834567"
                    value={formData.landline || ''}
                    onChange={(e) => handleChange('landline', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Email Address"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={(submitAttempted || touched.email) ? errors.email : undefined}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Portal Login Password"
                    placeholder="e.g. RADHIKA07566"
                    value={formData.password || ''}
                    onChange={(e) => handleChange('password', e.target.value)}
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28] mb-3">
                  Current / Working Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 md:col-span-3">
                    <CustomTextInput
                      label="Address / Locality"
                      placeholder="e.g. LAJPAT NAGAR, DELHI"
                      value={formData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      size="sm"
                    />
                  </div>

                  <CustomTextInput
                    label="City *"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={(submitAttempted || touched.city) ? errors.city : undefined}
                    size="sm"
                  />

                  <CustomTextInput
                    label="State"
                    value={formData.state || ''}
                    onChange={(e) => handleChange('state', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Country"
                    value={formData.country || 'INDIA'}
                    onChange={(e) => handleChange('country', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Pincode"
                    placeholder="e.g. 110024"
                    value={formData.pincode || ''}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    size="sm"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28] mb-3">
                  Permanent Residential Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 md:col-span-3">
                    <CustomTextInput
                      label="Permanent Address"
                      placeholder="e.g. LAJPAT NAGAR, DELHI"
                      value={formData.permanentAddress || formData.address || ''}
                      onChange={(e) => handleChange('permanentAddress', e.target.value)}
                      size="sm"
                    />
                  </div>

                  <CustomTextInput
                    label="City"
                    value={formData.permanentCity || formData.city || ''}
                    onChange={(e) => handleChange('permanentCity', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="State"
                    value={formData.permanentState || formData.state || ''}
                    onChange={(e) => handleChange('permanentState', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Country"
                    value={formData.permanentCountry || formData.country || 'INDIA'}
                    onChange={(e) => handleChange('permanentCountry', e.target.value)}
                    size="sm"
                  />

                  <CustomTextInput
                    label="Pincode"
                    placeholder="e.g. 110024"
                    value={formData.permanentPincode || formData.pincode || '110024'}
                    onChange={(e) => handleChange('permanentPincode', e.target.value)}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BIO & PREFERENCES */}
          {activeTab === 'ABOUT' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Bio & Partner Expectations
              </h4>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">About Candidate (Self Statement)</label>
                <textarea
                  rows={4}
                  value={formData.aboutCandidate || formData.aboutMe || ''}
                  onChange={(e) => handleChange('aboutCandidate', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#C81E28]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Desired Partner Profile</label>
                <textarea
                  rows={4}
                  value={formData.desiredProfile || ''}
                  onChange={(e) => handleChange('desiredProfile', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#C81E28]"
                />
              </div>

              <div>
                <CustomTextInput
                  label="Hobbies & Interests"
                  placeholder="Traveling, Music, Sports, Reading"
                  value={formData.hobbies || ''}
                  onChange={(e) => handleChange('hobbies', e.target.value)}
                  size="sm"
                />
              </div>
            </div>
          )}

          {/* TAB 7: PHOTOS & AVATAR */}
          {activeTab === 'PHOTOS' && (
            <div className="space-y-4">
              <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider text-[#C81E28]">
                Photos & Avatar URLs
              </h4>
              <div>
                <CustomTextInput
                  label="Primary Profile Photo URL"
                  type="url"
                  placeholder="https://..."
                  value={formData.profilePhoto || ''}
                  onChange={(e) => handleChange('profilePhoto', e.target.value)}
                  size="sm"
                />
              </div>

              {formData.profilePhoto && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200">
                  <img src={formData.profilePhoto} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            {dirty && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                ● Unsaved Changes
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
