import React, { useState, useCallback } from 'react';
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
import { ApiURL } from '../../../redux/apiService';
import { useApiQuery } from '../../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../../tanstackQuery/keys';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface NewMatchProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  location?: string;
  profession?: string;
  imageUrl: string;
  isEndCard?: boolean;
}

interface NewMatchesSectionProps {
  data?: NewMatchProfile[];
  matchCount?: number;
  onProfilePress?: (profile: NewMatchProfile) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}



// -----------------------------------------------------------------------------
// 3. MEMOIZED NEW MATCH CARD COMPONENT
// -----------------------------------------------------------------------------
interface CardProps {
  item: NewMatchProfile;
  onPress?: (profile: NewMatchProfile) => void;
  onViewAll?: () => void;
}

const NewMatchCard: React.FC<CardProps> = React.memo(
  ({ item, onPress, onViewAll }: any) => {
    const [imageError, setImageError] = useState(false);

    const handlePress = useCallback(() => {
      if (item.isEndCard) {
        onViewAll?.();
      } else {
        onPress?.(item);
      }
    }, [item, onPress, onViewAll]);

    // End Card view with blurred frosted overlay
    if (item.isEndCard) {
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePress}
          style={styles.cardContainer}
        >
          <View style={[styles.imageWrapper, styles.endCardWrapper]}>
            <Image
              source={{ uri: item.imageUrl }}
              style={[styles.profileImage, styles.blurredImage]}
              blurRadius={18}
              resizeMode="cover"
            />
            <View style={styles.endCardOverlay}>
              <View style={styles.endCardBtn}>
                <Text style={styles.endCardText}>View all</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={14}
                  color="#DB2F3C"
                  style={styles.endCardIcon}
                />
              </View>
            </View>
          </View>
          {/* Spacing for alignment with other cards */}
          <View style={{ height: moderateVerticalScale(28) }} />
        </TouchableOpacity>
      );
    }

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


              { uri: item.photoUrl }
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
  },
);

NewMatchCard.displayName = 'NewMatchCard';

const NEW_MATCHES_PARAMS = { page: 1, limit: 10 };
const NEW_MATCHES_QUERY_KEY = [...QUERY_KEYS.newMatches, NEW_MATCHES_PARAMS] as const;

// -----------------------------------------------------------------------------
// 4. MEMOIZED MAIN SECTION COMPONENT
// -----------------------------------------------------------------------------
const NewMatchesSection: React.FC<NewMatchesSectionProps> = React.memo(
  ({
    data,
    matchCount = 17,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    const { data: queryData } = useApiQuery({
      queryKey: NEW_MATCHES_QUERY_KEY,
      url: ApiURL.newMatchesFeed,
      params: NEW_MATCHES_PARAMS,
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
        const count = raw?.matchCount ?? raw?.count ?? raw?.total ?? res?.count ?? res?.total ?? list.length;
        return {
          matches: list,
          count: typeof count === 'number' ? count : list.length,
        };
      }, []),
    });

    const activeMatches = (queryData?.matches && queryData.matches.length > 0)
      ? queryData.matches
      : (Array.isArray(data) && data.length > 0 ? data : []);

    const activeCount = queryData?.count ?? (Array.isArray(data) && data.length > 0 ? data.length : matchCount);

    // Append the "View all" trailing card to the list as seen in reference screenshot
    const listData = React.useMemo(() => {
      const endCard: NewMatchProfile = {
        id: 'new_end_card',
        name: '',
        age: 0,
        height: '',
        imageUrl:
          activeMatches[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        isEndCard: true,
      };
      return [...activeMatches, endCard];
    }, [activeMatches]);

    const renderItem = useCallback(
      ({ item }: { item: NewMatchProfile }) => (
        <NewMatchCard
          item={item}
          onPress={onProfilePress}
          onViewAll={onViewAll}
        />
      ),
      [onProfilePress, onViewAll],
    );

    const keyExtractor = useCallback((item: NewMatchProfile) => item.id, []);

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Section Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>New Matches ({activeCount})</Text>
          <Text style={styles.sectionSubtitle}>
            Members who match your preferences and have joined in the last 30
            days
          </Text>
        </View>

        {/* Horizontal List of New Match Cards */}
        <FlashList
          horizontal
          data={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.horizontalList}
        />

        {/* "View all >" Outline Capsule Button */}
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
          accessibilityLabel="View all new matches"
          activeOpacity={0.78}
        />
      </View>
    );
  },
);

NewMatchesSection.displayName = 'NewMatchesSection';

export default NewMatchesSection;

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
    lineHeight: moderateScale(17),
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

  // Trailing "View All" Blurred Card (Matching reference image)
  endCardWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurredImage: {
    opacity: 0.5,
  },
  endCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(6),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#DB2F3C',
  },
  endCardText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(12),
    color: '#DB2F3C',
    marginRight: moderateScale(3),
  },
  endCardIcon: {
    marginTop: 1,
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
