import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomTextInput from '../../components/inputBox/CustomTextInput';
import LoadingButton from '../../components/buttons/LoadingButton';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import CountryPickerModal from '../../customModals/CountryPickerModal';
import TimeWheelPickerModal from '../../customModals/TimeWheelPickerModal';
import { COUNTRIES } from '../../staticData/countryJsonData';
import { showToast } from '../../utils/CustomToast';
import { Storage } from '../../storage/Storage';
import { moderateScale, moderateVerticalScale } from '../../utils/Responsive';

// -----------------------------------------------------------------------------
// STATIC DATA OPTIONS
// -----------------------------------------------------------------------------

const INDIAN_STATES = [
  'Maharashtra',
  'Gujarat',
  'Rajasthan',
  'Delhi NCR',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Karnataka',
  'Punjab',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Haryana',
  'Goa',
  'Kerala',
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Jharkhand',
  'Odisha',
  'Uttarakhand',
];

const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Ulhasnagar', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh', 'Gandhidham'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Bhilwara', 'Alwar'],
  'Delhi NCR': ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Meerut'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
  Punjab: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'],
  Default: ['Mumbai', 'Delhi', 'Ahmedabad', 'Pune', 'Jaipur', 'Indore', 'Bengaluru', 'Surat', 'Lucknow', 'Hyderabad', 'Kolkata'],
};

const CHART_STYLES = [
  'South Indian',
  'North Indian',
  'East Indian',
  'Kerala',
];

const LANGUAGES = [
  'English',
  'Hindi',
  'Sindhi',
  'Gujarati',
  'Marathi',
  'Punjabi',
  'Tamil',
  'Telugu',
  'Bengali',
];

const TIME_CORRECTIONS = [
  'Standard Time',
  'Daylight Saving Time (DST)',
  'War Time Correction',
  'None',
];

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

