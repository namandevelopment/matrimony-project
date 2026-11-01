import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { IMAGES } from '../../../components/images';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { formatCountdown } from '../../../utils/timeUtils';
import { useDailyRecommendationsQuery } from '../../../tanstackQuery/useQuery';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface DailyRecommendation {
  id?: string;
  _id?: string;
  name?: string;
  age?: number | string;
  height?: string;
  location?: any;
  profession?: any;
  imageUrl?: string;
  photoUrl?: string;
  avatar?: string;
}

interface DailyRecommendationsSectionProps {
  onProfilePress?: (profile: DailyRecommendation) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. MEMOIZED CARD COMPONENT
// -----------------------------------------------------------------------------
interface DailyCardProps {
  item: DailyRecommendation;
  onPress?: (profile: DailyRecommendation) => void;
}

const DailyRecommendationCard: React.FC<DailyCardProps> = React.memo(
  ({ item, onPress }) => {
    const [imageError, setImageError] = useState(false);

    const handlePress = useCallback(() => {
      onPress?.(item);
    }, [item, onPress]);

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
              imageError || (!item.imageUrl && !item.photoUrl && !item.avatar)
                ? IMAGES.userAvatar
                : { uri: item.imageUrl || item.photoUrl || item.avatar }
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
          {item.age} Yrs{item.height ? `, ${item.height}` : ''}
        </Text>
      </TouchableOpacity>
    );
  },
);

DailyRecommendationCard.displayName = 'DailyRecommendationCard';

// -----------------------------------------------------------------------------
// 4. MEMOIZED MAIN SECTION COMPONENT
// -----------------------------------------------------------------------------
const DailyRecommendationsSection: React.FC<DailyRecommendationsSectionProps> =
  React.memo(
    ({
      onProfilePress,
      onViewAll,
      containerStyle,
    }) => {
      const { data: queryRes } = useDailyRecommendationsQuery();
      const recommendations = queryRes?.data?.list || queryRes?.data?.items || queryRes?.list || queryRes?.items || [];

      // Live countdown timer towards midnight (or remaining duration in a 24h cycle)
      const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(23, 59, 59, 999);
        const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
        return diff > 0 ? diff : 84760; // fallback ~23h:32m:40s
      });

      useEffect(() => {
        const interval = setInterval(() => {
          setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 86400));
        }, 1000);
        return () => clearInterval(interval);
      }, []);

      // Formatted countdown e.g. "23h:32m:40s"
      const formattedCountdown = useMemo(
        () => formatCountdown(secondsRemaining),
        [secondsRemaining],
      );

      // Render Item callback for FlashList
      const renderItem = useCallback(
        ({ item }: { item: DailyRecommendation }) => (
          <DailyRecommendationCard item={item} onPress={onProfilePress} />
        ),
        [onProfilePress],
      );

      const keyExtractor = useCallback(
        (item: any, idx: number) => String(item.id || item._id || idx),
        [],
      );

      return (
        <View style={[styles.container, containerStyle]}>
          {/* Section Header */}
          <View style={styles.headerRow}>
            {/* Left: Title & Subtitle */}
            <View style={styles.titleColumn}>
              <Text style={styles.sectionTitle}>Daily Recommendations</Text>
              <Text style={styles.sectionSubtitle}>
                Recommended matches for today
              </Text>
            </View>

            {/* Right: Angled Ribbon Timer Badge */}
            <View style={styles.ribbonContainer}>
              <View style={styles.ribbonBadge}>
                <View style={styles.ribbonContent}>
                  <Text style={styles.ribbonLabel}>Time left to view</Text>
                  <Text style={styles.ribbonTimer}>{formattedCountdown}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Horizontal List of Profile Cards */}
          <FlashList
            horizontal
            data={recommendations}
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
            accessibilityLabel="View all daily recommendations"
            activeOpacity={0.78}
          />
        </View>
      );
    },
  );

DailyRecommendationsSection.displayName = 'DailyRecommendationsSection';

export default DailyRecommendationsSection;

// -----------------------------------------------------------------------------
// 5. STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateVerticalScale(14),
  },
  titleColumn: {
    flex: 1,
    paddingRight: moderateScale(8),
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

  // Angled Ribbon Badge (Matching user screenshot)
  ribbonContainer: {
    overflow: 'visible',
  },
  ribbonBadge: {
    backgroundColor: '#DB2F3C',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(4),
    borderRadius: 5,
    transform: [{ skewX: '-12deg' }],
    shadowColor: '#DB2F3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  ribbonContent: {
    transform: [{ skewX: '12deg' }], // Counter-skew to keep text crisp & vertical
    alignItems: 'center',
  },
  ribbonLabel: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(9.5),
    color: '#FFFFFF',
    opacity: 0.95,
  },
  ribbonTimer: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(12),
    color: '#FFFFFF',
    marginTop: moderateVerticalScale(1),
    letterSpacing: 0.3,
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
