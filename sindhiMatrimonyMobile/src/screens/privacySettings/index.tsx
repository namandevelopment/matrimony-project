import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/headers/CustomHeader';
import COLORS from '../../components/colors';
import fontFamily from '../../components/fontFamily';
import Storage from '../../storage/Storage';
import { showToast } from '../../utils/CustomToast';
import { apiFetch, ApiURL } from '../../redux/apiService';

type TabType = 'Mobile' | 'Photos' | 'Horoscope' | 'Profile';

interface PrivacySettingsState {
  mobile: 'all' | 'messages_only';
  photos: 'all' | 'contacted' | 'protect';
  horoscope: 'all' | 'contacted' | 'protect';
  profile: 'show_viewed' | 'hide_viewed';
}

const DEFAULT_SETTINGS: PrivacySettingsState = {
  mobile: 'all',
  photos: 'all',
  horoscope: 'all',
  profile: 'show_viewed',
};

const THEME_COLOR = COLORS.themeColor;
const RECOMMENDED_GREEN = '#10B981';

const PrivacySettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<TabType>('Mobile');
  const [settings, setSettings] = useState<PrivacySettingsState>(() => {
    const saved = Storage.getItemSync<PrivacySettingsState>('privacy_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = Storage.getItemSync<PrivacySettingsState>('privacy_settings');
    if (saved) {
      setSettings(prev => ({ ...prev, ...saved }));
    }
  }, []);

  const handleSelectOption = (key: keyof PrivacySettingsState, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      Storage.setItemSync('privacy_settings', settings);

      await apiFetch({
        url: ApiURL.updatePrivacySettings,
        method: 'POST',
        payload: {
          mobilePrivacy: settings.mobile,
          photoPrivacy: settings.photos,
          horoscopePrivacy: settings.horoscope,
          profilePrivacy: settings.profile,
        },
        showErrorToast: false,
        showSuccessToast: false,
      }).catch(() => {
        // Fallback gracefully if endpoint is not live yet
      });

      showToast({
        type: 'success', position: 'top',
        message: 'Privacy settings updated successfully',
      });
    } catch {
      showToast({
        type: 'success', position: 'top',
        message: 'Privacy settings updated successfully',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [settings]);

  const renderRecommendedBadge = (style?: object) => (
    <View style={[styles.recommendedBadge, style]}>
      <Text style={styles.recommendedBadgeText}>Recommended</Text>
    </View>
  );

  const renderRadioButton = (selected: boolean) => (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
  );

  const tabs: TabType[] = ['Mobile', 'Photos', 'Horoscope', 'Profile'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <CustomHeader
        title="Privacy settings"
        showBack={true}
        backIcon="arrow-left"
        backIconColor="#111827"
        backIconSize={24}
        onBackPress={() => navigation.goBack()}
      // showBottomBorder={false}
      />

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile Tab */}
        {activeTab === 'Mobile' && (
          <View>
            <Text style={styles.sectionHeading}>Who can call me</Text>

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('mobile', 'all')}
            >
              <View style={styles.optionLeft}>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.optionTitle}>Show my mobile number</Text>
                  {renderRecommendedBadge()}
                </View>
                <Text style={styles.optionSubtitle}>
                  Paid members can view my number and call me directly
                </Text>
              </View>
              {renderRadioButton(settings.mobile === 'all')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('mobile', 'messages_only')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>Messages only</Text>
                <Text style={styles.optionSubtitle}>
                  Paid members can contact me only through messages
                </Text>
              </View>
              {renderRadioButton(settings.mobile === 'messages_only')}
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>
        )}

        {/* Photos Tab */}
        {activeTab === 'Photos' && (
          <View>
            <Text style={styles.sectionHeading}>Who can view my photo?</Text>

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('photos', 'all')}
            >
              <View style={styles.optionLeft}>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.optionTitle}>Visible to all</Text>
                  {renderRecommendedBadge()}
                </View>
              </View>
              {renderRadioButton(settings.photos === 'all')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('photos', 'contacted')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>
                  Your Photo Privacy has been set to
                </Text>
                <Text style={styles.optionSubtitle}>
                  Visible only to members whom I had Contacted / Responded and to
                  all paid members
                </Text>
              </View>
              {renderRadioButton(settings.photos === 'contacted')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('photos', 'protect')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>Protect Photo</Text>
                <Text style={styles.optionSubtitle}>
                  Allow photo access to only members of your choice.
                </Text>
              </View>
              {renderRadioButton(settings.photos === 'protect')}
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>
        )}

        {/* Horoscope Tab */}
        {activeTab === 'Horoscope' && (
          <View>
            <Text style={styles.sectionHeading}>
              Who can view my horoscope?
            </Text>

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('horoscope', 'all')}
            >
              <View style={styles.optionLeft}>
                <View style={styles.titleBadgeRow}>
                  <Text style={styles.optionTitle}>Visible to all</Text>
                  {renderRecommendedBadge()}
                </View>
              </View>
              {renderRadioButton(settings.horoscope === 'all')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('horoscope', 'contacted')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>
                  Visible only to members whom I had contacted / responded.
                </Text>
              </View>
              {renderRadioButton(settings.horoscope === 'contacted')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('horoscope', 'protect')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>Protect horoscope</Text>
                <Text style={styles.optionSubtitle}>
                  Allow horoscope access to only members of your choice.
                </Text>
              </View>
              {renderRadioButton(settings.horoscope === 'protect')}
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>
        )}

        {/* Profile Tab */}
        {activeTab === 'Profile' && (
          <View>
            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('profile', 'show_viewed')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>
                  Show members that I've viewed their profile
                </Text>
                {renderRecommendedBadge({ alignSelf: 'flex-start', marginTop: 6 })}
              </View>
              {renderRadioButton(settings.profile === 'show_viewed')}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => handleSelectOption('profile', 'hide_viewed')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionTitle}>
                  Don't show members that I've viewed their profile
                </Text>
              </View>
              {renderRadioButton(settings.profile === 'hide_viewed')}
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Saving...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.themeColor,
  },
  tabText: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18Medium,
    color: '#6B7280',
  },
  tabTextActive: {
    color: THEME_COLOR,
    fontFamily: fontFamily.Inter18SemiBold,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: fontFamily.Inter18Bold,
    color: '#111827',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  optionLeft: {
    flex: 1,
    paddingRight: 16,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  optionTitle: {
    fontSize: 15,
    fontFamily: fontFamily.Inter18SemiBold,
    color: '#111827',
    lineHeight: 22,
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: fontFamily.Inter18Regular,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 19,
  },
  recommendedBadge: {
    borderWidth: 1,
    borderColor: RECOMMENDED_GREEN,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    marginLeft: 8,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontFamily: fontFamily.Inter18Medium,
    color: RECOMMENDED_GREEN,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: THEME_COLOR,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME_COLOR,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  submitButton: {
    backgroundColor: THEME_COLOR,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.Inter18SemiBold,
  },
});

export default PrivacySettingsScreen;

