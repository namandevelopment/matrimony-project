import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  useWindowDimensions,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { apiFetch } from '../../redux/apiService';
import { ApiURL } from '../../redux/apiService/endpoint';

export interface SuccessStoryItem {
  id: string;
  storyId?: string;
  coupleName: string;
  coupleNames?: string;
  groomName?: string;
  brideName?: string;
  imageUrl?: string;
  photoUrl?: string;
  photoUrls?: string[];
  weddingDate?: string;
  postedDate?: string;
  postedOn?: string;
  city?: string;
  location?: string;
  subcaste?: string;
  badge?: string;
  storyTitle?: string;
  storySnippet?: string;
  storyDescription?: string;
  testimonial?: string;
  fullStory?: string;
  likesCount?: number;
  isVerified?: boolean;
}

const FALLBACK_STORIES: SuccessStoryItem[] = [
  {
    id: '67b34a12c8e312a0f9000301',
    coupleName: 'Naveen Advani & Geeta Chhabria',
    groomName: 'Naveen Advani',
    brideName: 'Geeta Chhabria',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    photoUrls: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    ],
    weddingDate: '14 Dec 2025',
    location: 'Jaipur, Rajasthan',
    subcaste: 'Bhaiband',
    badge: 'Just Married',
    storySnippet:
      'We connected on SindhiMatrimony, discovered that our families hailed from adjacent neighborhoods in Ajmer, and found perfect alignment in culture, gotra, and life goals.',
    fullStory:
      "Our journey began with a simple Connect request on the app. We spent three weeks understanding each other's aspirations and family traditions. When our parents met for the formal 'Kachhi Misri', everyone instantly bonded over authentic Sindhi Dal Pakwan. Truly a match made in heaven!",
    likesCount: 142,
    isVerified: true,
  },
  {
    id: '67b34a12c8e312a0f9000302',
    coupleName: 'Rahul Vaswani & Priya Jhangiani',
    groomName: 'Rahul Vaswani',
    brideName: 'Priya Jhangiani',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    photoUrls: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    ],
    weddingDate: '20 Jan 2026',
    location: 'Bandra, Mumbai',
    subcaste: 'Bhaiband',
    badge: '31/36 Guna Match',
    storySnippet:
      "Our families exchanged Kundlis using the app's instant 36 Guna Milan feature. With 31/36 score, our wedding was celebrated with vibrant Lada and Santh ceremonies.",
    fullStory:
      'Both of us were working in fast-paced corporate roles in Mumbai. SindhiMatrimony made the search transparent and dignified. The compatibility report gave both sets of elders immense confidence.',
    likesCount: 178,
    isVerified: true,
  },
  {
    id: '67b34a12c8e312a0f9000303',
    coupleName: 'Mohit Motwani & Divya Bhavnani',
    groomName: 'Mohit Motwani',
    brideName: 'Divya Bhavnani',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    photoUrls: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    ],
    weddingDate: '05 Feb 2026',
    location: 'Kalyani Nagar, Pune',
    subcaste: 'Bhaiband',
    badge: 'Arranged Love',
    storySnippet:
      'Finding someone who shares the same entrepreneurial drive and Sindhi values felt impossible until we matched here. Within 4 months, we tied the knot!',
    fullStory:
      'Divya runs her own design boutique and I manage a software consultancy. Our partner preferences matched to 96%. After our initial video call on the app, we knew our wavelengths were completely in sync.',
    likesCount: 195,
    isVerified: true,
  },
];

const PAGE_SIZE = 10;

const SuccessStoriesListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();

  const [stories, setStories] = useState<SuccessStoryItem[]>(FALLBACK_STORIES);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // Normalizer for unified story format
  const normalizeStories = useCallback((rawList: any[]): SuccessStoryItem[] => {
    return rawList.map((item: any, idx: number) => {
      const couple =
        item.coupleName ||
        item.coupleNames ||
        (item.groomName && item.brideName ? `${item.groomName} & ${item.brideName}` : 'Happy Couple');
      const img =
        item.imageUrl ||
        item.photoUrl ||
        item.couplePhoto ||
        (Array.isArray(item.photoUrls) ? item.photoUrls[0] : '') ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
      const photos = Array.isArray(item.photoUrls) && item.photoUrls.length > 0 ? item.photoUrls : [img];

      return {
        id: String(item.id || item._id || item.storyId || `story_${idx + 1}`),
        storyId: item.storyId,
        coupleName: couple,
        groomName: item.groomName,
        brideName: item.brideName,
        imageUrl: img,
        photoUrl: img,
        photoUrls: photos,
        weddingDate: item.weddingDate || 'Recently',
        postedDate: item.postedDate || item.postedOn,
        location: item.location || item.city || 'India',
        subcaste: item.subcaste || 'Sindhi',
        badge: item.badge || item.storyTitle || 'Just Married',
        storySnippet:
          item.storySnippet ||
          item.storyDescription ||
          item.testimonial ||
          'Found our perfect match and life partner through Sindhi Matrimony.',
        fullStory: item.fullStory || item.storyDescription || item.storySnippet,
        likesCount: Number(item.likesCount) || 120 + idx * 15,
        isVerified: item.isVerified !== false,
      };
    });
  }, []);

  // Fetch paginated feed
  const fetchStoriesFeed = useCallback(
    async (pageToFetch: number, isRefresh = false) => {
      try {
        const response = await apiFetch({
          url: ApiURL.successStoriesFeed,
          method: 'GET',
          params: { page: pageToFetch, limit: PAGE_SIZE },
          showErrorToast: false,
        });

        const raw = response?.data !== undefined ? response.data : response;
        const list = Array.isArray(raw?.list)
          ? raw.list
          : Array.isArray(raw?.stories)
            ? raw.stories
            : Array.isArray(raw?.items)
              ? raw.items
              : Array.isArray(raw)
                ? raw
                : [];

        if (list.length > 0) {
          const parsed = normalizeStories(list);
          setStories((prev) => {
            if (isRefresh || pageToFetch === 1) return parsed;
            const existingIds = new Set(prev.map((s) => s.id));
            const newItems = parsed.filter((s) => !existingIds.has(s.id));
            return [...prev, ...newItems];
          });

          const serverHasMore = raw?.hasMore !== undefined ? raw.hasMore : list.length >= PAGE_SIZE;
          setHasMore(serverHasMore);
        } else {
          if (pageToFetch === 1 && (!stories || stories.length === 0)) {
            setStories(FALLBACK_STORIES);
          }
          setHasMore(false);
        }
      } catch {
        if (pageToFetch === 1 && (!stories || stories.length === 0)) {
          setStories(FALLBACK_STORIES);
        }
        setHasMore(false);
      } finally {
        setInitialLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [normalizeStories, stories],
  );

  useEffect(() => {
    fetchStoriesFeed(1, true);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(1);
    fetchStoriesFeed(1, true);
  }, [fetchStoriesFeed]);

  const handleEndReached = useCallback(() => {
    if (!hasMore || isLoadingMore || isRefreshing || initialLoading) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchStoriesFeed(nextPage, false);
  }, [fetchStoriesFeed, hasMore, initialLoading, isLoadingMore, isRefreshing, page]);

  const handleStoryPress = useCallback(
    (story: SuccessStoryItem) => {
      navigation.navigate('SuccessStoryDetailScreen', {
        story,
        id: story.id,
      });
    },
    [navigation],
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerBanner}>
        <View style={styles.badgeRow}>
          <View style={styles.limcaPill}>
            <CustomLucidIcons name="award" size={13} color="#0D9488" />
            <Text style={styles.limcaText}>Limca Book of Records</Text>
          </View>
          <View style={styles.verifiedCountPill}>
            <CustomLucidIcons name="check-circle" size={13} color="#DB2F3C" />
            <Text style={styles.verifiedCountText}>100% Verified Marriages</Text>
          </View>
        </View>

        <Text style={styles.bannerHeadline}>Lakhs of Happy Marriages!</Text>
        <Text style={styles.bannerSubtext}>
          Inspiring authentic stories of Sindhi couples who discovered love, family blessing, and eternal togetherness.
        </Text>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SuccessStoryItem>) => {
      return (
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => handleStoryPress(item)}
          style={styles.card}
        >
          {/* Card Hero Photo */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            {/* Top Left Badge */}
            <View style={styles.badgeTag}>
              <CustomLucidIcons name="heart" size={11} color="#FFF" fill="#FFF" />
              <Text style={styles.badgeTagText}>{item.badge || 'Just Married'}</Text>
            </View>

            {/* Bottom Photo Overlay Info */}
            <View style={styles.photoOverlay}>
              <View style={styles.photoOverlayMeta}>
                <CustomLucidIcons name="calendar" size={12} color="#FFF" />
                <Text style={styles.photoOverlayText}>Wedded: {item.weddingDate}</Text>
              </View>
              {item.location ? (
                <View style={styles.photoOverlayMeta}>
                  <CustomLucidIcons name="map-pin" size={12} color="#FFF" />
                  <Text style={styles.photoOverlayText}>{item.location}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Card Content Body */}
          <View style={styles.cardBody}>
            <View style={styles.nameRow}>
              <Text style={styles.coupleName} numberOfLines={1}>
                {item.coupleName}
              </Text>
              {item.isVerified && (
                <View style={styles.verifiedBadge}>
                  <CustomLucidIcons name="check" size={11} color="#0095F6" />
                </View>
              )}
            </View>

            {item.subcaste ? (
              <Text style={styles.subcasteText}>Community: {item.subcaste}</Text>
            ) : null}

            <Text style={styles.storyQuote} numberOfLines={3}>
              “{item.storySnippet}”
            </Text>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <View style={styles.likesPill}>
                <CustomLucidIcons name="heart" size={13} color="#FF2E54" fill="#FF2E54" />
                <Text style={styles.likesCountText}>{item.likesCount} Likes</Text>
              </View>

              <View style={styles.readStoryBtn}>
                <Text style={styles.readStoryText}>Read Full Story</Text>
                <CustomLucidIcons name="chevron-right" size={14} color="#DB2F3C" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleStoryPress],
  );

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#DB2F3C" />
          <Text style={styles.footerLoaderText}>Loading more stories...</Text>
        </View>
      );
    }
    if (!hasMore && stories.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <View style={styles.footerLine} />
          <Text style={styles.footerEndText}>You've viewed all happy stories ✨</Text>
          <View style={styles.footerLine} />
        </View>
      );
    }
    return <View style={{ height: 24 }} />;
  }, [hasMore, isLoadingMore, stories.length]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <CustomHeader title="Success Stories" showBack={true} />

      {initialLoading && stories.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#DB2F3C" />
          <Text style={styles.loadingText}>Fetching beautiful weddings...</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#DB2F3C']}
              tintColor="#DB2F3C"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SuccessStoriesListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Medium,
  },
  listContent: {
    paddingBottom: 32,
  },
  headerBanner: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  limcaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#CCFBF1',
  },
  limcaText: {
    fontSize: 11,
    color: '#0F766E',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  verifiedCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#FFE4E6',
  },
  verifiedCountText: {
    fontSize: 11,
    color: '#BE123C',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  bannerHeadline: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
    marginBottom: 4,
  },
  bannerSubtext: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    fontFamily: fontFamily.Inter18Regular,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECEFF3',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(219, 47, 60, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
  },
  badgeTagText: {
    fontSize: 11,
    color: '#FFF',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoOverlayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoOverlayText: {
    fontSize: 11.5,
    color: '#FFF',
    fontFamily: fontFamily.Inter18Medium,
  },
  cardBody: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  coupleName: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18Bold,
    color: '#1F2937',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#EBF5FF',
    borderRadius: 10,
    padding: 2,
  },
  subcasteText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Medium,
    color: '#6B7280',
    marginBottom: 8,
  },
  storyQuote: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    fontFamily: fontFamily.Inter18Regular,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  likesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  likesCountText: {
    fontSize: 12.5,
    color: '#4B5563',
    fontFamily: fontFamily.Inter18Medium,
  },
  readStoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readStoryText: {
    fontSize: 13,
    color: '#DB2F3C',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  footerLoaderText: {
    fontSize: 12.5,
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Medium,
  },
  footerEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  footerEndText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: fontFamily.Inter18Medium,
  },
});
