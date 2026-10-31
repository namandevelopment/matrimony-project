import React, { useState, useCallback, useEffect } from 'react';
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
import { apiFetch, ApiURL } from '../../../redux/apiService';

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
  data?: MatchProfile[];
  matchCount?: number;
  onProfilePress?: (profile: MatchProfile) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. FALLBACK SEED MATCHES
// -----------------------------------------------------------------------------
export const DEFAULT_ALL_MATCHES: MatchProfile[] = [
  {
    id: 'match_1',
    name: 'Pooja Advani',
    age: 26,
    height: "5'3\"",
    location: 'Mumbai',
    profession: 'Software Engineer',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_2',
    name: 'Kajal Chhabria',
    age: 24,
    height: "5'5\"",
    location: 'Pune',
    profession: 'Architect',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_3',
    name: 'Roshni Rohra',
    age: 27,
    height: "5'4\"",
    location: 'Ahmedabad',
    profession: 'Chartered Accountant',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_4',
    name: 'Simran Vazirani',
    age: 25,
    height: "5'2\"",
    location: 'Jaipur',
    profession: 'Financial Analyst',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
];

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

  const imageUri = item.imageUrl || item.photoUrl || item.avatar;

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
        {item.name}
      </Text>

      {/* Age & Height */}
      <Text style={styles.profileDetails} numberOfLines={1}>
        {item.age} Yrs, {item.height}
      </Text>
    </TouchableOpacity>
  );
});

MatchCard.displayName = 'MatchCard';

// -----------------------------------------------------------------------------
// 4. MEMOIZED ALL MATCHES SECTION COMPONENT
// -----------------------------------------------------------------------------
const AllMatchesSection: React.FC<AllMatchesSectionProps> = React.memo(
  ({
    data: propData,
    matchCount: propMatchCount,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    const [matches, setMatches] = useState<MatchProfile[]>(
      propData && propData.length > 0 ? propData : DEFAULT_ALL_MATCHES,
    );
    const [displayCount, setDisplayCount] = useState<number>(
      propMatchCount ?? 497,
    );

    useEffect(() => {
      if (propData && propData.length > 0) {
        setMatches(propData);
        if (propMatchCount !== undefined) {
          setDisplayCount(propMatchCount);
        }
        return;
      }

      let isMounted = true;
      const fetchMatches = async () => {
        try {
          const res = await apiFetch<any>({
            url: ApiURL.allMatchesFeed,
            method: 'GET',
            params: { page: 1, limit: 10 },
            showErrorToast: false,
          });

          if (!isMounted) return;

          const list = res?.data?.list || res?.data?.items;
          if (Array.isArray(list) && list.length > 0) {
            const mapped: MatchProfile[] = list.map((item: any, idx: number) => ({
              id: String(item.id || item._id || `match_${idx}`),
              name: item.name || 'Member',
              age: typeof item.age === 'number' ? item.age : parseInt(item.age, 10) || 25,
              height: item.height || "5'2\"",
              location: item.city || item.location || '',
              profession: item.profession || '',
              imageUrl: item.imageUrl || item.photoUrl || item.avatar || '',
            }));
            setMatches(mapped);
          }

          const count = res?.data?.matchCount ?? res?.data?.total ?? res?.data?.pagination?.total;
          if (typeof count === 'number') {
            setDisplayCount(count);
          }
        } catch {
          // Keep fallback matches on error
        }
      };

      fetchMatches();

      return () => {
        isMounted = false;
      };
    }, [propData, propMatchCount]);

    // Render Item callback for FlashList
    const renderItem = useCallback(
      ({ item }: { item: MatchProfile }) => (
        <MatchCard item={item} onPress={onProfilePress} />
      ),
      [onProfilePress],
    );

    const keyExtractor = useCallback((item: MatchProfile) => item.id, []);

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
          estimatedItemSize={moderateScale(150)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.horizontalList}
        />

        {/* "View all >" Capsule Outline Button */}
        <LoadingButton
          title="View all"
          onPress={onViewAll}
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
