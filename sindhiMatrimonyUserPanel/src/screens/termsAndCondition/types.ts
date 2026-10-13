import React from "react";

export interface TermsSection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

export interface TermsMetaInfo {
  lastUpdatedDate: string;
  effectiveDate: string;
  targetAudience: string;
}
