import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface DailyRecommendation {
  id: string;
  name: string;
  age: number;
  height: string;
  location: string;
  profession: string;
  imageUrl: string;
}

interface DailyRecommendationsSectionProps {
  data?: DailyRecommendation[];
  onProfilePress?: (profile: DailyRecommendation) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. CURATED DUMMY DATA (Matching Sindhi Community & User Reference Image)
// -----------------------------------------------------------------------------
export const DUMMY_DAILY_RECOMMENDATIONS: DailyRecommendation[] = [
  {
    id: 'rec_1',
    name: 'Vishakha Pare...',
    age: 30,
    height: `5'1"`,
    location: 'Mumbai, Maharashtra',
    profession: 'Software Consultant',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_2',
    name: 'Prajkta Deshm...',
    age: 24,
    height: `5'5"`,
    location: 'Pune, Maharashtra',
    profession: 'Fashion Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_3',
    name: 'Prajakta A...',
    age: 28,
    height: `5'0"`,
    location: 'Ahmedabad, Gujarat',
    profession: 'Chartered Accountant',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_4',
    name: 'Simran Kewalramani',
    age: 26,
    height: `5'4"`,
    location: 'Bengaluru, Karnataka',
    profession: 'Product Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_5',
    name: 'Komal Chawla',
    age: 27,
    height: `5'3"`,
    location: 'Delhi NCR',
    profession: 'Marketing Lead',
    imageUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_6',
    name: 'Barkha Motwani',
    age: 25,
    height: `5'2"`,
    location: 'Jaipur, Rajasthan',
    profession: 'Financial Analyst',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
];

// -----------------------------------------------------------------------------
// 3. MEMOIZED CARD COMPONENT
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
              imageError || !item.imageUrl
                ? require('../../../assets/images/user_avatar.png')
                : { uri: item.imageUrl }
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

DailyRecommendationCard.displayName = 'DailyRecommendationCard';

// -----------------------------------------------------------------------------
// 4. MEMOIZED MAIN SECTION COMPONENT
// -----------------------------------------------------------------------------
const DailyRecommendationsSection: React.FC<DailyRecommendationsSectionProps> =
  React.memo(
    ({
      data = DUMMY_DAILY_RECOMMENDATIONS,
      onProfilePress,
      onViewAll,
      containerStyle,
    }) => {
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
      const formattedCountdown = useMemo(() => {
        const hrs = Math.floor(secondsRemaining / 3600);
        const mins = Math.floor((secondsRemaining % 3600) / 60);
        const secs = secondsRemaining % 60;
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        return `${pad(hrs)}h:${pad(mins)}m:${pad(secs)}s`;
      }, [secondsRemaining]);

      // Render Item callback for FlatList
      const renderItem = useCallback(
        ({ item }: { item: DailyRecommendation }) => (
          <DailyRecommendationCard item={item} onPress={onProfilePress} />
        ),
        [onProfilePress],
      );

      const keyExtractor = useCallback(
        (item: DailyRecommendation) => item.id,
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
          <FlatList
            horizontal
            data={data}
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
            iconColor="#EE5559"
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
    backgroundColor: '#EE5559',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(4),
    borderRadius: 5,
    transform: [{ skewX: '-12deg' }],
    shadowColor: '#EE5559',
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
    borderColor: '#EE5559',
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
    color: '#EE5559',
    marginRight: moderateScale(4),
  },
  viewAllIcon: {
    marginTop: moderateVerticalScale(1),
  },
});
