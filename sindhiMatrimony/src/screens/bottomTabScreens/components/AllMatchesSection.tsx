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
export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  location?: string;
  profession?: string;
  imageUrl: string;
}

interface AllMatchesSectionProps {
  data?: MatchProfile[];
  matchCount?: number;
  onProfilePress?: (profile: MatchProfile) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. CURATED DUMMY DATA (Matching User's Reference Screenshot)
// -----------------------------------------------------------------------------
export const DUMMY_ALL_MATCHES: MatchProfile[] = [
  {
    id: 'match_1',
    name: 'Vishakha Parekar',
    age: 30,
    height: `5'1"`,
    location: 'Mumbai, Maharashtra',
    profession: 'Software Consultant',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_2',
    name: 'Prajkta Deshmukh',
    age: 24,
    height: `5'5"`,
    location: 'Pune, Maharashtra',
    profession: 'Fashion Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_3',
    name: 'Prajakta Anand',
    age: 28,
    height: `5'0"`,
    location: 'Ahmedabad, Gujarat',
    profession: 'Chartered Accountant',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_4',
    name: 'Dr. Sneha Hingorani',
    age: 27,
    height: `5'3"`,
    location: 'Jaipur, Rajasthan',
    profession: 'BDS Doctor',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_5',
    name: 'Divya Advani',
    age: 26,
    height: `5'4"`,
    location: 'Bengaluru, Karnataka',
    profession: 'Product Manager',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'match_6',
    name: 'Kajal Mirchandani',
    age: 29,
    height: `5'2"`,
    location: 'Delhi NCR',
    profession: 'Architect',
    imageUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80',
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
});

MatchCard.displayName = 'MatchCard';

// -----------------------------------------------------------------------------
// 4. MEMOIZED ALL MATCHES SECTION COMPONENT
// -----------------------------------------------------------------------------
const AllMatchesSection: React.FC<AllMatchesSectionProps> = React.memo(
  ({
    data = DUMMY_ALL_MATCHES,
    matchCount = 497,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    // Render Item callback for FlatList
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
            All Matches ({matchCount})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Members who match your partner preferences
          </Text>
        </View>

        {/* Horizontal List of Match Cards */}
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
