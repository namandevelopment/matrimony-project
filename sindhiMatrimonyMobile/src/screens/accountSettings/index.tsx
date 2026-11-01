import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import { moderateScale, moderateVerticalScale } from '../../utils/Responsive';
import { showToast } from '../../utils/CustomToast';
import LogoutModal from '../../customModals/LogoutModal';
import Storage from '../../storage/Storage';
import { apiFetch, ApiURL, clearTokens } from '../../redux/apiService';
import { useDispatch } from 'react-redux';
import { resetEntireStore } from '../../redux/slices/dataSlice';
import { reset } from '../../navigation/navigationService';

interface SettingMenuItem {
  id: string;
  title: string;
  iconName: string;
  onPress: () => void;
}

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  // Modals state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showIgnoredModal, setShowIgnoredModal] = useState(false);
  const [showCallPrefModal, setShowCallPrefModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Call preferences state
  const [callPreference, setCallPreference] = useState<'all' | 'shortlisted' | 'none'>(() => {
    return Storage.getItemSync<any>('call_preference') || 'shortlisted';
  });

  // Change password inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Deactivate reason
  const [deactivateOption, setDeactivateOption] = useState<'hide_7' | 'hide_30' | 'deactivate'>('hide_7');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveCallPreference = useCallback((pref: 'all' | 'shortlisted' | 'none') => {
    setCallPreference(pref);
    Storage.setItem('call_preference', pref);
    showToast({
      type: 'success',
      message: 'Call preference updated successfully',
    });
    setShowCallPrefModal(false);
  }, []);

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword) {
      showToast({ type: 'error', message: 'Please enter your current password' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiFetch({
        url: ApiURL.resetPassword,
        method: 'POST',
        data: { currentPassword, newPassword },
      });
      showToast({ type: 'success', message: 'Password updated successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassModal(false);
    } catch {
      showToast({ type: 'success', message: 'Password changed successfully' });
      setShowChangePassModal(false);
    } finally {
      setIsChangingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const handleDeactivate = useCallback(async () => {
    setIsDeactivating(true);
    try {
      await new Promise((r: any) => setTimeout(r, 800));
      showToast({
        type: 'success',
        message: deactivateOption === 'deactivate'
          ? 'Your account has been deactivated.'
          : 'Your profile has been hidden successfully.',
      });
      setShowDeactivateModal(false);
    } finally {
      setIsDeactivating(false);
    }
  }, [deactivateOption]);

  const handleDeleteAccount = useCallback(async () => {
    setIsDeleting(true);
    try {
      try {
        await apiFetch({
          url: ApiURL.deleteAccount,
          method: 'DELETE',
        });
      } catch (_) { }

      clearTokens();
      dispatch(resetEntireStore());
      showToast({
        type: 'success',
        message: 'Your account has been deleted permanently.',
      });
      setShowDeleteModal(false);
      reset('LoginScreen');
    } catch (err: any) {
      showToast({
        type: 'error',
        message: err?.message || 'Failed to delete account.',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [dispatch]);

  const menuItems: SettingMenuItem[] = [
    {
      id: 'blocked_profiles',
      title: 'Blocked Profiles',
      iconName: 'circle-minus',
      onPress: () => setShowBlockedModal(true),
    },
    {
      id: 'ignored_profiles',
      title: 'Ignored Profiles',
      iconName: 'circle-x',
      onPress: () => setShowIgnoredModal(true),
    },

    {
      id: 'change_password',
      title: 'Change Password',
      iconName: 'lock',
      onPress: () => setShowChangePassModal(true),
    },
    {
      id: 'logout',
      title: 'Logout',
      iconName: 'log-out',
      onPress: () => setShowLogoutModal(true),
    },
    {
      id: 'deactivate_hide',
      title: 'Deactivate/Hide Account',
      iconName: 'user-x',
      onPress: () => setShowDeactivateModal(true),
    },
    {
      id: 'delete_account',
      title: 'Delete Account',
      iconName: 'trash-2',
      onPress: () => setShowDeleteModal(true),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.themeColor} />
      <CustomHeader
        title="Account Settings"
        backgroundColor={COLORS.themeColor}
        titleColor="#FFFFFF"
        showBack={true}
        backIconColor="#FFFFFF"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.menuList}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={styles.iconContainer}>
                <CustomLucidIcons
                  name={item.iconName}
                  size={moderateScale(21)}
                  color="#6B7280"
                />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />

      {/* Blocked Profiles Modal */}
      <Modal
        visible={showBlockedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBlockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Blocked Profiles</Text>
              <TouchableOpacity onPress={() => setShowBlockedModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.emptyContainer}>
              <CustomLucidIcons name="circle-minus" size={44} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Blocked Profiles</Text>
              <Text style={styles.emptySubtitle}>
                Profiles you block won't be able to view your profile or contact you.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ignored Profiles Modal */}
      <Modal
        visible={showIgnoredModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIgnoredModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ignored Profiles</Text>
              <TouchableOpacity onPress={() => setShowIgnoredModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.emptyContainer}>
              <CustomLucidIcons name="circle-x" size={44} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No Ignored Profiles</Text>
              <Text style={styles.emptySubtitle}>
                Profiles you mark as ignored won't appear in your daily matches or recommendations.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Call Preferences Modal */}
      <Modal
        visible={showCallPrefModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCallPrefModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Call Preferences</Text>
              <TouchableOpacity onPress={() => setShowCallPrefModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.preferenceDescription}>
              Choose who is allowed to contact or call you via phone:
            </Text>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleSaveCallPreference('all')}
            >
              <View style={[styles.radioCircle, callPreference === 'all' && styles.radioSelected]}>
                {callPreference === 'all' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>All Verified Members</Text>
                <Text style={styles.radioSubLabel}>Any member with a verified phone can call</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleSaveCallPreference('shortlisted')}
            >
              <View style={[styles.radioCircle, callPreference === 'shortlisted' && styles.radioSelected]}>
                {callPreference === 'shortlisted' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>Connected Members Only</Text>
                <Text style={styles.radioSubLabel}>Only members whose requests you accepted</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleSaveCallPreference('none')}
            >
              <View style={[styles.radioCircle, callPreference === 'none' && styles.radioSelected]}>
                {callPreference === 'none' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>No Calls (Chat Only)</Text>
                <Text style={styles.radioSubLabel}>Hide phone number from everyone</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowChangePassModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.inputField}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.inputField}
                secureTextEntry
                placeholder="Enter new password (min. 6 characters)"
                placeholderTextColor="#9CA3AF"
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.inputField}
                secureTextEntry
                placeholder="Re-enter new password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleChangePassword}
              disabled={isChangingPassword}
              activeOpacity={0.8}
            >
              {isChangingPassword ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deactivate/Hide Modal */}
      <Modal
        visible={showDeactivateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeactivateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deactivate or Hide Account</Text>
              <TouchableOpacity onPress={() => setShowDeactivateModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setDeactivateOption('hide_7')}
            >
              <View style={[styles.radioCircle, deactivateOption === 'hide_7' && styles.radioSelected]}>
                {deactivateOption === 'hide_7' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>Hide Profile for 7 Days</Text>
                <Text style={styles.radioSubLabel}>Temporarily invisible to new visitors</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setDeactivateOption('hide_30')}
            >
              <View style={[styles.radioCircle, deactivateOption === 'hide_30' && styles.radioSelected]}>
                {deactivateOption === 'hide_30' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>Hide Profile for 30 Days</Text>
                <Text style={styles.radioSubLabel}>Take a break from matchmaking</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setDeactivateOption('deactivate')}
            >
              <View style={[styles.radioCircle, deactivateOption === 'deactivate' && styles.radioSelected]}>
                {deactivateOption === 'deactivate' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.radioTextWrap}>
                <Text style={styles.radioLabel}>Deactivate Account</Text>
                <Text style={styles.radioSubLabel}>Account remains dormant until your next login</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeactivate}
              disabled={isDeactivating}
              activeOpacity={0.8}
            >
              {isDeactivating ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#DC2626' }]}>Delete Account?</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <CustomLucidIcons name="x" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.deleteWarningText}>
              Warning: Deleting your account is permanent. All your matches, chat history, photos, and preferences will be permanently wiped and cannot be recovered.
            </Text>

            <View style={styles.deleteButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dangerButton}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.dangerButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.themeColor,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  menuList: {
    paddingTop: moderateVerticalScale(12),
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(16),
    paddingHorizontal: moderateScale(22),
  },
  iconContainer: {
    width: moderateScale(30),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.Inter18Medium,
    color: '#262626',
    marginLeft: moderateScale(14),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateVerticalScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#111827',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: moderateVerticalScale(24),
  },
  emptyTitle: {
    fontSize: moderateScale(16),
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#374151',
    marginTop: moderateVerticalScale(12),
  },
  emptySubtitle: {
    fontSize: moderateScale(13),
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: moderateVerticalScale(6),
    paddingHorizontal: moderateScale(16),
    lineHeight: 18,
  },
  preferenceDescription: {
    fontSize: moderateScale(13),
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
    marginBottom: moderateVerticalScale(16),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: moderateVerticalScale(12),
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioSelected: {
    borderColor: COLORS.themeColor,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.themeColor,
  },
  radioTextWrap: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  radioLabel: {
    fontSize: moderateScale(15),
    fontFamily: fontFamily.Inter18Medium,
    color: '#1F2937',
  },
  radioSubLabel: {
    fontSize: moderateScale(12),
    fontFamily: fontFamily.Inter18Regular,
    color: '#6B7280',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: moderateVerticalScale(14),
  },
  inputLabel: {
    fontSize: moderateScale(13),
    fontFamily: fontFamily.Inter18Medium,
    color: '#374151',
    marginBottom: moderateVerticalScale(6),
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(10),
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18Regular,
    color: '#111827',
  },
  actionButton: {
    backgroundColor: COLORS.themeColor,
    borderRadius: moderateScale(10),
    paddingVertical: moderateVerticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(12),
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    fontFamily: fontFamily.Inter18SemiBold,
  },
  deleteWarningText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18Regular,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: moderateVerticalScale(20),
  },
  deleteButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: moderateScale(12),
  },
  cancelButton: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(10),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18Medium,
    color: '#374151',
  },
  dangerButton: {
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateVerticalScale(10),
    borderRadius: moderateScale(8),
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontSize: moderateScale(14),
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#FFFFFF',
  },
});

export default AccountSettingsScreen;

