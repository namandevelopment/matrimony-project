import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import LoadingButton from '../../components/buttons/LoadingButton';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import { showToast } from '../../utils/CustomToast';
import { Storage } from '../../storage/Storage';
import { apiFetch, ApiURL } from '../../redux/apiService';
import { selectPartnerPreferences, selectProfile } from '../../redux/useSelector';
import { update_Partner_Preferences_Call } from '../../redux/useDispatch';

export interface PreferenceField {
  key: string;
  label: string;
  value: string;
  isCompulsory: boolean;
  options?: string[];
  isCustomInput?: boolean;
}

export interface PreferenceSection {
  title: string;
  fields: PreferenceField[];
}

const DEFAULT_PREFERENCES: PreferenceSection[] = [
  {
    title: 'Basic Preference',
    fields: [
      {
        key: 'age',
        label: 'Age',
        value: '24 - 31 Yrs',
        isCompulsory: true,
        options: ['18 - 24 Yrs', '21 - 28 Yrs', '24 - 31 Yrs', '26 - 33 Yrs', '28 - 35 Yrs', '30 - 38 Yrs'],
      },
      {
        key: 'height',
        label: 'Height',
        value: '5 ft - 6 ft',
        isCompulsory: true,
        options: ['4 ft 6 in - 5 ft 2 in', '4 ft 10 in - 5 ft 6 in', '5 ft - 6 ft', '5 ft 4 in - 6 ft 2 in', '5 ft 6 in - 6 ft 6 in', 'Any'],
      },
      {
        key: 'maritalStatus',
        label: 'Marital Status',
        value: 'Unmarried',
        isCompulsory: true,
        options: ['Unmarried', 'Divorced', 'Widowed', 'Awaiting Divorce', "Doesn't matter"],
      },
      {
        key: 'motherTongue',
        label: 'Mother Tongue',
        value: 'Hindi',
        isCompulsory: true,
        options: ['Hindi', 'Sindhi', 'Marathi', 'Gujarati', 'Punjabi', 'English', 'Any'],
      },
      {
        key: 'physicalStatus',
        label: 'Physical Status',
        value: 'Normal',
        isCompulsory: true,
        options: ['Normal', 'Physically Challenged', "Doesn't matter"],
      },
    ],
  },
  {
    title: 'Religious Preference',
    fields: [
      {
        key: 'manglik',
        label: 'Manglik',
        value: "Doesn't matter",
        isCompulsory: false,
        options: ["Doesn't matter", 'Non-Manglik', 'Manglik', 'Angshik (Partial) Manglik'],
      },
      {
        key: 'gothra',
        label: 'Gothra',
        value: 'Any',
        isCompulsory: true,
        options: ['Any', 'Shrimukh Shandilya', 'Bharadwaj', 'Kashyap', 'Vashishta', 'Garg', 'Parashar'],
      },
    ],
  },
  {
    title: 'Professional Preference',
    fields: [
      {
        key: 'education',
        label: 'Education',
        value: 'Bachelors - Engineering / Computers / Others, Masters - Eng... more',
        isCompulsory: true,
        options: [
          'Bachelors - Engineering / Computers / Others, Masters - Eng... more',
          'Bachelors in Engineering / Technology',
          'Masters in Engineering / IT / Technology',
          'MBA / PGDM / Business Management',
          'Doctorate / Ph.D / Medicine',
          'Any Graduate',
          'Any Post Graduate',
        ],
      },
      {
        key: 'employedIn',
        label: 'Employed In',
        value: 'Any',
        isCompulsory: false,
        options: ['Any', 'Private Sector', 'Government / Public Sector', 'Business / Self Employed', 'Civil Services', 'Not Working'],
      },
      {
        key: 'annualIncome',
        label: 'Annual Income',
        value: 'Any',
        isCompulsory: false,
        options: ['Any', 'Rs. 3 - 5 Lakh', 'Rs. 5 - 10 Lakh', 'Rs. 10 - 20 Lakh', 'Rs. 20 - 50 Lakh', 'Rs. 50+ Lakh'],
      },
      {
        key: 'occupation',
        label: 'Occupation',
        value: 'Any',
        isCompulsory: false,
        options: ['Any', 'Software / IT Professional', 'Doctor / Healthcare Specialist', 'Engineer', 'Banker / Financial Analyst', 'Business Owner / Entrepreneur', 'Civil Services'],
      },
    ],
  },
  {
    title: 'Location Preference',
    fields: [
      {
        key: 'citizenship',
        label: 'Citizenship',
        value: 'Afghanistan, Albania, Algeria, American Samoa, Andorra, Angola,... more',
        isCompulsory: false,
        options: [
          'India',
          'Afghanistan, Albania, Algeria, American Samoa, Andorra, Angola,... more',
          'United States',
          'United Arab Emirates',
          'Canada',
          'United Kingdom',
          'Any',
        ],
      },
      {
        key: 'country',
        label: 'Country',
        value: 'India',
        isCompulsory: true,
        options: ['India', 'United States', 'United Arab Emirates', 'Canada', 'United Kingdom', 'Australia', 'Any'],
      },
      {
        key: 'districtCity',
        label: 'District/City',
        value: 'Indore, Ajmer',
        isCompulsory: false,
        options: ['Indore, Ajmer', 'Indore, Bhopal', 'Jaipur, Ajmer', 'Mumbai, Pune', 'Ahmedabad, Surat', 'Delhi NCR', 'Any'],
        isCustomInput: true,
      },
      {
        key: 'state',
        label: 'State',
        value: 'Madhya Pradesh, Rajasthan',
        isCompulsory: true,
        options: ['Madhya Pradesh, Rajasthan', 'Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Gujarat', 'Delhi', 'Any'],
        isCustomInput: true,
      },
    ],
  },
  {
    title: 'Habits Preference',
    fields: [
      {
        key: 'drinkingHabits',
        label: 'Drinking Habits',
        value: "Doesn't matter",
        isCompulsory: false,
        options: ["Doesn't matter", 'Never Drinks', 'Drinks Socially', 'Regular Drinker'],
      },
      {
        key: 'eatingHabits',
        label: 'Eating Habits',
        value: 'Vegetarian, Eggetarian',
        isCompulsory: false,
        options: ['Vegetarian, Eggetarian', 'Pure Vegetarian', 'Eggetarian', 'Non-Vegetarian', "Doesn't matter"],
      },
      {
        key: 'smokingHabits',
        label: 'Smoking Habits',
        value: "Doesn't matter",
        isCompulsory: false,
        options: ["Doesn't matter", 'Never Smokes', 'Smokes Occasionally', 'Regular Smoker'],
      },
    ],
  },
];

const PartnerPreferenceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const reduxPartnerPrefs = useSelector(selectPartnerPreferences);
  const reduxProfile = useSelector(selectProfile);

  const [sections, setSections] = useState<PreferenceSection[]>(() => {
    if (reduxPartnerPrefs && Array.isArray(reduxPartnerPrefs) && reduxPartnerPrefs.length > 0) {
      return reduxPartnerPrefs;
    }
    const saved = Storage.getItemSync<PreferenceSection[]>('partnerPreferences');
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    if (reduxProfile?.partnerPreferences && Array.isArray(reduxProfile.partnerPreferences)) {
      return reduxProfile.partnerPreferences;
    }
    return DEFAULT_PREFERENCES;
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal Picker State
  const [activeField, setActiveField] = useState<{
    sectionIndex: number;
    fieldIndex: number;
    field: PreferenceField;
  } | null>(null);
  const [customInputValue, setCustomInputValue] = useState<string>('');

  // Keep synced if redux preferences update externally
  useEffect(() => {
    if (reduxPartnerPrefs && Array.isArray(reduxPartnerPrefs) && reduxPartnerPrefs.length > 0) {
      setSections(reduxPartnerPrefs);
    }
  }, [reduxPartnerPrefs]);

  // Toggle switch handler
  const handleToggleCompulsory = useCallback((sectionIndex: number, fieldIndex: number) => {
    setSections(prevSections => {
      const updated = prevSections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          fields: sec.fields.map((f, fIdx) => {
            if (fIdx !== fieldIndex) return f;
            return { ...f, isCompulsory: !f.isCompulsory };
          }),
        };
      });
      return updated;
    });
  }, []);

  // Open edit modal for a field
  const handleOpenEdit = useCallback((sectionIndex: number, fieldIndex: number, field: PreferenceField) => {
    setActiveField({ sectionIndex, fieldIndex, field });
    setCustomInputValue(field.value);
  }, []);

  // Save selected option
  const handleSelectOption = useCallback((optionValue: string) => {
    if (!activeField) return;
    const { sectionIndex, fieldIndex } = activeField;
    setSections(prevSections => {
      const updated = prevSections.map((sec, sIdx) => {
        if (sIdx !== sectionIndex) return sec;
        return {
          ...sec,
          fields: sec.fields.map((f, fIdx) => {
            if (fIdx !== fieldIndex) return f;
            return { ...f, value: optionValue };
          }),
        };
      });
      return updated;
    });
    setActiveField(null);
  }, [activeField]);

  // Submit and save preferences with Redux and backend API
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Redux store
      update_Partner_Preferences_Call(dispatch, sections);

      // 2. Persist locally to Storage
      await Storage.setItem('partnerPreferences', sections);

      const storedUser = Storage.getItemSync<any>('user') || {};
      const updatedUser = {
        ...storedUser,
        partnerPreferences: sections,
        profile: {
          ...(storedUser.profile || {}),
          partnerPreferences: sections,
        },
      };
      await Storage.setItem('user', updatedUser);

      // 3. Format payload for API
      const flatMap: Record<string, any> = {};
      sections.forEach(sec => {
        sec.fields.forEach(f => {
          flatMap[f.key] = {
            value: f.value,
            isCompulsory: f.isCompulsory,
          };
        });
      });

      // 4. Send API request
      try {
        await apiFetch({
          url: ApiURL.updatePartnerPreferences,
          method: 'PUT',
          payload: flatMap,
          showErrorToast: false,
        });
      } catch (err) {
        // Fallback gracefully for local/mock
      }

      showToast({
        type: 'success',
        message: 'Partner preferences saved successfully',
      });

      // 5. Notify callback if provided
      if (route.params?.onUpdated) {
        route.params.onUpdated(sections);
      }

      // 6. Navigate back
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('EditProfile');
      }
    } catch (e: any) {
      showToast({
        type: 'error',
        message: 'Failed to save preferences. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [sections, dispatch, navigation, route.params]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.themeColor} />

      {/* Header matching app theme */}
      <CustomHeader
        title="Compulsory Filters"
        backgroundColor={COLORS.themeColor}
        titleColor="#FFFFFF"
        backIconColor="#FFFFFF"
        statusBarColor={COLORS.themeColor}
        statusBarStyle="light-content"
      />

      {/* FlashList for Section Items */}
      <FlashList
        data={sections}
        keyExtractor={item => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>
              Matches are recommended to you based on your preferences and profile information.
              To see matches exactly based on your preferences, turn on the 'Compulsory' toggle.
              If you turn on 'Compulsory', your profile will not be shown to matches who do not fit
              your 'Compulsory' filters, hence you will miss out on potential matches.
            </Text>
          </View>
        }
        renderItem={({ item: section, index: sectionIndex }) => (
          <View style={styles.sectionContainer}>
            {/* Section Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {sectionIndex === 0 && (
                <Text style={styles.compulsoryColumnLabel}>Compulsory</Text>
              )}
            </View>

            {/* Field Rows */}
            {section.fields.map((field, fieldIndex) => (
              <TouchableOpacity
                key={field.key}
                activeOpacity={0.7}
                onPress={() => handleOpenEdit(sectionIndex, fieldIndex, field)}
                style={styles.fieldRow}
              >
                {/* Field Label */}
                <View style={styles.labelCol}>
                  <Text style={styles.fieldLabel} numberOfLines={2}>
                    {field.label}
                  </Text>
                </View>

                {/* Field Colon and Value */}
                <View style={styles.valueCol}>
                  <Text style={styles.colonText}>: </Text>
                  <Text style={styles.fieldValue} numberOfLines={3}>
                    {field.value}
                  </Text>
                </View>

                {/* Compulsory Toggle Switch themed */}
                <View style={styles.switchCol}>
                  <Switch
                    value={field.isCompulsory}
                    onValueChange={() => handleToggleCompulsory(sectionIndex, fieldIndex)}
                    trackColor={{ false: '#E2E8F0', true: COLORS.themeColor }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#E2E8F0"
                    style={
                      Platform.OS === 'ios'
                        ? { transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }
                        : undefined
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      {/* Sticky Bottom Bar using LoadingButton with App Theme Gradient */}
      <View style={styles.bottomBar}>
        <LoadingButton
          title="Submit"
          onPress={handleSubmit}
          loading={isSubmitting}
          useGradient={true}
          gradientColors={COLORS.linearGradient}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>

      {/* Selection & Edit Modal */}
      <Modal
        visible={!!activeField}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveField(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveField(null)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {activeField?.field.label}
              </Text>
              <TouchableOpacity
                onPress={() => setActiveField(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CustomLucidIcons name="x" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Custom text input option if supported */}
            {activeField?.field.isCustomInput && (
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customTextInput}
                  value={customInputValue}
                  onChangeText={setCustomInputValue}
                  placeholder={`Enter ${activeField.field.label}`}
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  style={styles.customApplyBtn}
                  onPress={() => {
                    if (customInputValue.trim()) {
                      handleSelectOption(customInputValue.trim());
                    }
                  }}
                >
                  <Text style={styles.customApplyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Options FlashList */}
            <FlashList
              data={activeField?.field.options || []}
              keyExtractor={(item, index) => `${item}-${index}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = activeField?.field.value === item;
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleSelectOption(item)}
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <CustomLucidIcons
                        name="check"
                        size={18}
                        color={COLORS.themeColor}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default PartnerPreferenceScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  infoBanner: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoText: {
    color: '#334155',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 19,
  },
  sectionContainer: {
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
  },
  compulsoryColumnLabel: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
  },
  fieldRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  labelCol: {
    width: 120,
  },
  fieldLabel: {
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
    lineHeight: 18,
  },
  valueCol: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  colonText: {
    color: '#334155',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
  },
  fieldValue: {
    color: '#334155',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13.5,
    lineHeight: 18,
  },
  switchCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 55,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    elevation: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  submitButton: {
    borderRadius: 8,
    height: 48,
    width: '100%',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 420,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  modalTitle: {
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  customTextInput: {
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0F172A',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    height: 44,
    paddingHorizontal: 12,
  },
  customApplyBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  customApplyBtnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 14,
  },
  optionItem: {
    alignItems: 'center',
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  optionItemSelected: {
    backgroundColor: '#FFF1F2',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  optionText: {
    color: '#334155',
    flex: 1,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
  },
  optionTextSelected: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
  },
});
