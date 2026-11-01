import React, { useCallback } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../../components/images';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';
import { ApiURL } from '../../../redux/apiService';
import { useApiQuery } from '../../../tanstackQuery/useQuery';
import { QUERY_KEYS } from '../../../tanstackQuery/keys';

interface CelebratingBannerProps {
  onPress?: () => void;
  imageUrl?: string;
  isVisible?: boolean;
  ctaUrl?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const CelebratingBanner: React.FC<CelebratingBannerProps> = ({
  onPress,
  imageUrl: propImageUrl,
  isVisible: propIsVisible,
  ctaUrl: propCtaUrl,
  containerStyle,
}) => {
  const navigation = useNavigation<any>();

  const { data: bannerData } = useApiQuery({
    queryKey: QUERY_KEYS.banners,
    url: ApiURL.homeBanners,
    staleTime: 1000 * 60 * 10,
    select: useCallback((res: any) => {
      const raw = res?.data !== undefined ? res.data : res;
      return raw?.celebratingBanner || null;
    }, []),
  });

  const isVisible = propIsVisible ?? bannerData?.isVisible ?? true;
  if (!isVisible) {
    return null;
  }

  const imageUrl = propImageUrl || bannerData?.imageUrl;
  const targetRoute = propCtaUrl || bannerData?.ctaUrl || 'Upgrade';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        navigation.navigate(targetRoute);
      } catch (e) {
        navigation.navigate('BottomTab', { screen: targetRoute });
      }
    }
  };

  const imageSource = imageUrl ? { uri: imageUrl } : IMAGES.celebratingBanner;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, containerStyle]}
      accessibilityRole="button"
      accessibilityLabel={
        bannerData?.title
          ? `${bannerData.title}. ${bannerData.ctaText || 'Get upto 78% OFF'}`
          : 'Celebrating 26 Years of Matchmaking. Get upto 78% OFF'
      }
    >
      <View style={styles.bannerWrapper}>
        <Image
          source={imageSource}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

export default CelebratingBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerWrapper: {
    width: '100%',
    aspectRatio: 1024 / 488,
    position: 'relative',
    backgroundColor: '#F7FFEA',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
