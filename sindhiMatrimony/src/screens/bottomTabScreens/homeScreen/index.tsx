import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import COLORS from '../../../components/colors';
import { useNavigation } from '@react-navigation/native';
import HomeProfileTab from '../components/HomeProfileTab';
import CompleteProfileSection from '../components/CompleteProfileSection';
import DailyRecommendationsSection, { DailyRecommendation } from '../components/DailyRecommendationsSection';
import AllMatchesSection, { MatchProfile } from '../components/AllMatchesSection';
import HomePlanAdBanner from '../components/HomePlanAdBanner';
import NewMatchesSection, { NewMatchProfile } from '../components/NewMatchesSection';
import AssistedServiceBanner from '../components/AssistedServiceBanner';
import WhoViewedYouSection, { ViewedProfile } from '../components/WhoViewedYouSection';
import ProfilesYouViewedSection, { MyViewedProfile } from '../components/ProfilesYouViewedSection';
import LimcaRecordBanner from '../components/LimcaRecordBanner';
import SuccessStoriesSection, { SuccessStory } from '../components/SuccessStoriesSection';
import HomeFooterSupportSection from '../components/HomeFooterSupportSection';
import PrimeModal from '../../../customModals/PrimeModal';
import CelebratingBanner from '../components/CelebratingBanner';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [primeModalVisible, setPrimeModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }} >
      <StatusBar
        backgroundColor={'#FFF'}
        barStyle={'dark-content'} // Or 'light-content'
      />
      <HomeProfileTab
        onPressPrime={() => {
          setPrimeModalVisible(true)
          console.log('Prime pressed')
        }}
        onPressBanner={() => {
          navigation.navigate('Upgrade')
        }}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

        <CelebratingBanner onPress={() => {
          navigation.navigate('Upgrade')
        }} />


        <CompleteProfileSection score={52} />

        <DailyRecommendationsSection
          onProfilePress={(profile: DailyRecommendation) => {
            console.log('Daily recommendation selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        <AllMatchesSection
          matchCount={497}
          onProfilePress={(profile: MatchProfile) => {
            console.log('Match selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        <HomePlanAdBanner
          planName="Silver - 1 month"
          originalPrice={1800}
          discountedPrice={990}
          onPayPress={() => {
            navigation.navigate('Upgrade');
          }}
        />

        <NewMatchesSection
          matchCount={17}
          onProfilePress={(profile: NewMatchProfile) => {
            console.log('New match selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        {/* Assisted Service AD Banner */}
        <AssistedServiceBanner
          onPressCTA={() => {
            navigation.navigate('Upgrade');
          }}
        />

        {/* Who Viewed You Section */}
        <WhoViewedYouSection
          count={10}
          onProfilePress={(profile: ViewedProfile) => {
            console.log('Who viewed you selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        {/* Profiles You Viewed Section */}
        <ProfilesYouViewedSection
          count={27}
          onProfilePress={(profile: MyViewedProfile) => {
            console.log('Profile viewed selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        {/* Limca Record AD / Social Proof Banner */}
        <LimcaRecordBanner />

        {/* Success Stories Section */}
        <SuccessStoriesSection
          onStoryPress={(story: SuccessStory) => {
            console.log('Success story selected:', story.coupleName);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        {/* Footer Support & Wedding Services Section */}
        <HomeFooterSupportSection />
        <PrimeModal
          visible={primeModalVisible}
          onClose={() => setPrimeModalVisible(false)}
          onAddPhoto={() => console.log('Add photo pressed')}
          step={1}
          totalSteps={2}
        />
        {/* </ScreenShell>
   */}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({});
export default HomeScreen;

