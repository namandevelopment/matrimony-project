import React from "react";

export interface PolicySection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
}

export interface PolicyMetaInfo {
  lastUpdatedDate: string;
  effectiveDate: string;
  complianceStandard: string;
  securityStandard: string;
}
