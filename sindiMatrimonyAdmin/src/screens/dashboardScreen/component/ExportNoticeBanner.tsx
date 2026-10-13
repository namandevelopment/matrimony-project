import React from 'react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface ExportNoticeBannerProps {
  notice: string;
}

export const ExportNoticeBanner: React.FC<ExportNoticeBannerProps> = memoWithDeepEqual(({ notice }) => {
  return (
    <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
      <span>{notice}</span>
      <span className="text-[10px] text-teal-600 font-mono">Generating download...</span>
    </div>
  );
});

ExportNoticeBanner.displayName = 'ExportNoticeBanner';
