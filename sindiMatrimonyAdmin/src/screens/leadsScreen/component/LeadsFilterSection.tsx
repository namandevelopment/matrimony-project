import React, { useMemo } from 'react';
import { Users, Tag, Globe2 } from 'lucide-react';
import { FilterBar } from '../../../components/FilterBar';
import { CustomDropDown, type CustomDropDownOption } from '../../../components/CustomDropDown';
import type { Employee } from '../../../types/employee.types';

interface LeadsFilterSectionProps {
  search: string;
  onSearchChange: (val: string) => void;
  isSuperAdmin: boolean;
  staffFilter: string;
  onStaffFilterChange: (val: string) => void;
  subcasteFilter: string;
  onSubcasteFilterChange: (val: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (val: string) => void;
  selectedCount: number;
  onClearSelection: () => void;
  eligibleEmployees: Employee[];
}

const SUBCASTE_OPTIONS: CustomDropDownOption[] = [
  { label: 'All Sindhi Subcastes', value: 'ALL' },
  { label: 'Amil', value: 'Amil' },
  { label: 'Baibhand', value: 'Baibhand' },
  { label: 'Sahiti', value: 'Sahiti' },
  { label: 'Larkana', value: 'Larkana' },
  { label: 'Shikarpuri', value: 'Shikarpuri' },
  { label: 'Thattai', value: 'Thattai' },
];

const SOURCE_OPTIONS: CustomDropDownOption[] = [
  { label: 'All Inquiry Sources', value: 'ALL' },
  { label: 'Website Registration Form', value: 'WEBSITE_FORM' },
  { label: 'Mobile App', value: 'MOBILE_APP' },
  { label: 'Callback Request', value: 'CALLBACK_REQ' },
  { label: 'Organic Google Search', value: 'ORGANIC_SEARCH' },
  { label: 'Social Media Ads', value: 'AD_CAMPAIGN' },
];

export const LeadsFilterSection: React.FC<LeadsFilterSectionProps> = React.memo(
  ({
    search,
    onSearchChange,
    isSuperAdmin,
    staffFilter,
    onStaffFilterChange,
    subcasteFilter,
    onSubcasteFilterChange,
    sourceFilter,
    onSourceFilterChange,
    selectedCount,
    onClearSelection,
    eligibleEmployees,
  }) => {
    // Memoized staff options
    const staffOptions = useMemo<CustomDropDownOption[]>(() => {
      const base: CustomDropDownOption[] = [
        { label: 'Filter by Staff: All Team', value: 'ALL' },
        { label: '⏳ Unassigned Leads Only', value: 'UNASSIGNED' },
      ];
      const empOptions: CustomDropDownOption[] = eligibleEmployees.map((emp) => ({
        label: `${emp.fullName} (${emp.role})`,
        value: emp.id,
      }));
      return [...base, ...empOptions];
    }, [eligibleEmployees]);

    return (
      <FilterBar
        search={search}
        onSearchChange={onSearchChange}
        placeholder="Search by Lead ID, Candidate Name, Mobile, or Subcaste..."
        filters={
          <>
            {/* Super Admin Staff Filter */}
            {isSuperAdmin && (
              <div className="w-full sm:w-56">
                <CustomDropDown
                  size="sm"
                  variant="outline"
                  icon={<Users className="w-3.5 h-3.5 text-slate-400" />}
                  options={staffOptions}
                  value={staffFilter}
                  onChange={(val) => onStaffFilterChange(String(val))}
                  triggerClassName="bg-white border-slate-300 font-medium text-xs shadow-2xs"
                  containerClassName="w-full sm:w-56"
                />
              </div>
            )}

            {/* Subcaste Filter */}
            <div className="w-full sm:w-44">
              <CustomDropDown
                size="sm"
                variant="outline"
                icon={<Tag className="w-3.5 h-3.5 text-slate-400" />}
                options={SUBCASTE_OPTIONS}
                value={subcasteFilter}
                onChange={(val) => onSubcasteFilterChange(String(val))}
                triggerClassName="bg-white border-slate-200 font-medium text-xs shadow-2xs"
                containerClassName="w-full sm:w-44"
              />
            </div>

            {/* Source Filter */}
            <div className="w-full sm:w-44">
              <CustomDropDown
                size="sm"
                variant="outline"
                icon={<Globe2 className="w-3.5 h-3.5 text-slate-400" />}
                options={SOURCE_OPTIONS}
                value={sourceFilter}
                onChange={(val) => onSourceFilterChange(String(val))}
                triggerClassName="bg-white border-slate-200 font-medium text-xs shadow-2xs"
                containerClassName="w-full sm:w-44"
              />
            </div>

            {selectedCount > 0 && (
              <button
                type="button"
                onClick={onClearSelection}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline px-2 py-1 cursor-pointer shrink-0"
              >
                Clear Selection ({selectedCount})
              </button>
            )}
          </>
        }
      />
    );
  }
);

LeadsFilterSection.displayName = 'LeadsFilterSection';
