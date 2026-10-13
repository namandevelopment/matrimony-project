// @ts-nocheck
import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../../utils/Responsive';
import { showToast } from '../../utils/CustomToast';

// Palette constants matching the screenshots exactly
const HEADER_COLOR = '#EE5559';
const PROFILE_CARD_BG = '#FFFFFF';
const TEXT_DARK = '#222222';
const TEXT_MUTED = '#71717A';
const ACCENT_BLUE = '#0288D1';
const SCORE_TRACK = '#F5E7CA';
const SCORE_FILL = '#F5A623';
const SCORE_TEXT = '#D48812';
const ICON_GRAY = '#666666';
const DIVIDER_COLOR = '#ECECEC';
const VERSION_GRAY = '#9E9E9E';

interface MenuItem {
  id: string;
  title: string;
  iconName: string;
  color?: string;
  isHighlighted?: boolean;
  onPress?: () => void;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleSupportPress = useCallback(() => {
    navigation.navigate('HelpCenter');
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('NotificationScreen');
  }, [navigation]);

  const handleUpgradePress = useCallback(() => {
    try {
      navigation.navigate('BottomTab', { screen: 'Upgrade' });
    } catch {
      navigation.navigate('Upgrade');
    }
  }, [navigation]);

  const handleNavigateToTab = useCallback(
    (tabName: string) => {
      try {
        navigation.navigate('BottomTab', { screen: tabName });
      } catch {
        navigation.navigate(tabName);
      }
    },
    [navigation]
  );

