import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import COLORS from '../../../components/colors';
import fontFamily from '../../../components/fontFamily';
import CustomLucidIcons from '../../../components/CustomLucidIcons';
import { useTheme } from '../../../theme/ThemeProvider';
import { toast } from '../../../toastMessage/toast';
import OneUpi from 'one-react-native-upi';
import { apiFetch, ApiURL } from '../../../redux/apiService';
import Storage from '../../../storage/Storage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.82);
const CARD_MARGIN = 8;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;
const SIDE_SPACER = (width - SNAP_INTERVAL) / 2;

interface Plan {
  id: string;
  tabTitle: string;
  tabSubtitle?: string;
  badge?: string;
  cardTitle: string;
  discountPercentage?: number;
  discountText?: string;
  originalPrice?: string;
  price: string;
  perMonth: string;
  features: { text: string; hasInfo?: boolean }[];
  hasKnowMore?: boolean;
}

const mapApiPlanToUiPlan = (raw: any): Plan => {
  const months =
    Number(raw.durationMonths) ||
    Math.max(1, Math.round((Number(raw.durationDays) || 90) / 30));
  const priceNum = Number(raw.priceINR ?? raw.price ?? 0);
  const origPriceNum = Number(raw.originalPriceINR ?? raw.originalPrice ?? 0);
  const perMonthNum = Math.round(priceNum / months);

  const rawFeatures = Array.isArray(raw.features) ? raw.features : [];
  const features =
    rawFeatures.length > 0
      ? rawFeatures.map((f: any) => ({
        text: typeof f === 'string' ? f : f?.text || String(f),
        hasInfo: f?.hasInfo || false,
      }))
      : [
        { text: `Valid for ${months} months` },
        { text: `View ${raw.contactViewCredits || 50} Phone Nos*`, hasInfo: true },
        { text: 'Send unlimited messages' },
        { text: 'Unlimited Horoscope views' },
        { text: 'View verified profiles with photos' },
      ];

  const discPercent =
    Number(raw.discountPercentage) ||
    (origPriceNum > priceNum
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
      : 0);

  const discText = raw.discountPercentage
    ? `${raw.discountPercentage}% OFF! Valid for today`
    : raw.tagline ||
    (origPriceNum > priceNum
      ? `${Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)}% OFF!`
      : undefined);

  return {
    id: String(raw.id || raw._id || raw.tier || Math.random()),
    tabTitle: raw.name || raw.tier || 'Plan',
    tabSubtitle: `${months} Months`,
    badge: raw.badge || (raw.isPopular ? 'MOST POPULAR' : undefined),
    cardTitle: raw.name || raw.tier || 'Membership',
    discountPercentage: discPercent,
    discountText: discText,
    originalPrice:
      origPriceNum > 0 ? `₹${origPriceNum.toLocaleString('en-IN')}` : undefined,
    price: `₹${priceNum.toLocaleString('en-IN')}`,
    perMonth: `₹${perMonthNum.toLocaleString('en-IN')} per month`,
    features,
    hasKnowMore: raw.tier === 'VIP' || raw.tier === 'DIAMOND',
  };
};

