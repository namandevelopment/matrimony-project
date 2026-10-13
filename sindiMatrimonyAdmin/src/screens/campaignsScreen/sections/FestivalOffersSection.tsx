import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Search,
  Pause,
  Play,
  Trash2,
  Edit,
} from 'lucide-react';
import {
  type FestivalOffer,
  campaignService,
} from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CreateFestivalOfferModal } from '../components/CreateFestivalOfferModal';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { useInputs } from '../../../customHooks/useInputs';

export interface FestivalOffersFilterValues {
  searchQuery: string;
  statusFilter: 'ALL' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
}

export const FestivalOffersSection: React.FC = () => {
  const { values: filters, setFieldValue: setFilterField } = useInputs<FestivalOffersFilterValues>({
    searchQuery: '',
    statusFilter: 'ALL',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<FestivalOffer | null>(null);

  const offers = campaignService.getOffers();

  const filteredOffers = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    const now = new Date().toISOString();

    return offers.filter((o) => {
      const isExpired = o.endDate < now;
      if (filters.statusFilter === 'ACTIVE' && (!o.isActive || isExpired)) return false;
      if (filters.statusFilter === 'PAUSED' && (o.isActive || isExpired)) return false;
      if (filters.statusFilter === 'EXPIRED' && !isExpired) return false;

      if (q) {
        return (
          o.festivalName.toLowerCase().includes(q) ||
          (o.offerTitle && o.offerTitle.toLowerCase().includes(q)) ||
          (o.couponCode && o.couponCode.toLowerCase().includes(q)) ||
          o.tagline.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [offers, filters.searchQuery, filters.statusFilter]);

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (offer: FestivalOffer) => {
    setEditingOffer(offer);
    setIsCreateModalOpen(true);
  };

  const handleSaveOffer = (offerData: any) => {
    if (editingOffer) {
      campaignService.updateOffer(editingOffer.id, offerData);
      toast.success('Festival offer updated successfully');
    } else {
      campaignService.addOffer(offerData);
      toast.success('Festival offer campaign published!');
    }
  };

  const handleToggleStatus = (id: string) => {
    campaignService.toggleOfferStatus(id);
    toast.info('Festival offer status updated');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this festival offer campaign?')) {
      campaignService.deleteOffer(id);
      toast.info('Festival offer deleted');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <CustomTextInput
              value={filters.searchQuery}
              onChange={(e) => setFilterField('searchQuery', e.target.value)}
              placeholder="Search festival campaigns, coupons or occasions..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-48">
              <CustomDropDown
                value={filters.statusFilter}
                onChange={(val) => setFilterField('statusFilter', val as any)}
                options={[
                  { value: 'ALL', label: `All Offers (${offers.length})` },
                  { value: 'ACTIVE', label: 'Active Campaigns' },
                  { value: 'PAUSED', label: 'Paused Campaigns' },
                  { value: 'EXPIRED', label: 'Expired' },
                ]}
                size="sm"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-[#C81E28] hover:opacity-95 shadow-md shadow-rose-900/20 active:scale-95 transition cursor-pointer flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-200 stroke-[3]" />
              <span>New Festival Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Offers Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredOffers.length === 0 ? (
          <div className="lg:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Gift className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            No festival offer campaigns found matching current criteria.
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const isExpired = new Date(offer.endDate) < new Date();

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col hover:border-slate-300 transition"
              >
                {/* Banner Header */}
                <div className="relative aspect-video max-h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={offer.bannerUrl}
                    alt={offer.festivalName}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Badge & Status Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md">
                      {offer.badge}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        isExpired
                          ? 'bg-slate-700 text-slate-300'
                          : offer.isActive
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {isExpired ? 'Expired' : offer.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {offer.couponCode && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[10px] font-mono font-black border border-white/20">
                      Code: {offer.couponCode}
                    </div>
                  )}

                  {/* Festival Title in Banner */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-black tracking-tight drop-shadow-sm leading-snug">
                      {offer.festivalName}
                    </h3>
                    <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
                      {offer.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  {/* Plan Rates Overrides Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Server-Calculated Membership Rates:</span>
                      <span className="text-rose-600 font-extrabold">
                        {offer.discountValue}% Discount Applied
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
                          <tr>
                            <th className="py-2 px-3">Plan</th>
                            <th className="py-2 px-3">Regular</th>
                            <th className="py-2 px-3">Festive Rate</th>
                            <th className="py-2 px-3 text-right">Savings</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {offer.planOverrides.map((p) => (
                            <tr key={p.planId}>
                              <td className="py-2 px-3 font-bold text-slate-800">{p.planName}</td>
                              <td className="py-2 px-3 text-slate-400 line-through">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 font-black text-emerald-700">
                                ₹{p.festivalPrice.toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-right font-extrabold text-rose-600">
                                Save {p.discountPercentage}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dates & Redemption Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Offer Validity Period
                      </span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        {new Date(offer.startDate).toLocaleDateString('en-IN')} —{' '}
                        {new Date(offer.endDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Redemptions / Quota
                      </span>
                      <span className="font-extrabold text-slate-900 mt-0.5 block">
                        {offer.currentRedemptions} / {offer.maxRedemptions || 'Unlimited'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(offer.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        offer.isActive
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {offer.isActive ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Offer</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Activate Offer</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(offer)}
                        className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                        title="Edit Offer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(offer.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Festival Offer Modal */}
      <CreateFestivalOfferModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOffer}
        initialData={editingOffer}
      />
    </div>
  );
};
