import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Modal from 'react-native-modal';
import fontFamily from '../components/fontFamily';
import COLORS from '../components/colors';
import { COUNTRIES } from '../staticData/countryJsonData';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedCountry: any;
  onSelectCountry: (country: any) => void;
}

const CountryPickerModal: React.FC<Props> = ({
  visible,
  onClose,
  selectedCountry,
  onSelectCountry,
}) => {
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRIES;

    const lower = search.toLowerCase();

    return COUNTRIES.filter(
      c =>
        c.name.toLowerCase().includes(lower) ||
        c.dialCode.includes(search),
    );
  }, [search]);

  const handleSelect = useCallback(
    (country: any) => {
      onSelectCountry(country);
      onClose();
    },
    [onClose, onSelectCountry],
  );

  const renderItem = useCallback(
    ({ item }: any) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.dial}>{item.dialCode}</Text>

        {selectedCountry?.iso2 === item.iso2 && (
          <Text style={styles.check}>✓</Text>
        )}
      </TouchableOpacity>
    ),
    [handleSelect, selectedCountry?.iso2],
  );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="left"
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={150}
      animationOutTiming={150}
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.modal}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Country</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country or dial code"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <FlashList
          data={filteredCountries}
          keyExtractor={(item, index) => item?.iso2 || String(index)}
          renderItem={renderItem}
          extraData={selectedCountry?.iso2}
          showsVerticalScrollIndicator
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 1,
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#1A1A1A',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    fontFamily: fontFamily.Inter18Medium,
    color: '#888',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fontFamily.Inter18Regular,
    color: '#1A1A1A',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  flag: {
    fontSize: 14,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontFamily: fontFamily.Inter18Regular,
  },
  dial: {
    fontSize: 14,
    color: '#666',
    fontFamily: fontFamily.Inter18Regular,
    marginRight: 8,
  },
  check: {
    fontSize: 18,
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default CountryPickerModal;
