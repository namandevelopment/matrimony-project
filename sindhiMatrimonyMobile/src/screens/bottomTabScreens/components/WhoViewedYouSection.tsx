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
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { IMAGES } from '../../../components/images';
import { ApiURL } from '../../../redux/apiService';
import { useApiQuery } from '../../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../../tanstackQuery/keys';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface ViewedProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  viewedOn?: string;
  viewedDate?: string;
  viewedAt?: string;
  imageUrl?: string;
  photoUrl?: string;
  avatar?: string;
  isPrime?: boolean;
}

interface WhoViewedYouSectionProps {
  data?: ViewedProfile[];
  count?: number;
  onProfilePress?: (profile: ViewedProfile) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. QUERY CONSTANTS
// -----------------------------------------------------------------------------
const WHO_VIEWED_YOU_PARAMS = { page: 1, limit: 10 };
const WHO_VIEWED_YOU_QUERY_KEY = [...QUERY_KEYS.whoViewedYou, WHO_VIEWED_YOU_PARAMS] as const;
const EMPTY_LIST: ViewedProfile[] = [];

// -----------------------------------------------------------------------------
// 3. MEMOIZED CARD COMPONENT
// -----------------------------------------------------------------------------
interface CardProps {
  item: ViewedProfile;
  onPress?: (profile: ViewedProfile) => void;
}

const ViewedProfileCard: React.FC<CardProps> = React.memo(({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  const imageUri = item.imageUrl || item.photoUrl || item.avatar;
  const name = item.name || 'Sindhi Candidate';
  const age = item.age || 25;
  const height = item.height || "5'2\"";
  const viewedDate = item.viewedOn || item.viewedDate || item.viewedAt || 'Recently';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      {/* Profile Image with smooth rounded corners & optional prime badge */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            imageError || !imageUri
              ? IMAGES.userAvatar
              : { uri: imageUri }
          }
          style={styles.profileImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Crown Badge if Prime/Featured Member */}
        {item.isPrime && (
          <View style={styles.crownBadge}>
            <CustomLucidIcons name="crown" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Profile Name */}
      <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>

      {/* Age & Height */}
      <Text style={styles.profileDetails} numberOfLines={1}>
        {age} Yrs, {height}
      </Text>

      {/* Viewed On Date */}
      <Text style={styles.viewedOnLabel}>Viewed on:</Text>
      <Text style={styles.viewedOnDate} numberOfLines={1}>
        {viewedDate}
      </Text>
    </TouchableOpacity>
  );
});


// -----------------------------------------------------------------------------
// 4. MAIN WHO VIEWED YOU SECTION COMPONENT
// -----------------------------------------------------------------------------
const WhoViewedYouSection: React.FC<WhoViewedYouSectionProps> = React.memo(
  ({
    data: propData,
    count: propCount,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    // TanStack Query with memoized selector for zero re-renders
    const { data: apiData } = useApiQuery({
      queryKey: WHO_VIEWED_YOU_QUERY_KEY,
      url: ApiURL.whoViewedYouFeed,
      params: WHO_VIEWED_YOU_PARAMS,
      staleTime: 1000 * 60 * 5,
      select: useCallback((res: any) => {
        const raw = res?.data !== undefined ? res.data : res;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.list)
            ? raw.list
            : Array.isArray(raw?.items)
              ? raw.items
              : Array.isArray(res?.list)
                ? res.list
                : Array.isArray(res?.items)
                  ? res.items
                  : [];

        const totalCount =
          raw?.count ??
          raw?.total ??
          raw?.pagination?.total ??
          res?.count ??
          res?.total ??
          list.length;

        return {
          profiles: list.map((item: any, idx: number): ViewedProfile => ({
            id: String(item.id || item._id || item.matrimonyId || `wvy_${idx}`),
            name: item.name || item.fullName || 'Sindhi Candidate',
            age: item.age || 25,
            height:
              typeof item.height === 'number'
                ? `${Math.floor(item.height / 30.48)}'${Math.round((item.height % 30.48) / 2.54)}"`
                : (item.height || "5'2\""),
            viewedOn: item.viewedOn || item.viewedDate || item.viewedAt || 'Recently',
            imageUrl: item.imageUrl || item.photoUrl || item.avatar || item.photos?.[0]?.url || '',
            isPrime: Boolean(item.isPrime || item.isPremium || (!item.isLocked && !item.upgradeRequired)),
          })),
          count: typeof totalCount === 'number' ? totalCount : list.length,
        };
      }, []),
    });

    const profiles = (apiData?.profiles && apiData.profiles.length > 0)
      ? apiData.profiles
      : (propData && propData.length > 0 ? propData : EMPTY_LIST);
    const displayCount = propCount ?? apiData?.count ?? profiles.length;

    const onProfilePressRef = useRef(onProfilePress);
    onProfilePressRef.current = onProfilePress;

    const onViewAllRef = useRef(onViewAll);
    onViewAllRef.current = onViewAll;

    const handleProfilePress = useCallback((profile: ViewedProfile) => {
      onProfilePressRef.current?.(profile);
    }, []);

    const handleViewAllPress = useCallback(() => {
      onViewAllRef.current?.();
    }, []);

    const renderItem = useCallback(
      ({ item }: { item: ViewedProfile }) => (
        <ViewedProfileCard item={item} onPress={handleProfilePress} />
      ),
      [handleProfilePress],
    );

    const keyExtractor = useCallback(
      (item: any, idx: number) => String(item.id || item._id || item.matrimonyId || idx),
      [],
    );

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Section Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Who Viewed You ({displayCount})</Text>
          <Text style={styles.sectionSubtitle}>
            Members who have viewed your profile
          </Text>
        </View>

        {/* Horizontal List of Cards */}
        <FlashList
          horizontal
          data={profiles}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.horizontalList}
        />

        {/* "View all >" Outline Capsule Button */}
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
          accessibilityLabel="View all who viewed you"
          activeOpacity={0.78}
        />
      </View>
    );
  },
);

WhoViewedYouSection.displayName = 'WhoViewedYouSection';

export default WhoViewedYouSection;

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
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  crownBadge: {
    position: 'absolute',
    top: moderateScale(6),
    right: moderateScale(6),
    backgroundColor: '#E5A93C',
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(6),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
  viewedOnLabel: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11),
    color: '#64748B',
    marginTop: moderateVerticalScale(4),
  },
  viewedOnDate: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(11.5),
    color: '#1E293B',
    marginTop: moderateVerticalScale(1),
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
