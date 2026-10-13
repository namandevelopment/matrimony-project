import React, { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import { showToast } from '../../utils/CustomToast';

const SUPPORT_NUMBER = '+91 9962043543';
const RAW_SUPPORT_NUMBER = '919962043543';

const VerifyYourProfile = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const handleCallSupport = useCallback(() => {
    const url = `tel:${RAW_SUPPORT_NUMBER}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert('Phone Call', `Please call our support at ${SUPPORT_NUMBER}`);
      })
      .catch(() => {
        Alert.alert('Phone Call', `Please call our support at ${SUPPORT_NUMBER}`);
      });
  }, []);

  const handleStartSelfie = useCallback(() => {
    setModalVisible(false);
    showToast({
      type: 'info',
      message: 'Opening selfie verification camera...',
    });
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={handleBack}
          style={styles.backButton}
        >
          <CustomLucidIcons name="arrow-left" color="#1F2937" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Profile</Text>
        <View style={styles.headerRight}>
          <View style={styles.shieldHeaderIcon}>
            <CustomLucidIcons name="shield-check" color={COLORS.themeColor} size={18} />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Hero Illustration */}
        <View style={styles.heroSection}>
          <View style={styles.illustrationGlow}>
            <View style={styles.illustrationCircle}>
              <View style={styles.avatarCircle}>
                <CustomLucidIcons name="scan-face" color={COLORS.themeColor} size={44} />
              </View>
              {/* Verified Shield Badge */}
              <View style={styles.verifiedBadge}>
                <CustomLucidIcons name="check" color="#FFFFFF" size={16} strokeWidth={3.2} />
              </View>
              {/* Decorative spark */}
              <View style={styles.sparkleBadge}>
                <CustomLucidIcons name="sparkles" color="#F59E0B" size={13} />
              </View>
            </View>
          </View>

          {/* Trust Tag */}
          <View style={styles.trustPill}>
            <CustomLucidIcons name="shield" color="#059669" size={13} />
            <Text style={styles.trustPillText}>100% Secure & Confidential</Text>
          </View>

          <Text style={styles.heading}>Verify the profile using the option below</Text>
          <Text style={styles.subheading}>
            Earn the official verified trust badge to get higher credibility and up to 3x more responses from compatible matches.
          </Text>
        </View>

        {/* Verification Option Card */}
        <View style={styles.optionsSection}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [styles.optionCard, pressed && styles.optionCardPressed]}
          >
            <View style={styles.optionIconContainer}>
              <CustomLucidIcons name="camera" color={COLORS.themeColor} size={24} />
            </View>

            <View style={styles.optionTextContainer}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Verify with a live selfie</Text>
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedBadgeText}>Instant</Text>
                </View>
              </View>
              <Text style={styles.optionSubtitle}>
                Take a quick 10-second selfie to verify yourself and boost your profile visibility.
              </Text>
            </View>

            <View style={styles.chevronWrap}>
              <CustomLucidIcons name="chevron-right" color={COLORS.themeColor} size={18} />
            </View>
          </Pressable>
        </View>

        {/* Why Verify Benefits Card */}
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsHeader}>
            <CustomLucidIcons name="shield-check" color={COLORS.themeColor} size={18} />
            <Text style={styles.benefitsTitle}>Why get your profile verified?</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, styles.benefitIconBoxGreen]}>
              <CustomLucidIcons name="badge-check" color="#059669" size={17} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitName}>Trust & Authenticity</Text>
              <Text style={styles.benefitDescription}>
                Get an official verified badge that builds immediate trust with matches and families.
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconBox, styles.benefitIconBoxRed]}>
              <CustomLucidIcons name="trending-up" color="#E11D48" size={17} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitName}>3x More Responses</Text>
              <Text style={styles.benefitDescription}>
                Verified members stand out in search and receive significantly higher interaction.
              </Text>
            </View>
          </View>

          <View style={[styles.benefitItem, styles.benefitItemLast]}>
            <View style={[styles.benefitIconBox, styles.benefitIconBoxBlue]}>
              <CustomLucidIcons name="lock" color="#2563EB" size={17} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitName}>100% Privacy Protected</Text>
              <Text style={styles.benefitDescription}>
                Your selfie is securely encrypted, only used for photo check, and never shown publicly.
              </Text>
            </View>
          </View>
        </View>

        {/* Help & Support Section */}
        <View style={styles.helpSection}>
          <View style={styles.dashedDivider} />

          <View style={styles.helpCard}>
            <View style={styles.helpHeaderRow}>
              <View style={styles.phoneIconCircle}>
                <CustomLucidIcons name="phone" color={COLORS.themeColor} size={15} />
              </View>
              <Text style={styles.helpTitle}>Need Help? Call us:</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCallSupport}
              style={styles.phoneCallButton}
            >
              <CustomLucidIcons name="phone-call" color="#FFFFFF" size={16} />
              <Text style={styles.phoneNumberText}>{SUPPORT_NUMBER}</Text>
            </TouchableOpacity>

            <View style={styles.hoursRow}>
              <CustomLucidIcons name="clock" color="#6B7280" size={14} />
              <Text style={styles.hoursText}>Working hours (8 AM - 8 PM IST)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Selfie Verification Guide Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <CustomLucidIcons name="camera" color={COLORS.themeColor} size={28} />
            </View>

            <Text style={styles.modalTitle}>Selfie Verification</Text>
            <Text style={styles.modalSubtitle}>
              Please follow these simple guidelines for a smooth verification:
            </Text>

            <View style={styles.modalInstructions}>
              <View style={styles.instructionRow}>
                <CustomLucidIcons name="sun" color="#F59E0B" size={18} />
                <Text style={styles.instructionText}>Ensure adequate lighting on your face</Text>
              </View>
              <View style={styles.instructionRow}>
                <CustomLucidIcons name="smile" color="#10B981" size={18} />
                <Text style={styles.instructionText}>Remove sunglasses, caps, or masks</Text>
              </View>
              <View style={styles.instructionRow}>
                <CustomLucidIcons name="scan-face" color="#3B82F6" size={18} />
                <Text style={styles.instructionText}>Hold your device steady and face the camera</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleStartSelfie}
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryBtnText}>Proceed to Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text style={styles.modalCancelBtnText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VerifyYourProfile;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#F3F4F6',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  headerTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 17,
  },
  headerRight: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  shieldHeaderIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 22,
    marginTop: 6,
  },
  illustrationGlow: {
    alignItems: 'center',
    backgroundColor: '#FFF5F6',
    borderRadius: 65,
    height: 130,
    justifyContent: 'center',
    marginBottom: 14,
    width: 130,
  },
  illustrationCircle: {
    alignItems: 'center',
    backgroundColor: '#FFE8EB',
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    position: 'relative',
    width: 100,
  },
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 38,
    elevation: 2,
    height: 76,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    width: 76,
  },
  verifiedBadge: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 2.5,
    bottom: -2,
    elevation: 3,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    width: 30,
  },
  sparkleBadge: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    justifyContent: 'center',
    left: -4,
    position: 'absolute',
    top: -4,
    width: 24,
  },
  trustPill: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trustPillText: {
    color: '#065F46',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  heading: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 19,
    lineHeight: 27,
    textAlign: 'center',
  },
  subheading: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  optionsSection: {
    marginBottom: 20,
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FFD6DA',
    borderRadius: 16,
    borderWidth: 1.5,
    elevation: 3,
    flexDirection: 'row',
    padding: 16,
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  optionCardPressed: {
    backgroundColor: '#FFFBFB',
    transform: [{ scale: 0.99 }],
  },
  optionIconContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    marginRight: 14,
    width: 48,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  recommendedBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderRadius: 10,
    borderWidth: 0.8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  recommendedBadgeText: {
    color: '#059669',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 10.5,
  },
  optionSubtitle: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 4,
  },
  chevronWrap: {
    alignItems: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginLeft: 10,
    width: 32,
  },
  benefitsCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 22,
    padding: 16,
  },
  benefitsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  benefitsTitle: {
    color: '#1F2937',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  benefitItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 12,
  },
  benefitItemLast: {
    marginBottom: 0,
  },
  benefitIconBox: {
    alignItems: 'center',
    borderRadius: 10,
    height: 32,
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    width: 32,
  },
  benefitIconBoxGreen: {
    backgroundColor: '#ECFDF5',
  },
  benefitIconBoxRed: {
    backgroundColor: '#FFF1F2',
  },
  benefitIconBoxBlue: {
    backgroundColor: '#EFF6FF',
  },
  benefitCopy: {
    flex: 1,
  },
  benefitName: {
    color: '#1F2937',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 13,
  },
  benefitDescription: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  helpSection: {
    marginTop: 4,
  },
  dashedDivider: {
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    marginBottom: 18,
  },
  helpCard: {
    alignItems: 'center',
    backgroundColor: '#FFFBFB',
    borderColor: '#FFE4E6',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  helpHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  phoneIconCircle: {
    alignItems: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  helpTitle: {
    color: '#374151',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
  },
  phoneCallButton: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  phoneNumberText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 15,
    letterSpacing: 0.4,
  },
  hoursRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  hoursText: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 8,
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    width: '100%',
  },
  modalIconWrap: {
    alignItems: 'center',
    backgroundColor: '#FFF0F2',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    width: 56,
  },
  modalTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 18,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center',
  },
  modalInstructions: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginVertical: 18,
    padding: 14,
    width: '100%',
  },
  instructionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginVertical: 6,
  },
  instructionText: {
    color: '#374151',
    flex: 1,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
  },
  modalPrimaryBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 12,
    elevation: 2,
    height: 48,
    justifyContent: 'center',
    shadowColor: COLORS.themeColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '100%',
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 15,
  },
  modalCancelBtn: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  modalCancelBtnText: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 14,
  },
});