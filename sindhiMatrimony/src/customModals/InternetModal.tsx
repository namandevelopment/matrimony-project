import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';

interface InternetModalProps {
  visible: boolean;
  onRetry?: () => void;
}

const InternetModal: React.FC<InternetModalProps> = memo(({ visible, onRetry }) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      backdropOpacity={0.5}
      backdropColor={COLORS.black}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      avoidKeyboard
      statusBarTranslucent
      onBackdropPress={() => undefined}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>!</Text>
        </View>

        <Text style={styles.badge}>Offline</Text>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.message}>
          Please check your network connection and try again.
        </Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.retryButton}
          onPress={onRetry ?? (() => undefined)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFE9EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: {
    color: COLORS.themeColor,
    fontSize: 28,
    fontFamily: fontFamily.Inter18Bold,
    lineHeight: 28,
  },
  badge: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18SemiBold,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: fontFamily.Inter18Bold,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#525252',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: fontFamily.Inter18Regular,
    marginBottom: 20,
  },
  retryButton: {
    width: '100%',
    backgroundColor: COLORS.themeColor,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: fontFamily.Inter18SemiBold,
  },
});

export default InternetModal;
