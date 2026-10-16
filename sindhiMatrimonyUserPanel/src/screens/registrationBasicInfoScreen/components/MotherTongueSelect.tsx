"use client";

import React, { memo } from "react";
import { CustomDropDown } from "@/components";

export interface MotherTongueSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const POPULAR_LANGUAGES = [
  { label: "Sindhi", value: "Sindhi", badge: "Community" },
  { label: "Hindi", value: "Hindi" },
  { label: "Kannada", value: "Kannada" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Marwari", value: "Marwari" },
  { label: "Oriya", value: "Oriya" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Marathi", value: "Marathi" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Bengali", value: "Bengali" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Urdu", value: "Urdu" },
  { label: "Assamese", value: "Assamese" },
  { label: "English", value: "English" },
  { label: "Rajasthani", value: "Rajasthani" },
  { label: "Bhojpuri", value: "Bhojpuri" },
  { label: "Maithili", value: "Maithili" },
  { label: "Kashmiri", value: "Kashmiri" },
  { label: "Konkani", value: "Konkani" },
  { label: "Nepali", value: "Nepali" },
];

export const MotherTongueSelect: React.FC<MotherTongueSelectProps> = memo(
  ({ value, onChange, error }) => {
    return (
      <CustomDropDown
        label="Mother Tongue"
        placeholder="Select your mother tongue"
        value={value}
        onChange={onChange}
        options={POPULAR_LANGUAGES}
        searchable
        searchPlaceholder="Search mother tongue"
        error={error}
      />
    );
  }
);

MotherTongueSelect.displayName = "MotherTongueSelect";
