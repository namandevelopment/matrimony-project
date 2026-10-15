import React from "react";

export interface QuickRule {
  id: string;
  title: string;
  description: string;
  badge: string;
  type: "danger" | "warning" | "shield";
}

export interface SafetySection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  summary: string;
  dos: string[];
  donts: string[];
  redFlags?: string[];
  content: React.ReactNode;
}

export interface SafetyMetaInfo {
  lastUpdatedDate: string;
  effectiveDate: string;
  targetAudience: string;
  helplineNumber: string;
  trustEmail: string;
}

export interface EmergencyContact {
  title: string;
  numberOrEmail: string;
  description: string;
  badge: string;
  actionUrl: string;
  actionLabel: string;
}

export interface SafetyFAQ {
  question: string;
  answer: string;
}
