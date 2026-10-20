import React, { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import CustomLucidIcons from '../../components/CustomLucidIcons';

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  initials: string;
  accent: string;
  online?: boolean;
  verified?: boolean;
  profession?: string;
}

interface ScreenShellProps {
  children: ReactNode;
  scroll?: boolean;
}

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  actionIcon?: string;
  onActionPress?: () => void;
}

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: string;
}

export const ScreenShell = ({ children, scroll = true }: any) => {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return <View style={styles.safeArea}>{content}</View>;
};

export const ScreenHeader = ({
  eyebrow,
  title,
  actionIcon,
  onActionPress,
}: ScreenHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.headerCopy}>
      {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    {!!actionIcon && (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
        hitSlop={8}
        onPress={onActionPress}
        style={({ pressed }) => [
          styles.headerAction,
          pressed && styles.pressed,
        ]}
      >
        <CustomLucidIcons name={actionIcon} color={COLORS.black} size={21} />
      </Pressable>
    )}
  </View>
);

export const SectionTitle = ({
  title,
  action,
  onActionPress,
}: {
  title: string;
  action?: string;
  onActionPress?: () => void;
}) => (
  <View style={styles.sectionTitleRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {!!action && (
      <Pressable onPress={onActionPress} hitSlop={8}>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    )}
  </View>
);

export const Avatar = ({
  profile,
  size = 56,
}: {
  profile: Profile;
  size?: number;
}) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: profile.accent,
      },
    ]}
  >
    <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>
      {profile.initials}
    </Text>
    {profile.online && <View style={styles.onlineDot} />}
  </View>
);

export const ProfileCard = ({
  profile,
  compact = false,
  onPress,
}: {
  profile: Profile;
  compact?: boolean;
  onPress?: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      compact ? styles.compactProfileCard : styles.profileCard,
      pressed && styles.pressed,
    ]}
  >
    <Avatar profile={profile} size={compact ? 48 : 62} />
    <View style={styles.profileCopy}>
      <View style={styles.profileNameRow}>
        <Text style={styles.profileName} numberOfLines={1}>
          {profile.name}, {profile.age}
        </Text>
        {profile.verified && (
          <CustomLucidIcons
            name="badge-check"
            color={COLORS.themeColor}
            size={15}
          />
        )}
      </View>
      <Text style={styles.profileMeta} numberOfLines={1}>
        {profile.location}
      </Text>
      {!!profile.profession && (
        <Text style={styles.profileProfession} numberOfLines={1}>
          {profile.profession}
        </Text>
      )}
    </View>
    {!compact && (
      <CustomLucidIcons
        name="chevron-right"
        color={COLORS.inactiveTab}
        size={18}
      />
    )}
  </Pressable>
);

export const Chip = ({ label, selected = false, onPress, icon }: ChipProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.chip,
      selected && styles.selectedChip,
      pressed && styles.pressed,
    ]}
  >
    {!!icon && (
      <CustomLucidIcons
        name={icon}
        color={selected ? COLORS.white : COLORS.inactiveTab}
        size={14}
      />
    )}
    <Text style={[styles.chipText, selected && styles.selectedChipText]}>
      {label}
    </Text>
  </Pressable>
);

export const SearchField = (props: TextInputProps) => (
  <View style={styles.searchField}>
    <CustomLucidIcons name="search" color={COLORS.inactiveTab} size={19} />
    <TextInput
      {...props}
      placeholderTextColor="#999999"
      style={styles.searchInput}
    />
    <CustomLucidIcons
      name="sliders-horizontal"
      color={COLORS.themeColor}
      size={19}
    />
  </View>
);

export const PrimaryButton = ({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress?: () => void;
  icon?: string;
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
  >
    <Text style={styles.primaryButtonText}>{label}</Text>
    {!!icon && <CustomLucidIcons name={icon} color={COLORS.white} size={17} />}
  </Pressable>
);

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 28 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  headerCopy: { flex: 1 },
  eyebrow: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
    marginBottom: 3,
  },
  headerTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter24Bold,
    fontSize: 25,
  },
  headerAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  pressed: { opacity: 0.7 },
  sectionTitleRow: {
    alignItems: 'center', paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 22,
  },
  sectionTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
  },
  sectionAction: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { color: COLORS.white, fontFamily: fontFamily.Inter18Bold },
  onlineDot: {
    backgroundColor: '#39B54A',
    borderColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 2,
    bottom: 0,
    height: 12,
    position: 'absolute',
    right: 0,
    width: 12,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
  },
  compactProfileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginRight: 10,
    padding: 12,
    width: 138,
  },
  profileCopy: { flex: 1, marginLeft: 11 },
  profileNameRow: { alignItems: 'center', flexDirection: 'row', gap: 5 },
  profileName: {
    color: COLORS.black,
    flexShrink: 1,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  profileMeta: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    marginTop: 4,
  },
  profileProfession: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    marginTop: 5,
  },
  chip: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    marginRight: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  selectedChip: {
    backgroundColor: COLORS.themeColor,
    borderColor: COLORS.themeColor,
  },
  chipText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  selectedChipText: { color: COLORS.white },
  searchField: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 13,
  },
  searchInput: {
    color: COLORS.black,
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    height: 48,
    marginHorizontal: 9,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
});
