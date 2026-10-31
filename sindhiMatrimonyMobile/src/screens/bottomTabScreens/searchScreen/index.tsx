import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import {
  Chip,
  Profile,
  ProfileCard,
  ScreenHeader,
  ScreenShell,
  SearchField,
} from '../components';

const results: Profile[] = [
  {
    id: '1',
    name: 'Riya',
    age: 25,
    location: 'Ahmedabad, Gujarat',
    initials: 'R',
    accent: '#B58A70',
    verified: true,
    profession: 'Architect',
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
];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  return (
    <ScreenShell>
      <ScreenHeader eyebrow="Find someone special" title="Search profiles" />
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search by name or city"
        returnKeyType="search"
      />
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Popular filters</Text>
        <Chip label="All filters" icon="sliders-horizontal" />
      </View>
      <View style={styles.chips}>
        <Chip label="Nearby" icon="map-pin" />
        <Chip label="Age 24–30" />
        <Chip label="Verified" icon="badge-check" />
      </View>
      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {query ? `Results for “${query}”` : 'Suggested profiles'}
        </Text>
        <Text style={styles.sort}>Sort: Recommended</Text>
      </View>
      {results.map(profile => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  filterLabel: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  chips: { flexDirection: 'row', marginTop: 11 },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 26,
  },
  resultCount: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
  },
  sort: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 10,
  },
});

export default SearchScreen;
