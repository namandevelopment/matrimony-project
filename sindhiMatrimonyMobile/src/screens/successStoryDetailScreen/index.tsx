import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  useWindowDimensions,
  Animated,
  Share,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../../utils/Responsive';
import { ApiURL, apiFetch } from '../../redux/apiService';
import { useApiQuery } from '../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../tanstackQuery/keys';
import { showToast } from '../../utils/CustomToast';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = moderateVerticalScale(375);
const QUICK_EMOJIS = ['❤️', '🙌', '🔥', '👏', '💍', '😍', '🎉'];

export interface StoryCommentReply {
  id: string;
  userName: string;
  userAvatar: string;
  replyText: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface StoryComment {
  id: string;
  userName: string;
  userAvatar: string;
  commentText: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
  replies?: StoryCommentReply[];
}

const DEFAULT_COMMENTS: StoryComment[] = [
  {
    id: 'c1',
    userName: 'Kunal Advani',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    commentText: 'Heartiest congratulations! Beautiful couple, truly a match made in heaven 🙏',
    createdAt: '2h',
    likesCount: 14,
    isLiked: false,
    replies: [
      {
        id: 'r1',
        userName: 'Geeta (Bride)',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        replyText: 'Thank you so much Kunal bhau! Appreciate your warm blessings.',
        createdAt: '1h',
        likesCount: 5,
        isLiked: false,
      },
    ],
  },
  {
    id: 'c2',
    userName: 'Simran Vazirani',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    commentText: 'So inspiring to see authentic Sindhi Gotra & Kundli compatibility lead to such a grand celebration! 🎉',
    createdAt: '4h',
    likesCount: 8,
    isLiked: false,
    replies: [],
  },
];

const SuccessStoryDetailScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const passedStory = route?.params?.story || {};
  const storyId = String(passedStory.id || passedStory._id || route?.params?.id || 'story_1');

  // Fetch from cached stories feed to prevent 404 on missing single-story route
  const { data: apiDetails } = useApiQuery({
    queryKey: QUERY_KEYS.successStories,
    url: ApiURL.successStoriesFeed,
    staleTime: 1000 * 60 * 5,
    select: useCallback(
      (res: any) => {
        const raw = res?.data !== undefined ? res.data : res;
        const list = Array.isArray(raw?.list)
          ? raw.list
          : Array.isArray(raw?.stories)
            ? raw.stories
            : Array.isArray(raw)
              ? raw
              : [];
        return (
          list.find(
            (item: any) =>
              String(item?.id || item?._id || item?.storyId) === String(storyId),
          ) || null
        );
      },
      [storyId],
    ),
  });

  const story = {
    ...passedStory,
    ...(apiDetails || {}),
  };

