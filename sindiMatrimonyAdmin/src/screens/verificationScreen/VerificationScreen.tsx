import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import { ReasonModal } from '../../customModals/ReasonModal';

interface QueueItem {
  id: string;
  type: 'PHOTO' | 'ID_PROOF';
  name: string;
  subcaste: string;
  profileId: string;
  imageUrl: string;
  uploadedAt: string;
}

const mockQueue: QueueItem[] = [
  {
    id: '1',
    type: 'PHOTO',
    name: 'Karan Advani',
    subcaste: 'Amil',
    profileId: 'SIND001',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    uploadedAt: '10 mins ago',
  },
  {
    id: '2',
    type: 'PHOTO',
    name: 'Simran Chandnani',
    subcaste: 'Baibhand',
    profileId: 'SIND002',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    uploadedAt: '25 mins ago',
  },
  {
    id: '3',
    type: 'ID_PROOF',
    name: 'Ritesh Bhatia (Aadhaar KYC)',
    subcaste: 'Sahiti',
    profileId: 'SIND003',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    uploadedAt: '1 hour ago',
  },
];

export const VerificationScreen: React.FC = () => {
  const [items, setItems] = useState<QueueItem[]>(mockQueue);
  const [rejectingItem, setRejectingItem] = useState<QueueItem | null>(null);

  const handleApprove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmReject = (_reason: string) => {
    if (rejectingItem) {
      setItems((prev) => prev.filter((item) => item.id !== rejectingItem.id));
      setRejectingItem(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Verification & Moderation Desk</h1>
          <p className="text-xs text-slate-500">
            Review uploaded photos and KYC ID proofs before they go public on mobile & web platforms
          </p>
        </div>
        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          {items.length} Pending Approvals
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">All Caught Up!</h3>
          <p className="text-xs text-slate-500 mt-1">There are no pending photos or documents in the moderation queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {item.type === 'PHOTO' ? 'Profile Photo' : 'KYC Document'}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    <p className="text-xs text-slate-500">
                      {item.subcaste} • <span className="font-mono">{item.profileId}</span>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.uploadedAt}</span>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setRejectingItem(item)}
                    className="flex-1 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Reason Modal on Rejection */}
      <ReasonModal
        isOpen={Boolean(rejectingItem)}
        title="Reject Uploaded Media"
        description={`Specify reason for rejecting ${rejectingItem?.name}'s ${
          rejectingItem?.type === 'PHOTO' ? 'photo' : 'KYC proof'
        }. Candidate will receive this feedback.`}
        confirmText="Confirm Rejection"
        isDestructive={true}
        onClose={() => setRejectingItem(null)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default VerificationScreen;
