"use client";

import React, { useState, useCallback, useMemo } from "react";
import { memoWithDeepEqual } from "@/utils";
import { ConversationList, ChatDetailView } from "@/screens/messagesScreen/components";
import { MailboxSearchInput } from "@/screens/interestsScreen/components";
import type { MessageTab, ConversationItem, ChatMessage } from "@/screens/messagesScreen/types";
import { apiFetch, ApiURL, showToast } from "@/redux/apiService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import equal from "fast-deep-equal";
import { useAppSelector } from "@/redux/Action/hook";
import { selectProfile } from "@/redux/useSelector";
import { QUERY_KEYS } from "@/tanstackQuery/keys";

export const isDataEqual = equal;

export interface DashboardMessagesViewProps {
  onUpgradeClick?: () => void;
  className?: string;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

const assistedServiceItem: ConversationItem = {
  id: "conv-assisted",
  name: "Assisted Service",
  subtitle: "Find your match 3x faster! Talk to our Matrimony Expert.",
  isOnline: true,
  isAssisted: true,
};

const DashboardMessagesViewComponent: React.FC<DashboardMessagesViewProps> = ({
  onUpgradeClick,
  className = "",
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
}) => {
  const [tab, setTab] = useState<MessageTab>("received");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setActiveSearchQuery = onSearchQueryChange || setInternalSearchQuery;
  const [selectedId, setSelectedId] = useState<string>("conv-assisted");
  const [isSending, setIsSending] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const profile = useAppSelector(selectProfile);
  const myProfileId = String(profile?._id || profile?.id || profile?.profileId || "");
  const myUserId = String(profile?.userId || profile?.user?._id || "");

  // 1. Fetch Conversations dynamically with TanStack Query
  const { data: rawConversations = [] } = useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: async () => {
      const res = await apiFetch<any>({
        url: ApiURL.chatConversations,
        method: "GET",
        showErrorToast: false,
      });
      return Array.isArray(res?.data?.conversations) ? res.data.conversations : [];
    },
    staleTime: 1000 * 30,
    structuralSharing: (oldData, newData) => (isDataEqual(oldData, newData) ? oldData : newData),
  });

  const apiConversations: ConversationItem[] = useMemo(() => {
    if (!Array.isArray(rawConversations)) return [];
    return rawConversations.map((c: any) => ({
      id: String(c._id || c.id),
      name: c.recipient?.name || c.participant?.name || "Match",
      subtitle: c.lastMessage?.text || "Click to connect and chat.",
      lastMessageTime: c.lastMessage?.timestamp
        ? new Date(c.lastMessage.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })
        : undefined,
      isOnline: Boolean(c.recipient?.isOnline ?? c.participant?.isOnline),
      unreadCount: c.unreadCount || 0,
      avatarUrl: c.recipient?.avatar || c.participant?.avatar,
      recipientProfileId: c.recipient?._id || c.participant?._id,
      isAssisted: false,
    }));
  }, [rawConversations]);

  const conversations = useMemo(() => {
    return [assistedServiceItem, ...apiConversations];
  }, [apiConversations]);

  // 2. Fetch Messages dynamically for selected conversation
  const { data: fetchedMessages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: QUERY_KEYS.messages(selectedId),
    queryFn: async () => {
      if (!selectedId || selectedId === "conv-assisted") return [];
      const res = await apiFetch<any>({
        url: ApiURL.chatMessages(selectedId),
        method: "GET",
        showErrorToast: false,
      });

      if (res?.data?.messages && Array.isArray(res.data.messages)) {
        // Mark read silently
        apiFetch({
          url: ApiURL.chatMarkAsRead,
          method: "PUT",
          data: { conversationId: selectedId },
          showErrorToast: false,
        }).catch(() => {});

        return res.data.messages.map((m: any) => {
          const senderIdStr = String(m.senderProfileId || m.senderUserId || m.senderId || "");
          const isMe =
            m.senderId === "my_profile" ||
            (Boolean(myProfileId) && (senderIdStr === myProfileId || String(m.senderProfileId) === myProfileId)) ||
            (Boolean(myUserId) && (senderIdStr === myUserId || String(m.senderUserId) === myUserId));

          return {
            id: String(m._id || m.id || Math.random()),
            senderId: senderIdStr,
            text: m.text || "",
            time: new Date(m.createdAt || m.timestamp || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe,
            status: ((m.status || "SENT").toLowerCase() as any) || "sent",
          };
        });
      }
      return [];
    },
    enabled: Boolean(selectedId && selectedId !== "conv-assisted"),
    staleTime: 1000 * 15,
    structuralSharing: (oldData, newData) => (isDataEqual(oldData, newData) ? oldData : newData),
  });

  const handleTabChange = useCallback((newTab: MessageTab) => {
    setTab(newTab);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) || conversations[0] || assistedServiceItem,
    [conversations, selectedId]
  );

  // 3. Optimistic Send Message Handler using TanStack Query
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !selectedId || selectedId === "conv-assisted") return;

      const tempId = `temp_${Date.now()}`;
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const optimisticMsg: ChatMessage = {
        id: tempId,
        senderId: "my_profile",
        text,
        time: nowTime,
        isMe: true,
        status: "sending",
      };

      // Optimistic cache update
      queryClient.setQueryData<ChatMessage[]>(QUERY_KEYS.messages(selectedId), (prev = []) => [
        ...prev,
        optimisticMsg,
      ]);

      setIsSending(true);
      try {
        const res = await apiFetch<any>({
          url: ApiURL.chatSendMessage,
          method: "POST",
          data: {
            conversationId: selectedId,
            recipientProfileId: selectedConversation?.recipientProfileId,
            text,
          },
          showErrorToast: false,
        });

        if (res?.error) {
          queryClient.setQueryData<ChatMessage[]>(QUERY_KEYS.messages(selectedId), (prev = []) =>
            prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
          );
          showToast({
            type: "error",
            message: res?.message || "Failed to send message. Please check quota or connection.",
          });
          if (
            res?.message?.toLowerCase().includes("limit") ||
            res?.message?.toLowerCase().includes("upgrade")
          ) {
            onUpgradeClick?.();
          }
        } else {
          queryClient.setQueryData<ChatMessage[]>(QUERY_KEYS.messages(selectedId), (prev = []) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, id: res?.data?.message?._id || tempId, status: "sent" } : m
            )
          );
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
        }
      } catch (err: any) {
        queryClient.setQueryData<ChatMessage[]>(QUERY_KEYS.messages(selectedId), (prev = []) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
        showToast({
          type: "error",
          message: err?.message || "Failed to send message.",
        });
      } finally {
        setIsSending(false);
      }
    },
    [selectedId, selectedConversation, onUpgradeClick, queryClient]
  );

  const filteredConversations = useMemo(() => {
    let list = conversations;
    if (tab === "awaiting") {
      list = list.filter((c) => c.isAssisted || (c.unreadCount || 0) > 0);
    } else if (tab === "calls") {
      list = list.filter((c) => c.isAssisted);
    }
    if (activeSearchQuery?.trim()) {
      const q = activeSearchQuery.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, tab, activeSearchQuery]);

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Top row: Search in Mailbox on right only if not provided from top SubHeader */}
      {externalSearchQuery === undefined && (
        <div className="flex items-center justify-end pb-1">
          <MailboxSearchInput value={activeSearchQuery} onChange={setActiveSearchQuery} />
        </div>
      )}

      {/* Main 2-Column Chat Layout */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left: Conversation List */}
        <ConversationList
          currentTab={tab}
          onTabChange={handleTabChange}
          conversations={filteredConversations}
          selectedConversationId={selectedId}
          onSelectConversation={handleSelectConversation}
        />

        {/* Right: Active Chat / Assisted Offer View */}
        <ChatDetailView
          conversation={selectedConversation}
          messages={fetchedMessages}
          isLoadingMessages={isLoadingMessages}
          onSendMessage={handleSendMessage}
          isSending={isSending}
          onPayNowClick={onUpgradeClick}
          onKnowMoreClick={onUpgradeClick}
        />
      </div>
    </div>
  );
};

export const DashboardMessagesView = memoWithDeepEqual(
  DashboardMessagesViewComponent,
  "DashboardMessagesView"
);
export default DashboardMessagesView;
