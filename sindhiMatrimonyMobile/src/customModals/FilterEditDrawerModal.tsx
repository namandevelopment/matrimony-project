import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import LoadingButton from '../components/buttons/LoadingButton';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

export interface EditDrawerConfig {
  id: string;
  label: string;
  title: string;
  type: 'range' | 'select';
  options: (string | number)[];
  value?: any;
  unit?: string;
}

interface FilterEditDrawerModalProps {
  isVisible: boolean;
  onClose: () => void;
  config: EditDrawerConfig | null;
  onApplyRange?: (fieldId: string, from: string | number, to: string | number) => void;
  onApplySelect?: (fieldId: string, value: string) => void;
  totalMatches?: number;
}

const FilterEditDrawerModal: React.FC<FilterEditDrawerModalProps> = memo(({
  isVisible,
  onClose,
  config,
  onApplyRange,
  onApplySelect,
  totalMatches = 306,
}) => {
  const [selectedFrom, setSelectedFrom] = useState<string | number>('');
  const [selectedTo, setSelectedTo] = useState<string | number>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<'from' | 'to' | 'select' | null>(null);

  useEffect(() => {
    if (!config) return;
    if (config.type === 'range') {
      setSelectedFrom(config.value?.from ?? config.options[0] ?? '');
      setSelectedTo(config.value?.to ?? config.options[config.options.length - 1] ?? '');
      setOpenDropdown(null);
    } else {
      setSelectedOption(typeof config.value === 'string' ? config.value : String(config.options[0] ?? ''));
      setOpenDropdown(null);
    }
  }, [config, isVisible]);

  const handleApply = useCallback(() => {
    if (!config) return;
    if (config.type === 'range') {
      onApplyRange?.(config.id, selectedFrom, selectedTo);
    } else {
      onApplySelect?.(config.id, selectedOption);
    }
    onClose();
  }, [config, selectedFrom, selectedTo, selectedOption, onApplyRange, onApplySelect, onClose]);

  const toggleDropdown = (type: 'from' | 'to' | 'select') => {
    setOpenDropdown(prev => (prev === type ? null : type));
  };

  if (!config) return null;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={250}
      animationOutTiming={200}
      backdropOpacity={0.4}
      backdropColor="#000000"
      useNativeDriver
      hideModalContentWhileAnimating
      style={styles.modal}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomLucidIcons name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{config.title}</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {config.type === 'range' ? (
            <>
              {/* Range: From */}
              <Text style={styles.inputLabel}>From</Text>
              <TouchableOpacity
                style={[styles.dropdownBox, openDropdown === 'from' && styles.dropdownBoxActive]}
                onPress={() => toggleDropdown('from')}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValueText}>
                  {selectedFrom} {config.unit ?? ''}
                </Text>
                <CustomLucidIcons
                  name={openDropdown === 'from' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#4B5563"
                />
              </TouchableOpacity>

              {openDropdown === 'from' && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    style={styles.optionsScroll}
                  >
                    {config.options.map((opt, idx) => {
                      const isSelected = opt === selectedFrom;
                      return (
                        <TouchableOpacity
                          key={`from-${idx}`}
                          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                          onPress={() => {
                            setSelectedFrom(opt);
                            setOpenDropdown(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.optionItemText,
                              isSelected && styles.optionItemTextSelected,
                            ]}
                          >
                            {opt} {config.unit ?? ''}
                          </Text>
                          {isSelected && (
                            <CustomLucidIcons name="check" size={16} color={COLORS.themeColor} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              {/* Range: To */}
              <Text style={[styles.inputLabel, { marginTop: openDropdown === 'from' ? 12 : 20 }]}>
                To
              </Text>
              <TouchableOpacity
                style={[styles.dropdownBox, openDropdown === 'to' && styles.dropdownBoxActive]}
                onPress={() => toggleDropdown('to')}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValueText}>
                  {selectedTo} {config.unit ?? ''}
                </Text>
                <CustomLucidIcons
                  name={openDropdown === 'to' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#4B5563"
                />
              </TouchableOpacity>

              {openDropdown === 'to' && (
                <View style={styles.dropdownListContainer}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    style={styles.optionsScroll}
                  >
                    {config.options.map((opt, idx) => {
                      const isSelected = opt === selectedTo;
                      return (
                        <TouchableOpacity
                          key={`to-${idx}`}
                          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                          onPress={() => {
                            setSelectedTo(opt);
                            setOpenDropdown(null);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.optionItemText,
                              isSelected && styles.optionItemTextSelected,
                            ]}
                          >
                            {opt} {config.unit ?? ''}
                          </Text>
                          {isSelected && (
                            <CustomLucidIcons name="check" size={16} color={COLORS.themeColor} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </>
          ) : (
            <>
              {/* Single Select / Dropdown */}
              <Text style={styles.inputLabel}>Choose {config.label}</Text>
              <TouchableOpacity
                style={[styles.dropdownBox, openDropdown === 'select' && styles.dropdownBoxActive]}
                onPress={() => toggleDropdown('select')}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValueText}>{selectedOption}</Text>
                <CustomLucidIcons
                  name={openDropdown === 'select' ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#4B5563"
                />
              </TouchableOpacity>

              {/* Dropdown Options List */}
              <View style={[styles.dropdownListContainer, { maxHeight: 320, marginTop: 12 }]}>
                <ScrollView
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  style={{ maxHeight: 320 }}
                >
                  {config.options.map((opt, idx) => {
                    const isSelected = opt === selectedOption;
                    return (
                      <TouchableOpacity
                        key={`opt-${idx}`}
                        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                        onPress={() => {
                          setSelectedOption(String(opt));
                          setOpenDropdown(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionItemText,
                            isSelected && styles.optionItemTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                        {isSelected && (
                          <CustomLucidIcons name="check" size={16} color={COLORS.themeColor} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTextContainer}>
            <Text style={styles.matchesCount}>{totalMatches}</Text>
            <Text style={styles.matchesSubText}>Matches</Text>
          </View>
          <LoadingButton
            title="Apply"
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
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  container: {
    width: '90%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Medium,
    color: '#111827',
    marginBottom: 8,
  },
  dropdownBox: {
    borderWidth: 1.2,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownBoxActive: {
    borderColor: COLORS.themeColor,
  },
  dropdownValueText: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18Regular,
    color: '#111827',
  },
  dropdownListContainer: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    maxHeight: 180,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  optionsScroll: {
    maxHeight: 180,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#FFF1F2',
  },
  optionItemText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Regular,
    color: '#374151',
  },
  optionItemTextSelected: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  footerTextContainer: {
    justifyContent: 'center',
  },
  matchesCount: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  matchesSubText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: COLORS.themeColor,
    paddingHorizontal: 32,
    paddingVertical: 11,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
    color: '#FFFFFF',
  },
});

export default FilterEditDrawerModal;
