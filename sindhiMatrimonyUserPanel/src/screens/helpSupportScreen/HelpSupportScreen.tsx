"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { HelpCategoryId } from "./types";
import {
  HELP_CATEGORIES,
  HELP_GUIDELINES,
  HELP_FAQS,
} from "./data/helpData";
import { HelpHeader } from "./components/HelpHeader";
import { HelpBreadcrumb } from "./components/HelpBreadcrumb";
import { HelpHero } from "./components/HelpHero";
import { HelpContactChannels } from "./components/HelpContactChannels";
import { HelpGuidelinesSection } from "./components/HelpGuidelinesSection";
import { HelpFAQSection } from "./components/HelpFAQSection";
import { HelpTicketForm } from "./components/HelpTicketForm";
import { HelpOfficeDetails } from "./components/HelpOfficeDetails";
import { HelpFooter } from "./components/HelpFooter";
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";

export const HelpSupportScreen: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HelpCategoryId>("all");
  const [faqsList, setFaqsList] = useState([...HELP_FAQS]);

  // Fetch dynamic FAQs and Help Desk updates from backend unified API
  useEffect(() => {
    let isMounted = true;
    apiFetch.get<any>(ApiURL.helpSupport)
      .then((res) => {
        if (!isMounted || !res?.data) return;
        if (Array.isArray(res.data.faqs) && res.data.faqs.length > 0) {
          setFaqsList(res.data.faqs);
        }
      })
      .catch(() => {
        // Fallback silently to HELP_FAQS
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickChip = useCallback((chip: string) => {
    setSearchQuery(chip);
    setActiveCategory("all");
    const el = document.getElementById("guidelines-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchQuery("");
    setActiveCategory("all");
  }, []);

  // Filtered Guidelines based on search query and category
  const filteredGuidelines = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return HELP_GUIDELINES.filter((guide) => {
      // Category filter
      if (activeCategory !== "all" && guide.categoryId !== activeCategory) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const titleMatch = guide.title.toLowerCase().includes(q);
      const summaryMatch = guide.summary.toLowerCase().includes(q);
      const tagMatch = guide.tags.some((tag) => tag.toLowerCase().includes(q));
      const stepMatch = guide.steps.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );

      return titleMatch || summaryMatch || tagMatch || stepMatch;
    });
  }, [searchQuery, activeCategory]);

  // Filtered FAQs based on search query
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return faqsList;

    return faqsList.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [searchQuery, faqsList]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Header with Sticky Navigation & Login Modal */}
      <HelpHeader />

      {/* 2. Main Content Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <HelpBreadcrumb />

        {/* Hero Section with Search & Quick Chips */}
        <HelpHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickChipClick={handleQuickChip}
        />

        {/* 4 Actionable Support Channels */}
        <HelpContactChannels />

        {/* Step-by-Step Feature Guidelines & Community Rules */}
        <HelpGuidelinesSection
          categories={HELP_CATEGORIES}
          guidelines={filteredGuidelines}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />

        {/* Mutually Exclusive Accessible FAQs */}
        <HelpFAQSection faqs={filteredFaqs} />

        {/* Interactive Raise a Ticket / Contact Form */}
        <HelpTicketForm />

        {/* Official Portal Details, Corporate Address & Grievance Redressal */}
        <HelpOfficeDetails />
      </main>

      {/* 3. Footer */}
      <HelpFooter />
    </div>
  );
});

HelpSupportScreen.displayName = "HelpSupportScreen";

export default HelpSupportScreen;
