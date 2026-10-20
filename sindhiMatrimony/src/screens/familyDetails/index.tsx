import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { showToast } from '../../utils/CustomToast';
import { Storage } from '../../storage/Storage';

// -----------------------------------------------------------------------------
// OPTIONS DATA
// -----------------------------------------------------------------------------
const FAMILY_VALUES = ['Orthodox', 'Traditional', 'Moderate', 'Liberal'];
const FAMILY_TYPES = ['Joint family', 'Nuclear family'];
const FAMILY_STATUSES = [
  'Middle class',
  'Upper middle class',
  'Rich / Affluent',
  'High class',
];
const SIBLING_COUNTS = ['None', '1', '2', '3', '4', '5+'];

// -----------------------------------------------------------------------------
// MAIN COMPONENT: FamilyDetails / Edit Profile - About my family
// -----------------------------------------------------------------------------
const FamilyDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  // State initialized with values from user screenshot (media_1792347200778.jpg)
  const [familyValue, setFamilyValue] = useState<string>('Moderate');
  const [familyType, setFamilyType] = useState<string>('Nuclear family');
  const [familyStatus, setFamilyStatus] = useState<string>('Upper middle class');
  const [fatherOccupation, setFatherOccupation] = useState<string>('6');
  const [motherOccupation, setMotherOccupation] = useState<string>('1');
  const [familyOrigin, setFamilyOrigin] = useState<string>('Maharashtra');
  const [noOfBrothers, setNoOfBrothers] = useState<string>('');
  const [brothersMarried, setBrothersMarried] = useState<string>('');
  const [noOfSisters, setNoOfSisters] = useState<string>('');
  const [sistersMarried, setSistersMarried] = useState<string>('');

  // Selection Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<string>('');

  // Open selection modal
  const openPicker = useCallback(
    (field: string, title: string, options: string[]) => {
      setCurrentField(field);
      setModalTitle(title);
      setModalOptions(options);
      setModalVisible(true);
    },
    [],
  );

  const handleSelectOption = useCallback(
    (value: string) => {
      switch (currentField) {
        case 'familyValue':
          setFamilyValue(value);
          break;
        case 'familyType':
          setFamilyType(value);
          break;
        case 'familyStatus':
          setFamilyStatus(value);
          break;
        case 'noOfBrothers':
          setNoOfBrothers(value);
          break;
        case 'brothersMarried':
          setBrothersMarried(value);
          break;
        case 'noOfSisters':
          setNoOfSisters(value);
          break;
        case 'sistersMarried':
          setSistersMarried(value);
          break;
      }
      setModalVisible(false);
    },
    [currentField],
  );

  // Save handler
  const handleSave = useCallback(() => {
    // Save to persistent storage
    Storage.setItemSync('hasFamilyDetails', 'true');
    Storage.setItemSync(
      'familyDetailsData',
      JSON.stringify({
        familyValue,
        familyType,
        familyStatus,
        fatherOccupation,
        motherOccupation,
        familyOrigin,
        noOfBrothers,
        brothersMarried,
        noOfSisters,
        sistersMarried,
      }),
    );

    showToast({
      type: 'success',
      message: 'Family details saved successfully!',
    });

    navigation.goBack();
  }, [
    navigation,
    familyValue,
    familyType,
    familyStatus,
    fatherOccupation,
    motherOccupation,
    familyOrigin,
    noOfBrothers,
    brothersMarried,
    noOfSisters,
    sistersMarried,
  ]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#EE5559" />

      {/* Top Header */}
      <CustomHeader
        title="Edit Profile"
        backgroundColor="#EE5559"
        titleColor="#FFFFFF"
        backIconColor="#FFFFFF"
        statusBarColor="#EE5559"
        statusBarStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Container */}
          <View style={styles.card}>
            {/* Header: Pencil circle + "About my family" */}
            <View style={styles.cardHeader}>
              <View style={styles.editIconCircle}>
                <CustomLucidIcons name="pencil" size={14} color="#666666" />
              </View>
              <Text style={styles.cardTitle}>About my family</Text>
            </View>

            {/* 1. Family Value */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'familyValue',
                  'Select Family Value',
                  FAMILY_VALUES,
                )
              }
            >
              <Text style={styles.itemLabel}>Family Value</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{familyValue}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 2. Family Type */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker('familyType', 'Select Family Type', FAMILY_TYPES)
              }
            >
              <Text style={styles.itemLabel}>Family Type</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{familyType}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 3. Family Status */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'familyStatus',
                  'Select Family Status',
                  FAMILY_STATUSES,
                )
              }
            >
              <Text style={styles.itemLabel}>Family Status</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{familyStatus}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 4. Father's Occupation */}
            <View style={styles.inputItemRow}>
              <Text style={styles.itemLabel}>Father's Occupation</Text>
              <TextInput
                style={styles.inlineInput}
                value={fatherOccupation}
                onChangeText={setFatherOccupation}
                placeholder="Enter occupation"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.divider} />

            {/* 5. Mother's Occupation */}
            <View style={styles.inputItemRow}>
              <Text style={styles.itemLabel}>Mother's Occupation</Text>
              <TextInput
                style={styles.inlineInput}
                value={motherOccupation}
                onChangeText={setMotherOccupation}
                placeholder="Enter occupation"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.divider} />

            {/* 6. Ancestral / Family Origin */}
            <View style={styles.inputItemRow}>
              <Text style={styles.itemLabel}>Ancestral / Family Origin</Text>
              <TextInput
                style={styles.inlineInput}
                value={familyOrigin}
                onChangeText={setFamilyOrigin}
                placeholder="Enter state / city"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.divider} />

            {/* 7. No.of Brothers */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'noOfBrothers',
                  'Select No. of Brothers',
                  SIBLING_COUNTS,
                )
              }
            >
              <Text style={styles.itemLabel}>No.of Brothers</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{noOfBrothers}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 8. Brothers Married */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'brothersMarried',
                  'Select Brothers Married',
                  SIBLING_COUNTS,
                )
              }
            >
              <Text style={styles.itemLabel}>Brothers Married</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{brothersMarried}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 9. No.of Sisters */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'noOfSisters',
                  'Select No. of Sisters',
                  SIBLING_COUNTS,
                )
              }
            >
              <Text style={styles.itemLabel}>No.of Sisters</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{noOfSisters}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />

            {/* 10. Sisters Married */}
            <TouchableOpacity
              style={styles.itemRow}
              activeOpacity={0.7}
              onPress={() =>
                openPicker(
                  'sistersMarried',
                  'Select Sisters Married',
                  SIBLING_COUNTS,
                )
              }
            >
              <Text style={styles.itemLabel}>Sisters Married</Text>
              <View style={styles.itemRight}>
                <Text style={styles.itemValue}>{sistersMarried}</Text>
                <CustomLucidIcons
                  name="chevron-right"
                  size={18}
                  color="#B0B0B0"
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM ACTION BAR (Cancel / Save)                              */}
        {/* ------------------------------------------------------------- */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomBtn}
            activeOpacity={0.7}
            onPress={handleCancel}
          >
            <CustomLucidIcons name="corner-up-left" size={17} color="#666666" />
            <Text style={styles.bottomBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.bottomDivider} />

          <TouchableOpacity
            style={styles.bottomBtn}
            activeOpacity={0.7}
            onPress={handleSave}
          >
            <CustomLucidIcons name="check" size={17} color="#E65100" />
            <Text style={[styles.bottomBtnText, { color: '#E65100' }]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ----------------------------------------------------------------- */}
      {/* SELECTION MODAL (Matches media_1792347271927.jpg)                  */}
      {/* ----------------------------------------------------------------- */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalSheet}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            {/* Top Close Icon on left */}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CustomLucidIcons name="x" size={22} color="#9E9E9E" />
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.modalHeaderTitle}>{modalTitle}</Text>
            <View style={styles.modalTitleDivider} />

            {/* Options List */}
            <FlatList
              data={modalOptions}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOptionItem}
                  activeOpacity={0.6}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default FamilyDetailsScreen;

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 4,
  },
  editIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16.5,
    color: '#262626',
    fontFamily: fontFamily.Inter18Bold,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  inputItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemLabel: {
    fontSize: 14,
    color: '#333333',
    fontFamily: fontFamily.Inter18Regular,
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  itemValue: {
    fontSize: 14,
    color: '#424242',
    fontFamily: fontFamily.Inter18Regular,
    marginRight: 6,
    textAlign: 'right',
  },
  inlineInput: {
    fontSize: 14,
    color: '#424242',
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'left',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 80,
    maxWidth: 160,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },

  // Bottom action bar
  bottomBar: {
    flexDirection: 'row',
    height: Platform.OS === 'android' ? 56 : 52,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'android' ? 4 : 0,
  },
  bottomBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: '100%',
  },
  bottomBtnText: {
    fontSize: 14.5,
    color: '#555555',
    fontFamily: fontFamily.Inter18Medium,
  },
  bottomDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E0E0E0',
  },

  // Modal styles (matches media_1792347271927.jpg)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 14,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: '65%',
  },
  modalCloseBtn: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  modalHeaderTitle: {
    fontSize: 16,
    color: '#888888',
    fontFamily: fontFamily.Inter18Regular,
    marginBottom: 12,
  },
  modalTitleDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginBottom: 4,
  },
  modalOptionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#262626',
    fontFamily: fontFamily.Inter18Regular,
  },
});
