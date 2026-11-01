import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import fontFamily from '../../../components/fontFamily';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { ApiURL } from '../../../redux/apiService';
import { useApiQuery } from '../../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../../tanstackQuery/keys';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  location?: string;
  profession?: string;
  imageUrl?: string;
  photoUrl?: string;
  avatar?: string;
}

interface AllMatchesSectionProps {
  matches?: MatchProfile[];
  matchCount?: number;
  onProfilePress?: (profile: MatchProfile) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ALL_MATCHES_PARAMS = { page: 1, limit: 20 };
const ALL_MATCHES_QUERY_KEY = QUERY_KEYS.allMatches(ALL_MATCHES_PARAMS);
const EMPTY_MATCHES: MatchProfile[] = [];

// -----------------------------------------------------------------------------
// 3. MEMOIZED MATCH CARD COMPONENT
// -----------------------------------------------------------------------------
interface MatchCardProps {
  item: MatchProfile;
  onPress?: (profile: MatchProfile) => void;
}

const MatchCard: React.FC<MatchCardProps> = React.memo(({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  const imageUri = item.imageUrl || item.photoUrl || item.avatar || (item as any).photos?.[0]?.url;
  const name = item.name || (item as any).fullName || ((item as any).firstName ? `${(item as any).firstName} ${(item as any).lastName || ''}`.trim() : 'Member');
  const age = item.age || 25;
  const height = item.height || "5'2\"";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      {/* Profile Image with smooth rounded corners */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            imageError || !imageUri
              ? require('../../../assets/images/user_avatar.png')
              : { uri: imageUri }
          }
          style={styles.profileImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      </View>

      {/* Profile Name */}
      <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>

      {/* Age & Height */}
      <Text style={styles.profileDetails} numberOfLines={1}>
        {age} Yrs, {height}
      </Text>
    </TouchableOpacity>
  );
});


// -----------------------------------------------------------------------------
// 4. MEMOIZED ALL MATCHES SECTION COMPONENT
// -----------------------------------------------------------------------------
const AllMatchesSection: React.FC<AllMatchesSectionProps> = React.memo(
  ({
    matches: initialMatches,
    matchCount: initialCount,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    // TanStack Query with memoized selector for zero re-renders
    const { data } = useApiQuery({
      queryKey: ALL_MATCHES_QUERY_KEY,
      url: ApiURL.allMatchesFeed,
      params: ALL_MATCHES_PARAMS,
      staleTime: 1000 * 60 * 5,
      select: useCallback((res: any) => {
        const list = Array.isArray(res?.items) ? res.items : Array.isArray(res?.list) ? res.list : [];
        const count = res?.totalMatchesCount ?? res?.total ?? list.length;
        return {
          matches: list,
          count: typeof count === 'number' ? count : list.length,
        };
      }, []),
    });

    const matches = (data?.matches && data.matches.length > 0)
      ? data.matches
      : (initialMatches && initialMatches.length > 0 ? initialMatches : EMPTY_MATCHES);
    const displayCount = data?.count ?? initialCount ?? matches.length;

    const onProfilePressRef = useRef(onProfilePress);
    onProfilePressRef.current = onProfilePress;

    const onViewAllRef = useRef(onViewAll);
    onViewAllRef.current = onViewAll;

    // Stable callbacks to prevent child re-renders
    const handleProfilePress = useCallback((profile: MatchProfile) => {
      onProfilePressRef.current?.(profile);
    }, []);

    const handleViewAllPress = useCallback(() => {
      onViewAllRef.current?.();
    }, []);

    // Render Item callback for FlashList
    const renderItem = useCallback(
      ({ item }: { item: MatchProfile }) => (
        <MatchCard item={item} onPress={handleProfilePress} />
      ),
      [handleProfilePress],
    );

    const keyExtractor = useCallback((item: any, idx: number) => String(item.id || item._id || item.matrimonyId || idx), []);

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Section Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>
            All Matches ({displayCount})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Members who match your partner preferences
          </Text>
        </View>

        {/* Horizontal List of Match Cards (No pagination here; View All handles pagination) */}
        <FlashList
          horizontal
          data={matches}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.horizontalList}
        />

        {/* "View all >" Capsule Outline Button */}
        <LoadingButton
          title="View all"
          onPress={handleViewAllPress}
          variant="outline"
          style={styles.viewAllBtn}
          textStyle={styles.viewAllText}
          rightIcon="chevron-right"
          iconColor="#DB2F3C"
          iconSize={16}
          iconStyle={styles.viewAllIcon}
          accessibilityLabel="View all matches"
          activeOpacity={0.78}
        />
      </View>
    );
  },
);

AllMatchesSection.displayName = 'AllMatchesSection';

export default AllMatchesSection;

// -----------------------------------------------------------------------------
// 5. STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  headerRow: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateVerticalScale(14),
  },
  sectionTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(17.5),
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    color: '#475569',
    marginTop: moderateVerticalScale(2),
  },

  // Horizontal List
  horizontalList: {
    overflow: 'visible',
  },
  listContent: {
    paddingLeft: moderateScale(14),
    paddingRight: moderateScale(8),
  },

  // Profile Card
  cardContainer: {
    width: moderateScale(130),
    marginRight: moderateScale(12),
  },
  imageWrapper: {
    width: moderateScale(130),
    height: moderateScale(142),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13.5),
    color: '#0F172A',
    marginTop: moderateVerticalScale(7),
  },
  profileDetails: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#64748B',
    marginTop: moderateVerticalScale(2),
  },

  // "View all >" Outline Capsule Button
  viewAllBtn: {
    marginHorizontal: moderateScale(14),
    marginTop: moderateVerticalScale(16),
    height: moderateVerticalScale(42),
    borderRadius: moderateScale(22),
    borderWidth: 1,
    borderColor: '#DB2F3C',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(14),
    color: '#DB2F3C',
    marginRight: moderateScale(4),
  },
  viewAllIcon: {
    marginTop: moderateVerticalScale(1),
  },
});