  // Multiple photos gallery (Instagram Carousel)
  const photoUrls: string[] =
    Array.isArray(story.photoUrls) && story.photoUrls.length > 0
      ? story.photoUrls
      : story.imageUrl
        ? [
            story.imageUrl,
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
          ]
        : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Instagram Like states with spring pop animation
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(story.isLiked));
  const [likesCount, setLikesCount] = useState<number>(Number(story.likesCount) || 135);
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const bigHeartAnim = useRef(new Animated.Value(0)).current;

  // Bookmarking state
  const [isSaved, setIsSaved] = useState(false);

  // Read more narrative toggle
  const [isFullStoryExpanded, setIsFullStoryExpanded] = useState(false);

  // Comments state
  const [comments, setComments] = useState<StoryComment[]>(
    Array.isArray(story.comments) && story.comments.length > 0 ? story.comments : DEFAULT_COMMENTS,
  );
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; userName: string } | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const commentInputRef = useRef<TextInput>(null);
  const commentsSectionYRef = useRef<number>(0);

  useEffect(() => {
    if (apiDetails?.comments && Array.isArray(apiDetails.comments)) {
      setComments(apiDetails.comments);
    }
    if (apiDetails?.likesCount !== undefined) {
      setLikesCount(Number(apiDetails.likesCount));
    }
  }, [apiDetails]);

  // Image slider scroll event
  const onImageScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index >= 0 && index < photoUrls.length) {
      setActiveImageIndex(index);
    }
  }, [photoUrls.length, screenWidth]);

  // Animated Instagram Like Burst
  const triggerLikeAnimation = useCallback(() => {
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.4,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heartScaleAnim]);

  // Double tap big heart pop on image (like Instagram)
  const triggerDoubleTapHeart = useCallback(() => {
    bigHeartAnim.setValue(0);
    Animated.sequence([
      Animated.spring(bigHeartAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(bigHeartAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bigHeartAnim]);

  // Toggle Post Like
  const handleToggleLike = useCallback(async () => {
    triggerLikeAnimation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await apiFetch({
        url: ApiURL.successStoryLike(storyId),
        method: 'POST',
        showErrorToast: false,
      });
    } catch {}
  }, [isLiked, storyId, triggerLikeAnimation]);

  // Double Tap on Image Handler
  const lastTapRef = useRef<number>(0);
  const handleImageDoubleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      triggerDoubleTapHeart();
      if (!isLiked) {
        handleToggleLike();
      }
    }
    lastTapRef.current = now;
  }, [handleToggleLike, isLiked, triggerDoubleTapHeart]);

  // Toggle Like on specific comment / reply (Instagram Feature)
  const handleToggleCommentLike = useCallback((commentId: string, replyId?: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          if (replyId) {
            return {
              ...c,
              replies: (c.replies || []).map((r) => {
                if (r.id === replyId) {
                  const nextLiked = !r.isLiked;
                  return {
                    ...r,
                    isLiked: nextLiked,
                    likesCount: nextLiked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 1) - 1),
                  };
                }
                return r;
              }),
            };
          }
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likesCount: nextLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 1) - 1),
          };
        }
        return c;
      }),
    );
  }, []);

  // Native Share Sheet
  const handleShareStory = useCallback(async () => {
    try {
      const couple = story.coupleName || 'Sindhi Couple';
      const city = story.city || story.location || 'India';
      const quote = story.storySnippet || 'A match made in heaven!';
      const shareUrl = `https://sindhimatrimony.co.in/success-stories/${storyId}`;

      await Share.share({
        title: `Wedding Story: ${couple}`,
        message: `💍 Inspiring Wedding Story of ${couple} (${city})\n\n"${quote}"\n\nRead their complete wedding journey on Sindhi Matrimony app:\n${shareUrl}`,
      });
    } catch {
      showToast({ type: 'info', message: 'Sharing story...' });
    }
  }, [story.city, story.coupleName, story.location, story.storySnippet, storyId]);

  // Focus comment input and scroll to comments
  const handleScrollToComments = useCallback(() => {
    commentInputRef.current?.focus();
    if (commentsSectionYRef.current > 0) {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, commentsSectionYRef.current - 20),
        animated: true,
      });
    } else {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, []);

  // Post Comment or Reply + Auto-Scroll to Comment
  const handlePostComment = useCallback(async () => {
    const text = inputText.trim();
    if (!text) return;

    if (replyingTo) {
      // Add nested reply optimistically
      const newReply: StoryCommentReply = {
        id: `r_${Date.now()}`,
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        replyText: text,
        createdAt: 'Just now',
        likesCount: 0,
        isLiked: false,
      };

      setComments((prev) =>
        prev.map((c) =>
          c.id === replyingTo.commentId
            ? { ...c, replies: [...(c.replies || []), newReply] }
            : c,
        ),
      );

      const parentId = replyingTo.commentId;
      setReplyingTo(null);
      setInputText('');

      // Auto-scroll down to where reply was added
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 120);

      try {
        await apiFetch({
          url: ApiURL.successStoryComments(storyId),
          method: 'POST',
          data: { text, parentCommentId: parentId },
          showErrorToast: false,
        });
      } catch {}
    } else {
      // Add top-level comment optimistically at top of comments list
      const newComment: StoryComment = {
        id: `c_${Date.now()}`,
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        commentText: text,
        createdAt: 'Just now',
        likesCount: 0,
        isLiked: false,
        replies: [],
      };

      setComments((prev) => [newComment, ...prev]);
      setInputText('');

      // Auto-scroll directly to comments section where comment was added
      setTimeout(() => {
        if (commentsSectionYRef.current > 0) {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, commentsSectionYRef.current - 15),
            animated: true,
          });
        } else {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }, 120);

      try {
        await apiFetch({
          url: ApiURL.successStoryComments(storyId),
          method: 'POST',
          data: { text },
          showErrorToast: false,
        });
      } catch {}
    }
  }, [inputText, replyingTo, storyId]);

  const handleReplyPress = useCallback((commentId: string, userName: string) => {
    setReplyingTo({ commentId, userName });
    commentInputRef.current?.focus();
  }, []);

  const handleAppendEmoji = useCallback((emoji: string) => {
    setInputText((prev) => prev + emoji);
  }, []);

  const totalCommentsCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0,
  );

  return (
    <SafeAreaView style={styles.screenContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* =========================================================================
          INSTAGRAM TOP NAVIGATION BAR
      ========================================================================== */}
      <View style={styles.igTopNav}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <CustomLucidIcons name="arrow-left" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.igTopNavTitle}>Success Story</Text>
        <View style={{ width: moderateScale(30) }} />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =========================================================================
            1. INSTAGRAM POST HEADER (Avatar + Couple Handle + Location + Dots)
        ========================================================================== */}
        <View style={styles.postHeader}>
          <View style={styles.postAuthorInfo}>
            <View style={styles.avatarGradientBorder}>
              <Image
                source={
                  photoUrls[0]
                    ? { uri: photoUrls[0] }
                    : require('../../assets/images/celebrating_banner.png')
                }
                style={styles.authorAvatar}
              />
            </View>
            <View style={styles.authorMeta}>
              <View style={styles.authorNameRow}>
                <Text style={styles.authorUsername} numberOfLines={1}>
                  {story.coupleName || 'Naveen & Geeta'}
                </Text>
                <CustomLucidIcons
                  name="check-circle"
                  size={13}
                  color="#0284C7"
                  style={{ marginLeft: 4 }}
                />
              </View>
              <Text style={styles.authorLocation} numberOfLines={1}>
                {story.location || story.city || 'Jaipur, Rajasthan'} • Married
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShareStory}
            style={styles.moreOptionsBtn}
          >
            <CustomLucidIcons name="more-horizontal" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* =========================================================================
            2. INSTAGRAM IMAGE CAROUSEL WITH DOUBLE-TAP HEART
        ========================================================================== */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onImageScroll}
            scrollEventThrottle={16}
          >
            {photoUrls.map((imgUrl, index) => (
              <TouchableOpacity
                key={`photo_${index}`}
                activeOpacity={1}
                onPress={handleImageDoubleTap}
                style={[styles.slideImageWrapper, { width: screenWidth }]}
              >
                <Image
                  source={
                    imgUrl
                      ? { uri: imgUrl }
                      : require('../../assets/images/celebrating_banner.png')
                  }
                  style={styles.slideImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Top Right Counter Pill (Instagram Style: 1/4) */}
          {photoUrls.length > 1 && (
            <View style={styles.igCounterBadge}>
              <Text style={styles.igCounterText}>
                {activeImageIndex + 1}/{photoUrls.length}
              </Text>
            </View>
          )}

          {/* Double-tap Big Heart Spring Animation */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.bigHeartContainer,
              {
                opacity: bigHeartAnim,
                transform: [
                  {
                    scale: bigHeartAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1.25],
                    }),
                  },
                ],
              },
            ]}
          >
            <CustomLucidIcons name="heart" size={95} color="#FF2E54" fill="#FF2E54" />
          </Animated.View>
        </View>

        {/* =========================================================================
            3. INSTAGRAM ACTION ICONS ROW (Heart, Comment, Share, Dots, Bookmark)
        ========================================================================== */}
        <View style={styles.igActionRow}>
          {/* Absolutely Centered Responsive Carousel Pagination Dots */}
          {photoUrls.length > 1 && (
            <View style={styles.igDotsRow} pointerEvents="none">
              {photoUrls.map((_, i) => (
                <View
                  key={`dot_${i}`}
                  style={[
                    styles.igDot,
                    i === activeImageIndex ? styles.igActiveDot : styles.igInactiveDot,
                  ]}
                />
              ))}
            </View>
          )}

          <View style={styles.igActionLeft}>
            {/* Heart Like */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleLike}
              style={styles.igActionIconBtn}
            >
              <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                <CustomLucidIcons
                  name="heart"
                  size={26}
                  color={isLiked ? '#FF2E54' : '#0F172A'}
                  fill={isLiked ? '#FF2E54' : 'transparent'}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Comment Speech Bubble */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleScrollToComments}
              style={styles.igActionIconBtn}
            >
              <CustomLucidIcons name="message-circle" size={25} color="#0F172A" />
            </TouchableOpacity>

            {/* Share Paper Plane */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShareStory}
              style={styles.igActionIconBtn}
            >
              <CustomLucidIcons name="send" size={23} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Right Bookmark / Save */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsSaved(!isSaved)}
            style={styles.igBookmarkBtn}
          >
            <CustomLucidIcons
              name="bookmark"
              size={24}
              color="#0F172A"
              fill={isSaved ? '#0F172A' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* =========================================================================
            4. INSTAGRAM LIKES COUNT & CAPTION SECTION
        ========================================================================== */}
        <View style={styles.postDetailsSection}>
          {/* Likes Row */}
          <Text style={styles.likesText}>
            Liked by <Text style={styles.boldText}>kunal_advani</Text> and{' '}
            <Text style={styles.boldText}>{likesCount} others</Text>
          </Text>

          {/* Caption with Author Handle */}
          <Text style={styles.captionText}>
            <Text style={styles.boldText}>{story.coupleName || 'Naveen & Geeta'} </Text>
            {story.storySnippet ||
              story.testimonial ||
              'We connected on SindhiMatrimony, discovered that our families hailed from adjacent neighborhoods, and tied the knot!'}
          </Text>

          {/* Expandable Full Story Narrative */}
          {isFullStoryExpanded ? (
            <View style={styles.fullStoryWrap}>
              <Text style={styles.fullStoryParagraph}>
                {story.fullStory ||
                  story.storyDescription ||
                  `Our journey began with a simple Connect request on the app. We spent three weeks understanding each other's aspirations and family traditions.\n\nWhen our parents met for the formal 'Kachhi Misri', everyone instantly bonded over authentic Sindhi Dal Pakwan. Both sets of elders appreciated the verified biodata and transparency of the platform.\n\nWith 31/36 Guna Milan and blessings from our community elders, we tied the knot in a vibrant Sindhi wedding filled with Santh, Lada, and sacred Pheras. Truly a blessed match!`}
              </Text>
              <TouchableOpacity
                onPress={() => setIsFullStoryExpanded(false)}
                style={styles.readMoreToggle}
              >
                <Text style={styles.readMoreText}>show less</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setIsFullStoryExpanded(true)}
              style={styles.readMoreToggle}
            >
              <Text style={styles.readMoreText}>more</Text>
            </TouchableOpacity>
          )}

          {/* Wedding Tags & Gotra Row */}
          <View style={styles.hashtagsRow}>
            <Text style={styles.hashtag}>#SindhiVivah</Text>
            {story.subcaste && <Text style={styles.hashtag}>#{story.subcaste}Gotra</Text>}
            <Text style={styles.hashtag}>#VerifiedSindhiMarriage</Text>
            <Text style={styles.hashtag}>#WeddingBells</Text>
          </View>

          {/* Wedding Date Milestone */}
          <View style={styles.dateStampRow}>
            <CustomLucidIcons name="calendar" size={12} color="#94A3B8" />
            <Text style={styles.dateStampText}>
              Married on {story.weddingDate || '14 Dec 2025'} • Posted {story.postedDate || '18 Dec 2025'}
            </Text>
          </View>
        </View>

        {/* =========================================================================
            5. INSTAGRAM COMMENTS & REPLIES SECTION
        ========================================================================== */}
        <View
          style={styles.commentsSection}
          onLayout={(e) => {
            commentsSectionYRef.current = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.commentsHeadingRow}>
            <Text style={styles.commentsHeading}>
              Comments ({totalCommentsCount})
            </Text>
            <TouchableOpacity onPress={handleScrollToComments}>
              <Text style={styles.addCommentLink}>Add wish</Text>
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.map((comment) => (
            <View key={comment.id} style={styles.igCommentBlock}>
              <View style={styles.igCommentMainRow}>
                <Image
                  source={{ uri: comment.userAvatar }}
                  style={styles.igCommentAvatar}
                />
                <View style={styles.igCommentBody}>
                  <Text style={styles.igCommentLine}>
                    <Text style={styles.boldText}>{comment.userName} </Text>
                    {comment.commentText}
                  </Text>
                  <View style={styles.igCommentFooterRow}>
                    <Text style={styles.igCommentTime}>{comment.createdAt}</Text>
                    {Boolean(comment.likesCount) && (
                      <Text style={styles.igCommentLikesCount}>
                        {comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => handleReplyPress(comment.id, comment.userName)}
                    >
                      <Text style={styles.igReplyTextBtn}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Individual Comment Like Heart (Instagram Feature) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleToggleCommentLike(comment.id)}
                  style={styles.commentHeartBtn}
                >
                  <CustomLucidIcons
                    name="heart"
                    size={14}
                    color={comment.isLiked ? '#FF2E54' : '#94A3B8'}
                    fill={comment.isLiked ? '#FF2E54' : 'transparent'}
                  />
                </TouchableOpacity>
              </View>

              {/* Nested Replies */}
              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <View style={styles.igRepliesWrap}>
                  {comment.replies.map((reply) => (
                    <View key={reply.id} style={styles.igReplyRow}>
                      <Image
                        source={{ uri: reply.userAvatar }}
                        style={styles.igReplyAvatar}
                      />
                      <View style={styles.igCommentBody}>
                        <Text style={styles.igCommentLine}>
                          <Text style={styles.boldText}>{reply.userName} </Text>
                          {reply.replyText}
                        </Text>
                        <View style={styles.igCommentFooterRow}>
                          <Text style={styles.igCommentTime}>{reply.createdAt}</Text>
                          {Boolean(reply.likesCount) && (
                            <Text style={styles.igCommentLikesCount}>
                              {reply.likesCount} likes
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Reply Heart Like */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleCommentLike(comment.id, reply.id)}
                        style={styles.commentHeartBtn}
                      >
                        <CustomLucidIcons
                          name="heart"
                          size={13}
                          color={reply.isLiked ? '#FF2E54' : '#94A3B8'}
                          fill={reply.isLiked ? '#FF2E54' : 'transparent'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* =========================================================================
          6. INSTAGRAM BOTTOM COMMENT INPUT WITH QUICK EMOJIS
      ========================================================================== */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <SafeAreaView edges={['bottom']}>
          {/* Replying Banner */}
          {replyingTo && (
            <View style={styles.replyingBar}>
              <Text style={styles.replyingText}>
                Replying to <Text style={styles.boldText}>@{replyingTo.userName}</Text>
              </Text>
              <TouchableOpacity
                onPress={() => setReplyingTo(null)}
                style={styles.closeReplyBtn}
              >
                <CustomLucidIcons name="x" size={14} color="#64748B" />
              </TouchableOpacity>
            </View>
          )}

          {/* Quick Instagram Reaction Emojis Row */}
          <View style={styles.emojiRow}>
            {QUICK_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={`emoji_${index}`}
                activeOpacity={0.7}
                onPress={() => handleAppendEmoji(emoji)}
                style={styles.emojiItemBtn}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Instagram Comment Input Bar */}
          <View style={styles.igInputContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
              style={styles.userCommentAvatar}
            />

            <TextInput
              ref={commentInputRef}
              style={styles.igTextInput}
              placeholder={
                replyingTo
                  ? `Reply to @${replyingTo.userName}...`
                  : 'Add a comment...'
              }
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={400}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!inputText.trim()}
              onPress={handlePostComment}
              style={styles.postTextBtn}
            >
              <Text
                style={[
                  styles.postText,
                  inputText.trim() ? styles.postTextActive : styles.postTextDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SuccessStoryDetailScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: moderateVerticalScale(24),
  },

  // Instagram Top Nav
  igTopNav: {
    height: moderateVerticalScale(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: moderateScale(4),
  },
  igTopNavTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(16),
    color: '#0F172A',
  },

  // 1. Post Header
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(10),
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarGradientBorder: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    borderWidth: 2,
    borderColor: '#DB2F3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(10),
  },
  authorAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
  },
  authorMeta: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorUsername: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13.5),
    color: '#0F172A',
  },
  authorLocation: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11),
    color: '#64748B',
    marginTop: 1,
  },
  moreOptionsBtn: {
    padding: moderateScale(6),
  },

  // 2. Carousel
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  slideImageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  igCounterBadge: {
    position: 'absolute',
    top: moderateVerticalScale(12),
    right: moderateScale(14),
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: moderateScale(9),
    paddingVertical: moderateVerticalScale(3.5),
    borderRadius: moderateScale(12),
  },
  igCounterText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(11),
    color: '#FFFFFF',
  },
  bigHeartContainer: {
    position: 'absolute',
    top: '36%',
    left: '38%',
    zIndex: 20,
  },

  // 3. Action Row
  igActionRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateVerticalScale(10),
    paddingBottom: moderateVerticalScale(6),
  },
  igActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  igActionIconBtn: {
    paddingVertical: moderateVerticalScale(4),
    paddingRight: moderateScale(14),
  },
  igDotsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  igDot: {
    marginHorizontal: moderateScale(3),
  },
  igActiveDot: {
    width: moderateScale(6.5),
    height: moderateScale(6.5),
    borderRadius: moderateScale(3.25),
    backgroundColor: '#0095F6',
  },
  igInactiveDot: {
    width: moderateScale(5.5),
    height: moderateScale(5.5),
    borderRadius: moderateScale(2.75),
    backgroundColor: '#CBD5E1',
  },
  igBookmarkBtn: {
    paddingVertical: moderateVerticalScale(4),
    paddingLeft: moderateScale(6),
    zIndex: 2,
  },

  // 4. Post Details
  postDetailsSection: {
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateVerticalScale(4),
    paddingBottom: moderateVerticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
  },
  likesText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13),
    color: '#0F172A',
    marginBottom: moderateVerticalScale(4),
  },
  boldText: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#0F172A',
  },
  captionText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: '#1E293B',
  },
  fullStoryWrap: {
    marginTop: moderateVerticalScale(6),
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
  },
  fullStoryParagraph: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    lineHeight: moderateScale(19),
    color: '#475569',
  },
  readMoreToggle: {
    marginTop: moderateVerticalScale(2),
  },
  readMoreText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#94A3B8',
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: moderateVerticalScale(6),
  },
  hashtag: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#0369A1',
    marginRight: moderateScale(8),
  },
  dateStampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(6),
  },
  dateStampText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(10.5),
    color: '#94A3B8',
    marginLeft: moderateScale(4),
  },

  // 5. Comments Section
  commentsSection: {
    paddingHorizontal: moderateScale(14),
    paddingTop: moderateVerticalScale(12),
  },
  commentsHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateVerticalScale(12),
  },
  commentsHeading: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(14.5),
    color: '#0F172A',
  },
  addCommentLink: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(12),
    color: '#DB2F3C',
  },
  igCommentBlock: {
    marginBottom: moderateVerticalScale(14),
  },
  igCommentMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  igCommentAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(10),
    backgroundColor: '#E2E8F0',
  },
  igCommentBody: {
    flex: 1,
  },
  igCommentLine: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    lineHeight: moderateScale(18),
    color: '#1E293B',
  },
  igCommentFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(4),
  },
  igCommentTime: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11),
    color: '#94A3B8',
    marginRight: moderateScale(12),
  },
  igCommentLikesCount: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(11),
    color: '#64748B',
    marginRight: moderateScale(12),
  },
  igReplyTextBtn: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(11),
    color: '#64748B',
  },
  commentHeartBtn: {
    padding: moderateScale(6),
    paddingRight: 0,
  },

  // Nested Replies
  igRepliesWrap: {
    marginLeft: moderateScale(42),
    marginTop: moderateVerticalScale(8),
  },
  igReplyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(8),
  },
  igReplyAvatar: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(8),
    backgroundColor: '#E2E8F0',
  },

  // 6. Instagram Bottom Comment Bar
  replyingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(6),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  replyingText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(11.5),
    color: '#475569',
  },
  closeReplyBtn: {
    padding: moderateScale(4),
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: moderateVerticalScale(6),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
  emojiItemBtn: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateVerticalScale(2),
  },
  emojiText: {
    fontSize: moderateScale(20),
  },
  igInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(8),
  },
  userCommentAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(10),
  },
  igTextInput: {
    flex: 1,
    minHeight: moderateVerticalScale(36),
    maxHeight: moderateVerticalScale(80),
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13),
    color: '#0F172A',
    paddingVertical: moderateVerticalScale(6),
  },
  postTextBtn: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateVerticalScale(6),
  },
  postText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13.5),
  },
  postTextActive: {
    color: '#DB2F3C',
  },
  postTextDisabled: {
    color: '#CBD5E1',
  },
});