  const handleGenericItemPress = useCallback((title: string) => {
    showToast({
      type: 'info',
      message: `${title} opened`,
    });
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 'verify_profile',
      title: 'Verify Your Profile',
      iconName: 'shield-check',
      onPress: () => navigation.navigate('VerifyYourProfile'),
    },
    {
      id: 'matches',
      title: 'Matches',
      iconName: 'users-round',
      onPress: () => handleNavigateToTab('Matches'),
    },
    {
      id: 'interests',
      title: 'Interests',
      iconName: 'heart',
      onPress: () => handleNavigateToTab('Interests'),
    },
    {
      id: 'daily_recommendation',
      title: 'Daily Recommendation',
      iconName: 'calendar-days',
      onPress: () => handleGenericItemPress('Daily Recommendation'),
    },
    {
      id: 'messages',
      title: 'Messages',
      iconName: 'message-circle',
      onPress: () => handleNavigateToTab('Messages'),
    },
    {
      id: 'edit_profile',
      title: 'Edit Profile',
      iconName: 'pencil',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'edit_partner_pref',
      title: 'Edit Partner Preference',
      iconName: 'user-round-pen',
      onPress: () => handleGenericItemPress('Edit Partner Preference'),
    },
    {
      id: 'upgrade_now',
      title: 'Upgrade Now',
      iconName: 'crown',
      isHighlighted: true,
      color: ACCENT_BLUE,
      onPress: handleUpgradePress,
    },
    {
      id: 'privacy_settings',
      title: 'Privacy Settings',
      iconName: 'file-lock',
      onPress: () => handleGenericItemPress('Privacy Settings'),
    },
    {
      id: 'communication_settings',
      title: 'Communication Settings',
      iconName: 'settings',
      onPress: () => handleGenericItemPress('Communication Settings'),
    },
    {
      id: 'account_settings',
      title: 'Account Settings',
      iconName: 'circle-user-round',
      onPress: () => handleGenericItemPress('Account Settings'),
    },
    {
      id: 'rate_us',
      title: 'Rate Us',
      iconName: 'star',
      onPress: () => {
        Alert.alert(
          'Rate Us',
          'Enjoying Sindhi Matrimony? Please rate us on the Play Store!',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Rate Now',
              onPress: () =>
                showToast({
                  type: 'success',
                  message: 'Thank you for your rating!',
                }),
            },
          ]
        );
      },
    },
  ];

  const legalLinks = [
    {
      id: 'help_center',
      title: '24x7 Help Center',
      hasChevron: false,
      onPress: handleSupportPress,
    },
    {
      id: 'more',
      title: 'More',
      hasChevron: true,
      onPress: () => handleGenericItemPress('More options'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      hasChevron: false,
      onPress: () => handleGenericItemPress('Terms & Conditions'),
    },
    {
      id: 'privacy_policy',
      title: 'Privacy Policy',
      hasChevron: false,
      onPress: () => handleGenericItemPress('Privacy Policy'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      <View style={[styles.headerWrapper,]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PROFILE</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleNotificationPress}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <CustomLucidIcons
                name="bell"
                size={moderateScale(23)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleSupportPress}
              accessibilityLabel="Customer Support"
              accessibilityRole="button"
            >
              <CustomLucidIcons
                name="headset"
                size={moderateScale(23)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info Summary Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/user_avatar.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.profileDetails}>
            {/* Name + Edit Icon */}
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1}>
                Mayank Tamhankar
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <CustomLucidIcons
                  name="pencil"
                  size={moderateScale(17)}
                  color="#555555"
                />
              </TouchableOpacity>
            </View>

            {/* Matrimony ID */}
            <Text style={styles.userId}>BRH4164942</Text>

            {/* Membership Line */}
            <View style={styles.membershipRow}>
              <Text style={styles.membershipLabel}>Membership - </Text>
              <Text style={styles.membershipValue}>Free</Text>
              <Text style={styles.membershipDivider}> | </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={handleUpgradePress}>
                <Text style={styles.upgradeLink}>Upgrade Now</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Score Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>

            {/* Profile Score Text */}
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Your profile score </Text>
              <Text style={styles.scoreValue}>52%</Text>
            </View>
          </View>
        </View>

        {/* Menu Items List */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => {
            const iconColor = item.color || ICON_GRAY;
            const textColor = item.isHighlighted ? item.color : TEXT_DARK;

            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.itemPressed,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuIconWrapper}>
                  <CustomLucidIcons
                    name={item.iconName}
                    size={moderateScale(22)}
                    color={iconColor}
                  />
                </View>
                <Text style={[styles.menuItemText, { color: textColor }]}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}

          {/* Full-width Divider */}
          <View style={styles.divider} />

          {/* Lower Text Links (Help, More, Legal) */}
          {legalLinks.map(link => (
            <Pressable
              key={link.id}
              style={({ pressed }) => [
                styles.linkItem,
                pressed && styles.itemPressed,
              ]}
              onPress={link.onPress}
            >
              <Text style={styles.linkText}>{link.title}</Text>
              {link.hasChevron && (
                <CustomLucidIcons
                  name="chevron-right"
                  size={moderateScale(20)}
                  color="#9E9E9E"
                />
              )}
            </Pressable>
          ))}

          {/* App Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>App version 11.8.232.139</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerWrapper: {
    backgroundColor: HEADER_COLOR,
    paddingBottom: moderateVerticalScale(12),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(4),
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(18),
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(18),
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: moderateVerticalScale(30),
  },

  // Profile Card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PROFILE_CARD_BG,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
  },
  avatarContainer: {
    width: moderateScale(74),
    height: moderateScale(74),
    borderRadius: moderateScale(37),
    backgroundColor: '#CBD5E1',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileDetails: {
    flex: 1,
    marginLeft: moderateScale(14),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.Inter18SemiBold,
    color: TEXT_DARK,
    flex: 1,
    marginRight: moderateScale(8),
  },
  userId: {
    fontSize: moderateScale(13),
    fontFamily: fontFamily.Inter18Medium,
    color: '#262626',
    marginTop: moderateVerticalScale(2),
  },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(3),
  },
  membershipLabel: {
    fontSize: moderateScale(12),
    fontFamily: fontFamily.Inter18Regular,
    color: TEXT_MUTED,
  },
  membershipValue: {
    fontSize: moderateScale(12),
    fontFamily: fontFamily.Inter18Medium,
    color: ACCENT_BLUE,
  },
  membershipDivider: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
  },
  upgradeLink: {
    fontSize: moderateScale(12),
    fontFamily: fontFamily.Inter18Medium,
    color: ACCENT_BLUE,
  },
  progressBarTrack: {
    width: '100%',
    height: moderateVerticalScale(4),
    backgroundColor: SCORE_TRACK,
    borderRadius: moderateScale(2),
    marginTop: moderateVerticalScale(6),
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '52%',
    height: '100%',
    backgroundColor: SCORE_FILL,
    borderRadius: moderateScale(2),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateVerticalScale(4),
  },
  scoreLabel: {
    fontSize: moderateScale(11),
    fontFamily: fontFamily.Inter18Regular,
    color: SCORE_TEXT,
  },
  scoreValue: {
    fontSize: moderateScale(11),
    fontFamily: fontFamily.Inter18Bold,
    color: SCORE_TEXT,
  },

  // Menu List
  menuContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateVerticalScale(6),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(14),
  },
  itemPressed: {
    opacity: 0.65,
  },
  menuIconWrapper: {
    width: moderateScale(30),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: moderateScale(15),
    fontFamily: fontFamily.Inter18Medium,
    marginLeft: moderateScale(10),
  },

  // Full-width Divider
  divider: {
    height: 1,
    backgroundColor: DIVIDER_COLOR,
    marginVertical: moderateVerticalScale(8),
    marginHorizontal: moderateScale(-20),
  },

  // Lower Links
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateVerticalScale(14),
  },
  linkText: {
    fontSize: moderateScale(15),
    fontFamily: fontFamily.Inter18Regular,
    color: TEXT_DARK,
  },

  // App Version
  versionContainer: {
    marginTop: moderateVerticalScale(16),
    marginBottom: moderateVerticalScale(28),
  },
  versionText: {
    fontSize: moderateScale(13.5),
    fontFamily: fontFamily.Inter18Regular,
    color: VERSION_GRAY,
  },
});