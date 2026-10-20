import React from "react";
import type { Metadata } from "next";
import { ViewProfileScreen } from "@/screens/viewProfileScreen";
import { createMetadata } from "@/metadata";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return createMetadata({
    title: `View Profile ${id} | Sindhimarriage.in`,
    description: `Explore full verified profile details for member ${id}.`,
    canonicalPath: `/matches/viewprofile/${id}`,
  });
}

export default async function MatchesViewProfileDynamicPage({ params }: Props) {
  const { id } = await params;
  return <ViewProfileScreen initialProfileId={id} />;
}
