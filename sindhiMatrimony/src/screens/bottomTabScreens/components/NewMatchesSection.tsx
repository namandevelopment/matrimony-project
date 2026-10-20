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
// 2. CURATED DUMMY DATA (Matching User's Reference Screenshot)
// -----------------------------------------------------------------------------
export const DUMMY_NEW_MATCHES: NewMatchProfile[] = [
  {
    id: 'new_1',
    name: 'Prajkta Deshmukh',
    age: 24,
    height: `5'5"`,
    location: 'Pune, Maharashtra',
    profession: 'Fashion Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'new_2',
    name: 'Purva Deshpande',
    age: 27,
    height: `5'3"`,
    location: 'Mumbai, Maharashtra',
    profession: 'Content Strategist',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'new_3',
    name: 'Sayali Dalvi',
    age: 27,
    height: `5'2"`,
    location: 'Nashik, Maharashtra',
    profession: 'HR Specialist',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'new_4',
    name: 'Mansi Vazirani',
    age: 25,
    height: `5'4"`,
    location: 'Ahmedabad, Gujarat',
    profession: 'Financial Analyst',
    imageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'new_5',
    name: 'Ritu Bhagchandani',
    age: 28,
    height: `5'1"`,
    location: 'Jaipur, Rajasthan',
    profession: 'Software Engineer',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  },
];

// -----------------------------------------------------------------------------
// 3. MEMOIZED NEW MATCH CARD COMPONENT
// -----------------------------------------------------------------------------
interface CardProps {
  item: NewMatchProfile;
  onPress?: (profile: NewMatchProfile) => void;
  onViewAll?: () => void;
}

const NewMatchCard: React.FC<CardProps> = React.memo(
  ({ item, onPress, onViewAll }) => {
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
                  color="#EE5559"
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

NewMatchCard.displayName = 'NewMatchCard';

// -----------------------------------------------------------------------------
// 4. MEMOIZED MAIN SECTION COMPONENT
// -----------------------------------------------------------------------------
const NewMatchesSection: React.FC<NewMatchesSectionProps> = React.memo(
  ({
    data = DUMMY_NEW_MATCHES,
    matchCount = 17,
    onProfilePress,
    onViewAll,
    containerStyle,
  }) => {
    // Append the "View all" trailing card to the list as seen in reference screenshot
    const listData = React.useMemo(() => {
      const endCard: NewMatchProfile = {
        id: 'new_end_card',
        name: '',
        age: 0,
        height: '',
        imageUrl:
          data[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        isEndCard: true,
      };
      return [...data, endCard];
    }, [data]);

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
          <Text style={styles.sectionTitle}>New Matches ({matchCount})</Text>
          <Text style={styles.sectionSubtitle}>
            Members who match your preferences and have joined in the last 30
            days
          </Text>
        </View>

        {/* Horizontal List of New Match Cards */}
        <FlatList
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
          iconColor="#EE5559"
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
    borderColor: '#EE5559',
  },
  endCardText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(12),
    color: '#EE5559',
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
