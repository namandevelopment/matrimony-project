import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  RotateCcw,
  CheckCircle2,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { type InAppPopup, campaignService } from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CustomDropDown } from '../../../components/CustomDropDown';

const SIMULATION_USER_OPTIONS = [
  { label: 'User #1 (Free Member)', value: 'usr_sample_free' },
  { label: 'User #2 (Expired VIP)', value: 'usr_sample_expired' },
  { label: 'User #3 (New Registrant)', value: 'usr_sample_new' },
];

interface InteractivePopupPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPopup?: InAppPopup | null;
}

export const InteractivePopupPreviewModal: React.FC<InteractivePopupPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedPopup,
}) => {
  const [deviceMode, setDeviceMode] = useState<'MOBILE' | 'WEB'>('MOBILE');
  const [simulationUserId, setSimulationUserId] = useState('usr_sample_free');
  const [lastEventMessage, setLastEventMessage] = useState<string | null>(null);

  // Fetch eligible popups for this simulated user
  const eligiblePopups = campaignService.getEligiblePopupsForUser(simulationUserId);
  const activePopup = selectedPopup || eligiblePopups[0] || null;
  const dismissedIds = campaignService.getDismissedPopupIdsForUser(simulationUserId);

  if (!isOpen) return null;

  const handleSimulateDismiss = (popupId: string) => {
    const res = campaignService.recordPopupDismiss(popupId, simulationUserId, 'admin_interactive_test');
    setLastEventMessage(`[API 200 OK] Dismiss recorded for ${simulationUserId}. Dismiss count: ${res.dismissCount}.`);
    toast.info(`Popup [${popupId}] dismissed for user [${simulationUserId}]. Won't appear again.`);
  };

  const handleSimulateClick = (popupId: string) => {
    campaignService.recordPopupCtaClick(popupId);
    setLastEventMessage(`[API 200 OK] CTA Click recorded for ${popupId}.`);
    toast.success(`CTA clicked! Navigating to: ${activePopup?.ctaLink || '/plans'}`);
  };

  const handleResetUser = () => {
    campaignService.resetUserDismissals(simulationUserId);
    setLastEventMessage(`[RESET] Dismissal cache cleared for ${simulationUserId}. All eligible popups restored.`);
    toast.success(`Reset dismissals for ${simulationUserId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Interactive Dynamic Popup Simulator
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Test [X] dismissal persistence, device viewports & priority queues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Switch Device & Simulated User */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600">Device Frame:</span>
            <div className="inline-flex rounded-xl p-0.5 bg-slate-200 border border-slate-300">
              <button
                type="button"
                onClick={() => setDeviceMode('MOBILE')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  deviceMode === 'MOBILE'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('WEB')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  deviceMode === 'WEB'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web Dashboard</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 text-xs">Simulate Member:</span>
            <div className="w-48">
              <CustomDropDown
                value={simulationUserId}
                options={SIMULATION_USER_OPTIONS}
                onChange={(val) => setSimulationUserId(String(val))}
                size="sm"
                variant="outline"
              />
            </div>
            <button
              type="button"
              onClick={handleResetUser}
              className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold transition flex items-center gap-1 shadow-2xs"
              title="Reset user dismissals"
            >
              <RotateCcw className="w-3 h-3 text-rose-600" />
              <span>Reset Dismissals</span>
            </button>
          </div>
        </div>

        {/* Simulator Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex flex-col items-center justify-center min-h-[440px]">
          {activePopup ? (
            <div
              className={`transition-all duration-300 w-full flex items-center justify-center ${
                deviceMode === 'MOBILE' ? 'max-w-xs' : 'max-w-lg'
              }`}
            >
              {/* Phone Frame or Web Modal */}
              <div
                className={`w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative text-center animate-scale-up ${
                  deviceMode === 'MOBILE' ? 'border-4 border-slate-900 shadow-slate-900/30' : ''
                }`}
              >
                {/* Simulated Close [X] Button */}
                <button
                  type="button"
                  onClick={() => handleSimulateDismiss(activePopup.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md active:scale-90"
                  title="Click [X] to simulate dismissal API"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Banner Graphic */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={activePopup.bannerImageUrl}
                    alt={activePopup.title}
                    className="w-full h-full object-cover"
                  />
                  {activePopup.discountLabel && (
                    <div className="absolute top-3 left-3 bg-[#C81E28] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md tracking-wider">
                      {activePopup.discountLabel}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  {activePopup.subtitle && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                      {activePopup.subtitle}
                    </span>
                  )}

                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {activePopup.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activePopup.message}
                  </p>

                  {/* Pricing Comparison */}
                  {activePopup.discountedPrice && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl py-2 px-3 flex items-center justify-center gap-3">
                      {activePopup.originalPrice && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          ₹{activePopup.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xl font-black text-emerald-600">
                        ₹{activePopup.discountedPrice.toLocaleString('en-IN')}
                      </span>
                      {activePopup.couponCode && (
                        <span className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-md font-mono font-bold">
                          {activePopup.couponCode}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => handleSimulateClick(activePopup.id)}
                    className="w-full py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] shadow-md shadow-rose-900/20 hover:opacity-95 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{activePopup.ctaText || 'Claim Festive Plan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[10px] text-slate-400 font-medium">
                    Priority #{activePopup.priority} • Policy: {activePopup.frequencyPolicy}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                All Popups Dismissed for {simulationUserId}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                The dismissal API successfully persisted the closed status. Future requests will not return these popups under their frequency policy.
              </p>
              <button
                type="button"
                onClick={handleResetUser}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#C81E28] text-white hover:bg-[#a61720] transition cursor-pointer shadow-xs"
              >
                Reset User Dismissals & Test Again
              </button>
            </div>
          )}
        </div>

        {/* Live Status & API Log Console */}
        <div className="bg-slate-900 text-slate-300 px-6 py-3 border-t border-slate-800 text-[11px] font-mono flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">
              {lastEventMessage ||
                `Eligible queue: ${eligiblePopups.length} popups. Dismissed IDs: [${dismissedIds.join(', ') || 'none'}].`}
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Module 4 & 5 Verification</span>
        </div>
      </div>
    </div>
  );
};
