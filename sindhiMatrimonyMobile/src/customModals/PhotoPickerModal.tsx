import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomLucidIcons from '../components/CustomLucidIcons';
import fontFamily from '../components/fontFamily';

export interface PhotoPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  isExistingPhoto?: boolean;
  isPrimary?: boolean;
  onSetPrimary?: () => void;
  onDeletePhoto?: () => void;
}

const PRIMARY_COLOR = '#DB2F3C';

export const PhotoPickerModal: React.FC<PhotoPickerModalProps> = memo(({
  isVisible,
  onClose,
  title,
  subtitle,
  onSelectCamera,
  onSelectGallery,
  isExistingPhoto = false,
  isPrimary = false,
  onSetPrimary,
  onDeletePhoto,
}) => {
  const modalTitle = title || (isExistingPhoto ? 'Manage Photo' : 'Upload Photo');
  const modalSubtitle = subtitle || (isExistingPhoto ? 'Update, replace or remove this photo' : 'Choose an option to add profile photos');

  const handleCamera = () => {
    onClose();
    setTimeout(onSelectCamera, 250);
  };

  const handleGallery = () => {
    onClose();
    setTimeout(onSelectGallery, 250);
  };

  const handleSetPrimary = () => {
    onClose();
    if (onSetPrimary) {
      setTimeout(onSetPrimary, 250);
    }
  };

  const handleDelete = () => {
    onClose();
    if (onDeletePhoto) {
      setTimeout(onDeletePhoto, 250);
    }
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
        {/* Top Drag Indicator */}
        <View style={styles.dragHandle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>{modalTitle}</Text>
            <Text style={styles.subtitle}>{modalSubtitle}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.closeButton}
          >
            <CustomLucidIcons name="x" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {/* Camera Option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCamera}
            style={styles.optionItem}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
              <CustomLucidIcons name="camera" size={20} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionDescription}>Capture a picture using your camera</Text>
            </View>
            <CustomLucidIcons name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          {/* Gallery Option */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGallery}
            style={styles.optionItem}
          >
            <View style={[styles.iconWrap, { backgroundColor: '#EFF6FF' }]}>
              <CustomLucidIcons name="image" size={20} color="#2563EB" />
            </View>
            <View style={styles.optionTextWrap}>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionDescription}>Select an existing image from device</Text>
            </View>
            <CustomLucidIcons name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          {/* Set as Primary Option (for existing non-primary photos) */}
          {isExistingPhoto && !isPrimary && onSetPrimary && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSetPrimary}
              style={styles.optionItem}
            >
              <View style={[styles.iconWrap, { backgroundColor: '#FEF3C7' }]}>
                <CustomLucidIcons name="star" size={20} color="#D97706" />
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Set as Primary</Text>
                <Text style={styles.optionDescription}>Show this as your main profile photo</Text>
              </View>
              <CustomLucidIcons name="chevron-right" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          )}

          {/* Delete Photo Option (for existing photos) */}
          {isExistingPhoto && onDeletePhoto && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDelete}
              style={[styles.optionItem, styles.deleteOptionItem]}
            >
              <View style={[styles.iconWrap, { backgroundColor: '#FFE4E6' }]}>
                <CustomLucidIcons name="trash-2" size={19} color="#E11D48" />
              </View>
              <View style={styles.optionTextWrap}>
                <Text style={[styles.optionTitle, { color: '#E11D48' }]}>Delete Photo</Text>
                <Text style={styles.optionDescription}>Remove this photo from your profile</Text>
              </View>
              <CustomLucidIcons name="chevron-right" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          )}
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

export default PhotoPickerModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragHandle: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    height: 4,
    marginBottom: 16,
    width: 38,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: '#0F172A',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  optionsList: {
    gap: 10,
    marginVertical: 4,
  },
  optionItem: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  deleteOptionItem: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FECDD3',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    color: '#1E293B',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  optionDescription: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    marginTop: 2,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 13,
  },
  cancelText: {
    color: '#475569',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
});

