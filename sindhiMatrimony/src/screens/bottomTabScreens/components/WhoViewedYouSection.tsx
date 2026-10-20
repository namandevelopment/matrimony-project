import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleProp,
  ViewStyle,
} from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface ViewedProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  viewedOn: string;
  imageUrl: string;
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
// 2. CURATED DUMMY DATA (Matching User's Reference Screenshot)
// -----------------------------------------------------------------------------
export const DUMMY_WHO_VIEWED_YOU: ViewedProfile[] = [
  {
    id: 'wvy_1',
    name: 'Akshata Hegde',
    age: 27,
    height: `5'2"`,
    viewedOn: '11 Oct 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    isPrime: false,
  },
  {
    id: 'wvy_2',
    name: 'Smruthi',
    age: 25,
    height: `5'2"`,
    viewedOn: '19 Sept 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    isPrime: true,
  },
  {
    id: 'wvy_3',
    name: 'Shivali Somani',
    age: 29,
    height: `5'0"`,
    viewedOn: '07 Sept 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isPrime: false,
  },
  {
    id: 'wvy_4',
    name: 'Pooja Ahuja',
    age: 26,
    height: `5'4"`,
    viewedOn: '02 Sept 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    isPrime: true,
  },
  {
    id: 'wvy_5',
    name: 'Muskaan Rohra',
    age: 28,
    height: `5'3"`,
    viewedOn: '28 Aug 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    isPrime: false,
  },
];

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
            imageError || !item.imageUrl
              ? require('../../../assets/images/user_avatar.png')
              : { uri: item.imageUrl }
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
        {item.name}
      </Text>

      {/* Age & Height */}
      <Text style={styles.profileDetails} numberOfLines={1}>
        {item.age} Yrs, {item.height}
      </Text>

      {/* Viewed On Date */}
      <Text style={styles.viewedOnLabel}>Viewed on:</Text>
      <Text style={styles.viewedOnDate} numberOfLines={1}>
        {item.viewedOn}
      </Text>
    </TouchableOpacity>
  );
});

ViewedProfileCard.displayName = 'ViewedProfileCard';

// -----------------------------------------------------------------------------
// 4. MAIN WHO VIEWED YOU SECTION COMPONENT
// -----------------------------------------------------------------------------
const WhoViewedYouSection: React.FC<WhoViewedYouSectionProps> = React.memo(
  ({
    data = DUMMY_WHO_VIEWED_YOU,
    count = 10,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    const renderItem = useCallback(
      ({ item }: { item: ViewedProfile }) => (
        <ViewedProfileCard item={item} onPress={onProfilePress} />
      ),
      [onProfilePress],
    );

    const keyExtractor = useCallback((item: ViewedProfile) => item.id, []);

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Section Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Who Viewed You ({count})</Text>
          <Text style={styles.sectionSubtitle}>
            Members who have viewed your profile
          </Text>
        </View>

        {/* Horizontal List of Cards */}
        <FlatList
          horizontal
          data={data}
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
          iconColor="#EE5559"
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
