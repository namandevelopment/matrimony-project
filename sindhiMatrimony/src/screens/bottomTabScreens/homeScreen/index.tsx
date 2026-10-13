import React, { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import {
  Profile,
  ProfileCard,
  ScreenHeader,
  ScreenShell,
  SectionTitle,
  styles as sharedStyles,
} from '../components';
import LinearGradient from 'react-native-linear-gradient'
import HomeProfileTab from '../components/HomeProfileTab';
import PrimeModal from '../../../customModals/PrimeModal';

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Aashna',
    age: 26,
    location: 'Mumbai, Maharashtra',
    initials: 'A',
    accent: '#D8797B',
    verified: true,
    profession: 'UX Designer',
  },
  {
    id: '2',
    name: 'Mihir',
    age: 29,
    location: 'Pune, Maharashtra',
    initials: 'M',
    accent: '#6E9BB2',
    online: true,
    profession: 'Software Engineer',
  },
  {
    id: '3',
    name: 'Riya',
    age: 25,
    location: 'Ahmedabad, Gujarat',
    initials: 'R',
    accent: '#B58A70',
    verified: true,
    profession: 'Architect',
  },
];

const HomeScreen = () => {
  const [primeModalVisible, setPrimeModalVisible] = React.useState(false);

  const renderProfileItem = useCallback(
    ({ item }: { item: Profile }) => <ProfileCard profile={item} compact />,
    [],
  );

  const profileKeyExtractor = useCallback((item: Profile) => item.id, []);

  return (
    // <ScreenShell>
    <>
      <View style={{ flex: 1, backgroundColor: COLORS.background }} >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >

          <HomeProfileTab onPressPrime={() => {
            setPrimeModalVisible(true)
            console.log('Prime pressed')
          }} />

          <View style={styles.completionCard}>
            <View style={styles.completionIcon}>
              <CustomLucidIcons name="sparkles" color={COLORS.white} size={19} />
            </View>
            <View style={styles.completionCopy}>
              <Text style={styles.completionTitle}>Complete your profile</Text>
              <Text style={styles.completionText}>
                A complete profile gets more meaningful responses.
              </Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressValue} />
              </View>
              <Text style={styles.progressLabel}>65% complete</Text>
            </View>
            <CustomLucidIcons
              name="chevron-right"
              color={COLORS.themeColor}
              size={19}
            />
          </View>
          <SectionTitle title="Quick actions" />
          <View style={styles.actionsRow}>
            {[
              { label: 'Daily matches', icon: 'users-round' },
              { label: 'Who liked me', icon: 'heart' },
              { label: 'Saved profiles', icon: 'bookmark' },
            ].map(action => (
              <Pressable
                key={action.label}
                style={({ pressed }) => [
                  styles.action,
                  pressed && sharedStyles.pressed,
                ]}
              >
                <View style={styles.actionIcon}>
                  <CustomLucidIcons
                    name={action.icon}
                    color={COLORS.themeColor}
                    size={19}
                  />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
          <SectionTitle title="Recommended for you" action="See all" />
          <View style={styles.horizontalListWrap}>
            <FlashList
              horizontal
              data={profiles}
              keyExtractor={profileKeyExtractor}
              renderItem={renderProfileItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>
          <SectionTitle title="A little inspiration" />
          <View style={styles.quoteCard}>
            <CustomLucidIcons name="quote" color={COLORS.themeColor} size={24} />
            <Text style={styles.quote}>
              The best connections begin with a genuine conversation.
            </Text>
            <Text style={styles.quoteCaption}>Take the first step today</Text>
          </View>
          <PrimeModal
            visible={primeModalVisible}
            onClose={() => setPrimeModalVisible(false)}
            onAddPhoto={() => console.log('Add photo pressed')}
            step={1}
            totalSteps={2}
          />
          {/* </ScreenShell>
   */}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  completionCard: {
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 14,
  },
  completionIcon: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  completionCopy: { flex: 1, marginHorizontal: 12 },
  completionTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  completionText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  progressTrack: {
    backgroundColor: '#F2D0D2',
    borderRadius: 3,
    height: 5,
    marginTop: 9,
    overflow: 'hidden',
  },
  progressValue: {
    backgroundColor: COLORS.themeColor,
    borderRadius: 3,
    height: 5,
    width: '65%',
  },
  progressLabel: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 10,
    marginTop: 4,
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  action: { alignItems: 'center', width: '31%' },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF0F1',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  actionLabel: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
    marginTop: 7,
    textAlign: 'center',
  },
  quoteCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 17 },
  quote: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  quoteCaption: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    marginTop: 8,
  },
  profileHeader: {
    minHeight: 145,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
  },

  planToggle: {
    alignSelf: 'center',
    width: '65%',
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  regularTab: {
    flex: 1,
    backgroundColor: '#D9363E',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  regularText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },

  primeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primeText: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 16,
  },

  primeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D9363E',
    marginLeft: 2,
  },

  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  avatarWrapper: {
    width: 58,
    height: 58,
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },

  avatarText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 25,
    color: '#E5A044',
  },

  cameraButton: {
    position: 'absolute',
    left: 0,
    bottom: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 19,
  },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  memberText: {
    color: '#333',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 16,
  },

  upgradeButton: {
    height: 34,
    paddingHorizontal: 13,
    borderRadius: 18,
    borderWidth: 1.3,
    borderColor: '#B79555',
    marginLeft: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  upgradeText: {
    color: '#9B7938',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
  },

  headerActions: {
    position: 'absolute',
    right: 14,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  horizontalListWrap: {
    minHeight: 140,
    marginBottom: 8,
  },
  horizontalListContent: {
    paddingVertical: 2,
  },
});

export default HomeScreen;
