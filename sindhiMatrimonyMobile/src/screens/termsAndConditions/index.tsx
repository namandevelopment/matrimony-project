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

interface Section {
  id: string;
  category: 'general' | 'eligibility' | 'account' | 'safety' | 'membership' | 'legal';
  title: string;
  badge?: string;
  content: string[];
}

const SECTIONS: Section[] = [
  {
    id: 'scope',
    category: 'general',
    title: 'Scope & Overview',
    badge: 'Overview',
    content: [
      'Welcome to sindhimarriage.in and neelimamarriage.com (herein referred to as "Platform" or "Services"). This electronic document is published in accordance with the provisions of the Information Technology Act, 2000 and Rule 3 (1) of the Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2021.',
      'Our platform acts as a dedicated matchmaking interface enabling users to voluntarily register and search profile(s) for prospective lawful matrimonial alliances. Members may access both free and premium services subject to these terms.',
      'Accessing, browsing, or registering on sindhimarriage.in and neelimamarriage.com constitutes your unconditional agreement to all terms, policies, and guidelines outlined herein.',
    ],
  },
  {
    id: 'eligibility',
    category: 'eligibility',
    title: '1. Eligibility Criteria',
    badge: 'Requirements',
    content: [
      'Membership and rights of admission are strictly reserved for: Indian Nationals & Citizens, Persons of Indian Origin (PIO), Non-Resident Indians (NRI), and individuals of Indian Descent/Heritage seeking lawful matrimony.',
      'Age Requirements: You confirm that you are at least 18 years or above (for women) or 21 years or above (for men).',
      'Marital Status: You must be legally competent to marry under applicable personal laws. If divorced or awaiting divorce, proper legal status ("Awaiting Divorce" / "Divorced") must be accurately disclosed.',
      'Registrant Authority: If creating a profile on behalf of a son, daughter, sibling, or relative, you confirm that you have obtained their full consent before creating and managing the profile.',
    ],
  },
  {
    id: 'registration',
    category: 'account',
    title: '2. Registration & Content Honesty',
    badge: 'Account',
    content: [
      'Accurate Information: You agree to furnish true, updated, and complete personal and family information along with recent authentic photographs (not older than 3 months).',
      'Zero Duplicate Policy: Creation of multiple or duplicate profiles for the same individual is strictly prohibited and liable for immediate termination.',
      'Synthetically Generated Information (SGI): Uploading, publishing, or transmitting AI-generated photos, deepfakes, manipulated media, or synthetic content is strictly forbidden and constitutes a material breach.',
      'Right to Terminate: If any details or photos are found untrue, misleading, or deceptive, the Platform reserves the right to suspend or terminate the membership without prior notice.',
    ],
  },
  {
    id: 'security',
    category: 'account',
    title: '3. Account Security & Confidentiality',
    badge: 'Security',
    content: [
      'You are solely responsible for maintaining the confidentiality of your login credentials (User ID, password, and OTP).',
      'The Platform will never ask for your password or OTP. Never share your security credentials with any individual, including support personnel.',
      'You accept complete responsibility for all activities that occur under your verified account.',
    ],
  },
  {
    id: 'platform_role',
    category: 'general',
    title: '4. Role & Responsibility of Platform',
    badge: 'Platform',
    content: [
      'Matchmaking Interface: Our role is solely to provide an automated search and communication interface based on your chosen partner preferences on an "as is" and "as available" basis.',
      'User Verification Notice: The Platform does not physically authenticate every user’s background or claims. Each member must independently exercise due diligence, verify credentials, and confirm background details.',
      'No Alliance Guarantee: We do not guarantee marriage outcomes, response rates, or uninterrupted service continuity.',
    ],
  },
  {
    id: 'member_responsibilities',
    category: 'safety',
    title: '5. Member Responsibilities & Safe Matrimony',
    badge: 'Safety',
    content: [
      'Financial Caution: Never transfer money or enter into financial transactions with any prospect. Do not share sensitive banking details, credit card numbers, or OTPs.',
      'Respectful Conduct: Using abusive language, harassment, discrimination based on caste/religion/race, or inappropriate sexual overtures will lead to immediate profile ban and legal action.',
      'Family Involvement: We strongly encourage involving family and friends before finalizing meetings or making matrimonial commitments.',
      'Report Suspicious Activity: Immediately report users who request financial aid, share conflicting details, or refuse face-to-face/video verification.',
    ],
  },
  {
    id: 'customer_care',
    category: 'general',
    title: '6. Customer Support & Contact',
    badge: 'Support',
    content: [
      `Support Email: ${SUPPORT_EMAIL}`,
      `Helpline / Contact: +91-${SUPPORT_PHONE}`,
      'Websites: https://sindhimarriage.in | https://neelimamarriage.com',
      'Our customer care desk is dedicated to assisting you with profile management, package inquiries, and technical issues.',
    ],
  },
  {
    id: 'communication',
    category: 'general',
    title: '7. Medium of Communication',
    badge: 'Updates',
    content: [
      'By registering, you consent to receive transactional and relevant matrimonial notifications via SMS, WhatsApp, phone calls, or emails from sindhimarriage.in and neelimamarriage.com.',
      'These communications assist in delivering prospective matches, interest updates, and account status notifications.',
      'Members may adjust communication preferences or contact support to update alert settings.',
    ],
  },
  {
    id: 'grievance',
    category: 'legal',
    title: '8. Grievance Redressal Mechanism',
    badge: 'Compliance',
    content: [
      'In compliance with Rule 3(2) of the Information Technology Rules, 2021, any concerns or complaints regarding inappropriate content, impersonation, or violations may be addressed in writing to our Grievance Officer.',
      `Grievance Email: ${SUPPORT_EMAIL}`,
      'Working Hours: 10:00 AM to 6:00 PM IST (Monday to Saturday, excluding public holidays).',
      'All verified complaints regarding prohibited or sensitive content will be acknowledged and addressed within statutory timelines.',
    ],
  },
  {
    id: 'disputes_liability',
    category: 'legal',
    title: '9. Disputes & Limitation of Liability',
    badge: 'Legal',
    content: [
      'Member Disputes: Communications and interactions between members are solely the personal responsibility of the concerned users. The Platform shall not be party to private disputes.',
      'Liability Cap: Under no circumstances shall the Platform or its management be liable for indirect or consequential damages. Maximum liability is strictly capped at the fee paid by the member for the active package.',
      'Indemnity: Members agree to defend and hold harmless the Platform against any claims, losses, or expenses resulting from their improper or illegal usage of the Services.',
    ],
  },
  {
    id: 'packages_refund',
    category: 'membership',
    title: '10. Packages, Renewal & Refund Policy',
    badge: 'Billing',
    content: [
      'Premium Packages: Members may upgrade to premium membership plans for direct contact views and advanced matchmaking benefits under fair usage limits.',
      'Non-Refundable Policy: Membership and renewal fees once paid are non-refundable and non-transferable under normal circumstances.',
      'Money-Back Scheme: Any specific guarantee schemes apply strictly to eligible self-serve users who fulfill all verification benchmarks (80%+ complete profile, minimum 3 authentic photos, and active outreach).',
    ],
  },
  {
    id: 'child_safety',
    category: 'safety',
    title: '11. Child Protection & Zero Tolerance Policy',
    badge: 'Child Safety',
    content: [
      'The Platform is strictly restricted to adults aged 18 years and older. Minors are not permitted to register or utilize the services.',
      'We maintain absolute zero tolerance against Child Sexual Abuse Material (CSAM) or any form of child exploitation. Any such content will result in instantaneous termination and reporting to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and law enforcement.',
    ],
  },
  {
    id: 'jurisdiction',
    category: 'legal',
    title: '12. Governing Law & Jurisdiction',
    badge: 'Jurisdiction',
    content: [
      'These Terms and Conditions and all associated services are governed by and construed in accordance with the Laws of India.',
      'Any disputes arising out of or related to the usage of sindhimarriage.in or neelimamarriage.com shall be subject to the exclusive jurisdiction of the competent courts of law in India.',
    ],
  },
];

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'account', label: 'Account' },
  { key: 'safety', label: 'Safety' },
  { key: 'membership', label: 'Billing' },
  { key: 'legal', label: 'Legal' },
];

const TermsConditionsScreen: React.FC = () => {
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
    return SECTIONS.filter(sec => {
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
        title="Terms & Conditions"
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
            placeholder="Search terms, refund, safety, rules..."
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

            <Text style={styles.heroTitle}>Terms of Service & Usage Guidelines</Text>
            <Text style={styles.heroSubtitle}>
              Applicable for all services, websites, mobile applications & interactions across our matrimonial network.
            </Text>
            <View style={styles.lastUpdatedRow}>
              <CustomLucidIcons name="shield-check" size={14} color="#10B981" />
              <Text style={styles.lastUpdatedText}>Legal compliance & member safety standards</Text>
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
              <Text style={styles.emptyStateText}>No terms matching "{searchQuery}"</Text>
            </View>
          )}

          {/* Support Banner */}
          <View style={styles.supportBanner}>
            <Text style={styles.supportBannerTitle}>Need Clarification or Legal Assistance?</Text>
            <Text style={styles.supportBannerDesc}>
              Contact our legal and member support team for any queries regarding terms and privacy.
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
                  Email Helpdesk
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

export default TermsConditionsScreen;

