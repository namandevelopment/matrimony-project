import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { Avatar, Profile, ScreenHeader, ScreenShell } from '../components';

const incoming: Profile[] = [
  {
    id: '1',
    name: 'Aashna',
    age: 26,
    location: 'Mumbai',
    initials: 'A',
    accent: '#D8797B',
    verified: true,
  },
  {
    id: '2',
    name: 'Yash',
    age: 30,
    location: 'Surat',
    initials: 'Y',
    accent: '#B58A70',
    online: true,
  },
];

const InterestRow = ({ profile }: { profile: Profile }) => (
  <View style={styles.interestRow}>
    <Avatar profile={profile} size={52} />
    <View style={styles.copy}>
      <Text style={styles.name}>
        {profile.name}, {profile.age}
      </Text>
      <Text style={styles.location}>
        {profile.location} · Sent you an interest
      </Text>
    </View>
    <View style={styles.rowActions}>
      <Pressable style={styles.acceptButton}>
        <CustomLucidIcons name="check" color={COLORS.white} size={17} />
      </Pressable>
      <Pressable style={styles.dismissButton}>
        <CustomLucidIcons name="x" color={COLORS.inactiveTab} size={17} />
      </Pressable>
    </View>
  </View>
);

const InterestsScreen = () => {
  const [tab, setTab] = useState<'Received' | 'Sent'>('Received');
  return (
    <ScreenShell>
      <ScreenHeader
        eyebrow="Make a connection"
        title="Interests"
        actionIcon="heart"
      />
      <View style={styles.tabs}>
        {(['Received', 'Sent'] as const).map(item => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[styles.tab, tab === item && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, tab === item && styles.activeTabText]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === 'Received' ? (
        incoming.map(profile => (
          <InterestRow key={profile.id} profile={profile} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <CustomLucidIcons name="send" color={COLORS.themeColor} size={24} />
          </View>
          <Text style={styles.emptyTitle}>No sent interests yet</Text>
          <Text style={styles.emptyText}>
            When you like someone, your interests will appear here.
          </Text>
        </View>
      )}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  tabs: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 3,
  },
  tab: { alignItems: 'center', borderRadius: 8, flex: 1, paddingVertical: 10 },
  activeTab: { backgroundColor: COLORS.white, elevation: 1 },
  tabText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
  },
  activeTabText: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  interestRow: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 12,
  },
  copy: { flex: 1, marginLeft: 11 },
  name: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  location: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    marginTop: 5,
  },
  rowActions: { flexDirection: 'row', gap: 6 },
  acceptButton: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  dismissButton: {
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  emptyState: { alignItems: 'center', marginTop: 90, paddingHorizontal: 30 },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF0F1',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  emptyTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 16,
    marginTop: 14,
  },
  emptyText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    textAlign: 'center',
  },
});

export default InterestsScreen;
