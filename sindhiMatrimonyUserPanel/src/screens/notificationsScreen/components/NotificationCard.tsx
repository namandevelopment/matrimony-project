"use client";

import React, { memo, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  Users,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Check,
  Eye,
  Trash2,
  CheckCircle,
  FileText,
  Camera,
  Percent,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  NotificationItem,
  NotificationType,
  NotificationActionType,
} from "../types";

export interface NotificationCardProps {
  item: NotificationItem;
  onToggleRead: (id: string, e: React.MouseEvent) => void;
  onDismiss: (id: string, e: React.MouseEvent) => void;
  onAction: (
    action: NotificationActionType,
    item: NotificationItem,
    e: React.MouseEvent
  ) => void;
  onCardClick?: (item: NotificationItem) => void;
  className?: string;
}

// Icon helper per notification type
const getNotificationTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "interest_received":
      return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
    case "interest_accepted":
      return <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-100" />;
    case "interest_declined":
      return <Heart className="w-4 h-4 text-stone-400" />;
    case "horoscope_request":
      return <Sparkles className="w-4 h-4 text-amber-500" />;
    case "photo_request":
      return <Camera className="w-4 h-4 text-blue-500" />;
    case "profile_viewed":
      return <Eye className="w-4 h-4 text-indigo-500" />;
    case "profile_shortlisted":
      return <Heart className="w-4 h-4 text-purple-500" />;
    case "daily_recommendation":
    case "high_match":
      return <Users className="w-4 h-4 text-[#DB2F3C]" />;
    case "chat_message":
      return <MessageSquare className="w-4 h-4 text-sky-500 fill-sky-50" />;
    case "call_request":
    case "assisted_service_update":
      return <Sparkles className="w-4 h-4 text-amber-600" />;
    case "profile_verified":
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    case "membership_offer":
      return <Percent className="w-4 h-4 text-rose-600" />;
    case "system_announcement":
    default:
      return <ShieldCheck className="w-4 h-4 text-stone-500" />;
  }
};

const NotificationCardComponent: React.FC<NotificationCardProps> = ({
  item,
  onToggleRead,
  onDismiss,
  onAction,
  onCardClick,
  className = "",
}) => {
  const { actor, primaryAction, secondaryAction, metadata, isRead } = item;

  const handleCardClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(item);
    }
  }, [onCardClick, item]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleRead(item.id, e);
    },
    [item.id, onToggleRead]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDismiss(item.id, e);
    },
    [item.id, onDismiss]
  );

  const handlePrimaryClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (primaryAction) {
        onAction(primaryAction.action, item, e);
      }
    },
    [primaryAction, item, onAction]
  );

  const handleSecondaryClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (secondaryAction) {
        onAction(secondaryAction.action, item, e);
      }
    },
    [secondaryAction, item, onAction]
  );

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 cursor-pointer ${
        isRead
          ? "bg-white/70 hover:bg-white border-stone-200/80 shadow-2xs hover:shadow-xs"
          : "bg-white border-red-200/90 shadow-xs hover:shadow-md ring-1 ring-red-100/50"
      } ${className}`}
    >
      {/* Unread Accent Pill on Left Border */}
      {!isRead && (
        <span
          className="absolute left-0 top-3 bottom-3 w-1 bg-[#DB2F3C] rounded-r-full"
          aria-hidden="true"
        />
      )}

      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Left: Avatar or Category Icon */}
        <div className="relative shrink-0">
          {actor?.avatarUrl ? (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-2xs">
              <Image
                src={actor.avatarUrl}
                alt={actor.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 48px, 56px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Online Indicator */}
              {actor.isOnline && (
                <span
                  className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                  title="Online now"
                />
              )}
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center">
              {getNotificationTypeIcon(item.type)}
            </div>
          )}

          {/* Small Category Badge Overlay */}
          <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-2xs border border-stone-100">
            {getNotificationTypeIcon(item.type)}
          </div>
        </div>

        {/* Center: Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar: Title, Actor Name, Badge, Timestamp */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={`text-sm sm:text-base font-semibold tracking-tight ${
                  isRead ? "text-stone-800" : "text-stone-900 font-bold"
                }`}
              >
                {actor?.name ? actor.name : item.title}
              </h2>

              {actor?.matrimonyId && (
                <span className="text-xs text-stone-400 font-medium">
                  ({actor.matrimonyId})
                </span>
              )}

              {actor?.verified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  Verified
                </span>
              )}

              {actor?.matchScore && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#DB2F3C] border border-red-200/50">
                  <Sparkles className="w-3 h-3 text-[#DB2F3C]" />
                  {actor.matchScore}% Match
                </span>
              )}

              {metadata?.badgeText && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                  {metadata.badgeText}
                </span>
              )}
            </div>

            {/* Time & Unread Dot */}
            <div className="flex items-center gap-2 text-xs text-stone-400 shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.timestamp}
              </span>
              {!isRead && (
                <span
                  className="w-2 h-2 rounded-full bg-[#DB2F3C]"
                  title="Unread notification"
                />
              )}
            </div>
          </div>

          {/* Actor Profile Snippet (if available) */}
          {actor && (
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-stone-500">
              {actor.age && actor.height && (
                <span>
                  {actor.age} yrs, {actor.height}
                </span>
              )}
              {actor.caste && (
                <>
                  <span className="text-stone-300">•</span>
                  <span>{actor.caste}</span>
                </>
              )}
              {actor.profession && (
                <>
                  <span className="text-stone-300">•</span>
                  <span className="font-medium text-stone-700">
                    {actor.profession}
                  </span>
                </>
              )}
              {actor.city && (
                <>
                  <span className="text-stone-300">•</span>
                  <span>{actor.city}</span>
                </>
              )}
            </div>
          )}

          {/* Message Text */}
          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              isRead ? "text-stone-600" : "text-stone-800 font-medium"
            }`}
          >
            {item.message}
          </p>

          {/* Action Buttons Row */}
          {(primaryAction || secondaryAction) && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5 pt-1">
              {primaryAction && (
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98 ${
                    primaryAction.variant === "primary"
                      ? "bg-[#DB2F3C] hover:bg-[#b71f2a] text-white"
                      : primaryAction.variant === "secondary"
                      ? "bg-stone-900 hover:bg-stone-800 text-white"
                      : "bg-white hover:bg-stone-50 text-stone-800 border border-stone-300"
                  }`}
                >
                  {primaryAction.label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {secondaryAction && (
                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/70 transition-colors cursor-pointer"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Corner Menu Controls */}
        <div className="flex items-center gap-1 self-start shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={handleToggle}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isRead ? "Mark as unread" : "Mark as read"}
          >
            <Check className={`w-4 h-4 ${isRead ? "text-stone-400" : "text-[#DB2F3C]"}`} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationCard = memo(
  NotificationCardComponent,
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.isRead === next.item.isRead &&
      prev.item.isActionRequired === next.item.isActionRequired &&
      prev.item.timestamp === next.item.timestamp &&
      prev.item.message === next.item.message &&
      prev.className === next.className &&
      prev.onToggleRead === next.onToggleRead &&
      prev.onDismiss === next.onDismiss &&
      prev.onAction === next.onAction &&
      prev.onCardClick === next.onCardClick
    );
  }
);

NotificationCard.displayName = "NotificationCard";
export default NotificationCard;
