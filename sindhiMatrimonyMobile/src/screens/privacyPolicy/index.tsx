import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/headers/CustomHeader';
import CustomLucidIcons from '../../components/CustomLucidIcons';
import fontFamily from '../../components/fontFamily';
import { clientPhoneNumber } from '../../utils/ClientData';

const HEADER_COLOR = '#DB2F3C';
const SUPPORT_EMAIL = 'helpdesk@sindhimarriage.in';
const SUPPORT_PHONE = clientPhoneNumber || '9672446220';

interface PolicySection {
  id: string;
  category: 'overview' | 'data' | 'permissions' | 'sharing' | 'security';
  title: string;
  badge?: string;
  content: string[];
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'overview',
    category: 'overview',
    title: 'Privacy Commitment & Scope',
    badge: 'Overview',
    content: [
      'sindhimarriage.in and neelimamarriage.com are dedicated online matrimonial platforms endeavouring constantly to deliver trusted matrimonial matchmaking services.',
      'We are strongly committed to safeguarding your right to privacy. This Privacy Policy details the types of personal data we gather, how we utilize and protect it, and your rights concerning your personal information.',
      'You acknowledge that you share information voluntarily. By accessing or using our websites or mobile applications, you consent to the collection, storage, and processing of your details in compliance with this Privacy Policy and applicable data protection regulations.',
    ],
  },
  {
    id: 'info_collected',
    category: 'data',
    title: '1. Information We Collect',
    badge: 'Data Collection',
    content: [
      'User-Provided Information: Profile photos, full name, email address, date of birth, contact number, educational qualifications, occupation, mailing address, PIN code, and user-specified account password.',
      'Payment Information: Secure third-party payment gateways handle transaction data (debit/credit card, UPI, net banking). We do not store sensitive CVV or banking credentials on our local servers.',
      'Device & Usage Data: When you access our application, technical details including device model, OS version, device ID, log files, IP address, and network details are collected automatically to identify and fix technical anomalies.',
      'Social Logins: If you opt to register or link through Google or other social platforms, we receive basic profile info authorized by your social settings.',
    ],
  },
  {
    id: 'app_permissions',
    category: 'permissions',
    title: '2. Mobile App Permissions & Justification',
    badge: 'Permissions',
    content: [
      'Camera: Required to allow users to capture recent photos and upload them directly as verified profile pictures.',
      'Storage & Gallery: Enables uploading profile pictures and horoscope documents from device memory, as well as saving matching summaries.',
      'Location: Assists in suggesting prospective matches residing in your preferred geographical vicinity or nearby areas.',
      'SMS / Phone: Optimized detection of incoming verification SMS for automatic OTP verification, ensuring quick and secure account login.',
      'Network State: Used to monitor network connectivity and optimize image delivery across varying cellular speeds.',
    ],
  },
  {
    id: 'usage',
    category: 'data',
    title: '3. How We Use Collected Information',
    badge: 'Usage',
    content: [
      'Matchmaking: Connecting you with relevant prospect matches based on your individual preferences, mutual compatibility criteria, and community parameters.',
      'Account Security: Authenticating login attempts, preventing duplicate or fake profiles, and investigating unauthorized access.',
      'Communication: Sending match alerts, prospective interest updates, and transactional receipts via WhatsApp, SMS, or email.',
      'Platform Improvement: Conducting research and analytics to optimize application features and enhance matchmaking algorithms.',
    ],
  },
  {
    id: 'sharing',
    category: 'sharing',
    title: '4. Information Sharing & Disclosures',
    badge: 'Sharing',
    content: [
      'Visible Match Information: Selected profile details and photos are visible only to fellow registered members searching within compatible criteria.',
      'No Selling of Data: We never sell or rent your personal contact information to third-party advertising companies.',
      'Legal & Statutory Compliance: We cooperate fully with statutory authorities, law enforcement agencies, and judicial courts if required under Indian law to prevent fraud or safeguard member safety.',
      'Verified Service Providers: Data may be securely shared with vetted technology partners (e.g., SMS gateways, payment aggregators, cloud hosts) strictly to execute core app services.',
    ],
  },
  {
    id: 'retention',
    category: 'security',
    title: '5. Data Retention & Account Deletion',
    badge: 'Retention',
    content: [
      'We retain your personal information for as long as your membership is active or as necessary to provide matrimonial services.',
      'Members have the right to request deletion or deactivation of their profile at any time through application settings or by writing to our support desk.',
      'Upon verified profile deletion, personal records are permanently purged or anonymized, subject only to mandatory legal compliance requirements.',
    ],
  },
  {
    id: 'security_measures',
    category: 'security',
    title: '6. Security Safeguards',
    badge: 'Security',
    content: [
      'We apply rigorous industry-standard administrative, physical, and technical controls including SSL/TLS encryption to protect your sensitive data against unauthorized disclosure or loss.',
      'All financial payments are handled over encrypted 256-bit payment gateway connections complying with RBI guidelines.',
      'Members are reminded to keep their passwords secure and refrain from sharing verification OTPs with anyone.',
    ],
  },
  {
    id: 'grievance',
    category: 'security',
    title: '7. Grievance Officer & Contact',
    badge: 'Redressal',
    content: [
      'In accordance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, our Grievance Officer handles privacy complaints and content queries.',
      `Helpdesk Email: ${SUPPORT_EMAIL}`,
      `Helpline: +91-${SUPPORT_PHONE}`,
      'Working Hours: 10:00 AM to 6:00 PM IST (Monday to Saturday, excluding public holidays).',
      'Portals: https://sindhimarriage.in | https://neelimamarriage.com',
    ],
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'data', label: 'Data Collected' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'sharing', label: 'Sharing' },
  { key: 'security', label: 'Security' },
];

const PrivacyPolicyScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('ProfileScreen');
    }
  }, [navigation]);

  const handleCallSupport = useCallback(() => {
    Linking.openURL(`tel:+91${SUPPORT_PHONE}`).catch(() => {});
  }, []);

  const handleEmailSupport = useCallback(() => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {});
  }, []);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return POLICY_SECTIONS.filter(sec => {
      const matchTab = selectedTab === 'all' || sec.category === selectedTab;
      if (!matchTab) return false;
      if (!q) return true;
      const titleMatch = sec.title.toLowerCase().includes(q);
      const contentMatch = sec.content.some(c => c.toLowerCase().includes(q));
      return titleMatch || contentMatch;
    });
  }, [searchQuery, selectedTab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={HEADER_COLOR} />
      <CustomHeader
        title="Privacy Policy"
        backgroundColor={HEADER_COLOR}
        titleColor="#FFFFFF"
        showBack={true}
        backIconColor="#FFFFFF"
        onBackPress={handleBack}
      />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <CustomLucidIcons name="search" size={17} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search privacy, camera, permissions, data..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CustomLucidIcons name="x" size={16} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Tabs */}
        <View style={styles.tabScrollWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {FILTER_TABS.map(tab => {
              const isActive = selectedTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setSelectedTab(tab.key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Banner */}
          <View style={styles.heroCard}>
            <View style={styles.portalBadgeRow}>
              <View style={styles.portalPill}>
                <Text style={styles.portalPillText}>sindhimarriage.in</Text>
              </View>
              <Text style={styles.portalDividerText}>&</Text>
              <View style={styles.portalPill}>
                <Text style={styles.portalPillText}>neelimamarriage.com</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>Privacy Policy & Data Protection</Text>
            <Text style={styles.heroSubtitle}>
              Transparency on how we collect, safeguard, and utilize your personal matrimonial information.
            </Text>
            <View style={styles.lastUpdatedRow}>
              <CustomLucidIcons name="lock" size={14} color="#10B981" />
              <Text style={styles.lastUpdatedText}>Encrypted & confidential matrimonial processing</Text>
            </View>
          </View>

          {/* Section Cards */}
          {filteredSections.map(section => {
            const isExpanded = expandedSection === section.id;
            return (
              <View key={section.id} style={styles.sectionCard}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                  onPress={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <View style={styles.sectionTitleArea}>
                    {section.badge && (
                      <View style={styles.sectionBadge}>
                        <Text style={styles.sectionBadgeText}>{section.badge}</Text>
                      </View>
                    )}
                    <Text style={styles.sectionTitleText}>{section.title}</Text>
                  </View>
                  <CustomLucidIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#5A6578"
                  />
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.sectionBody}>
                  {section.content.map((paragraph, idx) => (
                    <View key={`sec-${section.id}-p-${idx}`} style={styles.paragraphRow}>
                      <View style={styles.bulletDot} />
                      <Text style={styles.paragraphText}>{paragraph}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {filteredSections.length === 0 && (
            <View style={styles.emptyState}>
              <CustomLucidIcons name="file-question" size={36} color="#9E9E9E" />
              <Text style={styles.emptyStateText}>No policy matching "{searchQuery}"</Text>
            </View>
          )}

          {/* Support Banner */}
          <View style={styles.supportBanner}>
            <Text style={styles.supportBannerTitle}>Questions About Your Privacy?</Text>
            <Text style={styles.supportBannerDesc}>
              Reach out to our privacy and support desk for assistance with account data or permissions.
            </Text>
            <View style={styles.supportActionRow}>
              <TouchableOpacity
                style={styles.supportButton}
                activeOpacity={0.8}
                onPress={handleCallSupport}
              >
                <CustomLucidIcons name="phone" size={15} color="#FFFFFF" />
                <Text style={styles.supportButtonText}>Call Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.supportButton, styles.supportButtonOutline]}
                activeOpacity={0.8}
                onPress={handleEmailSupport}
              >
                <CustomLucidIcons name="mail" size={15} color={HEADER_COLOR} />
                <Text style={[styles.supportButtonText, styles.supportButtonOutlineText]}>
                  Email Privacy Desk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: HEADER_COLOR,
    flex: 1,
  },
  container: {
    backgroundColor: '#F5F6F9',
    flex: 1,
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E8ECF1',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    color: '#1F2937',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 13,
    padding: 0,
  },
  tabScrollWrap: {
    marginVertical: 10,
  },
  tabsContainer: {
    gap: 8,
    paddingHorizontal: 16,
  },
  tabButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tabButtonActive: {
    backgroundColor: HEADER_COLOR,
    borderColor: HEADER_COLOR,
  },
  tabButtonText: {
    color: '#64748B',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 12,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8ECF1',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  portalBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  portalPill: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  portalPillText: {
    color: HEADER_COLOR,
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 11,
  },
  portalDividerText: {
    color: '#9CA3AF',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
  },
  heroTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  lastUpdatedRow: {
    alignItems: 'center',
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingTop: 8,
  },
  lastUpdatedText: {
    color: '#059669',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8ECF1',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 10,
    overflow: 'hidden',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitleArea: {
    flex: 1,
    gap: 4,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    color: '#475569',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 10,
  },
  sectionTitleText: {
    color: '#1F2937',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionBody: {
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
  },
  paragraphRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  bulletDot: {
    backgroundColor: HEADER_COLOR,
    borderRadius: 3,
    height: 6,
    marginTop: 6,
    width: 6,
  },
  paragraphText: {
    color: '#4B5563',
    flex: 1,
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12.5,
    lineHeight: 19,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontFamily: fontFamily.Inter18Medium,
    fontSize: 13,
    marginTop: 10,
  },
  supportBanner: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8ECF1',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 16,
  },
  supportBannerTitle: {
    color: '#111827',
    fontFamily: fontFamily.Inter18Bold,
    fontSize: 14,
    marginBottom: 4,
  },
  supportBannerDesc: {
    color: '#6B7280',
    fontFamily: fontFamily.Inter18Regular,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  supportActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  supportButton: {
    alignItems: 'center',
    backgroundColor: HEADER_COLOR,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontFamily: fontFamily.Inter18SemiBold,
    fontSize: 12,
  },
  supportButtonOutline: {
    backgroundColor: '#FFFFFF',
    borderColor: HEADER_COLOR,
    borderWidth: 1,
  },
  supportButtonOutlineText: {
    color: HEADER_COLOR,
  },
});

export default PrivacyPolicyScreen;

