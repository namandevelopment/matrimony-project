import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

export type MatchLayoutType = 'photo' | 'list';

interface MatchesLayoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedLayout: MatchLayoutType;
  onSelectLayout: (layout: MatchLayoutType) => void;
}

const MatchesLayoutModal: React.FC<MatchesLayoutModalProps> = memo(({
  isVisible,
  onClose,
  selectedLayout,
  onSelectLayout,
}) => {
  const handleSelect = (layout: MatchLayoutType) => {
    onSelectLayout(layout);
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
          <Text style={styles.headerTitle}>Matches Display Layout</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <CustomLucidIcons name="x" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {/* Photo View Option */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleSelect('photo')}
            activeOpacity={0.7}
          >
            <View style={styles.iconPreviewBox}>
              <View style={styles.photoIconCard} />
              <View style={styles.photoIconLine1} />
              <View style={styles.photoIconLine2} />
            </View>

            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.optionTitle}>Photo View</Text>
                <Text style={styles.defaultLabel}> (Default view)</Text>
              </View>
              <Text style={styles.optionSubtitle}>View matches with bigger photos</Text>
            </View>

            <View
              style={[
                styles.radioOuter,
                selectedLayout === 'photo' && styles.radioOuterSelected,
              ]}
            >
              {selectedLayout === 'photo' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          {/* List View Option */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handleSelect('list')}
            activeOpacity={0.7}
          >
            <View style={styles.iconPreviewBox}>
              <View style={styles.listIconRow}>
                <View style={styles.listIconSquare} />
                <View style={styles.listIconLinesCol}>
                  <View style={styles.listIconLine} />
                  <View style={styles.listIconLine} />
                  <View style={[styles.listIconLine, { width: 8 }]} />
                </View>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>List View</Text>
              <Text style={styles.optionSubtitle}>View your matches in a list</Text>
            </View>

            <View
              style={[
                styles.radioOuter,
                selectedLayout === 'list' && styles.radioOuterSelected,
              ]}
            >
              {selectedLayout === 'list' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
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
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  optionsList: {
    marginTop: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconPreviewBox: {
    width: 44,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  photoIconCard: {
    width: 20,
    height: 14,
    backgroundColor: '#233246',
    borderRadius: 2,
  },
  photoIconLine1: {
    width: 18,
    height: 2,
    backgroundColor: '#475569',
    marginTop: 2,
    borderRadius: 1,
  },
  photoIconLine2: {
    width: 14,
    height: 2,
    backgroundColor: '#64748B',
    marginTop: 1.5,
    borderRadius: 1,
  },
  listIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listIconSquare: {
    width: 13,
    height: 16,
    backgroundColor: '#233246',
    borderRadius: 2,
  },
  listIconLinesCol: {
    flexDirection: 'column',
    gap: 3,
  },
  listIconLine: {
    width: 12,
    height: 2,
    backgroundColor: '#233246',
    borderRadius: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#111827',
  },
  defaultLabel: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
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
});

export default MatchesLayoutModal;

