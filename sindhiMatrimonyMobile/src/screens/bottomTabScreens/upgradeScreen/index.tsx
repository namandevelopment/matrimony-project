import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { PrimaryButton, ScreenHeader, ScreenShell } from '../components';

const benefits = [
  'See who liked your profile',
  'Send unlimited interests',
  'Get priority profile visibility',
];

const UpgradeScreen = () => (
  <ScreenShell>
    <ScreenHeader eyebrow="Go a little further" title="Upgrade" />
    <View style={styles.hero}>
      <View style={styles.sparkle}>
        <CustomLucidIcons name="sparkles" color={COLORS.white} size={25} />
      </View>
      <Text style={styles.heroTitle}>Make your search count</Text>
      <Text style={styles.heroText}>
        More visibility. More conversations. More chances to meet someone right.
      </Text>
    </View>
    <Text style={styles.sectionTitle}>Premium benefits</Text>
    <View style={styles.benefitCard}>
      {benefits.map(benefit => (
        <View key={benefit} style={styles.benefit}>
          <CustomLucidIcons
            name="check-circle-2"
            color={COLORS.themeColor}
            size={19}
          />
          <Text style={styles.benefitText}>{benefit}</Text>
        </View>
      ))}
    </View>
    <View style={styles.planCard}>
      <View>
        <Text style={styles.planLabel}>MOST POPULAR</Text>
        <Text style={styles.planName}>Premium monthly</Text>
        <Text style={styles.planPrice}>
          ₹499 <Text style={styles.planPeriod}>/ month</Text>
        </Text>
      </View>
      <PrimaryButton label="Continue" icon="arrow-right" />
    </View>
    <Text style={styles.disclaimer}>Secure payments · Cancel anytime</Text>
  </ScreenShell>
);

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: COLORS.themeColor,
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 25,
  },
  sparkle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  heroTitle: {
    color: COLORS.white,
    fontFamily: fontFamily.Inter24Bold,
    fontSize: 22,
    marginTop: 14,
    textAlign: 'center',
  },
  heroText: {
    color: '#FFE9EA',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
    textAlign: 'center',
  },
  sectionTitle: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 17,
    marginBottom: 12,
    marginTop: 24,
  },
  benefitCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16 },
  benefit: { alignItems: 'center', flexDirection: 'row', marginBottom: 14 },
  benefitText: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
    marginLeft: 10,
  },
  planCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: COLORS.themeColor,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    padding: 16,
  },
  planLabel: {
    color: COLORS.themeColor,
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  planName: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
    marginTop: 5,
  },
  planPrice: {
    color: COLORS.black,
    fontFamily: fontFamily.Inter24Bold,
    fontSize: 18,
    marginTop: 4,
  },
  planPeriod: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
  },
  disclaimer: {
    color: COLORS.inactiveTab,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 11,
    marginTop: 14,
    textAlign: 'center',
  },
});

export default UpgradeScreen;
