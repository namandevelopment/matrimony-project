import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { moderateScale, moderateVerticalScale } from '../../../utils/Responsive';

// -----------------------------------------------------------------------------
// 1. TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface PlanFeature {
  id: string;
  icon: string;
  prefixText?: string;
  highlightText: string;
  hasInfo?: boolean;
}

interface HomePlanAdBannerProps {
  planName?: string;
  tagline?: string;
  offerTag?: string;
  originalPrice?: number;
  discountedPrice?: number;
  features?: PlanFeature[];
  onPayPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

// -----------------------------------------------------------------------------
// 2. DEFAULT FEATURES LIST (Matching Screenshot)
// -----------------------------------------------------------------------------
const DEFAULT_FEATURES: PlanFeature[] = [
  {
    id: 'feat_1',
    icon: 'smartphone',
    prefixText: 'View ',
    highlightText: '10 Phone Nos',
  },
  {
    id: 'feat_2',
    icon: 'message-square',
    prefixText: 'Send ',
    highlightText: 'messages to matches',
    hasInfo: true,
  },
  {
    id: 'feat_3',
    icon: 'sparkles',
    prefixText: 'View ',
    highlightText: 'unlimited horoscopes',
  },
];

// -----------------------------------------------------------------------------
// 3. MEMOIZED DECORATIVE LIMITED OFFER BADGE
// -----------------------------------------------------------------------------
const LimitedOfferBadge = React.memo(() => {
  return (
    <View style={badgeStyles.badgeOuterWrapper}>
      {/* 8-pointed star / burst created with 2 rotated squares */}
      <View style={badgeStyles.starBurstBase} />
      <View style={badgeStyles.starBurstRotated} />

      {/* Foreground Content */}
      <View style={badgeStyles.badgeContent}>
        {/* Clock Graphic */}
        <View style={badgeStyles.clockOuter}>
          <View style={badgeStyles.clockBezel}>
            {/* Top stopwatch nob */}
            <View style={badgeStyles.stopwatchTop} />
            {/* Clock hands */}
            <View style={badgeStyles.hourHand} />
            <View style={badgeStyles.minuteHand} />
            <View style={badgeStyles.clockCenterDot} />
          </View>
        </View>

        {/* Text */}
        <Text style={badgeStyles.limitedText}>LIMITED</Text>
        <Text style={badgeStyles.periodText}>PERIOD OFFER</Text>
      </View>
    </View>
  );
});

LimitedOfferBadge.displayName = 'LimitedOfferBadge';

// -----------------------------------------------------------------------------
// 4. MAIN ADS BANNER COMPONENT
// -----------------------------------------------------------------------------
const HomePlanAdBanner: React.FC<HomePlanAdBannerProps> = React.memo(
  ({
    planName = 'Silver - 1 month',
    tagline = 'Your only starter pack to find the right match',
    offerTag = 'Special offer only for you',
    originalPrice = 1800,
    discountedPrice = 990,
    features = DEFAULT_FEATURES,
    onPayPress,
    containerStyle,
  }) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {/* Plan Header */}
        <Text style={styles.planTitle}>{planName}</Text>
        <Text style={styles.planTagline}>{tagline}</Text>

        {/* Offer Box (Price + Tag) */}
        <View style={styles.offerBox}>
          <Text style={styles.offerTagText}>{offerTag}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.strikethroughPrice}>₹{originalPrice.toLocaleString('en-IN')}</Text>
            <Text style={styles.discountedPrice}> ₹{discountedPrice.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Two-Column Area: Left perks + CTA, Right limited offer stamp */}
        <View style={styles.bodyRow}>
          {/* Left Column: Perks List & Pay Button */}
          <View style={styles.leftCol}>
            {/* Features List */}
            <View style={styles.featuresContainer}>
              {features.map(item => (
                <View key={item.id} style={styles.featureItem}>
                  <View style={styles.featureIconWrap}>
                    <CustomLucidIcons
                      name={item.icon}
                      size={15}
                      color="#2D3748"
                    />
                  </View>
                  <Text style={styles.featureText}>
                    {item.prefixText}
                    <Text style={styles.featureHighlight}>
                      {item.highlightText}
                    </Text>
                  </Text>
                  {item.hasInfo && (
                    <View style={styles.infoIconWrap}>
                      <CustomLucidIcons
                        name="info"
                        size={12}
                        color="#718096"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onPayPress}
              style={styles.payButton}
              accessibilityRole="button"
              accessibilityLabel={`Pay ${discountedPrice}`}
            >
              <Text style={styles.payButtonText}>
                Pay ₹{discountedPrice.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>

            {/* GST Disclaimer */}
            <Text style={styles.gstText}>*Prices are exclusive of GST</Text>
          </View>

          {/* Right Column: Limited Period Offer Badge */}
          <View style={styles.rightCol}>
            <LimitedOfferBadge />
          </View>
        </View>
      </View>
    );
  },
);

HomePlanAdBanner.displayName = 'HomePlanAdBanner';

export default HomePlanAdBanner;

// -----------------------------------------------------------------------------
// 5. STYLES
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDF9',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(20),
    paddingBottom: moderateVerticalScale(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3EAD8',
    marginVertical: moderateVerticalScale(12),
  },
  planTitle: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(22),
    color: '#111827',
    letterSpacing: -0.4,
  },
  planTagline: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(13.5),
    color: '#374151',
    marginTop: moderateVerticalScale(3),
    lineHeight: moderateScale(18),
  },

