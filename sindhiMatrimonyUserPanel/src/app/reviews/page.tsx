import React from "react";
import type { Metadata } from "next";
import { ReviewsScreen } from "@/screens/reviewsScreen";
import { createMetadata } from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Member Reviews & Ratings | Sindhimarriage.in",
  description:
    "Read genuine reviews and 4.9-star ratings from verified Sindhi couples and families who found their match on Sindhimarriage.in.",
  canonicalPath: "/reviews",
});

export default function ReviewsPage() {
  return <ReviewsScreen />;
}