const UpgradeScreen = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { colors, isDark } = useTheme();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [packagesModalVisible, setPackagesModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const sheetAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    let isMounted = true;
    const fetchLivePlans = async () => {
      try {
        const res: any = await apiFetch({
          url: ApiURL.getPlans,
          method: 'GET',
          showErrorToast: false,
        });
        const rawList = res?.data?.plans || res?.data?.list || res?.data || [];
        if (isMounted && Array.isArray(rawList) && rawList.length > 0) {
          setPlans(rawList.map(mapApiPlanToUiPlan));
        }
      } catch (err) {

      }
    };

    fetchLivePlans();
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  // Track screen visit for Admin CRM (Strictly throttled to 1 visit per day)
  useEffect(() => {
    if (!isFocused) return;
    const trackPaymentVisitOnceDaily = async () => {
      try {
        const todayStr = new Date().toISOString().slice(0, 10);
        const lastTrackedDate = await Storage.getItem('last_payment_screen_visit_date');
        if (lastTrackedDate === todayStr) {
          return;
        }

        const userObj = await Storage.getItem<any>('user');
        await apiFetch({
          url: ApiURL.trackPaymentScreenVisit,
          method: 'POST',
          payload: {
            screen: 'PAYMENT_UPGRADE',
            screenTitle: 'Payment & Membership Upgrade Plans',
            userId: userObj?.id || userObj?._id,
            name: userObj?.fullName || userObj?.name,
            phone: userObj?.phone,
            email: userObj?.email,
          },
          showErrorToast: false,
        });

        await Storage.setItem('last_payment_screen_visit_date', todayStr);
      } catch {
        // Non-blocking telemetry
      }
    };

    trackPaymentVisitOnceDaily();
  }, [isFocused]);

  const maxDiscount = React.useMemo(() => {
    let max = 0;
    for (const p of plans) {
      if (p.discountPercentage && p.discountPercentage > max) {
        max = p.discountPercentage;
      }
      const match = p.discountText?.match(/(\d+)%/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > max) max = num;
      }
    }
    return max > 0 ? max : 33;
  }, [plans]);

  const currentPlan = plans[selectedPlanIndex] || plans[0];
  const activeOfferText =
    currentPlan?.discountText || 'Find Your Sindhi Life Partner Faster';

  const handleSelectPlan = (index: number) => {
    setSelectedPlanIndex(index);
    flatListRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(scrollX / SNAP_INTERVAL);
    if (activeIndex >= 0 && activeIndex < plans.length && activeIndex !== selectedPlanIndex) {
      setSelectedPlanIndex(activeIndex);
    }
  };

  const openSheet = () => {
    setModalVisible(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      friction: 8,
      tension: 65,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 450,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handlePayNow = async (planName: string, amount: string) => {
    if (Platform.OS !== 'android') {
      toast.error('UPI payments are supported on Android only');
      return;
    }

    setIsProcessing(true);
    const activePlan =
      plans[selectedPlanIndex] ||
      plans.find(p => p.cardTitle === planName || p.tabTitle === planName);
    const numericAmount = amount.replace(/[^0-9]/g, '');

    let orderId = `order_${Date.now()}`;
    let dynamicUpiId = 'namansaini033@oksbi';
    let dynamicPayeeName = 'Naman Saini';
    try {
      const orderRes: any = await apiFetch({
        url: ApiURL.createPaymentOrder,
        method: 'POST',
        payload: {
          planId: activePlan?.id || 'plan_gold',
          currency: 'INR',
        },
        showErrorToast: false,
      }).catch(() => null);

      if (orderRes?.data?.orderId) {
        orderId = orderRes.data.orderId;
      }
      if (orderRes?.data?.upi?.upiId) {
        dynamicUpiId = orderRes.data.upi.upiId;
      }
      if (orderRes?.data?.upi?.payeeName) {
        dynamicPayeeName = orderRes.data.upi.payeeName;
      }
    } catch (e) {
      // Proceed with orderId
    }

    const config = {
      upiId: dynamicUpiId,
      name: dynamicPayeeName,
      note: `Payment for ${planName} (Order: ${orderId})`,
      amount: numericAmount,
    };

    try {
      OneUpi.initiate(
        config,
        async (success: any) => {
          setIsProcessing(false);
          const paymentId =
            success?.approvalRefNo || success?.txnId || `pay_${Date.now()}`;

          // Verify payment on backend
          try {
            await apiFetch({
              url: ApiURL.verifyPaymentSignature,
              method: 'POST',
              payload: {
                planId: activePlan?.id || 'plan_gold',
                paymentOrderId: orderId,
                paymentId,
              },
              showErrorToast: false,
            }).catch(() => null);
          } catch { }

          try {
            const currentUser = Storage.getItemSync<any>('user') || {};
            Storage.setItemSync('user', {
              ...currentUser,
              membershipTier: activePlan?.cardTitle || 'GOLD',
            });
          } catch (e) { }

          toast.success(
            `Payment successful! Congratulations, your ${planName} plan is now active.`,
          );
        },
        (error: any) => {
          setIsProcessing(false);
          toast.error(error?.message || 'Payment failed or cancelled');
        },
      );
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err?.message || 'Failed to initiate UPI payment');
    }
  };

  const handleSupportChat = () => {
    navigation.navigate('SupportChatScreen');
  };

  const handleSupportCall = () => {
    Linking.openURL('tel:+919509531768').catch(() => {
      toast.error('Unable to open phone dialer');
    });
  };

  const handleTermsPress = () => {
    navigation.navigate('TermsConditionsScreen');
  };

  const renderCard = ({ item }: { item: Plan; index: number }) => {
    return (
      <View
        style={[
          styles.planCard,
          {
            width: CARD_WIDTH,
            marginHorizontal: CARD_MARGIN,
            backgroundColor: isDark ? colors.surface : '#FFFFFF',
            borderColor: isDark ? colors.border : '#ECEEF1',
          },
        ]}
      >
        <View
          style={[
            styles.planCardHeader,
            { backgroundColor: isDark ? colors.cardElevated : '#F4F5F7' },
          ]}
        >
          <Text
            style={[
              styles.planCardTitle,
              { color: isDark ? colors.text : '#1A1D20' },
            ]}
          >
            {item.cardTitle}
          </Text>
        </View>

        <View style={styles.cardBody}>
          {item.discountText ? (
            <Text style={styles.discountTag}>{item.discountText}</Text>
          ) : (
            <View style={styles.discountPlaceholder} />
          )}

          <View style={styles.priceRow}>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            )}
            <Text
              style={[
                styles.currentPrice,
                { color: isDark ? colors.text : '#111827' },
              ]}
            >
              {item.price}
            </Text>
          </View>

          <View
            style={[
              styles.perMonthPill,
              { backgroundColor: isDark ? 'rgba(219,47,60,0.16)' : '#FFF0F2' },
            ]}
          >
            <Text style={[styles.perMonthText, { color: colors.primary }]}>
              {item.perMonth}
            </Text>
          </View>

          <View style={styles.featuresList}>
            {item.features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <CustomLucidIcons
                  name="check"
                  size={16}
                  color={colors.primary}
                  style={styles.checkIcon}
                />
                <Text
                  style={[
                    styles.featureText,
                    { color: isDark ? colors.textSecondary : '#374151' },
                  ]}
                >
                  {feature.text}
                </Text>
                {feature.hasInfo && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={openSheet}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <CustomLucidIcons
                      name="info"
                      size={14}
                      color="#9CA3AF"
                      style={styles.infoIcon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {item.hasKnowMore && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={openSheet}
              style={styles.knowMoreButton}
            >
              <Text style={[styles.knowMoreText, { color: colors.primary }]}>
                Know More &gt;
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.88}
            disabled={isProcessing}
            onPress={() => handlePayNow(item.cardTitle, item.price)}
            style={[styles.payNowButton, { backgroundColor: colors.primary }]}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.payNowText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#FFF9FA' }]}>
      {isFocused && (
        <StatusBar
          backgroundColor={isDark ? '#2C0E16' : '#FFE9EE'}
          barStyle={isDark ? 'light-content' : 'dark-content'}
          animated
        />
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <LinearGradient
          colors={
            isDark
              ? ['#2C0E16', '#1F0B11', colors.background]
              : ['#FFE9EE', '#FFF3F5', '#FFF9FA']
          }
          style={styles.heroSection}
        >
          <View style={styles.offerBadge}>
            <CustomLucidIcons name="tag" size={13} color="#FFFFFF" />
            <Text style={styles.offerBadgeText}>Special Offer</Text>
          </View>

          <Text style={[styles.heroHeadline, { color: isDark ? colors.text : '#1A1A1A' }]}>
            Save up to {maxDiscount}%{' '}
            <Text style={styles.heroHighlight}>+ 21 Days Money Back Guarantee!</Text>
          </Text>

          <Text style={[styles.heroSubtext, { color: isDark ? colors.textSecondary : '#555555' }]}>
            {activeOfferText}
          </Text>

          <View style={styles.tabsRow}>
            {plans.map((plan, index) => {
              const isSelected = selectedPlanIndex === index;
              return (
                <View key={plan.id} style={styles.tabWrapper}>
                  {plan.badge && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{plan.badge}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => handleSelectPlan(index)}
                    style={[
                      styles.tabButton,
                      isSelected
                        ? [styles.activeTabButton, { backgroundColor: '#A41D3B' }]
                        : [
                          styles.inactiveTabButton,
                          {
                            backgroundColor: isDark ? colors.surface : '#FFFFFF',
                            borderColor: isDark ? colors.border : '#E2E8F0',
                          },
                        ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabTitle,
                        isSelected
                          ? styles.activeTabText
                          : [styles.inactiveTabText, { color: isDark ? colors.text : '#222222' }],
                      ]}
                    >
                      {plan.tabTitle}
                    </Text>
                    {plan.tabSubtitle && (
                      <Text
                        style={[
                          styles.tabSubtitle,
                          isSelected
                            ? styles.activeTabSubtitle
                            : [styles.inactiveTabSubtitle, { color: isDark ? colors.textSecondary : '#666666' }],
                        ]}
                      >
                        {plan.tabSubtitle}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </LinearGradient>

        <FlatList
          ref={flatListRef}
          data={plans}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={{
            paddingHorizontal: SIDE_SPACER,
            paddingVertical: 14,
          }}
        />

        <View style={styles.paginationRow}>
          {plans.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelectPlan(i)}
              style={[
                styles.paginationDot,
                selectedPlanIndex === i
                  ? [styles.activePaginationDot, { backgroundColor: '#A41D3B' }]
                  : [
                    styles.inactivePaginationDot,
                    { backgroundColor: isDark ? '#4B5563' : '#D1D5DB' },
                  ],
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPackagesModalVisible(true)}
          style={styles.viewPackagesBtn}
        >
          <Text style={[styles.viewPackagesText, { color: '#E53935' }]}>
            View All Packages &gt;
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.dashedDivider,
            { borderColor: isDark ? colors.border : '#E5E7EB' },
          ]}
        />

        <View style={styles.helpSection}>
          <Text
            style={[
              styles.helpTitle,
              { color: isDark ? colors.text : '#1F2937' },
            ]}
          >
            Need any help in making payment?
          </Text>
          <View style={styles.helpButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSupportChat}
              style={[
                styles.helpButton,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#D1D5DB',
                },
              ]}
            >
              <CustomLucidIcons
                name="message-circle"
                size={16}
                color="#E53935"
              />
              <Text
                style={[
                  styles.helpButtonText,
                  { color: isDark ? colors.text : '#1F2937' },
                ]}
              >
                Chat with us
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSupportCall}
              style={[
                styles.helpButton,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: isDark ? colors.border : '#D1D5DB',
                },
              ]}
            >
              <CustomLucidIcons
                name="phone"
                size={15}
                color="#E53935"
              />
              <Text
                style={[
                  styles.helpButtonText,
                  { color: isDark ? colors.text : '#1F2937' },
                ]}
              >
                Call us
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerNoteRow}>
          <Text
            style={[
              styles.footerNote,
              { color: isDark ? colors.textMuted : '#6B7280' },
            ]}
          >
            Note : 21 Days money back guarantee{' '}
            <Text
              onPress={handleTermsPress}
              style={[styles.termsLink, { color: '#E53935' }]}
            >
              Terms &amp; Conditions
            </Text>{' '}
            applied
          </Text>
        </View>
      </ScrollView>

      {/* Till U Marry Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSheet}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeSheet}>
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                transform: [{ translateY: sheetAnim }],
              },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text
                style={[
                  styles.sheetTitle,
                  { color: isDark ? colors.text : '#111827' },
                ]}
              >
                What Makes Till U Marry the Best Choice
              </Text>
              <TouchableOpacity
                onPress={closeSheet}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CustomLucidIcons
                  name="x"
                  size={20}
                  color={isDark ? colors.text : '#374151'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text
                  style={[
                    styles.bulletText,
                    { color: isDark ? colors.textSecondary : '#374151' },
                  ]}
                >
                  Search for your life partner without worrying about repeated payments
                </Text>
              </View>

              <View
                style={[
                  styles.sheetDivider,
                  { borderColor: isDark ? colors.border : '#E5E7EB' },
                ]}
              />

              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text
                  style={[
                    styles.bulletText,
                    { color: isDark ? colors.textSecondary : '#374151' },
                  ]}
                >
                  Majority of paid users find their life partner within a year – Till U Marry package gives you one year of paid membership benefits at a price lower than the 6 months Prime Gold plan.
                </Text>
              </View>

              <View
                style={[
                  styles.sheetDivider,
                  { borderColor: isDark ? colors.border : '#E5E7EB' },
                ]}
              />

              <View style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text
                  style={[
                    styles.bulletText,
                    { color: isDark ? colors.textSecondary : '#374151' },
                  ]}
                >
                  Still searching after one year? – Renew for another year at a guaranteed 75% discount, lower than the 3 months Prime Gold price, if renewed within 2 weeks of package expiry.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.highlightBox,
                {
                  backgroundColor: isDark ? 'rgba(219,47,60,0.1)' : '#FFF7F8',
                  borderColor: isDark ? colors.border : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.highlightBoxText,
                  { color: isDark ? colors.text : '#1F2937' },
                ]}
              >
                Choose the only package you need to find your perfect match!
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                closeSheet();
                handlePayNow('Prime - Till U Marry', '₹23,700');
              }}
              style={[styles.payNowButton, { backgroundColor: '#E53935' }]}
            >
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* View All Packages Comparison Modal */}
      <Modal
        visible={packagesModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPackagesModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPackagesModalVisible(false)}
        >
          <View
            style={[
              styles.comparisonSheet,
              { backgroundColor: isDark ? colors.surface : '#FFFFFF' },
            ]}
          >
            <View style={styles.sheetHeader}>
              <Text
                style={[
                  styles.sheetTitle,
                  { color: isDark ? colors.text : '#111827' },
                ]}
              >
                Compare All Packages
              </Text>
              <TouchableOpacity
                onPress={() => setPackagesModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CustomLucidIcons
                  name="x"
                  size={20}
                  color={isDark ? colors.text : '#374151'}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {plans.map(plan => (
                <View
                  key={plan.id}
                  style={[
                    styles.comparisonCard,
                    {
                      borderColor: isDark ? colors.border : '#E5E7EB',
                      backgroundColor: isDark ? colors.cardElevated : '#F9FAFB',
                    },
                  ]}
                >
                  <View style={styles.comparisonHeader}>
                    <Text
                      style={[
                        styles.comparisonTitle,
                        { color: isDark ? colors.text : '#111827' },
                      ]}
                    >
                      {plan.cardTitle}
                    </Text>
                    <Text
                      style={[
                        styles.comparisonPrice,
                        { color: '#E53935' },
                      ]}
                    >
                      {plan.price}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.comparisonPerMonth,
                      { color: isDark ? colors.textSecondary : '#6B7280' },
                    ]}
                  >
                    {plan.perMonth}
                  </Text>
                  <View style={styles.comparisonFeatures}>
                    {plan.features.map((f, i) => (
                      <View key={i} style={styles.comparisonFeatureItem}>
                        <CustomLucidIcons
                          name="check"
                          size={14}
                          color="#E53935"
                        />
                        <Text
                          style={[
                            styles.comparisonFeatureText,
                            { color: isDark ? colors.textSecondary : '#374151' },
                          ]}
                        >
                          {f.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      setPackagesModalVisible(false);
                      handlePayNow(plan.cardTitle, plan.price);
                    }}
                    style={[
                      styles.comparisonSelectBtn,
                      { backgroundColor: '#E53935' },
                    ]}
                  >
                    <Text style={styles.comparisonSelectBtnText}>
                      Select {plan.tabTitle}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B1538',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 12,
    marginLeft: 5,
  },
  heroHeadline: {
    fontSize: 20,
    fontFamily: fontFamily.Inter24Bold,
    textAlign: 'center',
    lineHeight: 27,
  },
  heroHighlight: {
    color: '#8B1538',
  },
  heroSubtext: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Medium,
    marginTop: 8,
    marginBottom: 18,
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  tabWrapper: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  badgePill: {
    position: 'absolute',
    top: -9,
    zIndex: 10,
    backgroundColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 9,
  },
  tabButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    shadowColor: '#8B1538',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  inactiveTabButton: {
    borderWidth: 1,
  },
  tabTitle: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Bold,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {},
  tabSubtitle: {
    fontSize: 11,
    fontFamily: fontFamily.Inter18Regular,
    marginTop: 2,
    textAlign: 'center',
  },
  activeTabSubtitle: {
    color: 'rgba(255,255,255,0.85)',
  },
  inactiveTabSubtitle: {},
  planCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  planCardHeader: {
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECEEF1',
  },
  planCardTitle: {
    fontSize: 17,
    fontFamily: fontFamily.Inter18Bold,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  discountTag: {
    color: '#00897B',
    fontSize: 14,
    fontFamily: fontFamily.Inter18Bold,
    marginBottom: 8,
  },
  discountPlaceholder: {
    height: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  originalPrice: {
    fontSize: 19,
    fontFamily: fontFamily.Inter18Medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  currentPrice: {
    fontSize: 30,
    fontFamily: fontFamily.Inter24Bold,
  },
  perMonthPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  perMonthText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  featuresList: {
    width: '100%',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    flex: 1,
  },
  infoIcon: {
    marginLeft: 6,
  },
  knowMoreButton: {
    marginVertical: 8,
    alignSelf: 'center',
  },
  knowMoreText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Bold,
  },
  payNowButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activePaginationDot: {
    width: 20,
  },
  inactivePaginationDot: {
    width: 6,
  },
  viewPackagesBtn: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  viewPackagesText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  dashedDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.8,
    marginHorizontal: 20,
    marginVertical: 14,
  },
  helpSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  helpTitle: {
    fontSize: 14,
    fontFamily: fontFamily.Inter18SemiBold,
    marginBottom: 12,
  },
  helpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  helpButtonText: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Medium,
    marginLeft: 6,
  },
  footerNoteRow: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 6,
  },
  footerNote: {
    fontSize: 11,
    fontFamily: fontFamily.Inter18Regular,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontFamily: fontFamily.Inter18Medium,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
    flex: 1,
    paddingRight: 12,
  },
  bulletList: {
    marginBottom: 14,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  bulletDot: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
    marginTop: -2,
  },
  bulletText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Regular,
    lineHeight: 18,
    flex: 1,
  },
  sheetDivider: {
    borderStyle: 'dashed',
    borderWidth: 0.6,
    marginVertical: 8,
  },
  highlightBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 14,
  },
  highlightBoxText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18SemiBold,
    textAlign: 'center',
    lineHeight: 17,
  },
  comparisonSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  comparisonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonTitle: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Bold,
  },
  comparisonPrice: {
    fontSize: 16,
    fontFamily: fontFamily.Inter24Bold,
  },
  comparisonPerMonth: {
    fontSize: 11,
    fontFamily: fontFamily.Inter18Regular,
    marginTop: 2,
    marginBottom: 10,
  },
  comparisonFeatures: {
    marginBottom: 12,
  },
  comparisonFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  comparisonFeatureText: {
    fontSize: 12,
    fontFamily: fontFamily.Inter18Regular,
    marginLeft: 6,
  },
  comparisonSelectBtn: {
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  comparisonSelectBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: fontFamily.Inter18Bold,
  },
});

export default UpgradeScreen;
