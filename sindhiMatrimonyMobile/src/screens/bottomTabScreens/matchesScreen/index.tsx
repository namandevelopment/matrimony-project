import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import FilterModal from '../../../customModals/FilterModal';
import SortByModal from '../../../customModals/SortByModal';
import MatchesLayoutModal, { MatchLayoutType } from '../../../customModals/MatchesLayoutModal';
import rawMatchesData from '../../../staticData/matchesData.json';

interface MatchProfile {
  id: string;
  name: string;
  profileId: string;
  lastSeen: string;
  age: number;
  height: string;
  education: string;
  profession: string;
  location: string;
  verified: boolean;
  photoCount: number;
  imageUrl: string;
  isShortlisted: boolean;
}

const MatchesScreen: React.FC = () => {
  const [activePlan, setActivePlan] = useState<'regular' | 'prime'>('regular');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'newlyJoined' | 'more'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('Filter');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [isLayoutModalVisible, setIsLayoutModalVisible] = useState(false);
  const [layoutMode, setLayoutMode] = useState<MatchLayoutType>('photo');
  const [selectedSort, setSelectedSort] = useState('lastActive');
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [matches, setMatches] = useState<MatchProfile[]>(rawMatchesData as MatchProfile[]);

  const handleApplyFilters = useCallback((filters: Record<string, any>) => {
    setAppliedFilters(filters);
    // Ready for API integration: e.g. dispatch(getFilteredMatches(filters))
  }, []);

  const toggleShortlist = useCallback((id: string) => {
    setMatches(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isShortlisted: !item.isShortlisted } : item
      )
    );
  }, []);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Sub navigation tabs: All matches | Newly joined | More */}
      <View style={styles.subTabsRow}>
        <TouchableOpacity
          onPress={() => setActiveSubTab('all')}
          style={styles.subTabItem}
          activeOpacity={0.7}
        >
          <View style={styles.tabContentWrapper}>
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'all' && styles.subTabTextActive,
              ]}
            >
              All matches
            </Text>
            {activeSubTab === 'all' && <View style={styles.activeTabIndicator} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('newlyJoined')}
          style={styles.subTabItem}
          activeOpacity={0.7}
        >
          <View style={styles.tabContentWrapper}>
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'newlyJoined' && styles.subTabTextActive,
              ]}
            >
              Newly joined
            </Text>
            {activeSubTab === 'newlyJoined' && (
              <View style={styles.activeTabIndicator} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('more')}
          style={styles.subTabItem}
          activeOpacity={0.7}
        >
          <View style={[styles.tabContentWrapper, styles.tabContentWithIcon]}>
            <Text
              style={[
                styles.subTabText,
                activeSubTab === 'more' && styles.subTabTextActive,
              ]}
            >
              More
            </Text>
            <CustomLucidIcons
              name="chevron-down"
              size={16}
              color={activeSubTab === 'more' ? COLORS.themeColor : '#555555'}
            />
            {activeSubTab === 'more' && <View style={styles.activeTabIndicator} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Matches count & Preferences row */}
      <View style={styles.countRow}>
        <Text style={styles.matchesCountText}>
          <Text style={styles.boldMatchesText}>
            {matches.length} Matches based on your{' '}
          </Text>
          <Text style={styles.preferencesLinkText}>preferences</Text>
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => setIsLayoutModalVisible(true)}
        >
          <CustomLucidIcons name="more-vertical" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips Horizontal List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsScroll}
      >
        <TouchableOpacity
          style={styles.filterChip}
          onPress={() => {
            setActiveFilter('Filter');
            setIsFilterModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <CustomLucidIcons name="sliders-horizontal" size={14} color="#374151" />
          <Text style={styles.chipText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, isSortModalVisible && styles.activeChip]}
          onPress={() => {
            setActiveFilter('Sort by');
            setIsSortModalVisible(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, isSortModalVisible && styles.activeChipText]}>
            Sort by
          </Text>
          <CustomLucidIcons
            name="chevron-down"
            size={14}
            color={isSortModalVisible ? COLORS.themeColor : '#374151'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'Newly joined' && styles.activeChip,
          ]}
          onPress={() => setActiveFilter('Newly joined')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              activeFilter === 'Newly joined' && styles.activeChipText,
            ]}
          >
            Newly joined
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'Nearby' && styles.activeChip,
          ]}
          onPress={() => setActiveFilter('Nearby')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              activeFilter === 'Nearby' && styles.activeChipText,
            ]}
          >
            Nearby
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'With Photo' && styles.activeChip,
          ]}
          onPress={() => setActiveFilter('With Photo')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.chipText,
              activeFilter === 'With Photo' && styles.activeChipText,
            ]}
          >
            With Photo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderMatchCard = ({ item }: { item: MatchProfile }) => {
    if (layoutMode === 'list') {
      return (
        <View style={styles.listCardContainer}>
          <View style={styles.listCardTopRow}>
            <View style={styles.listImageWrapper}>
              <Image
                source={{ uri: item.imageUrl }}
                defaultSource={require('../../../assets/images/user_avatar.png')}
                style={styles.listProfileImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.listShortlistBtn}
                onPress={() => toggleShortlist(item.id)}
                activeOpacity={0.8}
              >
                <CustomLucidIcons
                  name="star"
                  size={14}
                  color={item.isShortlisted ? '#FF4A57' : '#FFFFFF'}
                />
              </TouchableOpacity>
              <View style={styles.listPhotoCountBadge}>
                <Text style={styles.listPhotoCountText}>{item.photoCount}</Text>
                <CustomLucidIcons name="image" size={10} color="#111827" />
              </View>
            </View>

            <View style={styles.listDetailsCol}>
              {item.verified && (
                <View style={styles.verifiedRow}>
                  <CustomLucidIcons name="check-circle-2" size={14} color="#0288D1" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
              <Text style={styles.profileName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.profileIdText}>{item.profileId} | {item.lastSeen}</Text>
              <Text style={styles.listAttributesText} numberOfLines={2}>
                {item.age} Yrs • {item.height} • {item.education} • {item.profession} • {item.location}
              </Text>
            </View>
          </View>

          <View style={styles.listMessageNoteWrapper}>
            <Text style={styles.listSentNote}>You sent her a message - 30 Oct 2026</Text>
            <Text style={styles.listMessageQuote}>
              Greetings! I came across your ... <Text style={styles.listReadMoreText}>Read more &gt;</Text>
            </Text>
          </View>

          <View style={styles.listActionButtonsRow}>
            <TouchableOpacity style={styles.listCallBtn} activeOpacity={0.7}>
              <CustomLucidIcons name="phone" size={15} color="#FF4A57" />
              <Text style={styles.listCallBtnText}>Call Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.listSendMsgBtn} activeOpacity={0.7}>
              <CustomLucidIcons name="mail" size={15} color="#FFFFFF" />
              <Text style={styles.listSendMsgBtnText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.cardContainer}>
        {/* Photo Container with Top Right Shortlist and Bottom Right Photo Count */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            defaultSource={require('../../../assets/images/user_avatar.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />

          {/* Shortlist Floating Pill */}
          <TouchableOpacity
            style={styles.shortlistBadge}
            onPress={() => toggleShortlist(item.id)}
            activeOpacity={0.8}
          >
            <CustomLucidIcons
              name="bookmark"
              size={14}
              color={item.isShortlisted ? '#FF4A57' : '#FFFFFF'}
            />
            <Text style={styles.shortlistText}>Shortlist</Text>
          </TouchableOpacity>

          {/* Photo Count Floating Badge */}
          <View style={styles.photoCountBadge}>
            <Text style={styles.photoCountText}>{item.photoCount}</Text>
            <CustomLucidIcons name="image" size={12} color="#111827" />
          </View>
        </View>

        {/* Card Body Details */}
        <View style={styles.cardBody}>
          {/* Verified Badge */}
          {item.verified && (
            <View style={styles.verifiedRow}>
              <CustomLucidIcons name="check-circle-2" size={15} color="#0288D1" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {/* Name & Contact Row */}
          <View style={styles.nameActionRow}>
            <View style={styles.nameDetailsCol}>
              <Text style={styles.profileName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.profileIdText}>
                {item.profileId} | {item.lastSeen}
              </Text>
            </View>

            {/* Circular Call & WhatsApp Action Buttons */}
            <View style={styles.contactButtonsRow}>
              <TouchableOpacity
                style={styles.callCircleBtn}
                activeOpacity={0.7}
                accessibilityLabel="Call"
              >
                <CustomLucidIcons name="phone" size={18} color="#F97316" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whatsappCircleBtn}
                activeOpacity={0.7}
                accessibilityLabel="WhatsApp"
              >
                <CustomLucidIcons name="message-circle" size={18} color="#22C55E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Attributes Info */}
          <Text style={styles.attributesText}>
            {item.age} Yrs • {item.height} • {item.education} • {item.profession} •{' '}
            {item.location}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar backgroundColor={COLORS.themeColor} barStyle="light-content" />

      {/* Top Header with Regular / PRIME Toggle */}
      <View style={styles.topRedHeader}>
        <View style={styles.planToggleWrapper}>
          <TouchableOpacity
            style={styles.toggleSegment}
            onPress={() => setActivePlan('regular')}
            activeOpacity={0.85}
          >
            {activePlan === 'regular' ? (
              <LinearGradient
                colors={[...COLORS.linearGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activePillGradient}
              >
                <Text style={styles.activePillText}>Regular</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactivePillText}>Regular</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleSegment}
            onPress={() => setActivePlan('prime')}
            activeOpacity={0.85}
          >
            {activePlan === 'prime' ? (
              <LinearGradient
                colors={[...COLORS.linearGradient]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activePillGradient}
              >
                <Text style={styles.activePillText}>PRIME</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactivePillText}>PRIME</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main List */}
      <FlashList
        data={matches}
        estimatedItemSize={250}
        keyExtractor={item => item.id}
        renderItem={renderMatchCard}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Full Screen Slide-Up Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialValues={appliedFilters}
        totalMatches={matches.length}
      />

      {/* Sort By Bottom Sheet Modal */}
      <SortByModal
        isVisible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        selectedSortId={selectedSort}
        onApply={(sortId) => setSelectedSort(sortId)}
      />

      {/* Matches Display Layout Bottom Sheet Modal */}
      <MatchesLayoutModal
        isVisible={isLayoutModalVisible}
        onClose={() => setIsLayoutModalVisible(false)}
        selectedLayout={layoutMode}
        onSelectLayout={(layout) => setLayoutMode(layout)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topRedHeader: {
    backgroundColor: COLORS.themeColor,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planToggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleSegment: {
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePillGradient: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: fontFamily.Inter18Bold,
  },
  inactivePillText: {
    color: '#111827',
    fontSize: 14,
    fontFamily: fontFamily.Inter18Bold,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContentWrapper: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabContentWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subTabText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Medium,
    color: '#4B5563',
  },
  subTabTextActive: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.themeColor,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  matchesCountText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Regular,
  },
  boldMatchesText: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
  },
  preferencesLinkText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
  },
  filterChipsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  activeChip: {
    borderColor: COLORS.themeColor,
    backgroundColor: '#FFF1F2',
  },
  chipText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Medium,
    color: '#374151',
  },
  activeChipText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  listContentContainer: {
    paddingBottom: 30,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 370,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  shortlistBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  shortlistText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fontFamily.Inter18Bold,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  photoCountText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#0288D1',
  },
  nameActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  nameDetailsCol: {
    flex: 1,
    marginRight: 12,
  },
  profileName: {
    fontSize: 20,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  profileIdText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
    marginTop: 2,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  callCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  whatsappCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.2,
    borderColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  attributesText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Medium,
    color: '#374151',
    lineHeight: 20,
    marginTop: 10,
  },
  listCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  listCardTopRow: {
    flexDirection: 'row',
  },
  listImageWrapper: {
    width: 110,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  listProfileImage: {
    width: '100%',
    height: '100%',
  },
  listShortlistBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPhotoCountBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listPhotoCountText: {
    fontSize: 10,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  listDetailsCol: {
    flex: 1,
    marginLeft: 12,
  },
  listAttributesText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 4,
  },
  listMessageNoteWrapper: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  listSentNote: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
  },
  listMessageQuote: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#374151',
    marginTop: 2,
  },
  listReadMoreText: {
    color: '#F97316',
    fontFamily: fontFamily.Inter18Medium,
  },
  listActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  listCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4A57',
    backgroundColor: '#FFFFFF',
  },
  listCallBtnText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#FF4A57',
  },
  listSendMsgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#FF4A57',
  },
  listSendMsgBtnText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#FFFFFF',
  },
});

export default MatchesScreen;
