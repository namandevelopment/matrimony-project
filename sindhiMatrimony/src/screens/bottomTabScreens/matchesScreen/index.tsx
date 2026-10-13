import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Chip,
  Profile,
  ProfileCard,
  ScreenHeader,
  ScreenShell,
  styles as sharedStyles,
} from '../components';

const matches: Profile[] = [
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
    name: 'Nisha',
    age: 27,
    location: 'Nashik, Maharashtra',
    initials: 'N',
    accent: '#A78399',
    profession: 'CA Professional',
  },
  {
    id: '4',
    name: 'Yash',
    age: 30,
    location: 'Surat, Gujarat',
    initials: 'Y',
    accent: '#B58A70',
    verified: true,
    profession: 'Business Owner',
  },
];

const MatchesScreen = () => {
  const [selected, setSelected] = useState('For you');

  const renderItem = useCallback(
    ({ item }: { item: Profile }) => <ProfileCard profile={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Profile) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View>
        <ScreenHeader
          eyebrow="Curated for you"
          title="Your matches"
          actionIcon="sliders-horizontal"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={{ paddingBottom: 4 }}
        >
          {['For you', 'New this week', 'Nearby'].map(filter => (
            <Chip
              key={filter}
              label={filter}
              selected={selected === filter}
              onPress={() => setSelected(filter)}
            />
          ))}
        </ScrollView>
      </View>
    ),
    [selected],
  );

  return (
    <ScreenShell scroll={false}>
      <FlashList
        data={matches}
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
  filters: { flexGrow: 0, marginBottom: 8 },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  ...sharedStyles,
});

export default MatchesScreen;
