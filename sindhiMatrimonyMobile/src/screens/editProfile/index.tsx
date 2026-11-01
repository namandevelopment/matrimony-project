import React, { useCallback, useState, useRef } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectProfile, selectPartnerPreferences } from '../../redux/useSelector';
import Storage from '../../storage/Storage';
import { apiFetch, ApiURL, uploadImage, pickImage } from '../../redux/apiService';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { showToast } from '../../utils/CustomToast';
import PhotoPickerModal from '../../customModals/PhotoPickerModal';
import usePermissions from '../../customHooks/usePermissions';
import COLORS from '../../components/colors';

const HEADER_COLOR = COLORS.themeColor;

interface DetailItem {
  label: string;
  value: string;
  isMore?: boolean;
}

interface FamilyDetailsData {
  familyValue: string;
  familyType: string;
  familyStatus: string;
  fatherOccupation: string;
  motherOccupation: string;
  familyOrigin: string;
  noOfBrothers: string;
  noOfSisters: string;
  brothersMarried: string;
  sistersMarried: string;
}

const FAMILY_VALUES = ['Orthodox', 'Traditional', 'Moderate', 'Liberal'];
const FAMILY_TYPES = ['Joint family', 'Nuclear family'];
const FAMILY_STATUSES = ['Middle class', 'Upper middle class', 'Rich / Affluent', 'High class'];
const SIBLING_COUNTS = ['None', '1', '2', '3', '4', '5+'];
const MARRIED_COUNTS = ['None', '1', '2', '3', '4', 'All'];

const DEFAULT_SECTION_VALUES: Record<string, string> = {
  'A Few Lines About Myself': '',
  'Basic Details': '',
  'Religious Information': '',
  'Hobbies & Interests': '',
  'Habits': '',
  'Family Details': '',
  'About my family': '',
  'A Few Lines About My Partner': '',
  'Religious Preference': '',
  'Professional Preference': '',
  'Location Preference': '',
  'Habits Preferences': '',
};

const getPreferenceValue = (sections: any[], key: string, fallback: string): string => {
  if (!Array.isArray(sections)) return fallback;
  for (const sec of sections) {
    if (sec.fields && Array.isArray(sec.fields)) {
      const found = sec.fields.find((f: any) => f.key === key);
      if (found && found.value) return found.value;
    }
  }
  return fallback;
};