  // Offer Box (Rounded Pill)
  offerBox: {
    backgroundColor: '#F7F2E9',
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: '#EFE7DA',
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateVerticalScale(9),
    marginTop: moderateVerticalScale(14),
    marginBottom: moderateVerticalScale(12),
    alignSelf: 'flex-start',
    minWidth: moderateScale(210),
  },
  offerTagText: {
    fontFamily: fontFamily.Inter18Medium,
    fontSize: moderateScale(12),
    color: '#4B5563',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: moderateVerticalScale(2),
  },
  strikethroughPrice: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(15),
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(22),
    color: '#3B1F13',
    letterSpacing: -0.5,
  },

  // Body Two Columns
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftCol: {
    flex: 1,
    paddingRight: moderateScale(8),
  },
  rightCol: {
    width: moderateScale(110),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: moderateVerticalScale(4),
  },

  // Features List
  featuresContainer: {
    marginBottom: moderateVerticalScale(14),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(8),
  },
  featureIconWrap: {
    width: moderateScale(20),
    alignItems: 'center',
    marginRight: moderateScale(8),
  },
  featureText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(12.5),
    color: '#1F2937',
  },
  featureHighlight: {
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
  },
  infoIconWrap: {
    marginLeft: moderateScale(5),
  },

  // Pay Button
  payButton: {
    backgroundColor: '#4E2415',
    borderRadius: moderateScale(24),
    paddingVertical: moderateVerticalScale(11),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4E2415',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  payButtonText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(14.5),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  gstText: {
    fontFamily: fontFamily.Inter18Regular,
    fontSize: moderateScale(10.5),
    color: '#6B7280',
    marginTop: moderateVerticalScale(6),
    marginLeft: moderateScale(2),
  },
});

// Styles for the Limited Period Offer badge
const badgeStyles = StyleSheet.create({
  badgeOuterWrapper: {
    width: moderateScale(100),
    height: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  starBurstBase: {
    position: 'absolute',
    width: moderateScale(86),
    height: moderateScale(86),
    backgroundColor: '#FFF1D6',
    borderRadius: moderateScale(10),
    opacity: 0.85,
  },
  starBurstRotated: {
    position: 'absolute',
    width: moderateScale(86),
    height: moderateScale(86),
    backgroundColor: '#FFF1D6',
    borderRadius: moderateScale(10),
    transform: [{ rotate: '45deg' }],
    opacity: 0.85,
  },
  badgeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  clockOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateVerticalScale(4),
  },
  stopwatchTop: {
    position: 'absolute',
    top: -moderateVerticalScale(4),
    alignSelf: 'center',
    width: moderateScale(6),
    height: moderateScale(3),
    backgroundColor: '#1E3A8A',
    borderRadius: 1,
  },
  clockBezel: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(23),
    borderWidth: 3.5,
    borderColor: '#FACC15',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clockCenterDot: {
    position: 'absolute',
    width: moderateScale(4),
    height: moderateScale(4),
    borderRadius: moderateScale(2),
    backgroundColor: '#1E3A8A',
  },
  hourHand: {
    position: 'absolute',
    width: 2.5,
    height: moderateScale(11),
    backgroundColor: '#1E3A8A',
    top: moderateScale(13),
    borderRadius: 1,
  },
  minuteHand: {
    position: 'absolute',
    width: moderateScale(10),
    height: 2.5,
    backgroundColor: '#1E3A8A',
    right: moderateScale(13),
    top: moderateScale(21),
    borderRadius: 1,
  },
  limitedText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(10.5),
    color: '#1E3A8A',
    letterSpacing: 0.4,
  },
  periodText: {
    fontFamily: fontFamily.Inter18Bold,
    fontSize: moderateScale(7.5),
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
});
