import { NotificationItem, NotificationPreferenceSetting } from "./types";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferenceSetting[] = [
  {
    id: "pref-interests",
    title: "Interests & Responses",
    description: "Get notified whenever someone sends an interest, accepts your interest, or requests contact details.",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "pref-messages",
    title: "Chat & Call Requests",
    description: "Instant alerts for direct messages, voice call requests, and missed calls.",
    email: false,
    sms: true,
    push: true,
  },
  {
    id: "pref-matches",
    title: "Daily Matches & Profile Views",
    description: "Daily curated recommendations, profile view alerts, and members who shortlisted you.",
    email: true,
    sms: false,
    push: true,
  },
  {
    id: "pref-assisted",
    title: "Assisted Service Updates",
    description: "Weekly updates from your dedicated relationship manager and shortlisted prospects.",
    email: true,
    sms: true,
    push: true,
  },
  {
    id: "pref-promotions",
    title: "Discounts & Community Events",
    description: "Exclusive subscription discounts, Sindhi community meetups, and festival offers.",
    email: true,
    sms: false,
    push: false,
  },
];

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  all: "All Notifications",
  interests: "Interests & Requests",
  matches: "Matches & Views",
  messages: "Messages & Calls",
  system: "System & Offers",
};