const EditProfile: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const heroScrollRef = useRef<ScrollView>(null);
  const { requestGalleryPermission, requestCameraPermission } = usePermissions();

  // Profile and photos state
  const storedUser = Storage.getItemSync<any>('user') || {};
  const reduxProfile = useSelector(selectProfile);
  const [liveProfile, setLiveProfile] = useState<any>(
    () => reduxProfile || storedUser?.profile || storedUser || {},
  );
  const profile = liveProfile || reduxProfile || storedUser?.profile || storedUser || {};

  const initialPhotos: string[] = React.useMemo(() => {
    const list: string[] = [];
    if (Array.isArray(profile?.photos)) {
      profile.photos.forEach((p: any) => {
        const u = typeof p === 'string' ? p : p?.url || p?.image;
        if (u && typeof u === 'string' && u.trim().length > 0) list.push(u.trim());
      });
    }
    const single =
      profile?.avatar ||
      profile?.profileImage ||
      profile?.photo ||
      storedUser?.avatar ||
      storedUser?.photo;
    if (single && typeof single === 'string' && single.trim().length > 0 && !list.includes(single.trim())) {
      list.unshift(single.trim());
    }
    return list;
  }, [profile, storedUser]);

  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [hasImageError, setHasImageError] = useState<boolean>(false);
  const [photoPickerVisible, setPhotoPickerVisible] = useState<boolean>(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (photos.length === 0 && initialPhotos.length > 0) {
      setPhotos(initialPhotos);
    }
  }, [initialPhotos]);

  // State for interactive modal editing
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [savedValues, setSavedValues] = useState<Record<string, string>>({});

  const bioValue =
    savedValues['A Few Lines About Myself'] ||
    profile?.aboutMe ||
    profile?.about ||
    profile?.bio ||
    '';

  const hobbiesValue =
    savedValues['Hobbies & Interests'] ||
    (Array.isArray(profile?.hobbies) ? profile.hobbies.join(', ') : profile?.hobbies) ||
    profile?.interests ||
    '';

  const aboutFamilyValue =
    savedValues['About my family'] ||
    profile?.family?.aboutFamily ||
    profile?.aboutFamily ||
    '';

  const primaryPhone =
    profile?.phone ||
    profile?.mobile ||
    storedUser?.phone ||
    storedUser?.mobile ||
    '+91 98765 43210';
  const primaryEmail =
    profile?.email ||
    storedUser?.email ||
    'user@sindhimatrimony.com';
  const [alternatePhone, setAlternatePhone] = useState<string>(() => {
    return (
      profile?.alternatePhone ||
      profile?.alternateMobile ||
      storedUser?.alternatePhone ||
      Storage.getItemSync<string>('alternatePhone') ||
      ''
    );
  });
  const [hasHoroscope, setHasHoroscope] = useState<boolean>(() => {
    const val = Storage.getItemSync<any>('hasHoroscope');
    return val === true || val === 'true' || !!profile?.hasHoroscope || !!profile?.horoscope;
  });

  // Family Details State
  const [familyDetails, setFamilyDetails] = useState<FamilyDetailsData>(() => {
    try {
      const saved = Storage.getItemSync<any>('familyDetailsData');
      if (saved) {
        const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
        return {
          ...parsed,
          fatherOccupation: parsed.fatherOccupation === '6' ? 'Passed Away' : (parsed.fatherOccupation || 'Passed Away'),
          motherOccupation: parsed.motherOccupation === '1' ? 'Homemaker' : (parsed.motherOccupation || 'Homemaker'),
        };
      }
    } catch (e) { }
    const fam = profile?.family || storedUser?.family || {};
    return {
      familyValue: fam?.familyValue || 'Moderate',
      familyType: fam?.familyType || 'Nuclear family',
      familyStatus: fam?.familyStatus || 'Upper middle class',
      fatherOccupation: fam?.fatherOccupation || 'Passed Away',
      motherOccupation: fam?.motherOccupation || 'Homemaker',
      familyOrigin: fam?.origin || fam?.familyOrigin || profile?.location?.state || 'Not Specified',
      noOfBrothers: fam?.brothers || fam?.noOfBrothers || 'None',
      noOfSisters: fam?.sisters || fam?.noOfSisters || 'None',
      brothersMarried: fam?.brothersMarried || 'None',
      sistersMarried: fam?.sistersMarried || 'None',
    };
  });

  const [isFamilyModalVisible, setIsFamilyModalVisible] = useState(false);
  const [familyFormData, setFamilyFormData] = useState<FamilyDetailsData>(familyDetails);

  // Active inline custom dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = useCallback((field: string) => {
    setActiveDropdown(prev => (prev === field ? null : field));
  }, []);

  const handleSelectOption = useCallback((field: keyof FamilyDetailsData, value: string) => {
    setFamilyFormData((prev: FamilyDetailsData) => ({
      ...prev,
      [field]: value,
    }));
    setActiveDropdown(null);
  }, []);

  const renderCustomDropdown = (
    field: keyof FamilyDetailsData,
    options: string[]
  ) => {
    if (activeDropdown !== field) return null;
    return (
      <View style={styles.dropdownMenu}>
        {options.map((opt, idx) => {
          const isSelected = familyFormData[field] === opt;
          return (
            <TouchableOpacity
              key={`${opt}-${idx}`}
              style={[
                styles.dropdownMenuItem,
                isSelected && styles.dropdownMenuItemSelected,
                idx === options.length - 1 && { borderBottomWidth: 0 },
              ]}
              activeOpacity={0.7}
              onPress={() => handleSelectOption(field, opt)}
            >
              <Text
                style={[
                  styles.dropdownMenuText,
                  isSelected && styles.dropdownMenuTextSelected,
                ]}
              >
                {opt}
              </Text>
              {isSelected && (
                <CustomLucidIcons name="check" size={16} color={HEADER_COLOR} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const handleOpenFamilyModal = useCallback(() => {
    setFamilyFormData(familyDetails);
    setIsFamilyModalVisible(true);
  }, [familyDetails]);

  const handleSaveFamilyDetails = useCallback(() => {
    setFamilyDetails(familyFormData);
    Storage.setItemSync('familyDetailsData', JSON.stringify(familyFormData));
    try {
      const currentUser = Storage.getItemSync<any>('user') || {};
      Storage.setItemSync('user', {
        ...currentUser,
        familyDetails: familyFormData,
      });
    } catch (e) { }

    apiFetch({
      url: ApiURL.updateProfile,
      method: 'POST',
      payload: {
        family: {
          familyValue: familyFormData.familyValue,
          familyType: familyFormData.familyType,
          familyStatus: familyFormData.familyStatus,
          fatherOccupation: familyFormData.fatherOccupation,
          motherOccupation: familyFormData.motherOccupation,
          origin: familyFormData.familyOrigin,
          brothers: familyFormData.noOfBrothers,
          sisters: familyFormData.noOfSisters,
          brothersMarried: familyFormData.brothersMarried,
          sistersMarried: familyFormData.sistersMarried,
        },
      },
      showErrorToast: false,
    }).catch(() => { });

    showToast({
      type: 'success',
      message: 'Family details updated successfully',
    });
    setIsFamilyModalVisible(false);
  }, [familyFormData]);

  const reduxPartnerPrefs = useSelector(selectPartnerPreferences);
  const [partnerPrefs, setPartnerPrefs] = useState<any[]>(() => {
    return reduxPartnerPrefs || Storage.getItemSync<any[]>('partnerPreferences') || [];
  });

  React.useEffect(() => {
    if (reduxPartnerPrefs && Array.isArray(reduxPartnerPrefs) && reduxPartnerPrefs.length > 0) {
      setPartnerPrefs(reduxPartnerPrefs);
    }
  }, [reduxPartnerPrefs]);

  useFocusEffect(
    useCallback(() => {
      const saved = Storage.getItemSync<any[]>('partnerPreferences');
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setPartnerPrefs(saved);
      }
      const horo = Storage.getItemSync<any>('hasHoroscope');
      if (horo === true || horo === 'true') {
        setHasHoroscope(true);
      }
      const alt = Storage.getItemSync<string>('alternatePhone');
      if (alt) {
        setAlternatePhone(alt);
      }
      try {
        const savedFam = Storage.getItemSync<any>('familyDetailsData');
        if (savedFam) {
          const parsed = typeof savedFam === 'string' ? JSON.parse(savedFam) : savedFam;
          setFamilyDetails({
            ...parsed,
            fatherOccupation: parsed.fatherOccupation === '6' ? 'Passed Away' : (parsed.fatherOccupation || 'Passed Away'),
            motherOccupation: parsed.motherOccupation === '1' ? 'Homemaker' : (parsed.motherOccupation || 'Homemaker'),
          });
        }
      } catch (e) { }

      // Sync latest data from backend API
      apiFetch({
        url: ApiURL.getProfile,
        method: 'GET',
        showErrorToast: false,
      })
        .then((res: any) => {
          const profileData = res?.data?.profile || res?.data;
          if (profileData) {
            setLiveProfile(profileData);
            try {
              const curUser = Storage.getItemSync<any>('user') || {};
              Storage.setItemSync('user', { ...curUser, ...profileData, profile: profileData });
            } catch (e) { }

            if (profileData.alternatePhone !== undefined) {
              setAlternatePhone(profileData.alternatePhone || '');
              Storage.setItemSync('alternatePhone', profileData.alternatePhone || '');
            }
            if (profileData.hasHoroscope || profileData.horoscope) {
              setHasHoroscope(true);
              Storage.setItemSync('hasHoroscope', 'true');
            }
            if (profileData.family) {
              const fam = profileData.family;
              setFamilyDetails({
                familyValue: fam.familyValues || fam.familyValue || 'Moderate',
                familyType: fam.familyType === 'NUCLEAR' ? 'Nuclear family' : fam.familyType === 'JOINT' ? 'Joint family' : fam.familyType || 'Nuclear family',
                familyStatus: fam.familyStatus || 'Upper middle class',
                fatherOccupation: fam.fatherOccupation || 'Passed Away',
                motherOccupation: fam.motherOccupation || 'Homemaker',
                familyOrigin: fam.origin || fam.familyOrigin || profileData.location?.state || 'Not Specified',
                noOfBrothers: String(fam.brothersCount ?? fam.brothers ?? fam.noOfBrothers ?? 'None'),
                noOfSisters: String(fam.sistersCount ?? fam.sisters ?? fam.noOfSisters ?? 'None'),
                brothersMarried: String(fam.brothersMarried ?? 'None'),
                sistersMarried: String(fam.sistersMarried ?? 'None'),
              });
            }
          }
        })
        .catch(() => { });
    }, []),
  );

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const openCameraPicker = useCallback(async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        showToast({ type: 'info', message: 'Camera permission denied' });
        return;
      }

      const img = await pickImage({ fromCamera: true, showToast: false });
      if (img?.uri) {
        setPhotos(prev => {
          if (targetSlotIndex !== null && targetSlotIndex < prev.length) {
            const updated = [...prev];
            updated[targetSlotIndex] = img.uri;
            return updated;
          }
          return [img.uri, ...prev];
        });
        setSelectedPhotoIndex(targetSlotIndex !== null ? targetSlotIndex : 0);
        setHasImageError(false);
        showToast({ type: 'info', message: 'Uploading photo...' });

        uploadImage(img, { showToast: false }).then(res => {
          const remoteUrl = res?.data?.avatar || res?.data?.photos?.[0]?.url || (res?.data as any)?.url;
          if (remoteUrl) setPhotos(prev => prev.map(p => (p === img.uri ? remoteUrl : p)));
          showToast({ type: 'success', message: 'Photo uploaded successfully' });
        }).catch(() => {});
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        showToast({ type: 'info', message: 'Camera closed' });
      }
    }
  }, [requestCameraPermission, targetSlotIndex]);

  const openGalleryPicker = useCallback(async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        showToast({ type: 'info', message: 'Gallery permission denied' });
        return;
      }

      const img = await pickImage({ fromCamera: false, showToast: false });
      if (img?.uri) {
        setPhotos(prev => {
          if (targetSlotIndex !== null && targetSlotIndex < prev.length) {
            const updated = [...prev];
            updated[targetSlotIndex] = img.uri;
            return updated;
          }
          return [...prev, img.uri];
        });
        setSelectedPhotoIndex(targetSlotIndex !== null ? targetSlotIndex : photos.length);
        setHasImageError(false);
        showToast({ type: 'info', message: 'Uploading photo...' });

        uploadImage(img, { showToast: false }).then(res => {
          const remoteUrl = res?.data?.avatar || res?.data?.photos?.[0]?.url || (res?.data as any)?.url;
          if (remoteUrl) setPhotos(prev => prev.map(p => (p === img.uri ? remoteUrl : p)));
          showToast({ type: 'success', message: 'Photo uploaded successfully' });
        }).catch(() => {});
      }
    } catch (err: any) {
      if (err?.code !== 'E_PICKER_CANCELLED') {
        showToast({ type: 'info', message: 'Gallery closed' });
      }
    }
  }, [requestGalleryPermission, targetSlotIndex, photos.length]);

  const handleAddPhoto = useCallback(() => {
    setTargetSlotIndex(selectedPhotoIndex < photos.length ? selectedPhotoIndex : null);
    setPhotoPickerVisible(true);
  }, [photos.length, selectedPhotoIndex]);

  const handleSlotPress = useCallback(
    (index: number) => {
      if (index < photos.length) {
        setSelectedPhotoIndex(index);
        setHasImageError(false);
        heroScrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
        if (index === selectedPhotoIndex) {
          setTargetSlotIndex(index);
          setPhotoPickerVisible(true);
        }
      } else {
        setTargetSlotIndex(index);
        setPhotoPickerVisible(true);
      }
    },
    [photos.length, screenWidth, selectedPhotoIndex],
  );

  const handleSetPrimary = useCallback(() => {
    if (targetSlotIndex !== null && targetSlotIndex > 0 && targetSlotIndex < photos.length) {
      setPhotos(prev => {
        const copy = [...prev];
        const [moved] = copy.splice(targetSlotIndex, 1);
        copy.unshift(moved);
        return copy;
      });
      setSelectedPhotoIndex(0);
      showToast({ type: 'success', message: 'Main photo updated' });
    }
  }, [targetSlotIndex, photos.length]);

  const handleDeletePhoto = useCallback(() => {
    if (targetSlotIndex !== null && targetSlotIndex < photos.length) {
      setPhotos(prev => prev.filter((_, i) => i !== targetSlotIndex));
      setSelectedPhotoIndex(0);
      showToast({ type: 'success', message: 'Photo removed' });
    }
  }, [targetSlotIndex, photos.length]);

  const handleEditAction = useCallback((sectionName: string, initialContent?: string) => {
    setActiveEditSection(sectionName);
    let fallback = '';
    if (sectionName === 'A Few Lines About Myself') fallback = bioValue;
    else if (sectionName === 'Hobbies & Interests') fallback = hobbiesValue;
    else if (sectionName === 'About my family') fallback = aboutFamilyValue;
    setEditingValue(initialContent || savedValues[sectionName] || fallback || DEFAULT_SECTION_VALUES[sectionName] || '');
  }, [savedValues, bioValue, hobbiesValue, aboutFamilyValue]);

  const handleSaveEdit = useCallback(() => {
    if (activeEditSection === 'Alternate Mobile Number') {
      const trimmed = editingValue.trim();
      if (trimmed.length > 0 && !/^\+?[0-9]{10,13}$/.test(trimmed.replace(/[\s-]/g, ''))) {
        showToast({
          type: 'error',
          message: 'Please enter a valid 10-digit mobile number',
        });
        return;
      }
      setAlternatePhone(trimmed);
      Storage.setItemSync('alternatePhone', trimmed);
      try {
        const currentUser = Storage.getItemSync<any>('user') || {};
        Storage.setItemSync('user', { ...currentUser, alternatePhone: trimmed });
      } catch (e) {
        // ignore
      }

      // Sync with backend API
      apiFetch({
        url: ApiURL.updateProfile,
        method: 'POST',
        payload: { alternatePhone: trimmed },
        showErrorToast: false,
      }).catch(() => { });

      showToast({
        type: 'success', position: 'top',
        message: trimmed ? 'Alternate mobile number saved' : 'Alternate number removed',
      });
      setActiveEditSection(null);
      return;
    }

    if (activeEditSection) {
      const trimmed = editingValue.trim();
      setSavedValues(prev => ({ ...prev, [activeEditSection]: trimmed }));

      // Construct API payload based on section name
      let payload: Record<string, any> = {};
      if (activeEditSection === 'A Few Lines About Myself') {
        payload = { aboutMe: trimmed };
      } else if (activeEditSection === 'Hobbies & Interests') {
        payload = { hobbies: trimmed.split(',').map(s => s.trim()).filter(Boolean) };
      } else if (activeEditSection === 'About my family') {
        payload = { family: { ...(profile?.family || {}), aboutFamily: trimmed }, aboutFamily: trimmed };
      } else {
        payload = { [activeEditSection]: trimmed };
      }

      setLiveProfile((prev: any) => ({
        ...prev,
        ...payload,
        family: { ...(prev?.family || {}), ...(payload.family || {}) },
      }));

      // Sync with backend API
      apiFetch({
        url: ApiURL.updateUserProfile,
        method: 'POST',
        payload,
        showErrorToast: true,
      })
        .then((res: any) => {
          const profileData = res?.data?.profile || res?.data;
          if (profileData) {
            setLiveProfile(profileData);
            try {
              const currentUser = Storage.getItemSync<any>('user') || {};
              const currentProfile = currentUser.profile || currentUser;
              Storage.setItemSync('user', {
                ...currentUser,
                ...profileData,
                profile: {
                  ...currentProfile,
                  ...profileData,
                },
              });
            } catch (e) { }
          }
        })
        .catch(() => { });

      showToast({
        type: 'success',
        message: `${activeEditSection} updated successfully`,
      });
      setActiveEditSection(null);
    }
  }, [activeEditSection, editingValue]);

  const handleActionStripPress = useCallback((action: 'alternate_phone' | 'email' | 'horoscope') => {
    if (action === 'alternate_phone') {
      setActiveEditSection('Alternate Mobile Number');
      setEditingValue(alternatePhone);
    } else if (action === 'email') {
      Alert.alert(
        'Registered Email',
        `Registered Email: ${primaryEmail}\n\nEmail ID cannot be changed because it is linked to your login credentials.`,
        [{ text: 'OK' }]
      );
    } else if (action === 'horoscope') {
      if (hasHoroscope) {
        navigation.navigate('Horoscope');
      } else {
        navigation.navigate('AddHoroscope');
      }
    }
  }, [alternatePhone, primaryEmail, hasHoroscope, navigation]);

  const handlePartnerPreferenceNavigation = useCallback(() => {
    navigation.navigate('PartnerPreferenceScreen', {
      onUpdated: (newSections: any[]) => {
        setPartnerPrefs(newSections);
      },
    });
  }, [navigation]);

  const handleCompulsoryFilters = useCallback(() => {
    handlePartnerPreferenceNavigation();
  }, [handlePartnerPreferenceNavigation]);

  const handleMorePress = useCallback((topic: string) => {
    Alert.alert('Education Details', topic);
  }, []);

  // Render a single key-value detail row
  const renderDetailRow = (item: DetailItem, index: number) => (
    <View key={`${item.label}-${index}`} style={styles.detailRow}>
      <Text style={styles.detailLabel}>{item.label}</Text>
      <View style={styles.detailValueWrap}>
        <Text style={styles.detailColon}>: </Text>
        <Text style={styles.detailValue}>
          {item.value}
          {item.isMore && (
            <Text
              onPress={() => handleMorePress(item.value)}
              style={styles.moreLink}
            >
              {' '}more
            </Text>
          )}
        </Text>
      </View>
    </View>
  );

  // Render Section Header with Title and Pencil Icon
  const renderSubSectionHeader = (title: string, onEditPress?: () => void) => (
    <View style={styles.subSectionHeader}>
      <Text style={styles.subSectionTitle}>{title}</Text>
      <TouchableOpacity
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={onEditPress || (() => handleEditAction(title))}
      >
        <CustomLucidIcons name="pencil" size={17} color="#9E9E9E" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title="Edit Profile"
        backgroundColor={HEADER_COLOR}
        titleColor="#FFFFFF"
        showBack={true}
        backIconColor="#FFFFFF"
        onBackPress={handleBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Profile Hero Photo Area */}
        <View style={styles.photoContainer}>
          {photos.length > 0 && !hasImageError ? (
            <ScrollView
              ref={heroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const offsetX = e.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / screenWidth);
                if (index >= 0 && index < photos.length) {
                  setSelectedPhotoIndex(index);
                }
              }}
              style={styles.heroScrollView}
            >
              {photos.map((photoUrl, index) => (
                <View key={`hero-photo-${index}`} style={{ width: screenWidth, height: 270 }}>
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.heroAvatarImage}
                    resizeMode="cover"
                    onError={() => setHasImageError(true)}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.heroFallbackWrap}>
              <View style={styles.heroAvatarCircle}>
                <CustomLucidIcons name="user" color="#94A3B8" size={72} />
              </View>
              <Text style={styles.heroFallbackText}>No photo added yet</Text>
            </View>
          )}

          {/* Hero Top Badges */}
          <View style={styles.heroTopBar} pointerEvents="box-none">
            <View style={styles.mainBadge}>
              <CustomLucidIcons name="star" color="#F59E0B" size={12} />
              <Text style={styles.mainBadgeText}>
                {selectedPhotoIndex === 0 ? 'MAIN PHOTO' : `PHOTO ${selectedPhotoIndex + 1}`}
              </Text>
            </View>

            <View style={styles.countBadge}>
              <CustomLucidIcons name="image" color="#FFFFFF" size={12} />
              <Text style={styles.countBadgeText}>
                {photos.length > 0 ? `${selectedPhotoIndex + 1}/${photos.length}` : '0/6'}
              </Text>
            </View>
          </View>

          {/* Carousel Pagination Dots */}
          {photos.length > 1 && (
            <View style={styles.heroDotsContainer} pointerEvents="none">
              {photos.map((_, dotIdx) => (
                <View
                  key={`hero-dot-${dotIdx}`}
                  style={[
                    styles.heroDot,
                    dotIdx === selectedPhotoIndex ? styles.heroActiveDot : styles.heroInactiveDot,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Subtle gradient overlay at bottom for clarity */}
          <View style={styles.heroBottomOverlay} pointerEvents="none" />

          {/* Add / Change Photo CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAddPhoto}
            style={styles.addPhotoButton}
          >
            <CustomLucidIcons name="camera" color="#FFFFFF" size={16} />
            <Text style={styles.addPhotoText}>
              {photos.length > 0 ? 'Change / Add Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display Photos Gallery Strip */}
        <View style={styles.galleryCard}>
          <View style={styles.galleryHeader}>
            <View style={styles.galleryTitleRow}>
              <CustomLucidIcons name="images" color={HEADER_COLOR} size={18} />
              <Text style={styles.galleryTitle}>Display Photos</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleAddPhoto}>
              <Text style={styles.galleryAddLink}>+ Add More</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slotsRow}
          >
            {[0, 1, 2, 3, 4, 5].map(index => {
              const hasPhoto = index < photos.length;
              const isSelected = index === selectedPhotoIndex;
              const isPrimary = index === 0;

              return (
                <TouchableOpacity
                  key={`slot-${index}`}
                  activeOpacity={0.75}
                  onPress={() => handleSlotPress(index)}
                  style={[
                    styles.slotContainer,
                    isSelected && styles.slotSelected,
                    !hasPhoto && styles.slotEmpty,
                  ]}
                >
                  {hasPhoto ? (
                    <>
                      <Image
                        source={{ uri: photos[index] }}
                        style={styles.slotImage}
                        resizeMode="cover"
                      />
                      {isPrimary && (
                        <View style={styles.slotPrimaryTag}>
                          <Text style={styles.slotPrimaryTagText}>MAIN</Text>
                        </View>
                      )}
                      <View style={styles.slotEditIcon}>
                        <CustomLucidIcons name="pencil" color="#FFFFFF" size={9} />
                      </View>
                    </>
                  ) : (
                    <View style={styles.emptySlotContent}>
                      <View style={styles.emptyPlusIcon}>
                        <CustomLucidIcons name="plus" color={HEADER_COLOR} size={16} />
                      </View>
                      <Text style={styles.emptySlotLabel}>Add</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Photo Tip Banner */}
          <View style={styles.photoTipCard}>
            <CustomLucidIcons name="sparkles" color={HEADER_COLOR} size={15} />
            <Text style={styles.photoTipText}>
              Profiles with 3+ photos receive up to <Text style={styles.photoTipBold}>8x more matches</Text> & responses!
            </Text>
          </View>
        </View>

        {/* Action Buttons Strip */}
        <View style={styles.actionStrip}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleActionStripPress('alternate_phone')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="phone" color="#4CAF50" size={19} />
            <Text style={styles.actionLabel}>
              {alternatePhone ? 'EDIT ALTERNATE' : 'ADD ALTERNATE'}{'\n'}NUMBER
            </Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleActionStripPress('email')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="mail" color="#4CAF50" size={19} />
            <Text style={styles.actionLabel}>REGISTERED{'\n'}EMAIL</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleActionStripPress('horoscope')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="orbit" color="#4CAF50" size={19} />
            <Text style={styles.actionLabelSingle}>
              {hasHoroscope ? 'VIEW HOROSCOPE' : 'ADD HOROSCOPE'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================================= */}
        {/* SECTION 1: Personal Information */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.categoryTitle}>Personal Information</Text>

          {/* A Few Lines About Myself */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('A Few Lines About Myself')}
            <Text style={bioValue ? styles.bioText : styles.notSpecifiedText}>
              {bioValue || 'Not Specified'}
            </Text>
          </View>

          {/* Basic Details */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Basic Details')}
            {[
              { label: 'Age', value: profile?.age ? `${profile.age} Yrs` : 'Not Specified' },
              {
                label: 'Height',
                value: profile?.height
                  ? `${Math.floor(Number(profile.height) / 30.48)} ft ${Math.round(
                    (Number(profile.height) % 30.48) / 2.54,
                  )} in`
                  : 'Not Specified',
              },
              {
                label: 'Marital Status',
                value:
                  profile?.maritalStatus === 'NEVER_MARRIED'
                    ? 'Unmarried'
                    : profile?.maritalStatus || 'Unmarried',
              },
              { label: 'Mother Tongue', value: profile?.motherTongue || 'Sindhi' },
              { label: 'Country', value: savedValues['Country'] || profile?.location?.country || profile?.country || 'India' },
              { label: 'State', value: savedValues['State'] || profile?.location?.state || profile?.state || 'Not Specified' },
              { label: 'City', value: savedValues['City'] || profile?.location?.city || profile?.city || 'Not Specified' },
              { label: 'Citizenship', value: savedValues['Citizenship'] || profile?.citizenship || profile?.location?.country || profile?.country || 'India' },
            ].map(renderDetailRow)}
          </View>

          {/* Professional Details */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Professional Details')}
            {[
              {
                label: 'Education',
                value:
                  savedValues['Education'] ||
                  profile?.education?.degree ||
                  profile?.education ||
                  'Not Specified',
              },
              {
                label: 'Occupation',
                value:
                  savedValues['Occupation'] ||
                  profile?.profession?.occupation ||
                  profile?.occupation ||
                  'Not Specified',
              },
              {
                label: 'Employed In',
                value:
                  savedValues['Employed In'] ||
                  profile?.profession?.companyName ||
                  'Not Specified',
              },
              {
                label: 'Annual Income',
                value:
                  savedValues['Annual Income'] ||
                  (typeof profile?.profession?.annualIncome === 'number'
                    ? `₹${profile.profession.annualIncome / 100000} Lakhs`
                    : profile?.profession?.annualIncome ||
                    profile?.annualIncome ||
                    'Not Specified'),
              },
            ].map(renderDetailRow)}
          </View>

          {/* Religious Information */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Religious Information')}
            {[
              {
                label: 'Caste/Division',
                value: savedValues['Caste/Division'] || profile?.caste || profile?.religion || 'Sindhi',
              },
              {
                label: 'Subcaste',
                value: savedValues['Subcaste'] || profile?.subcaste || 'Sindhi',
              },
              { label: 'Star', value: savedValues['Star'] || profile?.star || profile?.nakshatra || profile?.horoscope?.star || 'Not Specified' },
              { label: 'Raasi', value: savedValues['Raasi'] || profile?.raasi || profile?.rashi || profile?.horoscope?.rashi || 'Not Specified' },
              { label: 'Gothra', value: savedValues['Gothra'] || profile?.gotra || profile?.gothra || 'Not Specified' },
              {
                label: 'Manglik',
                value:
                  savedValues['Manglik'] ||
                  (profile?.manglik === 'MANGLIK'
                    ? 'Yes'
                    : profile?.manglik === 'NON_MANGLIK'
                      ? 'No'
                      : profile?.manglik || 'Not Specified'),
              },
            ].map(renderDetailRow)}
          </View>

          {/* Hobbies & Interests */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Hobbies & Interests')}
            <Text style={hobbiesValue ? styles.bioText : styles.notSpecifiedText}>
              {hobbiesValue || 'Not Specified'}
            </Text>
          </View>

          {/* Habits */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Habits')}
            {[
              {
                label: 'Eating Habits',
                value:
                  savedValues['Eating Habits'] ||
                  profile?.diet ||
                  profile?.habits?.eating ||
                  profile?.eatingHabits ||
                  'Not Specified',
              },
              {
                label: 'Smoking Habits',
                value:
                  savedValues['Smoking Habits'] ||
                  profile?.smoking ||
                  profile?.habits?.smoking ||
                  profile?.smokingHabits ||
                  'Non-smoker',
              },
              {
                label: 'Drinking Habits',
                value:
                  savedValues['Drinking Habits'] ||
                  profile?.drinking ||
                  profile?.habits?.drinking ||
                  profile?.drinkingHabits ||
                  'Non-drinker',
              },
            ].map(renderDetailRow)}
          </View>

          {/* Trust Badge */}
          <View style={styles.subSectionBlock}>
            <View style={styles.subSectionHeader}>
              <Text style={styles.subSectionTitle}>Trust Badge</Text>
              <View style={styles.trustBadgeCircle}>
                <CustomLucidIcons name="check" size={16} color="#0288D1" strokeWidth={2.5} />
              </View>
            </View>
            <View style={styles.trustVerificationRow}>
              <CustomLucidIcons name="check" size={15} color="#10B981" strokeWidth={3} />
              <Text style={styles.trustVerificationTitle}>Contact Verification</Text>
            </View>
            <Text style={styles.trustSubtext}>Primary mobile verified ({primaryPhone})</Text>
            {alternatePhone ? (
              <Text style={[styles.trustSubtext, { marginTop: 4, color: '#374151' }]}>
                Alternate mobile: {alternatePhone}
              </Text>
            ) : null}
            <Text style={styles.trustExplanation}>
              We have verified the mobile number provided by the user.
            </Text>
          </View>

          {/* Family Details */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Family Details', handleOpenFamilyModal)}
            {[
              { label: 'Family Value', value: familyDetails.familyValue || 'Moderate' },
              { label: 'Family Type', value: familyDetails.familyType || 'Nuclear family' },
              { label: 'Family Status', value: familyDetails.familyStatus || 'Upper middle class' },
              { label: "Father's Occupation", value: familyDetails.fatherOccupation || 'Passed Away' },
              { label: "Mother's Occupation", value: familyDetails.motherOccupation || 'Homemaker' },
              { label: 'Family Origin', value: familyDetails.familyOrigin || 'Not Specified' },
              { label: 'No. of Brothers', value: familyDetails.noOfBrothers || 'None' },
              { label: 'No. of Sisters', value: familyDetails.noOfSisters || 'None' },
              { label: 'Brothers Married', value: familyDetails.brothersMarried || 'None' },
              { label: 'Sisters Married', value: familyDetails.sistersMarried || 'None' },
            ].map(renderDetailRow)}
          </View>

          {/* About my family */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('About my family')}
            <Text style={aboutFamilyValue ? styles.bioText : styles.notSpecifiedText}>
              {aboutFamilyValue || 'Not Specified'}
            </Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* SECTION 2: Partner Preference */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePartnerPreferenceNavigation}
            style={styles.categoryHeaderWithButton}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.categoryTitle}>Partner Preference</Text>
              <CustomLucidIcons name="chevron-right" size={17} color="#DB2F3C" style={{ marginLeft: 4 }} />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCompulsoryFilters}
              style={styles.compulsoryFiltersBtn}
            >
              <Text style={styles.compulsoryFiltersText}>Compulsory Filters</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* A Few Lines About My Partner */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('A Few Lines About My Partner', handlePartnerPreferenceNavigation)}
            <Text style={styles.notSpecifiedText}>
              {savedValues['A Few Lines About My Partner'] || 'Not Specified'}
            </Text>
          </View>

          {/* Basic Details (Partner Preference) */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Basic Details', handlePartnerPreferenceNavigation)}
            {[
              { label: 'Age', value: getPreferenceValue(partnerPrefs, 'age', 'Any') },
              { label: 'Height', value: getPreferenceValue(partnerPrefs, 'height', 'Any') },
              { label: 'Marital Status', value: getPreferenceValue(partnerPrefs, 'maritalStatus', 'Any') },
              { label: 'Physical Status', value: getPreferenceValue(partnerPrefs, 'physicalStatus', 'Any') },
              { label: 'Mother Tongue', value: getPreferenceValue(partnerPrefs, 'motherTongue', 'Sindhi') },
            ].map(renderDetailRow)}
          </View>

          {/* Religious Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Religious Preference', handlePartnerPreferenceNavigation)}
            {[
              { label: 'Gothra', value: getPreferenceValue(partnerPrefs, 'gothra', 'Any') },
              { label: 'Manglik', value: getPreferenceValue(partnerPrefs, 'manglik', "Doesn't matter") },
            ].map(renderDetailRow)}
          </View>

          {/* Professional Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Professional Preference', handlePartnerPreferenceNavigation)}
            {[
              {
                label: 'Education',
                value: getPreferenceValue(
                  partnerPrefs,
                  'education',
                  'Any',
                ),
              },
              { label: 'Employed In', value: getPreferenceValue(partnerPrefs, 'employedIn', 'Any') },
              { label: 'Occupation', value: getPreferenceValue(partnerPrefs, 'occupation', 'Any') },
              { label: 'Annual Income', value: getPreferenceValue(partnerPrefs, 'annualIncome', 'Any') },
            ].map(renderDetailRow)}
          </View>

          {/* Location Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Location Preference', handlePartnerPreferenceNavigation)}
            {[
              { label: 'Country', value: getPreferenceValue(partnerPrefs, 'country', 'India') },
              { label: 'State', value: getPreferenceValue(partnerPrefs, 'state', 'Any') },
              { label: 'District/City', value: getPreferenceValue(partnerPrefs, 'districtCity', 'Any') },
              { label: 'Citizenship', value: getPreferenceValue(partnerPrefs, 'citizenship', 'Any') },
            ].map(renderDetailRow)}
          </View>

          {/* Habits Preferences */}
          <View style={[styles.subSectionBlock, styles.lastSubSection]}>
            {renderSubSectionHeader('Habits Preferences', handlePartnerPreferenceNavigation)}
            {[
              { label: 'Eating Habits', value: getPreferenceValue(partnerPrefs, 'eatingHabits', 'Any') },
              { label: 'Drinking Habits', value: getPreferenceValue(partnerPrefs, 'drinkingHabits', "Doesn't matter") },
              { label: 'Smoking Habits', value: getPreferenceValue(partnerPrefs, 'smokingHabits', "Doesn't matter") },
            ].map(renderDetailRow)}
          </View>
        </View>
      </ScrollView>

      {/* Edit Section Bottom Sheet / Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!activeEditSection}
        onRequestClose={() => setActiveEditSection(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>
                {activeEditSection === 'Alternate Mobile Number'
                  ? (alternatePhone ? 'Edit Alternate Number' : 'Add Alternate Number')
                  : `Edit ${activeEditSection}`}
              </Text>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setActiveEditSection(null)}
              >
                <CustomLucidIcons name="x" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            {activeEditSection === 'Alternate Mobile Number' && (
              <View style={styles.primaryInfoBanner}>
                <CustomLucidIcons name="info" size={15} color="#4B5563" />
                <Text style={styles.primaryInfoText}>
                  Primary Login: <Text style={styles.primaryInfoBold}>{primaryPhone}</Text> (Cannot be edited)
                </Text>
              </View>
            )}

            <TextInput
              style={activeEditSection === 'Alternate Mobile Number' ? styles.modalInputSingle : styles.modalInput}
              multiline={activeEditSection !== 'Alternate Mobile Number'}
              numberOfLines={activeEditSection === 'Alternate Mobile Number' ? 1 : 4}
              keyboardType={activeEditSection === 'Alternate Mobile Number' ? 'phone-pad' : 'default'}
              maxLength={activeEditSection === 'Alternate Mobile Number' ? 15 : undefined}
              placeholder={
                activeEditSection === 'Alternate Mobile Number'
                  ? 'Enter 10-digit alternate mobile number...'
                  : `Update ${activeEditSection}...`
              }
              placeholderTextColor="#9E9E9E"
              value={editingValue}
              onChangeText={setEditingValue}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSaveEdit}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* 1. EDIT FAMILY DETAILS MODAL                                              */}
      {/* ========================================================================= */}
      <Modal
        visible={isFamilyModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFamilyModalVisible(false)}
      >
        <SafeAreaView style={styles.familyModalContainer}>
          {/* Header */}
          <View style={styles.familyModalHeader}>
            <TouchableOpacity
              onPress={() => setIsFamilyModalVisible(false)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <CustomLucidIcons name="x" size={24} color="#333333" />
            </TouchableOpacity>
            <Text style={styles.familyModalTitle}>Edit Family Details</Text>
            <TouchableOpacity onPress={handleSaveFamilyDetails} activeOpacity={0.7}>
              <Text style={styles.familyModalSaveHeaderBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.familyModalScroll}
            contentContainerStyle={styles.familyModalScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Family Value */}
            <Text style={styles.formLabel}>Family Value</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'familyValue' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('familyValue')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.familyValue || 'Select Family Value'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'familyValue' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'familyValue' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('familyValue', FAMILY_VALUES)}

            {/* 2. Family Type */}
            <Text style={styles.formLabel}>Family Type</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'familyType' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('familyType')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.familyType || 'Select Family Type'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'familyType' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'familyType' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('familyType', FAMILY_TYPES)}

            {/* 3. Family Status */}
            <Text style={styles.formLabel}>Family Status</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'familyStatus' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('familyStatus')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.familyStatus || 'Select Family Status'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'familyStatus' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'familyStatus' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('familyStatus', FAMILY_STATUSES)}

            {/* 4. Father's Occupation */}
            <Text style={styles.formLabel}>Father's Occupation</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. Businessman, Doctor, Retired, Passed Away"
              placeholderTextColor="#9E9E9E"
              value={familyFormData.fatherOccupation}
              onChangeText={val => setFamilyFormData((prev: FamilyDetailsData) => ({ ...prev, fatherOccupation: val }))}
            />

            {/* 5. Mother's Occupation */}
            <Text style={styles.formLabel}>Mother's Occupation</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. Homemaker, Teacher, Doctor"
              placeholderTextColor="#9E9E9E"
              value={familyFormData.motherOccupation}
              onChangeText={val => setFamilyFormData((prev: FamilyDetailsData) => ({ ...prev, motherOccupation: val }))}
            />

            {/* 6. Family Origin */}
            <Text style={styles.formLabel}>Family Origin / Native Place</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="e.g. Maharashtra, Sindh, Gujarat"
              placeholderTextColor="#9E9E9E"
              value={familyFormData.familyOrigin}
              onChangeText={val => setFamilyFormData((prev: FamilyDetailsData) => ({ ...prev, familyOrigin: val }))}
            />

            {/* 7. No. of Brothers (Numbers Dropdown) */}
            <Text style={styles.formLabel}>No. of Brothers</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'noOfBrothers' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('noOfBrothers')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.noOfBrothers || 'None'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'noOfBrothers' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'noOfBrothers' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('noOfBrothers', SIBLING_COUNTS)}

            {/* 8. No. of Sisters (Numbers Dropdown) */}
            <Text style={styles.formLabel}>No. of Sisters</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'noOfSisters' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('noOfSisters')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.noOfSisters || 'None'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'noOfSisters' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'noOfSisters' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('noOfSisters', SIBLING_COUNTS)}

            {/* 9. Brothers Married (Numbers Dropdown) */}
            <Text style={styles.formLabel}>Brothers Married</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'brothersMarried' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('brothersMarried')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.brothersMarried || 'None'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'brothersMarried' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'brothersMarried' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('brothersMarried', MARRIED_COUNTS)}

            {/* 10. Sisters Married (Numbers Dropdown) */}
            <Text style={styles.formLabel}>Sisters Married</Text>
            <TouchableOpacity
              style={[styles.dropdownTrigger, activeDropdown === 'sistersMarried' && styles.dropdownTriggerActive]}
              onPress={() => toggleDropdown('sistersMarried')}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownTriggerText}>{familyFormData.sistersMarried || 'None'}</Text>
              <CustomLucidIcons
                name={activeDropdown === 'sistersMarried' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={activeDropdown === 'sistersMarried' ? HEADER_COLOR : '#757575'}
              />
            </TouchableOpacity>
            {renderCustomDropdown('sistersMarried', MARRIED_COUNTS)}

            {/* Save Button */}
            <TouchableOpacity
              style={styles.familySaveButton}
              activeOpacity={0.8}
              onPress={handleSaveFamilyDetails}
            >
              <Text style={styles.familySaveButtonText}>Save Family Details</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Reusable Bottom Sheet Photo Picker Modal */}
      <PhotoPickerModal
        isVisible={photoPickerVisible}
        onClose={() => setPhotoPickerVisible(false)}
        isExistingPhoto={targetSlotIndex !== null && targetSlotIndex < photos.length}
        isPrimary={targetSlotIndex === 0}
        title={
          targetSlotIndex !== null && targetSlotIndex < photos.length
            ? targetSlotIndex === 0
              ? 'Main Profile Photo'
              : `Photo ${targetSlotIndex + 1}`
            : 'Upload Photo'
        }
        subtitle={
          targetSlotIndex !== null && targetSlotIndex < photos.length
            ? 'Update, replace or remove this photo'
            : 'Choose an option to add profile photos'
        }
        onSelectCamera={openCameraPicker}
        onSelectGallery={openGalleryPicker}
        onSetPrimary={handleSetPrimary}
        onDeletePhoto={handleDeletePhoto}
      />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: HEADER_COLOR,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: HEADER_COLOR,
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 18,
    marginLeft: 12,
  },
  scrollContent: {
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
    paddingBottom: 40,
  },
  photoContainer: {
    alignItems: 'center',
    backgroundColor: '#1E2530',
    height: 270,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  heroAvatarImage: {
    height: '100%',
    width: '100%',
  },
  heroFallbackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarCircle: {
    alignItems: 'center',
    backgroundColor: '#2D3748',
    borderColor: '#4A5568',
    borderRadius: 65,
    borderWidth: 2,
    height: 130,
    justifyContent: 'center',
    width: 130,
  },
  heroFallbackText: {
    color: '#94A3B8',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
    marginTop: 10,
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 14,
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 10,
  },
  mainBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mainBadgeText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
  },
  heroScrollView: {
    height: 270,
    width: '100%',
  },
  heroDotsContainer: {
    alignItems: 'center',
    bottom: 58,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 9,
  },
  heroDot: {
    borderRadius: 3,
    height: 5,
  },
  heroActiveDot: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  heroInactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    width: 5,
  },
  heroBottomOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    bottom: 0,
    height: 70,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  addPhotoButton: {
    alignItems: 'center',
    backgroundColor: HEADER_COLOR,
    borderRadius: 22,
    bottom: 16,
    elevation: 4,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 9,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  galleryCard: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EDEDED',
    borderBottomWidth: 1,
    paddingBottom: 14,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  galleryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  galleryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  galleryTitle: {
    color: '#1E293B',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  galleryAddLink: {
    color: HEADER_COLOR,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13,
  },
  slotsRow: {
    gap: 10,
    paddingRight: 8,
    paddingVertical: 2,
  },
  slotContainer: {
    borderColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    height: 72,
    overflow: 'hidden',
    position: 'relative',
    width: 68,
  },
  slotSelected: {
    borderColor: HEADER_COLOR,
    borderWidth: 2,
  },
  slotEmpty: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  slotImage: {
    height: '100%',
    width: '100%',
  },
  slotPrimaryTag: {
    backgroundColor: HEADER_COLOR,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    paddingVertical: 2,
  },
  slotPrimaryTagText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 8,
    textAlign: 'center',
  },
  slotEditIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    position: 'absolute',
    right: 3,
    top: 3,
    width: 16,
  },
  emptySlotContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyPlusIcon: {
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 13,
    height: 26,
    justifyContent: 'center',
    marginBottom: 3,
    width: 26,
  },
  emptySlotLabel: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
  },
  photoTipCard: {
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoTipText: {
    color: '#9F1239',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11.5,
    lineHeight: 16,
  },
  photoTipBold: {
    fontFamily: fontFamily.Inter18Bold,
  },
  actionStrip: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EBEBEB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 72,
  },
  actionColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionDivider: {
    backgroundColor: '#EEEEEE',
    height: '60%',
    marginVertical: 'auto',
    width: 1,
  },
  actionLabel: {
    color: '#333333',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  actionLabelSingle: {
    color: '#333333',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 10.5,
    marginTop: 6,
    textAlign: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  categoryTitle: {
    color: '#DB2F3C',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 19,
    marginBottom: 16,
  },
  categoryHeaderWithButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 10,
  },
  compulsoryFiltersBtn: {
    borderColor: '#00BCD4',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  compulsoryFiltersText: {
    color: '#00BCD4',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  subSectionBlock: {
    marginBottom: 24,
  },
  lastSubSection: {
    marginBottom: 12,
  },
  subSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subSectionTitle: {
    color: '#1A1A1A',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 17,
  },
  bioText: {
    color: '#2A2A2A',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13.5,
    lineHeight: 21,
    marginTop: 4,
  },
  detailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#222222',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    width: 130,
  },
  detailValueWrap: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
  },
  detailColon: {
    color: '#222222',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
  },
  detailValue: {
    color: '#222222',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    lineHeight: 20,
  },
  moreLink: {
    color: '#0288D1',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
  },
  notSpecifiedText: {
    color: '#222222',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    marginTop: 4,
  },
  trustBadgeCircle: {
    alignItems: 'center',
    borderColor: '#0288D1',
    borderRadius: 14,
    borderWidth: 1.5,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  trustVerificationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  trustVerificationTitle: {
    color: '#222222',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
  },
  trustSubtext: {
    color: '#71717A',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    marginLeft: 23,
    marginTop: 2,
  },
  trustExplanation: {
    color: '#333333',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
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
    elevation: 8,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
  },
  modalInput: {
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111827',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    height: 100,
    marginBottom: 20,
    padding: 12,
    textAlignVertical: 'top',
  },
  modalInputSingle: {
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111827',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    height: 48,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  primaryInfoBanner: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryInfoText: {
    color: '#4B5563',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    marginLeft: 8,
  },
  primaryInfoBold: {
    color: '#111827',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  modalSaveButton: {
    alignItems: 'center',
    backgroundColor: HEADER_COLOR,
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  // Family Edit Modal Styles
  familyModalContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  familyModalHeader: {
    alignItems: 'center',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  familyModalTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
  },
  familyModalSaveHeaderBtn: {
    color: HEADER_COLOR,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  familyModalScroll: {
    flex: 1,
  },
  familyModalScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },
  formLabel: {
    color: '#4B5563',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  dropdownTrigger: {
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  dropdownTriggerActive: {
    borderColor: HEADER_COLOR,
    backgroundColor: '#FFFFFF',
  },
  dropdownTriggerText: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownMenuItem: {
    alignItems: 'center',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownMenuItemSelected: {
    backgroundColor: '#FFF5F5',
  },
  dropdownMenuText: {
    color: '#374151',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
  },
  dropdownMenuTextSelected: {
    color: HEADER_COLOR,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  textInputField: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 14,
  },
  familySaveButton: {
    alignItems: 'center',
    backgroundColor: HEADER_COLOR,
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    marginTop: 24,
  },
  familySaveButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
});

