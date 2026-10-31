import React, { memo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import LoadingButton from '../components/buttons/LoadingButton';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

export interface SortOption {
  id: string;
  title: string;
  subtitle: string;
}

export const SORT_OPTIONS: SortOption[] = [
  {
    id: 'lastActive',
    title: 'Last active',
    subtitle: 'Members who recently logged-in will be shown first',
  },
  {
    id: 'dateCreated',
    title: 'Date created',
    subtitle: 'Profiles created recently will be shown first',
  },
  {
    id: 'distance',
    title: 'Distance',
    subtitle: 'Profiles nearby will be shown first',
  },
  {
    id: 'latestPhotos',
    title: 'Latest photos',
    subtitle: 'Members who have recently added photos will be shown first',
  },
];

interface SortByModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedSortId?: string;
  onApply: (sortId: string) => void;
}

const SortByModal: React.FC<SortByModalProps> = memo(({
  isVisible,
  onClose,
  selectedSortId = 'lastActive',
  onApply,
}) => {
  const [selectedId, setSelectedId] = useState(selectedSortId);

  useEffect(() => {
    setSelectedId(selectedSortId);
  }, [selectedSortId, isVisible]);

  const handleReset = () => {
    setSelectedId('lastActive');
  };

  const handleApply = () => {
    onApply(selectedId);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      backdropColor="#000000"
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.modal}
    >
      <View style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sort matches by:</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <CustomLucidIcons name="x" size={20} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {SORT_OPTIONS.map(opt => {
            const isSelected = selectedId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionRow}
                onPress={() => setSelectedId(opt.id)}
                activeOpacity={0.7}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
                </View>

                {/* Radio Button */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <LoadingButton
            title="Reset"
            variant="outline"
            useGradient={false}
            onPress={handleReset}
            style={styles.resetButton}
            textStyle={styles.resetButtonText}
          />

          <LoadingButton
            title="Apply"
            variant="solid"
            onPress={handleApply}
            style={styles.applyButton}
            textStyle={styles.applyButtonText}
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  optionsList: {
    marginVertical: 4,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#111827',
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#4B5563',
    marginTop: 3,
    lineHeight: 18,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.themeColor,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.themeColor,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 22,
  },
  resetButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: COLORS.themeColor,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
    color: COLORS.themeColor,
  },
  applyButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.themeColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
    color: '#FFFFFF',
  },
});

export default SortByModal;

