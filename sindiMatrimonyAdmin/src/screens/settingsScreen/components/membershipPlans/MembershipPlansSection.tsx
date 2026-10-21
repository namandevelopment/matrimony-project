import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PlanStatsHeader } from './PlanStatsHeader';
import { PlanTabsFilter } from './PlanTabsFilter';
import { PlanCard } from './PlanCard';
import { PlanFormModal } from './PlanFormModal';
import { PlanDeleteConfirmModal } from './PlanDeleteConfirmModal';
import { INITIAL_MEMBERSHIP_PLANS } from './initialPlans';
import type {
  MembershipPlan,
  PlanCategory,
  PlanFormValues,
  MembershipPlanStats,
} from './types';
import { toast } from '../../../../toastMessage/toast';
import { storage } from '../../../../storage';
import { useInputs } from '../../../../customHooks/useInputs';
import { usePlansQuery } from '../../../../tanstackQuery/useQuery';

interface MembershipPlansFilterValues {
  activeCategory: PlanCategory;
  searchQuery: string;
}

const STORAGE_PLANS_KEY = 'sindhi_admin_membership_plans';

export const MembershipPlansSection: React.FC = () => {
  // TanStack Query for Membership Plans (caching + instantaneous load)
  const { data: apiPlansData, isLoading: isPlansLoading } = usePlansQuery();

  // Load plans from storage or fallback to INITIAL_MEMBERSHIP_PLANS
  // Fallback initial plans preserved:
  // const fallbackPlans = INITIAL_MEMBERSHIP_PLANS;
  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = storage.getString(STORAGE_PLANS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing stored membership plans:', e);
      }
    }
    return INITIAL_MEMBERSHIP_PLANS;
  });

  // Synchronize live API plans into state when query resolves
  useEffect(() => {
    const rawPlans = apiPlansData?.plans || apiPlansData?.data || (Array.isArray(apiPlansData) ? apiPlansData : null);
    if (Array.isArray(rawPlans) && rawPlans.length > 0) {
      const mapped: MembershipPlan[] = rawPlans.map((p: any) => ({
        id: p.id || p._id || `plan_${Math.random().toString(36).substring(2, 7)}`,
        title: p.name || p.title || 'Membership Plan',
        subtitle: p.tagline || p.subtitle || '',
        price: Number(p.originalPriceINR ?? p.price ?? 0),
        offerPrice: Number(p.priceINR ?? p.offerPrice ?? p.price ?? 0),
        duration: p.durationDays ? `${p.durationDays} Days` : (p.duration || '30 Days'),
        category: p.tier?.includes('ASSIST') ? 'ASSIST_PLAN' : (p.category || 'SELF_SERVICE'),
        features: Array.isArray(p.features) ? p.features : [],
        highlighted: Boolean(p.isPopular || p.highlighted),
        badge: p.badge || (p.isPopular ? 'POPULAR' : undefined),
        active: p.active !== false,
      }));
      setPlans(mapped);
    }
  }, [apiPlansData]);

  const {
    values: filterValues,
    setFieldValue: setFilterFieldValue,
  } = useInputs<MembershipPlansFilterValues>({
    activeCategory: 'SELF_SERVICE',
    searchQuery: '',
  });

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);

  // Sync to storage on plan changes
  useEffect(() => {
    storage.set(STORAGE_PLANS_KEY, JSON.stringify(plans));
  }, [plans]);

  // Computed stats using useMemo
  const stats: MembershipPlanStats = useMemo(() => {
    const totalPlans = plans.length;
    const activePlans = plans.filter((p) => p.active).length;
    const selfServiceCount = plans.filter((p) => p.category === 'SELF_SERVICE').length;
    const assistPlansCount = plans.filter((p) => p.category === 'ASSIST_PLAN').length;

    return {
      totalPlans,
      activePlans,
      selfServiceCount,
      assistPlansCount,
    };
  }, [plans]);

  // Filtered plans using useMemo
  const filteredPlans = useMemo(() => {
    let result = plans.filter((p) => p.category === filterValues.activeCategory);

    if (filterValues.searchQuery.trim()) {
      const q = filterValues.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.duration.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Sort order: by sortOrder if available, or keep order
    return [...result].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  }, [plans, filterValues.activeCategory, filterValues.searchQuery]);

  // Handlers wrapped in useCallback for referential stability
  const handleSelectCategory = useCallback(
    (cat: PlanCategory) => {
      setFilterFieldValue('activeCategory', cat);
    },
    [setFilterFieldValue]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setFilterFieldValue('searchQuery', query);
    },
    [setFilterFieldValue]
  );

  const handleOpenAddModal = useCallback(() => {
    setSelectedPlan(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setFormMode('edit');
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setSelectedPlan(null);
  }, []);

  const handleSavePlan = useCallback((values: PlanFormValues, planId?: string) => {
    const parsedFeatures = values.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (formMode === 'edit' && planId) {
      setPlans((prev) =>
        prev.map((p) => {
          if (p.id === planId) {
            return {
              ...p,
              title: values.title,
              subtitle: values.subtitle,
              price: Number(values.price),
              offerPrice: Number(values.offerPrice),
              category: values.category,
              duration: values.duration,
              features: parsedFeatures,
              highlighted: values.highlighted,
              badge: values.badge || undefined,
              active: values.active,
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        })
      );
      toast.success(`Plan "${values.title}" updated successfully!`);
    } else {
      const newPlan: MembershipPlan = {
        id: `plan_${Date.now()}`,
        title: values.title,
        subtitle: values.subtitle,
        price: Number(values.price),
        offerPrice: Number(values.offerPrice),
        category: values.category,
        duration: values.duration,
        features: parsedFeatures,
        highlighted: values.highlighted,
        badge: values.badge || undefined,
        active: values.active,
        sortOrder: plans.length + 1,
        updatedAt: new Date().toISOString(),
      };
      setPlans((prev) => [...prev, newPlan]);
      toast.success(`New plan "${values.title}" created successfully!`);
      // Switch to category of created plan if different
      if (values.category !== filterValues.activeCategory) {
        setFilterFieldValue('activeCategory', values.category);
      }
    }

    setIsFormModalOpen(false);
    setSelectedPlan(null);
  }, [formMode, plans.length, filterValues.activeCategory, setFilterFieldValue]);

  const handleOpenDeleteModal = useCallback((plan: MembershipPlan) => {
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    toast.success('Membership plan deleted successfully.');
    setIsDeleteModalOpen(false);
    setPlanToDelete(null);
  }, []);

  const handleToggleHighlight = useCallback((planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const nextState = !p.highlighted;
          toast.info(
            nextState
              ? `"${p.title}" highlighted as featured crimson red card.`
              : `Removed red highlight from "${p.title}".`
          );
          return { ...p, highlighted: nextState };
        }
        return p;
      })
    );
  }, []);

  const handleToggleActive = useCallback((planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const nextActive = !p.active;
          toast.info(
            nextActive
              ? `"${p.title}" is now active and visible to users.`
              : `"${p.title}" deactivated.`
          );
          return { ...p, active: nextActive };
        }
        return p;
      })
    );
  }, []);

  const handleResetDefaults = useCallback(() => {
    if (window.confirm('Reset all membership plans back to system defaults? Any custom modifications will be restored.')) {
      setPlans(INITIAL_MEMBERSHIP_PLANS);
      storage.set(STORAGE_PLANS_KEY, JSON.stringify(INITIAL_MEMBERSHIP_PLANS));
      toast.success('Membership plans reset to defaults successfully.');
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & + Add New Plan button */}
      <PlanStatsHeader
        stats={stats}
        searchQuery={filterValues.searchQuery}
        onSearchChange={handleSearchChange}
        onAddNewPlan={handleOpenAddModal}
        onResetDefaults={handleResetDefaults}
      />

      {/* 2. Tabs Pill Filter matching Screenshot 1 (Self Service vs Assist Plans) */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        <PlanTabsFilter
          activeCategory={filterValues.activeCategory}
          onSelectCategory={handleSelectCategory}
          selfServiceCount={stats.selfServiceCount}
          assistPlansCount={stats.assistPlansCount}
        />

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredPlans.length}</span>{' '}
          {filterValues.activeCategory === 'SELF_SERVICE' ? 'Self Service' : 'Assisted'} Plans
        </div>
      </div>

      {/* 3. Responsive Grid of Plan Cards matching Screenshot 1 & 2 */}
      {isPlansLoading && plans.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onToggleHighlight={handleToggleHighlight}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No plans found matching &quot;{filterValues.searchQuery}&quot;</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or add a new plan.</p>
          <button
            type="button"
            onClick={() => setFilterFieldValue('searchQuery', '')}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* 4. Form Modal (Add / Edit) matching Screenshot 3 */}
      <PlanFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        initialPlan={selectedPlan}
        defaultCategory={filterValues.activeCategory}
        onClose={handleCloseFormModal}
        onSave={handleSavePlan}
      />

      {/* 5. Delete Confirm Modal */}
      <PlanDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        plan={planToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
