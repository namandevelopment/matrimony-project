// CustomVectorIcons.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

// Create a mapping of icon sets
const iconSets: Record<string, any> = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

// Default icon set
const DEFAULT_ICON_SET = 'Ionicons';

interface CustomVectorIconsProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  iconSet?: string;
  rotation?: number;
  [key: string]: any; // To allow any additional props
}

const CustomVectorIcons: React.FC<CustomVectorIconsProps> = ({
  name,
  size = 24,
  color = 'black',
  style,
  iconSet = DEFAULT_ICON_SET,
  rotation = 0,
  ...props
}) => {
  // Select the appropriate icon component based on iconSet
  const IconComponent = iconSets[iconSet] || iconSets[DEFAULT_ICON_SET];

  return (
    <View style={[styles.iconContainer, style]}>
      <IconComponent
        name={name}
        size={size}
        color={color}
        style={{ transform: [{ rotate: `${rotation}deg` }] }}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {},
});

export default CustomVectorIcons;
