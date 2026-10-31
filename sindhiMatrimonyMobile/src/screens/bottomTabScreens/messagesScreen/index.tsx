import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { Avatar, Profile, ScreenHeader, ScreenShell } from '../components';

type ConversationItem = Profile & { preview: string; time: string; unread?: number };

const conversations: ConversationItem[] = [
  {
    id: '1',
    name: 'Aashna',
    age: 26,
    location: 'Mumbai',
    initials: 'A',
    accent: '#D8797B',
    online: true,
    preview: 'That sounds wonderful. Tell me more!',
    time: '10:42 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Mihir',
    age: 29,
    location: 'Pune',
    initials: 'M',
    accent: '#6E9BB2',
    preview: 'Would you like to connect this weekend?',
    time: 'Yesterday',
  },
  {
    id: '3',
    name: 'Riya',
    age: 25,
    location: 'Ahmedabad',
    initials: 'R',
    accent: '#B58A70',
    preview: 'Hello! Nice to meet you here.',
    time: 'Mon',
  },
];

const MessagesScreen = () => {
  const renderItem = useCallback(({ item }: { item: ConversationItem }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Avatar profile={item} size={54} />
      <View style={styles.copy}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.preview,
            !!item.unread && styles.unreadPreview,
          ]}
        >
          {item.preview}
        </Text>
      </View>
      {!!item.unread && (
        <View style={styles.unread}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </Pressable>
  ), []);

  const keyExtractor = useCallback((item: ConversationItem) => item.id, []);

  const ListHeader = useMemo(() => (
    <View style={styles.headerWrap}>
      <ScreenHeader
        eyebrow="Stay connected"
        title="Messages"
        actionIcon="search"
      />
      <View style={styles.notice}>
        <CustomLucidIcons
          name="shield-check"
          color={COLORS.themeColor}
          size={17}
        />
        <Text style={styles.noticeText}>
          Keep conversations respectful and meaningful.
        </Text>
      </View>
    </View>
  ), []);

  return (
    <ScreenShell scroll={false}>
      <FlashList
        data={conversations}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: 14,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 11,
  },
  noticeText: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    marginLeft: 8,
  },
  row: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: 'row',
    marginBottom: 9,
    padding: 12,
  },
  pressed: { opacity: 0.7 },
  copy: { flex: 1, marginLeft: 11 },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  time: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 10,
  },
  preview: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    marginTop: 6,
  },
  unreadPreview: { color: COLORS.black, fontFamily: fontFamily.Inter18Medium },
  unread: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    marginLeft: 7,
    width: 20,
  },
  unreadText: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 10,
  },
});

export default MessagesScreen;
