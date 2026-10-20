import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

interface AssistedServiceBannerProps {
  onPressCTA?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const AssistedServiceBanner: React.FC<AssistedServiceBannerProps> = React.memo(
  ({ onPressCTA, containerStyle }) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Background Mandala / Floral Watermark Accent (Top-Right) */}
        <View style={styles.mandalaWatermark}>
          <CustomLucidIcons name="sun" size={130} color="rgba(255, 255, 255, 0.05)" />
        </View>

        {/* Top Header: Crown Icon + Title */}
        <View style={styles.headerRow}>
          <View style={styles.crownCircle}>
            <CustomLucidIcons name="crown" size={14} color="#0D281D" />
          </View>
          <Text style={styles.titleText}>Assisted Service</Text>
        </View>

        {/* Subtitle / Headline */}
        <Text style={styles.headline}>
          Find your match <Text style={styles.highlightText}>3X Faster</Text> with a Dedicated Relationship Manager
        </Text>

        {/* Two-Column Area: Left perks + CTA button, Right RM image */}
        <View style={styles.bodyRow}>
          {/* Left Column: Perks Box + Gold Button */}
          <View style={styles.leftCol}>
            {/* Boxed Features */}
            <View style={styles.featuresBox}>
              {/* Feature 1 */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons name="users" size={15} color="#E5B869" />
                </View>
                <Text style={styles.featureText}>Handpicked Compatible Matches</Text>
              </View>

              {/* Feature 2 */}
              <View style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons name="user-check" size={15} color="#E5B869" />
                </View>
                <Text style={styles.featureText}>Regular Follow-ups with Prospects</Text>
              </View>

              {/* Feature 3 */}
              <View style={[styles.featureItem, { marginBottom: 0 }]}>
                <View style={styles.featureIconWrap}>
                  <CustomLucidIcons name="phone-call" size={15} color="#E5B869" />
                </View>
                <Text style={styles.featureText}>
                  Guaranteed Monthly Meetings with Interested Prospects
                </Text>
              </View>
            </View>

            {/* Gold CTA Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onPressCTA}
              style={styles.goldButton}
              accessibilityRole="button"
              accessibilityLabel="Get Your Relationship Manager"
            >
              <Text style={styles.goldButtonText}>Get Your Relationship Manager</Text>
            </TouchableOpacity>
          </View>

          {/* Right Column: Professional Relationship Manager Image */}
          <View style={styles.rightCol}>
            <View style={styles.rmImageWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
                }}
                style={styles.rmImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>
    );
  },
);

AssistedServiceBanner.displayName = 'AssistedServiceBanner';

export default AssistedServiceBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#073223',
    marginVertical: moderateVerticalScale(14),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(20),
    paddingBottom: moderateVerticalScale(18),
    overflow: 'hidden',
    position: 'relative',
  },
  mandalaWatermark: {
    position: 'absolute',
    top: -moderateVerticalScale(25),
    right: -moderateScale(25),
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  crownCircle: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: '#E5B869',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(8),
  },
  titleText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(18),
    color: '#E5B869',
    letterSpacing: -0.2,
  },
  headline: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(14.5),
    color: '#FFFFFF',
    lineHeight: moderateScale(21),
    marginBottom: moderateVerticalScale(14),
    paddingRight: moderateScale(30),
  },
  highlightText: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#FDE047',
  },

  // Body Two Columns
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: moderateScale(10),
  },
  rightCol: {
    width: moderateScale(110),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // Boxed Features
  featuresBox: {
    borderWidth: 1,
    borderColor: 'rgba(229, 184, 105, 0.35)',
    borderRadius: moderateScale(14),
    backgroundColor: 'rgba(5, 38, 26, 0.7)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateVerticalScale(12),
    marginBottom: moderateVerticalScale(14),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(10),
  },
  featureIconWrap: {
    width: moderateScale(20),
    marginTop: 2,
    marginRight: moderateScale(8),
  },
  featureText: {
    flex: 1,
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(12),
    color: '#E2E8F0',
    lineHeight: moderateScale(16),
  },

  // Gold Button
  goldButton: {
    backgroundColor: '#C89B3C',
    borderRadius: moderateScale(22),
    paddingVertical: moderateVerticalScale(11),
    paddingHorizontal: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E5B869',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  goldButtonText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(13.5),
    color: '#072418',
    letterSpacing: 0.2,
  },

  // RM Image on Right
  rmImageWrapper: {
    width: moderateScale(110),
    height: moderateScale(185),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  rmImage: {
    width: '100%',
    height: '100%',
  },
});
