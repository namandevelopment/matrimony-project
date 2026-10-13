import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { ViewStyle } from 'react-native';

interface Props {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
  [key: string]: any;
}

const DEFAULT_SIZE = 18;
const DEFAULT_COLOR = '#666';

const CustomLucidIcons: React.FC<Props> = ({
  name,
  size = DEFAULT_SIZE,
  color = DEFAULT_COLOR,
  style,
  ...props
}) => {
  // Convert "chevron-down" -> "ChevronDown"
  const iconName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const LucideIcon: any = LucideIcons[iconName as keyof typeof LucideIcons];

  if (!LucideIcon) {
    console.warn(`Lucide icon "${name}" not found`);
    return null;
  }

  return <LucideIcon size={size} color={color} style={style} {...props} />;
};

export default CustomLucidIcons;
