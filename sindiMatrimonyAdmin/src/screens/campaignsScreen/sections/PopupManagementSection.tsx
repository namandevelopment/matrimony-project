import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Eye,
  Pause,
  Play,
  Copy,
  Trash2,
  Edit,
} from 'lucide-react';
import {
  type InAppPopup,
  campaignService,
} from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CreatePopupModal } from '../components/CreatePopupModal';
import { InteractivePopupPreviewModal } from '../components/InteractivePopupPreviewModal';
import { useInputs } from '../../../customHooks/useInputs';

export interface PopupFilterValues {
  searchQuery: string;
  statusFilter: string;
  placementFilter: string;
}

export const PopupManagementSection: React.FC = () => {
  const {
    values: filterValues,
    setFieldValue: setFilterField,
  } = useInputs<PopupFilterValues>({
    searchQuery: '',
    statusFilter: 'ALL',
    placementFilter: 'ALL',
  });

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<InAppPopup | null>(null);
  const [previewingPopup, setPreviewingPopup] = useState<InAppPopup | null>(null);

  const popups = campaignService.getPopups();

  const filteredPopups = useMemo(() => {
    const q = filterValues.searchQuery.trim().toLowerCase();

    return popups.filter((p) => {
      if (filterValues.statusFilter !== 'ALL') {
        if (filterValues.statusFilter === 'ACTIVE' && !p.isActive) return false;
        if (filterValues.statusFilter === 'PAUSED' && p.isActive) return false;
      }
      if (filterValues.placementFilter !== 'ALL' && p.placement !== filterValues.placementFilter) return false;

      if (q) {
        return (
          p.title.toLowerCase().includes(q) ||
          (p.internalName && p.internalName.toLowerCase().includes(q)) ||
          p.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [popups, filterValues]);

  const handleOpenCreate = () => {
    setEditingPopup(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (popup: InAppPopup) => {
    setEditingPopup(popup);
    setIsCreateModalOpen(true);
  };

  const handleSavePopup = (data: any) => {
    if (editingPopup) {
      campaignService.updatePopup(editingPopup.id, data);
      toast.success('Promotional popup updated successfully');
    } else {
      campaignService.addPopup(data);
      toast.success('Promotional popup created & added to queue!');
    }
  };

  const handleToggleStatus = (id: string) => {
    campaignService.togglePopupStatus(id);
    toast.info('Popup display status updated');
  };

  const handleDuplicate = (id: string) => {
    campaignService.duplicatePopup(id);
    toast.success('Popup duplicated as new draft');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this promotional popup?')) {
      campaignService.deletePopup(id);
      toast.info('Popup removed');
    }
  };

  const handleOpenSimulator = (popup?: InAppPopup) => {
    setPreviewingPopup(popup || null);
    setIsSimulatorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Bar: Search, Filters & Action Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterValues.searchQuery}
              onChange={(e) => setFilterField('searchQuery', e.target.value)}
              placeholder="Search popups by internal title, message or coupon..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#C81E28]/20 focus:border-[#C81E28] font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterValues.statusFilter}
              onChange={(e) => setFilterField('statusFilter', e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
            </select>

            <select
              value={filterValues.placementFilter}
              onChange={(e) => setFilterField('placementFilter', e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-700"
            >
              <option value="ALL">All Placements</option>
              <option value="DASHBOARD">Web Dashboard</option>
              <option value="MOBILE_HOME">Mobile Home</option>
              <option value="MEMBERSHIP_SCREEN">Pricing Plans</option>
              <option value="PROFILE_SCREEN">Profile Screen</option>
            </select>

            {/* Launch Interactive Simulator Button */}
            <button
              type="button"
              onClick={() => handleOpenSimulator()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Test dismissals and live viewport rendering"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch Simulator</span>
            </button>

            {/* Create Popup Button */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] hover:opacity-95 shadow-md shadow-rose-900/20 active:scale-95 transition cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
              <span>Create Popup</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Popups Cards Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPopups.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No promotional popups found matching current filters.
          </div>
        ) : (
          filteredPopups.map((popup) => {
            const ctr =
              popup.impressionsCount > 0
                ? ((popup.ctaClicksCount / popup.impressionsCount) * 100).toFixed(1)
                : '0.0';

            return (
              <div
                key={popup.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition"
              >
                {/* Banner Thumbnail */}
                <div className="relative aspect-video max-h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={popup.bannerImageUrl}
                    alt={popup.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Priority & Status Pills */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md">
                      Priority #{popup.priority}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        popup.isActive
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {popup.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {popup.discountLabel && (
                    <div className="absolute top-3 right-3 bg-[#C81E28] text-white px-2 py-0.5 rounded-md text-[10px] font-black">
                      {popup.discountLabel}
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      {popup.placement.replace(/_/g, ' ')}
                    </div>
                    <h3 className="text-sm font-extrabold text-white truncate leading-snug">
                      {popup.title}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {popup.message}
                    </p>

                    {/* Pricing Pill */}
                    {popup.discountedPrice && (
                      <div className="mt-2.5 flex items-center gap-2">
                        {popup.originalPrice && (
                          <span className="text-slate-400 line-through text-[11px]">
                            ₹{popup.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-sm font-black text-emerald-700">
                          ₹{popup.discountedPrice.toLocaleString('en-IN')}
                        </span>
                        {popup.couponCode && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                            {popup.couponCode}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics Row */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Impressions
                      </span>
                      <span className="font-extrabold text-slate-900 block mt-0.5">
                        {popup.impressionsCount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500 block">
                        [X] Dismissed
                      </span>
                      <span className="font-extrabold text-rose-700 block mt-0.5">
                        {popup.dismissCount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block">
                        CTR %
                      </span>
                      <span className="font-black text-emerald-700 block mt-0.5">
                        {ctr}%
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenSimulator(popup)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Live Test</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(popup.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          popup.isActive
                            ? 'text-amber-700 hover:bg-amber-50 border-amber-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                        }`}
                        title={popup.isActive ? 'Pause' : 'Activate'}
                      >
                        {popup.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(popup.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(popup)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(popup.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreatePopupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSavePopup}
        initialData={editingPopup}
      />

      <InteractivePopupPreviewModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        selectedPopup={previewingPopup}
      />
    </div>
  );
};
