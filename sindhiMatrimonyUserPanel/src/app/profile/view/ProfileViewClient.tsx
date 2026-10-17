"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ViewProfileScreen } from "@/screens/viewProfileScreen";

export default function ProfileViewClient() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id") || undefined;

  return <ViewProfileScreen initialProfileId={profileId} />;
}
