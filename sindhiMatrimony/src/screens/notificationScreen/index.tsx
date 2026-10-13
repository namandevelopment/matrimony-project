import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import { showToast } from '../../utils/CustomToast';
import NotificationItem from './components/NotificationItem';
import {
  NotificationFilter,
  NotificationItemData,
  NotificationTimeSection,
} from './types';

// Realistic sample notifications for Matrimony
const initialNotifications: NotificationItemData[] = [
  {
    id: '1',
    type: 'interest',
    title: 'Aashna sent you an interest',
    message: 'She reviewed your profile and expressed interest in connecting with you.',
    meta: '26 yrs, 5\'4" • UX Designer • Mumbai',
    time: '12m ago',
    section: 'today',
    read: false,
    accent: '#D8797B',
    initials: 'A',
    interestStatus: 'pending',
  },
  {
    id: '2',
    type: 'match',
    title: 'It\'s a Mutual Match with Yash!',
    message: 'You both liked each other\'s profile. Take the first step and start a conversation.',
    meta: '30 yrs, 5\'10" • Business Owner • Surat',
    time: '2h ago',
    section: 'today',
    read: false,
    accent: '#B58A70',
    initials: 'Y',
  },
  {
    id: '3',
    type: 'message',
    title: 'Riya sent you a message',
    message: '“Hello! Nice to connect with you here. How was your weekend?”',
    meta: '25 yrs • Architect • Ahmedabad',
    time: '4h ago',
    section: 'today',
    read: false,
    accent: '#3B82F6',
    initials: 'R',
  },
  {
    id: '4',
    type: 'profile_view',
    title: '14 new members viewed your profile',
    message: 'Your profile had high visibility today. Browse who checked out your details.',
    meta: 'High profile activity • Last 24 hours',
    time: 'Yesterday',
    section: 'yesterday',
    read: true,
    accent: '#7C3AED',
    initials: '14+',
  },
  {
    id: '5',
    type: 'interest_accepted',
    title: 'Kavita accepted your interest',
    message: 'Great news! Kavita accepted your interest request. You can now chat directly.',
    meta: '27 yrs • Pediatrician • Pune',
    time: 'Yesterday',
    section: 'yesterday',
    read: true,
    accent: '#059669',
    initials: 'K',
  },
  {
    id: '6',
    type: 'system',
    title: 'Complete Kundali details for 3x more matches',
    message: 'Profiles with completed horoscope & family backgrounds receive significantly more responses.',
    meta: 'Profile Completeness • 65%',
    time: '3 days ago',
    section: 'earlier',
    read: true,
    accent: COLORS.themeColor,
    initials: '✨',
  },
];

