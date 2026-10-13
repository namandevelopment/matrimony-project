import React from 'react';
import { SubcasteGotraSection } from './components/SubcasteGotraSection';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck } from 'lucide-react';

export const SubcasteGotraScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcastes & Ancient Gotras Master"
        description="Comprehensive management of Sindhi subcastes, ancient Vedic gotras, exogamy rules, and associated surname directories."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C81E28]" />
              Vedic Rules Active
            </span>
          </div>
        }
      />
      <SubcasteGotraSection />
    </div>
  );
};

export default SubcasteGotraScreen;
