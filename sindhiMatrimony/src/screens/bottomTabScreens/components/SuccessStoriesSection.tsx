import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleProp,
  ViewStyle,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = moderateScale(290);
const CARD_SPACING = moderateScale(14);
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface SuccessStory {
  id: string;
  coupleName: string;
  postedOn: string;
  storySnippet: string;
  imageUrl: string;
  badge?: string;
}

interface SuccessStoriesSectionProps {
  data?: SuccessStory[];
  onStoryPress?: (story: SuccessStory) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. CURATED DUMMY STORIES (Authentic Indian Sindhi Wedding Couples)
// -----------------------------------------------------------------------------
export const DUMMY_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story_1',
    coupleName: 'Saravana sharma & Srinika',
    postedOn: '14 Oct 2026',
    storySnippet:
      'I was looking for a partner who will understand me and stand by my side through all phases of life.',
    imageUrl:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    badge: 'Just Married',
  },
  {
    id: 'story_2',
    coupleName: 'Chandrashekar & Dhavani',
    postedOn: '10 Oct 2026',
    storySnippet:
      'Our families connected on the app and bonded instantly over shared Sindhi traditions and values.',
    imageUrl:
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&auto=format&fit=crop&q=80',
    badge: 'Happily Married',
  },
  {
    id: 'story_3',
    coupleName: 'Kunal & Mehek Advani',
    postedOn: '28 Sept 2026',
    storySnippet:
      'From our very first chat to our grand wedding celebration, finding each other here felt purely destined.',
    imageUrl:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    badge: 'Match Made in Heaven',
  },
];

// -----------------------------------------------------------------------------
// 3. MEMOIZED STORY CARD COMPONENT
// -----------------------------------------------------------------------------
interface StoryCardProps {
  item: SuccessStory;
  onPress?: (story: SuccessStory) => void;
}

const StoryCard: React.FC<StoryCardProps> = React.memo(({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={styles.cardContainer}
    >
      {/* Couple Wedding Photo with Badge Overlay */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            imageError || !item.imageUrl
              ? require('../../../assets/images/celebrating_banner.jpg')
              : { uri: item.imageUrl }
          }
          style={styles.coupleImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Elegant Top Badge */}
        <View style={styles.tagBadge}>
          <CustomLucidIcons name="heart" size={11} color="#FF4D6D" />
          <Text style={styles.tagBadgeText}>{item.badge || 'Just Married'}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Couple Name */}
        <Text style={styles.coupleName} numberOfLines={1}>
          {item.coupleName}
        </Text>

        {/* Posted on Date with subtle calendar icon */}
        <View style={styles.dateRow}>
          <CustomLucidIcons
            name="calendar"
            size={12}
            color="#94A3B8"
            style={styles.calendarIcon}
          />
          <Text style={styles.postedOn}>Posted on: {item.postedOn}</Text>
        </View>

        {/* Testimonial Quote with always-visible 'Read more...' */}
        <View style={styles.quoteRow}>
          <Text style={styles.quoteSign}>“</Text>
          <Text style={styles.storyText} numberOfLines={2}>
            {item.storySnippet}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
          style={styles.readMoreBtn}
        >
          <Text style={styles.readMoreText}>Read full story</Text>
          <CustomLucidIcons
            name="arrow-right"
            size={12}
            color="#EE5559"
            style={{ marginLeft: 3 }}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

StoryCard.displayName = 'StoryCard';

// -----------------------------------------------------------------------------
// 4. MAIN SUCCESS STORIES SECTION COMPONENT
// -----------------------------------------------------------------------------
const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = React.memo(
  ({
    data = DUMMY_SUCCESS_STORIES,
    onStoryPress,
    onViewAll,
    containerStyle,
  }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SNAP_INTERVAL);
        if (index >= 0 && index < data.length) {
          setActiveIndex(index);
        }
      },
      [data.length],
    );

    const renderItem = useCallback(
      ({ item }: { item: SuccessStory }) => (
        <StoryCard item={item} onPress={onStoryPress} />
      ),
      [onStoryPress],
    );

    const keyExtractor = useCallback((item: SuccessStory) => item.id, []);

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Horizontal Carousel of Story Cards */}
        <FlatList
          horizontal
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.horizontalList}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          snapToAlignment="start"
          onScroll={onScroll}
          scrollEventThrottle={16}
        />

        {/* Carousel Pagination Dots */}
        <View style={styles.paginationRow}>
          {data.map((_, idx) => (
            <View
              key={`dot_${idx}`}
              style={[
                styles.dot,
                idx === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* "View success stories >" Outline Capsule Button */}
        <LoadingButton
          title="View success stories"
          onPress={onViewAll}
          variant="outline"
          style={styles.viewAllBtn}
          textStyle={styles.viewAllText}
          rightIcon="chevron-right"
          iconColor="#EE5559"
          iconSize={16}
          iconStyle={styles.viewAllIcon}
          accessibilityLabel="View all success stories"
          activeOpacity={0.8}
        />
      </View>
    );
  },
);

SuccessStoriesSection.displayName = 'SuccessStoriesSection';

export default SuccessStoriesSection;

// -----------------------------------------------------------------------------
// 5. STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(24),
  },
  horizontalList: {
    overflow: 'visible',
  },
  listContent: {
    paddingLeft: moderateScale(14),
    paddingRight: moderateScale(14),
  },

  // Story Card
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#EAEFF5',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: {
    width: '100%',
    height: moderateVerticalScale(175),
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  coupleImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: moderateScale(10),
    left: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: moderateScale(9),
    paddingVertical: moderateVerticalScale(4),
    borderRadius: moderateScale(12),
  },
  tagBadgeText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(10.5),
    color: '#FFFFFF',
    marginLeft: moderateScale(4),
    letterSpacing: 0.2,
  },

  // Card Content
  cardContent: {
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateVerticalScale(12),
    paddingBottom: moderateVerticalScale(14),
  },
  coupleName: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(15.5),
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(3),
    marginBottom: moderateVerticalScale(8),
  },
  calendarIcon: {
    marginRight: moderateScale(4),
  },
  postedOn: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11.5),
    color: '#64748B',
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(6),
  },
  quoteSign: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(18),
    color: '#EE5559',
    lineHeight: moderateScale(18),
    marginRight: moderateScale(4),
    marginTop: -moderateVerticalScale(2),
  },
  storyText: {
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#334155',
    lineHeight: moderateScale(17),
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: moderateVerticalScale(4),
    paddingVertical: 2,
  },
  readMoreText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(12),
    color: '#EE5559',
  },

  // Dots Pagination
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(12),
    marginBottom: moderateVerticalScale(4),
  },
  dot: {
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    marginHorizontal: moderateScale(3),
  },
  activeDot: {
    width: moderateScale(18),
    backgroundColor: '#EE5559',
  },
  inactiveDot: {
    width: moderateScale(6),
    backgroundColor: '#CBD5E1',
  },

  // "View success stories >" Capsule Outline Button
  viewAllBtn: {
    marginHorizontal: moderateScale(14),
    marginTop: moderateVerticalScale(12),
    height: moderateVerticalScale(44),
    borderRadius: moderateScale(22),
    borderWidth: 1.2,
    borderColor: '#EE5559',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE5559',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
