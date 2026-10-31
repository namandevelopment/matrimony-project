import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLucidIcons from '../components/CustomLucidIcons';
import FilterEditDrawerModal, { EditDrawerConfig } from './FilterEditDrawerModal';
import LoadingButton from '../components/buttons/LoadingButton';
import defaultFilterData from '../staticData/filterOptionsData.json';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

export interface FilterFieldSchema {
  id: string;
  label: string;
  type: 'select' | 'range' | 'checkbox' | 'chips' | string;
  title?: string;
  subLabel?: string;
  defaultValue: any;
  unit?: string;
  options?: any[];
}

export interface FilterSectionSchema {
  id: string;
  title: string;
  fields: FilterFieldSchema[];
}

export interface FilterSchemaData {
  sections: FilterSectionSchema[];
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: Record<string, any>) => void;
  schemaData?: FilterSchemaData;
  initialValues?: Record<string, any>;
  totalMatches?: number;
}

const FilterModal: React.FC<FilterModalProps> = memo(({
  visible,
  onClose,
  onApply,
  schemaData = defaultFilterData as FilterSchemaData,
  initialValues,
  totalMatches = 306,
}) => {
  // Extract default values from schema
  const defaultValuesMap = useMemo(() => {
    const map: Record<string, any> = {};
    schemaData.sections.forEach(sec => {
      sec.fields.forEach(field => {
        map[field.id] = field.defaultValue;
      });
    });
    return map;
  }, [schemaData]);

  // Dynamic filter state
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => ({
    ...defaultValuesMap,
    ...(initialValues || {}),
  }));

  // Sync state if initialValues changes
  useEffect(() => {
    if (initialValues) {
      setFilterValues(prev => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const [activeDrawerConfig, setActiveDrawerConfig] = useState<EditDrawerConfig | null>(null);

  const openDrawerForField = useCallback((field: FilterFieldSchema) => {
    setActiveDrawerConfig({
      id: field.id,
      label: field.label,
      title: field.title || `Select ${field.label}`,
      type: field.type as 'range' | 'select',
      options: field.options || [],
      value: filterValues[field.id],
      unit: field.unit,
    });
  }, [filterValues]);

  const handleApplyRange = useCallback((fieldId: string, from: string | number, to: string | number) => {
    setFilterValues(prev => ({
      ...prev,
      [fieldId]: { from, to },
    }));
  }, []);

  const handleApplySelect = useCallback((fieldId: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const toggleCheckbox = useCallback((fieldId: string) => {
    setFilterValues(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  }, []);

  const selectChipOption = useCallback((fieldId: string, option: any) => {
    setFilterValues(prev => ({
      ...prev,
      [fieldId]: option,
    }));
  }, []);

  const handleSaveAndApply = useCallback(() => {
    onApply?.(filterValues);
    onClose();
  }, [filterValues, onApply, onClose]);

  const renderFieldValue = (field: FilterFieldSchema) => {
    const val = filterValues[field.id];
    if (field.type === 'range') {
      const from = val?.from ?? field.defaultValue?.from;
      const to = val?.to ?? field.defaultValue?.to;
      const unit = field.unit ? ` ${field.unit}` : '';
      return `${from}${unit} - ${to}${unit}`;
    }
    return String(val ?? field.defaultValue ?? 'Any');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> */}

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
          <Text style={styles.headerTitle}>Filter</Text>
        </View>

        {/* Dynamic Scrollable Sections */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {schemaData.sections.map(section => (
            <View key={section.id}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>

              {/* Dynamic Field Renderer */}
              {section.fields.map(field => {
                if (field.type === 'checkbox') {
                  const isChecked = !!filterValues[field.id];
                  return (
                    <TouchableOpacity
                      key={field.id}
                      style={styles.checkboxRow}
                      activeOpacity={0.7}
                      onPress={() => toggleCheckbox(field.id)}
                    >
                      <View style={styles.labelCol}>
                        <Text style={styles.filterLabel}>{field.label}</Text>
                        {field.subLabel ? (
                          <Text style={styles.subLabelText}>{field.subLabel}</Text>
                        ) : null}
                      </View>
                      <View style={[styles.checkbox, isChecked && styles.checkboxActive]}>
                        {isChecked && (
                          <CustomLucidIcons name="check" size={13} color="#FFFFFF" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }

                if (field.type === 'chips') {
                  const selectedChip = filterValues[field.id] ?? field.defaultValue;
                  return (
                    <View key={field.id} style={styles.chipsSectionContainer}>
                      <Text style={styles.filterLabel}>{field.label}</Text>
                      {field.subLabel ? (
                        <Text style={styles.subLabelText}>{field.subLabel}</Text>
                      ) : null}

                      <View style={styles.chipsRow}>
                        {(field.options || []).map((option: any) => {
                          const isSelected = selectedChip === option;
                          return (
                            <TouchableOpacity
                              key={String(option)}
                              style={[styles.chipItem, isSelected && styles.chipItemSelected]}
                              onPress={() => selectChipOption(field.id, option)}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.chipItemText,
                                  isSelected && styles.chipItemTextSelected,
                                ]}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                }

                // Default: Editable Range or Select Row
                return (
                  <View key={field.id} style={styles.filterRow}>
                    <Text style={styles.filterLabel}>{field.label}</Text>
                    <TouchableOpacity
                      style={styles.filterValueContainer}
                      activeOpacity={0.7}
                      onPress={() => openDrawerForField(field)}
                    >
                      <Text
                        style={styles.filterValueText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {renderFieldValue(field)}
                      </Text>
                      <CustomLucidIcons name="pencil" size={15} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerMatchesText}>
            <Text style={styles.footerMatchesBold}>{totalMatches}</Text> matches based on your filters
          </Text>
          <LoadingButton
            title="Show Matches"
            onPress={handleSaveAndApply}
            style={styles.showMatchesButton}
            textStyle={styles.showMatchesButtonText}
          />
        </View>

        {/* Slide-in Drawer Edit Modal */}
        <FilterEditDrawerModal
          isVisible={activeDrawerConfig !== null}
          onClose={() => setActiveDrawerConfig(null)}
          config={activeDrawerConfig}
          totalMatches={totalMatches}
          onApplyRange={handleApplyRange}
          onApplySelect={handleApplySelect}
        />
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 54,
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
    fontSize: 20,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 52,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 52,
  },
  labelCol: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Medium,
    color: '#111827',
    flex: 1,
  },
  subLabelText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
    marginTop: 2,
  },
  filterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flex: 1.5,
  },
  filterValueText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Regular,
    color: '#374151',
    textAlign: 'right',
    maxWidth: '85%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: COLORS.themeColor,
    borderColor: COLORS.themeColor,
  },
  chipsSectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  chipItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipItemSelected: {
    borderColor: COLORS.themeColor,
    backgroundColor: '#FFF1F2',
  },
  chipItemText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Medium,
    color: '#374151',
  },
  chipItemTextSelected: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerMatchesText: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18Regular,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerMatchesBold: {
    fontFamily: fontFamily.Inter18Bold,
  },
  showMatchesButton: {
    backgroundColor: COLORS.themeColor,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showMatchesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.Inter18Bold,
  },
});

export default FilterModal;