type ListItem =
  | { kind: 'header'; title: string }
  | { kind: 'item'; data: NotificationItemData };

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<NotificationItemData[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [clearModalVisible, setClearModalVisible] = useState(false);

  // Unread Count
  const unreadCount = useMemo(
    () => items.reduce((count, item) => count + (item.read ? 0 : 1), 0),
    [items],
  );

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !item.read;
      if (activeFilter === 'interest') {
        return item.type === 'interest' || item.type === 'interest_accepted';
      }
      if (activeFilter === 'match') return item.type === 'match';
      if (activeFilter === 'message') return item.type === 'message';
      return true;
    });
  }, [items, activeFilter]);

  // Group items by section
  const sectionedList = useMemo<ListItem[]>(() => {
    const sections: { key: NotificationTimeSection; title: string }[] = [
      { key: 'today', title: 'Today' },
      { key: 'yesterday', title: 'Yesterday' },
      { key: 'earlier', title: 'Earlier' },
    ];

    const result: ListItem[] = [];

    sections.forEach(sec => {
      const secItems = filteredItems.filter(i => i.section === sec.key);
      if (secItems.length > 0) {
        result.push({ kind: 'header', title: sec.title });
        secItems.forEach(item => {
          result.push({ kind: 'item', data: item });
        });
      }
    });

    return result;
  }, [filteredItems]);

  // Handlers
  const handleMarkAsRead = useCallback((id: string) => {
    setItems(current =>
      current.map(item => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setItems(current => current.map(item => ({ ...item, read: true })));
    showToast({
      type: 'success',
      message: 'All notifications marked as read',
    });
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
    showToast({
      type: 'info',
      message: 'Notification removed',
    });
  }, []);

  const handleAcceptInterest = useCallback((id: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id
          ? { ...item, interestStatus: 'accepted', read: true }
          : item,
      ),
    );
    showToast({
      type: 'success',
      message: 'Interest accepted! You can now start chatting.',
    });
  }, []);

  const handleDeclineInterest = useCallback((id: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id
          ? { ...item, interestStatus: 'declined', read: true }
          : item,
      ),
    );
    showToast({
      type: 'info',
      message: 'Interest declined',
    });
  }, []);

  const handleActionPress = useCallback(
    (item: NotificationItemData) => {
      handleMarkAsRead(item.id);

      if (item.type === 'message' || item.type === 'interest_accepted') {
        navigation.navigate('BottomTab', { screen: 'Messages' });
      } else if (item.type === 'match' || item.type === 'interest') {
        navigation.navigate('BottomTab', { screen: 'Matches' });
      } else {
        navigation.navigate('BottomTab', { screen: 'Home' });
      }
    },
    [handleMarkAsRead, navigation],
  );

  const handleConfirmClearAll = useCallback(() => {
    setItems([]);
    setClearModalVisible(false);
    showToast({
      type: 'info',
      message: 'All notifications cleared',
    });
  }, []);

  // Filter Chip Config
  const filterChips: { id: NotificationFilter; label: string; icon?: string; count?: number }[] = [
    { id: 'all', label: 'All', count: items.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'interest', label: 'Interests', icon: 'heart' },
    { id: 'match', label: 'Matches', icon: 'sparkles' },
    { id: 'message', label: 'Messages', icon: 'message-circle' },
  ];

  // Render FlashList items
  const renderItem: ListRenderItem<ListItem> = useCallback(
    ({ item }) => {
      if (item.kind === 'header') {
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{item.title}</Text>
            <View style={styles.sectionHeaderDivider} />
          </View>
        );
      }

      return (
        <NotificationItem
          item={item.data}
          onPress={handleMarkAsRead}
          onDelete={handleDeleteItem}
          onAcceptInterest={handleAcceptInterest}
          onDeclineInterest={handleDeclineInterest}
          onActionPress={handleActionPress}
        />
      );
    },
    [
      handleMarkAsRead,
      handleDeleteItem,
      handleAcceptInterest,
      handleDeclineInterest,
      handleActionPress,
    ],
  );

  // Render Empty State
  const renderEmptyState = () => {
    let icon = 'bell-off';
    let title = 'No notifications yet';
    let subtitle = 'New interests, matches, and messages will appear here.';
    let iconBg = '#FFF0F1';
    let iconColor: string = COLORS.themeColor;

    if (activeFilter === 'unread') {
      icon = 'check-check';
      title = 'You’re all caught up! ✨';
      subtitle = 'You have no unread notifications right now.';
      iconBg = '#ECFDF5';
      iconColor = '#059669';
    } else if (activeFilter === 'interest') {
      icon = 'heart';
      title = 'No interest requests yet';
      subtitle = 'When someone likes your profile, you will receive connection requests here.';
      iconBg = '#FFF1F2';
      iconColor = '#E11D48';
    } else if (activeFilter === 'match') {
      icon = 'sparkles';
      title = 'No mutual matches yet';
      subtitle = 'Like profiles you are interested in. When they like you back, it is a match!';
      iconBg = '#FEF3C7';
      iconColor = '#D97706';
    } else if (activeFilter === 'message') {
      icon = 'message-circle';
      title = 'No message alerts';
      subtitle = 'Direct chats and updates with prospective matches will be shown here.';
      iconBg = '#EFF6FF';
      iconColor = '#2563EB';
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={[styles.emptyIconCircle, { backgroundColor: iconBg }]}>
          <CustomLucidIcons name={icon} color={iconColor} size={30} strokeWidth={2} />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>

        {activeFilter !== 'all' ? (
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={styles.emptyActionBtnText}>View All Notifications</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => navigation.navigate('BottomTab', { screen: 'Matches' })}
          >
            <CustomLucidIcons name="compass" color={COLORS.white} size={16} />
            <Text style={styles.emptyActionBtnText}>Explore Matches</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <CustomLucidIcons name="arrow-left" color="#1A1A1A" size={20} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notifications</Text>

          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>

        {items.length > 0 && (
          <View style={styles.headerRight}>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                style={styles.markReadBtn}
                accessibilityLabel="Mark all as read"
              >
                <CustomLucidIcons name="check-check" color={COLORS.themeColor} size={17} />
                <Text style={styles.markReadBtnText}>Mark read</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setClearModalVisible(true)}
              style={styles.clearBtn}
              accessibilityLabel="Clear all notifications"
            >
              <CustomLucidIcons name="trash-2" color="#8E8E93" size={17} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Filter Chips Bar */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterChips.map(chip => {
            const isSelected = activeFilter === chip.id;
            return (
              <Pressable
                key={chip.id}
                onPress={() => setActiveFilter(chip.id)}
                style={({ pressed }) => [
                  styles.filterChip,
                  isSelected && styles.selectedFilterChip,
                  pressed && styles.filterChipPressed,
                ]}
              >
                {!!chip.icon && (
                  <CustomLucidIcons
                    name={chip.icon}
                    color={isSelected ? COLORS.white : '#666666'}
                    size={13}
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.selectedFilterChipText,
                  ]}
                >
                  {chip.label}
                </Text>

                {chip.count !== undefined && chip.count > 0 && (
                  <View
                    style={[
                      styles.filterChipBadge,
                      isSelected && styles.selectedFilterChipBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipBadgeText,
                        isSelected && styles.selectedFilterChipBadgeText,
                      ]}
                    >
                      {chip.count}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Unread Alert Banner */}
      {unreadCount > 0 && activeFilter === 'all' && (
        <View style={styles.unreadBanner}>
          <View style={styles.unreadBannerLeft}>
            <View style={styles.unreadBannerIconBox}>
              <CustomLucidIcons name="bell" color={COLORS.themeColor} size={15} />
            </View>
            <Text style={styles.unreadBannerText}>
              You have <Text style={styles.unreadBannerBold}>{unreadCount} unread</Text> {unreadCount === 1 ? 'update' : 'updates'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.unreadBannerAction}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications FlashList */}
      <View style={styles.listContainer}>
        <FlashList
          data={sectionedList}
          keyExtractor={(item, index) =>
            item.kind === 'header' ? `header-${item.title}` : item.data.id || String(index)
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>

      {/* Clear All Confirmation Modal */}
      <Modal
        visible={clearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setClearModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setClearModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={e => e.stopPropagation()}>
            <View style={styles.modalIconBox}>
              <CustomLucidIcons name="trash-2" color={COLORS.themeColor} size={26} />
            </View>

            <Text style={styles.modalTitle}>Clear All Notifications?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete all notifications? This action cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setClearModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmClearAll}
              >
                <Text style={styles.modalConfirmBtnText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#111111',
    fontFamily: fontFamily.Inter24Bold,
  },
  unreadBadge: {
    backgroundColor: '#FFF0F1',
    borderColor: '#FECDD3',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 11,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  markReadBtnText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 11.5,
  },
  clearBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F7F8',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.themeColor,
    borderColor: COLORS.themeColor,
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipPressed: {
    opacity: 0.8,
  },
  filterChipText: {
    color: '#555555',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12.5,
  },
  selectedFilterChipText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  filterChipBadge: {
    backgroundColor: '#EAEAEA',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  selectedFilterChipBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterChipBadgeText: {
    color: '#555555',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 10.5,
  },
  selectedFilterChipBadgeText: {
    color: COLORS.white,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  unreadBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  unreadBannerIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBannerText: {
    color: '#2D2D2D',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
    flex: 1,
  },
  unreadBannerBold: {
    fontFamily: fontFamily.Inter18Bold,
    color: COLORS.themeColor,
  },
  unreadBannerAction: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 14,
  },
  sectionHeaderText: {
    color: '#8E8E93',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: 10,
  },
  sectionHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EBEBEB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 40,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#1A1A1A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.themeColor,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  emptyActionBtnText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF0F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#1A1A1A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    color: '#666666',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    color: '#4B5563',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13.5,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: COLORS.themeColor,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13.5,
  },
});

export default NotificationScreen;
