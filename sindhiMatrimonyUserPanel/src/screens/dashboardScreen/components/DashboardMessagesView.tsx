"use client";

import React, { useState, useCallback, memo } from "react";
import { ConversationList, ChatDetailView } from "@/screens/messagesScreen/components";
import { MailboxSearchInput } from "@/screens/interestsScreen/components";
import type { MessageTab, ConversationItem } from "@/screens/messagesScreen/types";

export interface DashboardMessagesViewProps {
  onUpgradeClick?: () => void;
  className?: string;
}

const defaultConversations: ConversationItem[] = [
  {
    id: "conv-assisted",
    name: "Assisted Service",
    subtitle: "Find your match 3x faster! Talk to our Matrimony Expert.",
    isOnline: true,
    isAssisted: true,
  },
  {
    id: "conv-1",
    name: "Aisha Pandit",
    subtitle: "Sent you an interest request. Click to connect.",
    isOnline: false,
    lastMessageTime: "2 days ago",
  },
  {
    id: "conv-2",
    name: "Simran Motwani",
    subtitle: "Hi! I viewed your profile and found our interests compatible.",
    isOnline: true,
    lastMessageTime: "Yesterday",
  },
];

const DashboardMessagesViewComponent: React.FC<DashboardMessagesViewProps> = ({
  onUpgradeClick,
  className = "",
}) => {
  const [tab, setTab] = useState<MessageTab>("received");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>("conv-assisted");

  const handleTabChange = useCallback((newTab: MessageTab) => {
    setTab(newTab);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const selectedConversation =
    defaultConversations.find((c) => c.id === selectedId) || defaultConversations[0];

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Top row: Search in Mailbox on right */}
      <div className="flex items-center justify-end pb-1">
        <MailboxSearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Main 2-Column Chat Layout */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left: Conversation List */}
        <ConversationList
          currentTab={tab}
          onTabChange={handleTabChange}
          conversations={defaultConversations}
          selectedConversationId={selectedId}
          onSelectConversation={handleSelectConversation}
        />

        {/* Right: Active Chat / Assisted Offer View */}
        <ChatDetailView
          conversation={selectedConversation}
          onPayNowClick={onUpgradeClick}
          onKnowMoreClick={onUpgradeClick}
        />
      </div>
    </div>
  );
};

export const DashboardMessagesView = memo(DashboardMessagesViewComponent);
DashboardMessagesView.displayName = "DashboardMessagesView";
export default DashboardMessagesView;
