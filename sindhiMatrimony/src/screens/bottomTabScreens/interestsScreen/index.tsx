import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { apiFetch, ApiURL } from '../../../redux/apiService';
import { toast } from '../../../toastMessage/toast';

export type InterestSection = 'Received' | 'Sent';
export type InterestStatusFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface InterestCandidate {
  _id: string;
  name: string;
  age?: number;
  height?: string;
  subcaste?: string;
  city?: string;
  state?: string;
  profession?: string;
  companyName?: string;
  avatar?: string;
  verified?: boolean;
}

export interface InterestItem {
  _id: string;
  direction?: 'RECEIVED' | 'SENT';
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  personalizedNote?: string;
  sentAt?: number;
  respondedAt?: number;
  remindedAt?: number;
  senderProfile?: InterestCandidate;
  receiverProfile?: InterestCandidate;
}

const STATUS_CHIPS: { id: InterestStatusFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ACCEPTED', label: 'Accepted' },
  { id: 'DECLINED', label: 'Declined' },
];

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return 'Recently';
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

const InterestsScreen = () => {
  const [mode, setMode] = useState<'regular' | 'prime'>('regular');
  const [tab, setTab] = useState<InterestSection>('Received');
  const [status, setStatus] = useState<InterestStatusFilter>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [badgeCounts, setBadgeCounts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch badge counts
  const fetchBadgeCounts = useCallback(async () => {
    try {
      const res = await apiFetch<any>({
        url: ApiURL.interestsBadgeCount,
        method: 'GET',
        showErrorToast: false,
      });
      if (res && res.data) {
        setBadgeCounts(res.data);
      }
    } catch {
      // Non-blocking
    }
  }, []);

  // Fetch interests
  const fetchInterests = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const endpoint =
          tab === 'Received'
            ? ApiURL.interestsReceived
            : ApiURL.interestsSent;

        const res = await apiFetch<any>({
          url: endpoint,
          method: 'GET',
          params: {
            status,
            search: debouncedSearch.trim() || undefined,
            page: 1,
            limit: 30,
          },
          showErrorToast: false,
        });

        if (res && res.data && Array.isArray(res.data.interests)) {
          setInterests(res.data.interests);
        } else {
          setInterests([]);
        }
      } catch (err) {
        console.warn('Failed to load interests', err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [tab, status, debouncedSearch]
  );

  useEffect(() => {
    fetchInterests();
    fetchBadgeCounts();
  }, [fetchInterests, fetchBadgeCounts]);

  // Actions
  const handleAccept = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsAccept(interestId),
          method: 'PUT',
        });
        if (!res.error) {
          toast.success(res.message || 'Interest accepted!');
          setInterests(prev =>
            prev.map(item =>
              item._id === interestId ? { ...item, status: 'ACCEPTED' } : item
            )
          );
          fetchBadgeCounts();
        } else {
          toast.error(res.message || 'Failed to accept interest');
        }
      } catch {
        toast.error('Failed to accept interest');
      }
    },
    [fetchBadgeCounts]
  );

  const handleDecline = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsDecline(interestId),
          method: 'PUT',
        });
        if (!res.error) {
          toast.info('Interest politely declined');
          setInterests(prev =>
            prev.map(item =>
              item._id === interestId ? { ...item, status: 'DECLINED' } : item
            )
          );
          fetchBadgeCounts();
        } else {
          toast.error(res.message || 'Failed to decline interest');
        }
      } catch {
        toast.error('Failed to decline interest');
      }
    },
    [fetchBadgeCounts]
  );

  const handleRemind = useCallback(async (interestId: string) => {
    try {
      const res = await apiFetch<any>({
        url: ApiURL.interestsRemind(interestId),
        method: 'PUT',
      });
      if (!res.error) {
        toast.success('Reminder sent successfully');
        setInterests(prev =>
          prev.map(item =>
            item._id === interestId
              ? { ...item, remindedAt: Date.now() }
              : item
          )
        );
      }
    } catch {
      toast.error('Failed to send reminder');
    }
  }, []);

  const handleCancel = useCallback(
    async (interestId: string) => {
      try {
        const res = await apiFetch<any>({
          url: ApiURL.interestsCancel(interestId),
          method: 'DELETE',
        });
        if (!res.error) {
          toast.info('Interest withdrawn');
          setInterests(prev => prev.filter(item => item._id !== interestId));
          fetchBadgeCounts();
        }
      } catch {
        toast.error('Failed to withdraw interest');
      }
    },
    [fetchBadgeCounts]
  );

  // Counts lookup
  const getCountForStatus = (statusKey: InterestStatusFilter) => {
    if (!badgeCounts) return null;
    const bucket = tab === 'Received' ? badgeCounts.received : badgeCounts.sent;
    if (!bucket) return null;
    if (statusKey === 'ALL') return bucket.all;
    if (statusKey === 'PENDING') return bucket.pending;
    if (statusKey === 'ACCEPTED') return bucket.accepted;
    if (statusKey === 'DECLINED') return bucket.declined;
    return null;
  };

  // Render Item
  const renderInterestCard = ({ item }: { item: InterestItem }) => {
    const profile = tab === 'Received' ? item.senderProfile : item.receiverProfile;
    const candidateName = profile?.name || 'Member';
    const avatarUrl = profile?.avatar;
    const isPending = item.status === 'PENDING';
    const isAccepted = item.status === 'ACCEPTED';
    const isDeclined = item.status === 'DECLINED';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {candidateName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {profile?.verified && (
              <View style={styles.verifiedBadge}>
                <CustomLucidIcons name="check" size={10} color={COLORS.white} />
              </View>
            )}
          </View>

          {/* Core Info */}
          <View style={styles.cardCopy}>
            <View style={styles.cardTopRow}>
              <Text style={styles.candidateName} numberOfLines={1}>
                {candidateName}
                {profile?.age ? `, ${profile.age}` : ''}
              </Text>
              <Text style={styles.timeAgo}>{formatTimestamp(item.sentAt)}</Text>
            </View>

            {/* Subcaste & City */}
            <Text style={styles.subcasteText} numberOfLines={1}>
              {profile?.subcaste ? `Sindhi : ${profile.subcaste}` : 'Sindhi'}
              {profile?.city ? ` · ${profile.city}` : ''}
            </Text>

            {/* Profession */}
            {!!profile?.profession && (
              <Text style={styles.professionText} numberOfLines={1}>
                {profile.profession}
              </Text>
            )}
          </View>
        </View>

        {/* Personalized Message Note */}
        {!!item.personalizedNote && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText} numberOfLines={2}>
              &ldquo;{item.personalizedNote}&rdquo;
            </Text>
          </View>
        )}

        {/* Status & Actions Footer */}
        <View style={styles.cardFooter}>
          {/* Status Label */}
          <View style={styles.statusPill}>
            {isPending && (
              <View style={[styles.badge, styles.pendingBadge]}>
                <CustomLucidIcons name="clock" size={12} color="#B45309" />
                <Text style={styles.pendingBadgeText}>
                  {tab === 'Received' ? 'Awaiting response' : 'Sent - Pending'}
                </Text>
              </View>
            )}
            {isAccepted && (
              <View style={[styles.badge, styles.acceptedBadge]}>
                <CustomLucidIcons name="check" size={12} color="#047857" />
                <Text style={styles.acceptedBadgeText}>Accepted</Text>
              </View>
            )}
            {isDeclined && (
              <View style={[styles.badge, styles.declinedBadge]}>
                <CustomLucidIcons name="x" size={12} color="#6B7280" />
                <Text style={styles.declinedBadgeText}>Declined</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.cardActions}>
            {tab === 'Received' && isPending && (
              <>
                <Pressable
                  style={styles.declineButton}
                  onPress={() => handleDecline(item._id)}
                  hitSlop={8}
                >
                  <CustomLucidIcons name="x" size={16} color="#DC2626" />
                </Pressable>
                <Pressable
                  style={styles.acceptButton}
                  onPress={() => handleAccept(item._id)}
                  hitSlop={8}
                >
                  <CustomLucidIcons name="check" size={16} color={COLORS.white} />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </Pressable>
              </>
            )}

            {tab === 'Received' && isAccepted && (
              <View style={styles.actionRow}>
                <View style={styles.chatActionBtn}>
                  <CustomLucidIcons
                    name="message-square"
                    size={14}
                    color={COLORS.white}
                  />
                  <Text style={styles.chatActionText}>Chat</Text>
                </View>
              </View>
            )}

            {tab === 'Sent' && isPending && (
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.withdrawBtn}
                  onPress={() => handleCancel(item._id)}
                >
                  <Text style={styles.withdrawText}>Withdraw</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.remindBtn,
                    !!item.remindedAt && styles.remindBtnDisabled,
                  ]}
                  disabled={!!item.remindedAt}
                  onPress={() => handleRemind(item._id)}
                >
                  <CustomLucidIcons
                    name="bell"
                    size={13}
                    color={item.remindedAt ? '#888' : COLORS.white}
                  />
                  <Text
                    style={[
                      styles.remindText,
                      !!item.remindedAt && styles.remindTextDisabled,
                    ]}
                  >
                    {item.remindedAt ? 'Reminded' : 'Remind'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Empty State Matching Screenshot 1
  const renderEmptyState = () => {
    const isPending = status === 'PENDING';
    const title =
      isPending
        ? 'You have no pending interests.'
        : status === 'ACCEPTED'
        ? 'You have no accepted interests.'
        : status === 'DECLINED'
        ? 'You have no declined interests.'
        : 'You have no interests in this folder.';

    return (
      <View style={styles.emptyContainer}>
        {/* Smartphone Illustration matching Screenshot */}
        <View style={styles.illustrationWrap}>
          <View style={styles.illustrationPhone}>
            <View style={styles.speakerBar} />
            <View style={styles.chatLine1} />
            <View style={styles.chatLine2} />
            <View style={styles.chatLine3} />
            <View style={styles.phoneHomeBtn} />
          </View>
          <View style={styles.illustrationShadow} />
        </View>

        <Text style={styles.emptySubtitle}>No pending conversations till now</Text>
        <Text style={styles.emptyTitle}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {/* 1. Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Mailbox & Connects</Text>
          <Text style={styles.headerTitle}>Interests</Text>
        </View>
        <Pressable
          style={styles.refreshIconBtn}
          onPress={() => {
            fetchInterests(false);
            fetchBadgeCounts();
          }}
        >
          <CustomLucidIcons
            name="refresh-cw"
            size={18}
            color={COLORS.inactiveTab}
          />
        </Pressable>
      </View>

      {/* 2. Sub-Header: Mode Switcher (Regular vs PRIME*) */}
      <View style={styles.modeSwitcherContainer}>
        <View style={styles.modePillWrap}>
          <Pressable
            style={[
              styles.modePill,
              mode === 'regular' && styles.modePillActive,
            ]}
            onPress={() => setMode('regular')}
          >
            <Text
              style={[
                styles.modePillText,
                mode === 'regular' && styles.modePillTextActive,
              ]}
            >
              Regular
            </Text>
          </Pressable>

          <Pressable
            style={[styles.modePill, mode === 'prime' && styles.modePillActive]}
            onPress={() => setMode('prime')}
          >
            <Text
              style={[
                styles.modePillText,
                mode === 'prime' && styles.modePillTextActive,
              ]}
            >
              PRIME <Text style={styles.starText}>*</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 3. Primary Tabs: Received vs Sent */}
      <View style={styles.primaryTabs}>
        {(['Received', 'Sent'] as const).map(item => {
          const isActive = tab === item;
          return (
            <Pressable
              key={item}
              onPress={() => setTab(item)}
              style={[styles.primaryTab, isActive && styles.primaryTabActive]}
            >
              <Text
                style={[
                  styles.primaryTabText,
                  isActive && styles.primaryTabTextActive,
                ]}
              >
                {item === 'Received' ? 'Interests Received' : 'Interests Sent'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 4. Sub-Filter Status Chips (All, Pending, Accepted, Declined) */}
      <View style={styles.filterChipsRow}>
        {STATUS_CHIPS.map(chip => {
          const isSelected = status === chip.id;
          const count = getCountForStatus(chip.id);

          return (
            <Pressable
              key={chip.id}
              onPress={() => setStatus(chip.id)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {chip.label}
                {count !== null && count > 0 ? ` (${count})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 5. Search Bar */}
      <View style={styles.searchBar}>
        <CustomLucidIcons
          name="search"
          size={16}
          color={COLORS.inactiveTab}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search in Mailbox"
          placeholderTextColor="#999"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {!!searchQuery && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <CustomLucidIcons name="x" size={15} color="#888" />
          </Pressable>
        )}
      </View>

      {/* 6. List Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.themeColor} />
          <Text style={styles.loadingText}>Loading interests...</Text>
        </View>
      ) : (
        <FlatList
          data={interests}
          keyExtractor={item => item._id}
          renderItem={renderInterestCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                fetchInterests(false);
                fetchBadgeCounts();
              }}
              tintColor={COLORS.themeColor}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8F9FA',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eyebrow: {
    color: '#888',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 20,
    marginTop: 2,
  },
  refreshIconBtn: {
    borderRadius: 8,
    padding: 6,
  },
  // Sub-Header Mode Switcher
  modeSwitcherContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingBottom: 10,
    paddingTop: 8,
  },
  modePillWrap: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    flexDirection: 'row',
    padding: 3,
  },
  modePill: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  modePillActive: {
    backgroundColor: COLORS.themeColor,
  },
  modePillText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  modePillTextActive: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  starText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  // Primary Tabs
  primaryTabs: {
    backgroundColor: COLORS.white,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  primaryTab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2.5,
    flex: 1,
    paddingVertical: 10,
  },
  primaryTabActive: {
    borderBottomColor: COLORS.themeColor,
  },
  primaryTabText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
  },
  primaryTabTextActive: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  // Status Chips
  filterChipsRow: {
    backgroundColor: COLORS.white,
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipSelected: {
    backgroundColor: '#FFF1F2',
    borderColor: COLORS.themeColor,
  },
  chipText: {
    color: '#475569',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  chipTextSelected: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  // Search bar
  searchBar: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    color: '#1E293B',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    paddingVertical: 8,
  },
  // List
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    marginTop: 8,
  },
  // Card
  card: {
    backgroundColor: COLORS.white,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: '#FFE4E6',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarInitial: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 20,
  },
  verifiedBadge: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    bottom: -2,
    height: 16,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    width: 16,
  },
  cardCopy: {
    flex: 1,
    marginLeft: 12,
  },
  cardTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  candidateName: {
    color: '#0F172A',
    flex: 1,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 15,
  },
  timeAgo: {
    color: '#94A3B8',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    marginLeft: 6,
  },
  subcasteText: {
    color: '#475569',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
    marginTop: 2,
  },
  professionText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    marginTop: 2,
  },
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 10,
    padding: 8,
  },
  noteText: {
    color: '#334155',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    fontStyle: 'italic',
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: '#F1F5F9',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
  },
  statusPill: {
    flexDirection: 'row',
  },
  badge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingBadgeText: {
    color: '#B45309',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 10,
    marginLeft: 4,
  },
  acceptedBadge: {
    backgroundColor: '#D1FAE5',
  },
  acceptedBadgeText: {
    color: '#047857',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 10,
    marginLeft: 4,
  },
  declinedBadge: {
    backgroundColor: '#F3F4F6',
  },
  declinedBadgeText: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 10,
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 16,
    flexDirection: 'row',
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptButtonText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 11,
    marginLeft: 4,
  },
  declineButton: {
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  chatActionBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 14,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chatActionText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    marginLeft: 4,
  },
  withdrawBtn: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  withdrawText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
  },
  remindBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 14,
    flexDirection: 'row',
    marginLeft: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  remindBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  remindText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    marginLeft: 4,
  },
  remindTextDisabled: {
    color: '#94A3B8',
  },
  // Empty State Matching Screenshot 1
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  illustrationWrap: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    width: 140,
  },
  illustrationPhone: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#334155',
    borderRadius: 10,
    borderWidth: 2.5,
    height: 96,
    paddingTop: 6,
    width: 56,
    zIndex: 2,
  },
  speakerBar: {
    backgroundColor: '#94A3B8',
    borderRadius: 1,
    height: 2,
    marginBottom: 8,
    width: 16,
  },
  chatLine1: {
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    height: 5,
    marginBottom: 5,
    width: 34,
  },
  chatLine2: {
    backgroundColor: '#FEE2E2',
    borderRadius: 2,
    height: 5,
    marginBottom: 5,
    width: 38,
  },
  chatLine3: {
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    height: 5,
    width: 28,
  },
  phoneHomeBtn: {
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    bottom: 5,
    height: 4,
    position: 'absolute',
    width: 10,
  },
  illustrationShadow: {
    backgroundColor: '#E2E8F0',
    borderRadius: 30,
    bottom: 12,
    height: 8,
    position: 'absolute',
    width: 110,
  },
  emptySubtitle: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default InterestsScreen;
