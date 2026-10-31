import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../../redux/useSelector';
import Storage from '../../storage/Storage';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { showToast } from '../../utils/CustomToast';
import PhotoPickerModal from '../../customModals/PhotoPickerModal';

const HEADER_COLOR = '#DB2F3C';

interface DetailItem {
  label: string;
  value: string;
  isMore?: boolean;
}

const EditProfile: React.FC = () => {
  const navigation = useNavigation<any>();

  // Profile and photos state
  const storedUser = Storage.getItemSync<any>('user') || {};
  const reduxProfile = useSelector(selectProfile);
  const profile = reduxProfile || storedUser?.profile || storedUser || {};

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

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const openCameraPicker = useCallback(() => {
    try {
      const ImageCropPicker = require('react-native-image-crop-picker').default;
      ImageCropPicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
      })
        .then((image: any) => {
          if (image?.path) {
            setPhotos(prev => {
              if (targetSlotIndex !== null && targetSlotIndex < prev.length) {
                const updated = [...prev];
                updated[targetSlotIndex] = image.path;
                return updated;
              }
              return [image.path, ...prev];
            });
            setSelectedPhotoIndex(targetSlotIndex !== null ? targetSlotIndex : 0);
            setHasImageError(false);
            showToast({ type: 'success', message: 'Photo uploaded successfully' });
          }
        })
        .catch((err: any) => {
          if (err?.code !== 'E_PICKER_CANCELLED') {
            showToast({ type: 'info', message: 'Camera closed' });
          }
        });
    } catch {
      showToast({ type: 'info', message: 'Camera opened' });
    }
  }, [targetSlotIndex]);

  const openGalleryPicker = useCallback(() => {
    try {
      const ImageCropPicker = require('react-native-image-crop-picker').default;
      ImageCropPicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      })
        .then((image: any) => {
          if (image?.path) {
            setPhotos(prev => {
              if (targetSlotIndex !== null && targetSlotIndex < prev.length) {
                const updated = [...prev];
                updated[targetSlotIndex] = image.path;
                return updated;
              }
              return [...prev, image.path];
            });
            setSelectedPhotoIndex(targetSlotIndex !== null ? targetSlotIndex : photos.length);
            setHasImageError(false);
            showToast({ type: 'success', message: 'Photo added successfully' });
          }
        })
        .catch((err: any) => {
          if (err?.code !== 'E_PICKER_CANCELLED') {
            showToast({ type: 'info', message: 'Gallery closed' });
          }
        });
    } catch {
      showToast({ type: 'info', message: 'Gallery opened' });
    }
  }, [targetSlotIndex, photos.length]);

  const handleAddPhoto = useCallback(() => {
    if (photos.length >= 6) {
      showToast({ type: 'info', message: 'Maximum 6 photos allowed' });
      return;
    }
    setTargetSlotIndex(null);
    setPhotoPickerVisible(true);
  }, [photos.length]);

  const handleSlotPress = useCallback(
    (index: number) => {
      if (index < photos.length) {
        setSelectedPhotoIndex(index);
        setHasImageError(false);
        setTargetSlotIndex(index);
        setPhotoPickerVisible(true);
      } else {
        handleAddPhoto();
      }
    },
    [photos.length, handleAddPhoto],
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
    setEditingValue(initialContent || '');
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (activeEditSection) {
      showToast({
        type: 'success',
        message: `${activeEditSection} updated successfully`,
      });
      setActiveEditSection(null);
    }
  }, [activeEditSection]);

  const handleActionStripPress = useCallback((actionName: string) => {
    showToast({
      type: 'info',
      message: `${actionName} opened`,
    });
  }, []);

  const handleCompulsoryFilters = useCallback(() => {
    showToast({
      type: 'info',
      message: 'Compulsory Filters opened',
    });
  }, []);

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
              onPress={() =>
                handleMorePress(
                  'Bachelors - Engineering / Computers / Others, Masters - Science / Engineering',
                )
              }
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
          {photos.length > 0 && photos[selectedPhotoIndex] && !hasImageError ? (
            <Image
              source={{ uri: photos[selectedPhotoIndex] }}
              style={styles.heroAvatarImage}
              resizeMode="cover"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <View style={styles.heroFallbackWrap}>
              <View style={styles.heroAvatarCircle}>
                <CustomLucidIcons name="user" color="#94A3B8" size={72} />
              </View>
              <Text style={styles.heroFallbackText}>No photo added yet</Text>
            </View>
          )}

          {/* Hero Top Badges */}
          <View style={styles.heroTopBar}>
            <View style={styles.mainBadge}>
              <CustomLucidIcons name="star" color="#F59E0B" size={12} />
              <Text style={styles.mainBadgeText}>
                {selectedPhotoIndex === 0 ? 'MAIN PHOTO' : `PHOTO ${selectedPhotoIndex + 1}`}
              </Text>
            </View>

            <View style={styles.countBadge}>
              <CustomLucidIcons name="image" color="#FFFFFF" size={12} />
              <Text style={styles.countBadgeText}>{photos.length}/6</Text>
            </View>
          </View>

          {/* Subtle gradient overlay at bottom for clarity */}
          <View style={styles.heroBottomOverlay} />

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
            onPress={() => handleActionStripPress('Edit Mobile Number')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="phone" color="#4CAF50" size={19} />
            <Text style={styles.actionLabel}>EDIT MOBILE{'\n'}NUMBER</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleActionStripPress('Edit Mail')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="mail" color="#4CAF50" size={19} />
            <Text style={styles.actionLabelSingle}>EDIT MAIL</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleActionStripPress('Add Horoscope')}
            style={styles.actionColumn}
          >
            <CustomLucidIcons name="orbit" color="#4CAF50" size={19} />
            <Text style={styles.actionLabelSingle}>ADD HOROSCOPE</Text>
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
            <Text style={styles.bioText}>
              I’m someone who believes in living life with an open mind and a
              straightforward heart. I don’t like to hide anything—I value honesty
              and clarity in every part of life. I enjoy spending quality time with
              my cousins and brothers; family bonds mean a lot to me. Fitness is a
              big part of who I am—I love bodybuilding, dancing, and singing. Staying
              active keeps me energized and balanced. I have a deep love for animals,
              especially dogs—they hold a special place in my heart. Exploring new
              places and learning about different cultures and histories excites me.
              I’m also very drawn to mythology and history, and I deeply respect our
              elders and the values they carry. My philosophy is simple: “The way...
            </Text>
          </View>

          {/* Basic Details */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Basic Details')}
            {[
              { label: 'Country', value: 'India' },
              { label: 'State', value: 'Madhya Pradesh' },
              { label: 'City', value: 'Indore' },
              { label: 'Citizenship', value: 'India' },
            ].map(renderDetailRow)}
          </View>

          {/* Religious Information */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Religious Information')}
            {[
              {
                label: 'Caste/Division',
                value: 'Kokanastha Maharashtrian Brahmin-kokanastha',
              },
              {
                label: 'Subcaste',
                value: 'Maharashtrian Brahmin-kokanastha',
              },
              { label: 'Star', value: 'Poorvaphalguni' },
              { label: 'Raasi', value: 'Simha (Leo)' },
              { label: 'Gothra', value: 'Shrimukh Shandilya' },
              { label: 'Manglik', value: 'No' },
            ].map(renderDetailRow)}
          </View>

          {/* Hobbies & Interests */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Hobbies & Interests')}
            <Text style={styles.notSpecifiedText}>
              Music, Bodybuilding, Dancing, Travel, Pets
            </Text>
          </View>

          {/* Habits */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Habits')}
            {[
              { label: 'Eating Habits', value: 'Vegetarian' },
              { label: 'Smoking Habits', value: 'Non-smoker' },
              { label: 'Drinking Habits', value: 'Non-drinker' },
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
            <Text style={styles.trustSubtext}>Mobile number verified</Text>
            <Text style={styles.trustExplanation}>
              We have verified the mobile number provided by the user.
            </Text>
          </View>

          {/* Family Details */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Family Details')}
            {[
              { label: 'Family Type', value: 'Nuclear family' },
              { label: 'Family Status', value: 'Upper middle class' },
              { label: "Father's Occupation", value: 'Passed Away' },
              { label: "Mother's Occupation", value: 'Homemaker' },
              { label: 'Family Origin', value: 'Maharashtra' },
              { label: 'No. of Brothers', value: 'None' },
              { label: 'No. of Sisters', value: 'None' },
              { label: 'Brothers Married', value: 'None' },
              { label: 'Sisters Married', value: 'None' },
            ].map(renderDetailRow)}
          </View>

          {/* About my family */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('About my family')}
            <Text style={styles.notSpecifiedText}>Not Specified</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* SECTION 2: Partner Preference */}
        {/* ========================================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.categoryHeaderWithButton}>
            <Text style={styles.categoryTitle}>Partner Preference</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCompulsoryFilters}
              style={styles.compulsoryFiltersBtn}
            >
              <Text style={styles.compulsoryFiltersText}>Compulsory Filters</Text>
            </TouchableOpacity>
          </View>

          {/* A Few Lines About My Partner */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('A Few Lines About My Partner')}
            <Text style={styles.notSpecifiedText}>Not Specified</Text>
          </View>

          {/* Basic Details (Partner Preference) */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Basic Details')}
            {[
              { label: 'Age', value: '24 - 31 Yrs' },
              { label: 'Height', value: '5 ft - 6 ft' },
              { label: 'Marital Status', value: 'Unmarried' },
              { label: 'Physical Status', value: 'Normal' },
              { label: 'Mother Tongue', value: 'Marathi, Konkani' },
            ].map(renderDetailRow)}
          </View>

          {/* Religious Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Religious Preference')}
            {[
              { label: 'Gothra', value: 'Any' },
              { label: 'Manglik', value: "Doesn't matter" },
            ].map(renderDetailRow)}
          </View>

          {/* Professional Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Professional Preference')}
            {[
              {
                label: 'Education',
                value: 'Bachelors - Engineering / Computers / Others, Master...',
                isMore: true,
              },
              { label: 'Employed In', value: 'Any' },
              { label: 'Occupation', value: 'Any' },
              { label: 'Annual Income', value: 'Any' },
            ].map(renderDetailRow)}
          </View>

          {/* Location Preference */}
          <View style={styles.subSectionBlock}>
            {renderSubSectionHeader('Location Preference')}
            {[
              { label: 'Country', value: 'Any' },
              { label: 'Citizenship', value: 'Any' },
            ].map(renderDetailRow)}
          </View>

          {/* Habits Preferences */}
          <View style={[styles.subSectionBlock, styles.lastSubSection]}>
            {renderSubSectionHeader('Habits Preferences')}
            {[
              { label: 'Eating Habits', value: 'Vegetarian, Eggetarian' },
              { label: 'Drinking Habits', value: "Doesn't matter" },
              { label: 'Smoking Habits', value: "Doesn't matter" },
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
              <Text style={styles.modalHeaderTitle}>Edit {activeEditSection}</Text>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setActiveEditSection(null)}
              >
                <CustomLucidIcons name="x" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              multiline={true}
              numberOfLines={4}
              placeholder={`Update ${activeEditSection}...`}
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
});

