import { Dimensions } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

export {
  width,
  height,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
};

export const activeOpacity = 0.7;

// Safe Area Hook
export const useInsets = () => {
  const insets = useSafeAreaInsets();

  return {
    insets,
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  };
};