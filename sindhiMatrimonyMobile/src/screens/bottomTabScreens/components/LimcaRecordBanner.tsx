import React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle } from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

interface LimcaRecordBannerProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const LimcaRecordBanner: React.FC<LimcaRecordBannerProps> = React.memo(
  ({ containerStyle }) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Heart Watermark in Background */}
        <View style={styles.heartWatermark}>
          <CustomLucidIcons
            name="heart"
            size={110}
            color="rgba(34, 197, 94, 0.14)"
          />
        </View>

        {/* Content Row */}
        <View style={styles.contentRow}>
          {/* Left Text Column */}
          <View style={styles.textCol}>
            <Text style={styles.headline}>
              <Text style={styles.redHighlight}>Lakhs </Text>
              <Text style={styles.greenHighlight}>of Happy Marriages!</Text>
            </Text>
            <Text style={styles.description}>
              We are featured in the Limca Book of Records for highest number of
              documented marriages online
            </Text>
          </View>

          {/* Right Logo / Seal Column */}
          <View style={styles.logoCol}>
            <View style={styles.limcaBadgeWrapper}>
              {/* Mini sunburst / sparkles on top left */}
              <View style={styles.sparklesWrap}>
                <CustomLucidIcons name="sparkles" size={12} color="#F59E0B" />
              </View>

              {/* Limca Brand Pill */}
              <View style={styles.limcaRedPill}>
                <Text style={styles.limcaRedText}>Limca</Text>
              </View>

              {/* Book of Records Typography */}
              <Text style={styles.limcaBigBook}>BOOK</Text>
              <Text style={styles.limcaOf}>of</Text>
              <Text style={styles.limcaRecords}>RECORDS</Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

LimcaRecordBanner.displayName = 'LimcaRecordBanner';

export default LimcaRecordBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFCF8',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDF5EB',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(16),
    marginVertical: moderateVerticalScale(12),
    position: 'relative',
    overflow: 'hidden',
  },
  heartWatermark: {
    position: 'absolute',
    right: moderateScale(10),
    top: moderateVerticalScale(2),
    zIndex: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  textCol: {
    flex: 1,
    paddingRight: moderateScale(12),
  },
  headline: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(15.5),
    letterSpacing: -0.2,
    marginBottom: moderateVerticalScale(5),
  },
  redHighlight: {
    color: '#D84040',
  },
  greenHighlight: {
    color: '#15803D',
  },
  description: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12),
    color: '#374151',
    lineHeight: moderateScale(16.5),
  },

  // Limca Seal
  logoCol: {
    width: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  limcaBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: moderateVerticalScale(4),
  },
  sparklesWrap: {
    position: 'absolute',
    top: -moderateVerticalScale(4),
    left: -moderateScale(8),
  },
  limcaRedPill: {
    backgroundColor: '#DC2626',
    paddingHorizontal: moderateScale(6),
    paddingVertical: 1,
    borderRadius: moderateScale(4),
    marginBottom: 1,
  },
  limcaRedText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(8),
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  limcaBigBook: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(15),
    color: '#14532D',
    lineHeight: moderateScale(16),
    letterSpacing: 0.5,
  },
  limcaOf: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(10),
    color: '#16A34A',
    fontStyle: 'italic',
    lineHeight: moderateScale(10),
    marginVertical: -2,
  },
  limcaRecords: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(10.5),
    color: '#14532D',
    letterSpacing: 0.8,
  },
});
