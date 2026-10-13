import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { clientPhoneNumber } from '../../utils/ClientData';
import { showToast } from '../../utils/CustomToast';

const HEADER_COLOR = '#EA4C59';
const ICON_COLOR = '#5A6578';
const SUPPORT_EMAIL = 'support@sindhimatrimony.com';

interface HelpCenterItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

const HelpCenter: React.FC = () => {

  // Call us handler
  const handleCallUs = useCallback(() => {
    const phoneNumber = clientPhoneNumber || '9672446220';
    Alert.alert(
      'Call Customer Support',
      `Would you like to call Sindhi Matrimony 24x7 support at +91 ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:+91${phoneNumber}`).catch(() => {
              showToast({
                type: 'error',
                message: 'Unable to open phone dialer on this device.',
              });
            });
          },
        },
      ],
    );
  }, []);

  // 24x7 Chat handler
  const handleChat = useCallback(() => {
    showToast({
      type: 'info',
      message: 'Connecting to 24x7 live chat support representative...',
    });
  }, []);

  // Feedback handler
  const handleFeedback = useCallback(() => {
    Alert.alert(
      'Send Feedback',
      'We would love to hear your feedback or suggestions to improve your experience!',
      [
        { text: 'Later', style: 'cancel' },
        {
          text: 'Send Email',
          onPress: () => {
            Linking.openURL(
              `mailto:${SUPPORT_EMAIL}?subject=App%20Feedback%20-%20Sindhi%20Matrimony`,
            ).catch(() => {
              showToast({
                type: 'error',
                message: 'Could not open mail app.',
              });
            });
          },
        },
      ],
    );
  }, []);

  // E-mail Us handler
  const handleEmailUs = useCallback(() => {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=Customer%20Support%20Inquiry`,
    ).catch(() => {
      showToast({
        type: 'error',
        message: 'Could not open mail app.',
      });
    });
  }, []);

  // Branch Locator handler
  const handleBranchLocator = useCallback(() => {
    Alert.alert(
      'Branch Locator',
      'Locate Sindhi Matrimony offices across major cities.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Maps',
          onPress: () => {
            Linking.openURL(
              'https://maps.google.com/?q=Sindhi+Matrimony+Branches',
            ).catch(() => {
              showToast({
                type: 'info',
                message: 'Branch offices in Mumbai, Delhi, Jaipur, Ahmedabad, Pune.',
              });
            });
          },
        },
      ],
    );
  }, []);

  // Menu items list matching the exact order and icons from the screenshot
  const helpOptions: HelpCenterItem[] = [
    {
      id: 'call_us',
      title: 'Call us',
      icon: 'phone',
      onPress: handleCallUs,
    },
    {
      id: 'chat',
      title: '24x7 Chat',
      icon: 'message-circle',
      onPress: handleChat,
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: 'square-pen',
      onPress: handleFeedback,
    },
    {
      id: 'email_us',
      title: 'E-mail Us',
      icon: 'mail',
      onPress: handleEmailUs,
    },
    {
      id: 'branch_locator',
      title: 'Branch Locator',
      icon: 'map-pin',
      onPress: handleBranchLocator,
    },
  ];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />

      {/* 
        CustomHeader:
        - Default internal navigation.goBack() works automatically ("ander se")
        - Can also accept custom onPress / onBackPress prop ("bhr se")
        - All styling customizable from inside (defaults) & outside (props)
      */}
      <CustomHeader
        title="24x7 Help Center"
        backgroundColor={HEADER_COLOR}
        titleColor="#FFFFFF"
        backIconColor="#FFFFFF"
        backIconSize={24}
        showBottomBorder={false}
        titleStyle={styles.headerTitle}
      />

      {/* Body Content */}
      <View style={styles.bodyContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {helpOptions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionRow}
              onPress={item.onPress}
              activeOpacity={0.65}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View style={styles.iconContainer}>
                <CustomLucidIcons
                  name={item.icon}
                  color={ICON_COLOR}
                  size={24}
                />
              </View>
              <Text style={styles.optionTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#FFFFFF',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: fontFamily.Inter18Medium,
    letterSpacing: 0.1,
  },
});