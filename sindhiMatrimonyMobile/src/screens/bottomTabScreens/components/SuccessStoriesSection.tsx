import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import LoadingButton from '../../../components/buttons/LoadingButton';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { ApiURL } from '../../../redux/apiService';
import { useApiQuery } from '../../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../../tanstackQuery/keys';

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
  weddingDate?: string;
  location?: string;
  fullStory?: string;
}

interface SuccessStoriesSectionProps {
  data?: SuccessStory[];
  title?: string;
  subtitle?: string;
  onStoryPress?: (story: SuccessStory) => void;
  onViewAll?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. QUERY CONSTANTS & CURATED FALLBACK STORIES
// -----------------------------------------------------------------------------
const SUCCESS_STORIES_PARAMS = { page: 1, limit: 10 };
const SUCCESS_STORIES_QUERY_KEY = [...QUERY_KEYS.successStories, SUCCESS_STORIES_PARAMS] as const;




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
              ? require('../../../assets/images/celebrating_banner.png')
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
            color="#DB2F3C"
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
    data: propStories,
    title = 'Success Stories',
    subtitle = 'Sindhi couples who found love',
    onStoryPress,
    onViewAll,
    containerStyle,
  }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch dynamic success stories feed with fallback
    const { data: apiStories } = useApiQuery({
      queryKey: SUCCESS_STORIES_QUERY_KEY,
      url: ApiURL.successStoriesFeed,
      params: SUCCESS_STORIES_PARAMS,
      staleTime: 1000 * 60 * 10,
      select: useCallback((res: any) => {
        const raw = res?.data !== undefined ? res.data : res;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.stories)
            ? raw.stories
            : Array.isArray(raw?.list)
              ? raw.list
              : Array.isArray(raw?.items)
                ? raw.items
                : Array.isArray(res?.stories)
                  ? res.stories
                  : Array.isArray(res?.list)
                    ? res.list
                    : Array.isArray(res?.items)
                      ? res.items
                      : [];

        if (!list.length) return [];

        return list.map((item: any, idx: number): SuccessStory => {
          const couple =
            item.coupleName ||
            item.coupleNames ||
            (item.groomName && item.brideName ? `${item.groomName} & ${item.brideName}` : 'Happy Couple');
          const img =
            item.imageUrl ||
            item.photoUrl ||
            item.couplePhoto ||
            (Array.isArray(item.photoUrls) ? item.photoUrls[0] : '') ||
            '';
          const snippet =
            item.storySnippet ||
            item.storyDescription ||
            item.testimonial ||
            item.fullStory ||
            'Found our soulmate through verified community matchmaking.';
          const posted = item.postedDate || item.postedOn || item.weddingDate || 'Recently';

          return {
            id: String(item.id || item._id || item.storyId || `story_${idx + 1}`),
            coupleName: couple,
            postedOn: posted,
            storySnippet: snippet,
            imageUrl: img,
            badge: item.badge || item.storyTitle || 'Just Married',
            weddingDate: item.weddingDate,
            location: item.location || item.city,
            fullStory: item.fullStory || snippet,
          };
        });
      }, []),
    });

    const stories =
      apiStories && apiStories.length > 0
        ? apiStories
        : (propStories && propStories.length > 0 ? propStories : []);

    const onStoryPressRef = useRef(onStoryPress);
    onStoryPressRef.current = onStoryPress;

    const onViewAllRef = useRef(onViewAll);
    onViewAllRef.current = onViewAll;

    const navigation = useNavigation<any>();

    const handleStoryPress = useCallback((story: SuccessStory) => {
      if (onStoryPressRef.current) {
        onStoryPressRef.current(story);
      } else {
        navigation.navigate('SuccessStoryDetailScreen', { story, id: story.id });
      }
    }, [navigation]);

    const handleViewAllPress = useCallback(() => {
      if (onViewAllRef.current) {
        onViewAllRef.current();
      } else {
        navigation.navigate('SuccessStoriesListScreen');
      }
    }, [navigation]);

    const onScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / SNAP_INTERVAL);
        if (index >= 0 && index < stories.length) {
          setActiveIndex(index);
        }
      },
      [stories.length],
    );

    const renderItem = useCallback(
      ({ item }: { item: SuccessStory }) => (
        <StoryCard item={item} onPress={handleStoryPress} />
      ),
      [handleStoryPress],
    );

    const keyExtractor = useCallback((item: SuccessStory) => item.id, []);

    if (!stories || stories?.length === 0) {
      return null;
    }

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Section Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>

        {/* Horizontal Carousel of Story Cards */}
        <FlashList
          horizontal
          data={stories}

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
        {stories.length > 1 && (
          <View style={styles.paginationRow}>
            {stories.map((_: any, idx: any) => (
              <View
                key={`dot_${idx}`}
                style={[
                  styles.dot,
                  idx === activeIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}

        {/* "View success stories >" Outline Capsule Button */}
        <LoadingButton
          title="View success stories"
          onPress={handleViewAllPress}
          variant="outline"
          style={styles.viewAllBtn}
          textStyle={styles.viewAllText}
          rightIcon="chevron-right"
          iconColor="#DB2F3C"
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
  headerRow: {
    paddingHorizontal: moderateScale(16),
    marginBottom: moderateVerticalScale(12),
  },
  sectionTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(17),
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#64748B',
    marginTop: moderateVerticalScale(2),
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
    color: '#DB2F3C',
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
    color: '#DB2F3C',
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
    backgroundColor: '#DB2F3C',
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
    borderColor: '#DB2F3C',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DB2F3C',
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
    color: '#DB2F3C',
    marginRight: moderateScale(4),
  },
  viewAllIcon: {
    marginTop: moderateVerticalScale(1),
  },
});
