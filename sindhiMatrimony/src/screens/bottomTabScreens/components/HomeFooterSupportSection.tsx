import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { clientPhoneNumber } from '../../../utils/ClientData';
import { showToast } from '../../../utils/CustomToast';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

interface HomeFooterSupportSectionProps {
  appName?: string;
  phoneNumber?: string;
  onKnowMore?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const HomeFooterSupportSection: React.FC<HomeFooterSupportSectionProps> =
  React.memo(
    ({
      appName = 'SindhiMatrimony',
      phoneNumber = clientPhoneNumber || '9672446220',
      onKnowMore,
      containerStyle,
    }) => {
      const navigation = useNavigation<any>();

      // Direct phone call handler directly inside the component
      const handleCallNow = useCallback(() => {
        const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
        const fullNumber = cleanedNumber.startsWith('+') ? cleanedNumber : `+91${cleanedNumber}`;
        Linking.openURL(`tel:${fullNumber}`).catch(() => {
          showToast({
            type: 'error',
            message: `Unable to open dialer. Support number: ${fullNumber}`,
          });
        });
      }, [phoneNumber]);

      // Direct chat handler inside the component
      const handleChatWithUs = useCallback(() => {
        // Option 1: Open WhatsApp support directly if available, fallback to HelpCenter
        const whatsappUrl = `https://wa.me/91${phoneNumber}?text=Hello%20${appName}%20Support,%20I%20need%20assistance.`;
        Linking.canOpenURL(whatsappUrl)
          .then(supported => {
            if (supported) {
              return Linking.openURL(whatsappUrl);
            } else {
              navigation.navigate('HelpCenter');
            }
          })
          .catch(() => {
            navigation.navigate('HelpCenter');
          });
      }, [appName, phoneNumber, navigation]);

      // Wedding planning know more handler
      const handleKnowMore = useCallback(() => {
        if (onKnowMore) {
          onKnowMore();
        } else {
          // Open wedding services info or external portal
          const url = 'https://www.weddingbazaar.com';
          Linking.openURL(url).catch(() => {
            showToast({
              type: 'info',
              message: 'Exploring wedding services & vendors...',
            });
          });
        }
      }, [onKnowMore]);

      return (
        <View style={[styles.container, containerStyle]}>
          {/* =========================================================================
              CARD 1: INDIA'S LARGEST WEDDING PLANNING PLATFORM
          ========================================================================== */}
          <View style={styles.card}>
            {/* Title */}
            <Text style={styles.cardTitle}>
              India's Largest Wedding Planning Platform
            </Text>

            {/* Features Checklist */}
            <View style={styles.featuresList}>
              {/* Feature 1 */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons
                    name="store"
                    size={17}
                    color="#EE5559"
                  />
                </View>
                <Text style={styles.featureText}>
                  <Text style={styles.featureBold}>
                    Photographers, Makeup artists, Caterers
                  </Text>{' '}
                  and more. Hire best vendors!
                </Text>
              </View>

              {/* Feature 2 */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons
                    name="users"
                    size={17}
                    color="#EE5559"
                  />
                </View>
                <Text style={styles.featureText}>
                  <Text style={styles.featureBold}>
                    Trusted wedding market place
                  </Text>{' '}
                  from matrimony.com group
                </Text>
              </View>

              {/* Feature 3 */}
              <View style={[styles.featureItem, { marginBottom: 0 }]}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons
                    name="award"
                    size={17}
                    color="#EE5559"
                  />
                </View>
                <Text style={styles.featureText}>
                  <Text style={styles.featureBold}>
                    2.8 Lakh+ trusted vendors
                  </Text>{' '}
                  across 40+ cities
                </Text>
              </View>
            </View>

            {/* "Know more" Solid Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleKnowMore}
              style={styles.knowMoreBtn}
              accessibilityRole="button"
              accessibilityLabel="Know more about wedding planning platform"
            >
              <Text style={styles.knowMoreText}>Know more</Text>
            </TouchableOpacity>
          </View>

          {/* =========================================================================
              CARD 2: NEED HELP IN USING SINDHI MATRIMONY?
          ========================================================================== */}
          <View style={styles.card}>
            {/* Centered Title */}
            <Text style={styles.helpTitle}>
              Need help in using{'\n'}
              <Text style={styles.appNameHighlight}>{appName}?</Text>
            </Text>

            {/* Subtitle */}
            <Text style={styles.helpSubtitle}>
              Reach out to us on this number or chat with us
            </Text>

            {/* Two Action Buttons: Call now & Chat with us */}
            <View style={styles.buttonsRow}>
              {/* Call Now Button */}
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={handleCallNow}
                style={styles.actionBtn}
                accessibilityRole="button"
                accessibilityLabel="Call customer support now"
              >
                <View style={styles.btnInner}>
                  <CustomLucidIcons
                    name="phone"
                    size={15}
                    color="#EE5559"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.actionBtnText}>Call now</Text>
                </View>
              </TouchableOpacity>

              {/* Chat with Us Button */}
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={handleChatWithUs}
                style={styles.actionBtn}
                accessibilityRole="button"
                accessibilityLabel="Chat with customer support"
              >
                <View style={styles.btnInner}>
                  <CustomLucidIcons
                    name="message-circle"
                    size={16}
                    color="#EE5559"
                    style={styles.btnIcon}
                  />
                  <Text style={styles.actionBtnText}>Chat with us</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
  );

HomeFooterSupportSection.displayName = 'HomeFooterSupportSection';

export default HomeFooterSupportSection;

// -----------------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginTop: moderateVerticalScale(8),
    marginBottom: moderateVerticalScale(16),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#E8EDF2',
    marginHorizontal: moderateScale(14),
    marginBottom: moderateVerticalScale(16),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(18),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  // Card 1: Wedding Planning
  cardTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(17),
    color: '#0F172A',
    lineHeight: moderateScale(23),
    letterSpacing: -0.3,
  },
  featuresList: {
    marginTop: moderateVerticalScale(14),
    marginBottom: moderateVerticalScale(16),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(12),
  },
  featureIconWrap: {
    width: moderateScale(24),
    marginTop: moderateVerticalScale(2),
    marginRight: moderateScale(10),
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    color: '#334155',
    lineHeight: moderateScale(18),
  },
  featureBold: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#0F172A',
  },
  knowMoreBtn: {
    backgroundColor: '#EE5559',
    borderRadius: moderateScale(22),
    height: moderateVerticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EE5559',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  knowMoreText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(14.5),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Card 2: Help & Support
  helpTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(18),
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: moderateScale(25),
    letterSpacing: -0.3,
  },
  appNameHighlight: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#0F172A',
  },
  helpSubtitle: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    color: '#475569',
    textAlign: 'center',
    marginTop: moderateVerticalScale(6),
    marginBottom: moderateVerticalScale(18),
    lineHeight: moderateScale(18),
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  actionBtn: {
    flex: 1,
    height: moderateVerticalScale(42),
    borderRadius: moderateScale(21),
    borderWidth: 1.2,
    borderColor: '#EE5559',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: moderateScale(6),
  },
  actionBtnText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13.5),
    color: '#EE5559',
  },
});
