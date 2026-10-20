import React from 'react';
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

interface CelebratingBannerProps {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const CelebratingBanner: React.FC<CelebratingBannerProps> = ({
  onPress,
  containerStyle,
}) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        navigation.navigate('Upgrade');
      } catch (e) {
        navigation.navigate('BottomTab', { screen: 'Upgrade' });
      }
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, containerStyle]}
      accessibilityRole="button"
      accessibilityLabel="Celebrating 26 Years of Matchmaking. Get upto 78% OFF"
    >
      <View style={styles.bannerWrapper}>
        <Image
          source={IMAGES.celebratingBanner}
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