const AddHoroscope: React.FC = () => {
  const navigation = useNavigation<any>();

  // Form State
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(1995, 3, 12)); // 12 Apr 1995
  const [timeOfBirth, setTimeOfBirth] = useState<string>('00:00');
  const [timeDate, setTimeDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [countryOfBirth, setCountryOfBirth] = useState<string>('');
  const [stateOfBirth, setStateOfBirth] = useState<string>('');
  const [cityOfBirth, setCityOfBirth] = useState<string>('');
  const [chartStyle, setChartStyle] = useState<string>('South Indian');
  const [language, setLanguage] = useState<string>('');
  const [timeCorrection, setTimeCorrection] = useState<string>('');

  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal States
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);

  // Generic Selection Modal State
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [selectionType, setSelectionType] = useState<
    'state' | 'city' | 'chartStyle' | 'language' | 'timeCorrection'
  >('state');
  const [selectionSearch, setSelectionSearch] = useState('');

  // Selected Country Object for CountryPickerModal
  const selectedCountryObj = useMemo(() => {
    return COUNTRIES.find(c => c.name === countryOfBirth) || COUNTRIES[0];
  }, [countryOfBirth]);

  // Current items for generic selection modal
  const selectionOptions = useMemo(() => {
    switch (selectionType) {
      case 'state':
        return INDIAN_STATES;
      case 'city':
        return CITIES_BY_STATE[stateOfBirth] || CITIES_BY_STATE.Default;
      case 'chartStyle':
        return CHART_STYLES;
      case 'language':
        return LANGUAGES;
      case 'timeCorrection':
        return TIME_CORRECTIONS;
      default:
        return [];
    }
  }, [selectionType, stateOfBirth]);

  const filteredSelectionOptions = useMemo(() => {
    if (!selectionSearch.trim()) return selectionOptions;
    const q = selectionSearch.toLowerCase();
    return selectionOptions.filter(item => item.toLowerCase().includes(q));
  }, [selectionOptions, selectionSearch]);

  const selectionTitle = useMemo(() => {
    switch (selectionType) {
      case 'state':
        return 'Select State of Birth';
      case 'city':
        return 'Select City of Birth';
      case 'chartStyle':
        return 'Select Chart Style';
      case 'language':
        return 'Select Language';
      case 'timeCorrection':
        return 'Select Time Correction';
      default:
        return 'Select Option';
    }
  }, [selectionType]);

  const openSelection = useCallback(
    (type: 'state' | 'city' | 'chartStyle' | 'language' | 'timeCorrection') => {
      setSelectionType(type);
      setSelectionSearch('');
      setSelectionModalVisible(true);
    },
    [],
  );

  const handleSelectOption = useCallback(
    (value: string) => {
      switch (selectionType) {
        case 'state':
          setStateOfBirth(value);
          // Auto update city to first city of that state
          const cities = CITIES_BY_STATE[value] || CITIES_BY_STATE.Default;
          if (cities && cities.length > 0) {
            setCityOfBirth(cities[0]);
          }
          break;
        case 'city':
          setCityOfBirth(value);
          break;
        case 'chartStyle':
          setChartStyle(value);
          break;
        case 'language':
          setLanguage(value);
          break;
        case 'timeCorrection':
          setTimeCorrection(value);
          break;
      }
      setSelectionModalVisible(false);
    },
    [selectionType],
  );

  // Generate Horoscope handler
  const handleGenerateHoroscope = useCallback(() => {
    setIsGenerating(true);
    Storage.setItemSync('hasHoroscope', 'true');
    setTimeout(() => {
      setIsGenerating(false);
      showToast({
        type: 'success',
        message: 'Horoscope generated successfully!',
      });
      navigation.navigate('Horoscope', {
        dateOfBirthStr: moment(dateOfBirth).format('DD MMMM YYYY, dddd'),
        timeOfBirthStr:
          timeOfBirth === '00:00'
            ? '12:00:00 PM'
            : timeOfBirth.includes(' ')
              ? `${timeOfBirth.split(' ')[0]}:00 ${timeOfBirth.split(' ')[1]}`
              : `${timeOfBirth}:00`,
        placeOfBirth: cityOfBirth || stateOfBirth || 'Ajmer',
        chartStyle: chartStyle,
        language: language,
      });
    }, 600);
  }, [
    navigation,
    dateOfBirth,
    timeOfBirth,
    cityOfBirth,
    stateOfBirth,
    chartStyle,
    language,
  ]);

  // Upload Horoscope handler
  const handleUploadHoroscope = useCallback(() => {
    Alert.alert(
      'Upload Horoscope',
      'Upload a scanned copy or PDF of your Kundli / Horoscope chart',
      [
        {
          text: 'Take Photo',
          onPress: () =>
            showToast({
              type: 'info',
              message: 'Camera opened for horoscope scan',
            }),
        },
        {
          text: 'Choose from Gallery',
          onPress: () =>
            showToast({
              type: 'info',
              message: 'Gallery opened for horoscope upload',
            }),
        },
        {
          text: 'Upload PDF / Document',
          onPress: () =>
            showToast({
              type: 'info',
              message: 'Document picker opened',
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Red Header matching application design */}
      <CustomHeader
        title="Add Horoscope"
        backgroundColor="#EE5559"
        titleColor="#FFFFFF"
        backIconColor="#FFFFFF"
        statusBarColor="#EE5559"
        statusBarStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Subtitle */}
        <Text style={styles.headerSubtitle}>
          Fill in the below details to generate horoscope
        </Text>

        {/* 1. Date of Birth */}
        <CustomTextInput
          label="Date of Birth"
          placeholder="Select Date of Birth"
          value={dateOfBirth ? moment(dateOfBirth).format('DD MMM YYYY') : ''}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => setDatePickerModalVisible(true)}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 2. Time of Birth */}
        <CustomTextInput
          label="Time of Birth"
          placeholder="Select Time of Birth"
          value={timeOfBirth}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => setTimePickerModalVisible(true)}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 3. Country of Birth */}
        <CustomTextInput
          label="Country of Birth"
          placeholder="Select Country of Birth"
          value={countryOfBirth}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => setCountryModalVisible(true)}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 4. State of Birth */}
        <CustomTextInput
          label="State of Birth"
          placeholder="Select State of Birth"
          value={stateOfBirth}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => openSelection('state')}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 5. City of Birth */}
        <CustomTextInput
          label="City of Birth"
          placeholder="Select City of Birth"
          value={cityOfBirth}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => openSelection('city')}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 6. Chart Style */}
        <CustomTextInput
          label="Chart Style"
          placeholder="Select Chart Style"
          value={chartStyle}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => openSelection('chartStyle')}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 7. Languages */}
        <CustomTextInput
          label="Languages"
          placeholder="Select Language"
          value={language}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => openSelection('language')}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* 8. Time Correction */}
        <CustomTextInput
          label="Time Correction"
          placeholder="Select Time Correction"
          value={timeCorrection}
          rightIcon="chevron-right"
          rightIconColor="#888"
          rightIconSize={18}
          onPress={() => openSelection('timeCorrection')}
          containerStyle={{ marginBottom: 16 }}
        />

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {/* Primary: Generate Horoscope */}
          <LoadingButton
            title="Generate Horoscope"
            onPress={handleGenerateHoroscope}
            loading={isGenerating}
            style={styles.generateButton}
            textStyle={styles.generateButtonText}
          />

          {/* Divider text */}
          <Text style={styles.orText}>
            Or upload a scanned copy of your Horoscope
          </Text>

          {/* Secondary: Upload Horoscope */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadHoroscope}
            style={styles.uploadButton}
            accessibilityRole="button"
            accessibilityLabel="Upload Horoscope"
          >
            <Text style={styles.uploadButtonText}>Upload Horoscope</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ----------------------------------------------------------------- */}
      {/* 1. COUNTRY PICKER MODAL                                            */}
      {/* ----------------------------------------------------------------- */}
      <CountryPickerModal
        visible={countryModalVisible}
        onClose={() => setCountryModalVisible(false)}
        selectedCountry={selectedCountryObj}
        onSelectCountry={(c: any) => setCountryOfBirth(c.name)}
      />

      {/* ----------------------------------------------------------------- */}
      {/* 2. GENERIC SELECTION MODAL (State, City, Chart Style, etc.)       */}
      {/* ----------------------------------------------------------------- */}
      <Modal
        visible={selectionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectionModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalSheet}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectionTitle}</Text>
              <TouchableOpacity
                onPress={() => setSelectionModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CustomLucidIcons name="x" size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            {/* Search Box if options > 6 */}
            {selectionOptions.length > 6 && (
              <View style={styles.searchBox}>
                <CustomLucidIcons name="search" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search option..."
                  placeholderTextColor="#94A3B8"
                  value={selectionSearch}
                  onChangeText={setSelectionSearch}
                  autoCorrect={false}
                />
              </View>
            )}

            {/* List */}
            <FlatList
              data={filteredSelectionOptions}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.modalList}
              renderItem={({ item }) => {
                const isSelected =
                  (selectionType === 'state' && item === stateOfBirth) ||
                  (selectionType === 'city' && item === cityOfBirth) ||
                  (selectionType === 'chartStyle' && item === chartStyle) ||
                  (selectionType === 'language' && item === language) ||
                  (selectionType === 'timeCorrection' && item === timeCorrection);

                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                    onPress={() => handleSelectOption(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ----------------------------------------------------------------- */}
      {/* 3. DATE OF BIRTH PICKER (react-native-date-picker)                 */}
      {/* ----------------------------------------------------------------- */}
      <DatePicker
        modal
        open={datePickerModalVisible}
        date={dateOfBirth || new Date(1995, 3, 12)}
        mode="date"
        maximumDate={new Date()}
        minimumDate={new Date(1940, 0, 1)}
        title="Select Date of Birth"
        confirmText="SET"
        cancelText="CANCEL"
        buttonColor="#176B87"
        theme="light"
        onConfirm={date => {
          setDatePickerModalVisible(false);
          setDateOfBirth(date);
        }}
        onCancel={() => {
          setDatePickerModalVisible(false);
        }}
      />

      {/* ----------------------------------------------------------------- */}
      {/* 4. TIME OF BIRTH WHEEL PICKER (Matches media_1792345445431.jpg)   */}
      {/* ----------------------------------------------------------------- */}
      <TimeWheelPickerModal
        visible={timePickerModalVisible}
        initialTime={timeOfBirth === '00:00' ? '12:00 PM' : timeOfBirth}
        onConfirm={(formattedTime, hour, minute, ampm) => {
          setTimePickerModalVisible(false);
          setTimeOfBirth(formattedTime);
          const d = new Date();
          let h = hour;
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          d.setHours(h, minute, 0, 0);
          setTimeDate(d);
        }}
        onCancel={() => {
          setTimePickerModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default AddHoroscope;

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(12),
    paddingBottom: moderateVerticalScale(24),
  },
  headerSubtitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(14.5),
    color: '#111827',
    marginBottom: moderateVerticalScale(14),
    letterSpacing: -0.2,
  },
  inputSpacing: {
    marginBottom: moderateVerticalScale(10),
  },
  outlinedInputContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: moderateScale(6),
    height: moderateVerticalScale(48),
    paddingHorizontal: moderateScale(14),
  },
  textInputStyle: {
    fontSize: moderateScale(14.5),
    fontFamily: fontFamily.Inter18Regular,
    color: '#111827',
  },

  // Bottom action buttons
  actionContainer: {
    marginTop: moderateVerticalScale(16),
    alignItems: 'center',
  },
  generateButton: {
    width: '68%',
    maxWidth: moderateScale(260),
    height: moderateVerticalScale(46),
    borderRadius: moderateScale(23),
    backgroundColor: '#176B87', // Petrol blue tone matching screenshot
    shadowColor: '#176B87',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  generateButtonText: {
    fontSize: moderateScale(15),
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#FFFFFF',
  },
  orText: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(13),
    color: '#1F2937',
    marginVertical: moderateVerticalScale(12),
    textAlign: 'center',
  },
  uploadButton: {
    width: '60%',
    maxWidth: moderateScale(230),
    height: moderateVerticalScale(44),
    borderRadius: moderateScale(22),
    borderWidth: 1.5,
    borderColor: '#176B87',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(14),
    color: '#176B87',
  },

  // Modal Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    paddingTop: moderateVerticalScale(16),
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateVerticalScale(30),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: moderateVerticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(16),
    color: '#0F172A',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: moderateScale(12),
    height: moderateVerticalScale(42),
    marginTop: moderateVerticalScale(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(14),
    color: '#0F172A',
  },
  modalList: {
    marginTop: moderateVerticalScale(10),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateVerticalScale(14),
    paddingHorizontal: moderateScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
    borderRadius: moderateScale(8),
  },
  selectedOptionItem: {
    backgroundColor: '#FFF1F2',
  },
  optionText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(14.5),
    color: '#1E293B',
  },
  selectedOptionText: {
    fontFamily: fontFamily.Inter18SemiBold,
    color: COLORS.themeColor,
  },

  // Picker Dialog (Date & Time)
  pickerDialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginHorizontal: moderateScale(24),
    alignSelf: 'center',
    width: '88%',
    maxWidth: 360,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  pickerTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(16),
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: moderateVerticalScale(14),
  },
  dateDisplayCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    alignItems: 'center',
    marginBottom: moderateVerticalScale(16),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateDisplayDay: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(13),
    color: '#64748B',
  },
  dateDisplayFull: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(18),
    color: '#0F172A',
    marginTop: 2,
  },
  steppersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(8),
    marginBottom: moderateVerticalScale(20),
  },
  stepperCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(12),
    color: '#64748B',
    marginBottom: moderateVerticalScale(6),
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(4),
    paddingVertical: moderateVerticalScale(4),
  },
  stepBtn: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(6),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    minWidth: moderateScale(34),
    textAlign: 'center',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(13),
    color: '#0F172A',
  },
  confirmButton: {
    backgroundColor: '#176B87',
    borderRadius: moderateScale(12),
    height: moderateVerticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },

  // Time Dialog
  timeDisplayCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(12),
    paddingVertical: moderateVerticalScale(14),
    alignItems: 'center',
    marginBottom: moderateVerticalScale(14),
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeDisplayText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(24),
    color: '#0F172A',
  },
  timePresetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(6),
    justifyContent: 'center',
    marginBottom: moderateVerticalScale(14),
  },
  presetBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(6),
    borderRadius: moderateScale(8),
    backgroundColor: '#F1F5F9',
  },
  presetBadgeSelected: {
    backgroundColor: '#176B87',
  },
  presetBadgeText: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(12),
    color: '#475569',
  },
  presetBadgeTextSelected: {
    color: '#FFFFFF',
  },
  manualTimeInputBox: {
    marginBottom: moderateVerticalScale(16),
  },
  manualTimeLabel: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#64748B',
    marginBottom: moderateVerticalScale(4),
  },
  manualTimeInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: moderateScale(8),
    height: moderateVerticalScale(40),
    paddingHorizontal: moderateScale(10),
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: moderateScale(14),
    color: '#0F172A',
    textAlign: 'center',
  },
});
