import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { NotificationItemData, NotificationType } from '../types';

interface NotificationItemProps {
  item: NotificationItemData;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  onAcceptInterest?: (id: string) => void;
  onDeclineInterest?: (id: string) => void;
  onActionPress?: (item: NotificationItemData) => void;
}

const typeIconConfig: Record<
  NotificationType,
  { icon: string; bg: string }
> = {
  interest: { icon: 'heart', bg: '#E11D48' },
  match: { icon: 'sparkles', bg: '#D97706' },
  message: { icon: 'message-circle', bg: '#2563EB' },
  profile_view: { icon: 'eye', bg: '#7C3AED' },
  interest_accepted: { icon: 'check', bg: '#059669' },
  system: { icon: 'bell', bg: COLORS.themeColor },
};

const NotificationItem: React.FC<NotificationItemProps> = memo(
  ({
    item,
    onPress,
    onDelete,
    onAcceptInterest,
    onDeclineInterest,
    onActionPress,
  }) => {
    const config = typeIconConfig[item.type] || typeIconConfig.system;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${item.message}`}
        onPress={() => onPress(item.id)}
        style={({ pressed }) => [
          styles.card,
          !item.read ? styles.unreadCard : styles.readCard,
          pressed && styles.cardPressed,
        ]}
      >
        {/* Unread Left Accent Bar */}
        {!item.read && <View style={styles.unreadAccentBar} />}

        <View style={styles.cardHeader}>
          {/* Avatar Container */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: item.accent }]}>
              <Text style={styles.avatarText}>{item.initials}</Text>
            </View>
            <View style={[styles.microBadge, { backgroundColor: config.bg }]}>
              <CustomLucidIcons
                name={config.icon}
                color={COLORS.white}
                size={11}
                strokeWidth={2.5}
              />
            </View>
          </View>

          {/* Main Info */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                numberOfLines={1}
                style={[styles.title, !item.read && styles.unreadTitle]}
              >
                {item.title}
              </Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>

            {!!item.meta && (
              <Text numberOfLines={1} style={styles.meta}>
                {item.meta}
              </Text>
            )}

            <Text numberOfLines={2} style={styles.message}>
              {item.message}
            </Text>
          </View>

          {/* Right Meta (Time & Delete Action) */}
          <View style={styles.rightSide}>
            <Text style={styles.time}>{item.time}</Text>
            <TouchableOpacity
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => onDelete(item.id)}
              style={styles.deleteButton}
              accessibilityLabel="Remove notification"
            >
              <CustomLucidIcons name="x" color="#A0A0A0" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons Row */}
        {renderActionButtons(
          item,
          onAcceptInterest,
          onDeclineInterest,
          onActionPress,
        )}
      </Pressable>
    );
  },
);

const renderActionButtons = (
  item: NotificationItemData,
  onAcceptInterest?: (id: string) => void,
  onDeclineInterest?: (id: string) => void,
  onActionPress?: (item: NotificationItemData) => void,
) => {
  if (item.type === 'interest') {
    if (item.interestStatus === 'accepted') {
      return (
        <View style={styles.statusBadgeAccepted}>
          <CustomLucidIcons name="check" color="#059669" size={13} strokeWidth={2.5} />
          <Text style={styles.statusBadgeAcceptedText}>Interest Accepted</Text>
          <TouchableOpacity
            style={styles.inlineMessageBtn}
            onPress={() => onActionPress?.(item)}
          >
            <Text style={styles.inlineMessageBtnText}>Send Message</Text>
            <CustomLucidIcons name="chevron-right" color={COLORS.themeColor} size={13} />
          </TouchableOpacity>
        </View>
      );
    }

    if (item.interestStatus === 'declined') {
      return (
        <View style={styles.statusBadgeDeclined}>
          <Text style={styles.statusBadgeDeclinedText}>Interest Declined</Text>
        </View>
      );
    }

    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.acceptBtn}
          onPress={() => onAcceptInterest?.(item.id)}
        >
          <CustomLucidIcons name="check" color={COLORS.white} size={14} strokeWidth={2.5} />
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.declineBtn}
          onPress={() => onDeclineInterest?.(item.id)}
        >
          <CustomLucidIcons name="x" color={COLORS.inactiveTab} size={14} strokeWidth={2} />
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (item.type === 'match') {
    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.matchBtn}
          onPress={() => onActionPress?.(item)}
        >
          <CustomLucidIcons name="sparkles" color={COLORS.themeColor} size={14} />
          <Text style={styles.matchBtnText}>Say Hello 👋</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (item.type === 'message') {
    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.replyBtn}
          onPress={() => onActionPress?.(item)}
        >
          <CustomLucidIcons name="send" color="#2563EB" size={13} />
          <Text style={styles.replyBtnText}>Reply</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (item.type === 'profile_view') {
    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.viewProfileBtn}
          onPress={() => onActionPress?.(item)}
        >
          <CustomLucidIcons name="eye" color="#7C3AED" size={13} />
          <Text style={styles.viewProfileBtnText}>View Profiles</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (item.type === 'interest_accepted') {
    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.startChatBtn}
          onPress={() => onActionPress?.(item)}
        >
          <CustomLucidIcons name="message-circle" color={COLORS.white} size={14} />
          <Text style={styles.startChatBtnText}>Start Conversation</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (item.type === 'system') {
    return (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.systemBtn}
          onPress={() => onActionPress?.(item)}
        >
          <CustomLucidIcons name="sparkles" color={COLORS.themeColor} size={13} />
          <Text style={styles.systemBtnText}>Complete Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    padding: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  readCard: {
    backgroundColor: COLORS.white,
    borderColor: '#ECECEC',
  },
  unreadCard: {
    backgroundColor: '#FFFDFD',
    borderColor: '#FEE2E2',
  },
  cardPressed: {
    opacity: 0.88,
  },
  unreadAccentBar: {
    backgroundColor: COLORS.themeColor,
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  avatarText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
  },
  microBadge: {
    alignItems: 'center',
    borderColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1.5,
    bottom: -2,
    height: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    width: 20,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: '#1E1E1E',
    flex: 1,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13.5,
    lineHeight: 18,
  },
  unreadTitle: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#0F0F0F',
  },
  unreadDot: {
    backgroundColor: COLORS.themeColor,
    borderRadius: 4,
    height: 7,
    marginLeft: 6,
    width: 7,
  },
  meta: {
    color: '#8E8E93',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    marginTop: 2,
  },
  message: {
    color: '#555555',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 46,
  },
  time: {
    color: '#9E9E9E',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 10.5,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    padding: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 11,
    paddingLeft: 60,
  },
  acceptBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  acceptBtnText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  declineBtn: {
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderColor: '#E2E2E2',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  declineBtnText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  matchBtn: {
    alignItems: 'center',
    backgroundColor: '#FFF0F1',
    borderColor: '#FECDD3',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  matchBtnText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  replyBtn: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  replyBtnText: {
    color: '#2563EB',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  viewProfileBtn: {
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  viewProfileBtnText: {
    color: '#7C3AED',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  startChatBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  startChatBtnText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  systemBtn: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  systemBtnText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  statusBadgeAccepted: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    marginLeft: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  statusBadgeAcceptedText: {
    color: '#059669',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11.5,
  },
  inlineMessageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: '#A7F3D0',
  },
  inlineMessageBtnText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 11.5,
    marginRight: 2,
  },
  statusBadgeDeclined: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    marginTop: 10,
    marginLeft: 60,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  statusBadgeDeclinedText: {
    color: '#9CA3AF',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11.5,
  },
});

export default NotificationItem;
