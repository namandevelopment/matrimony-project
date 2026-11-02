import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import COLORS from '../../../components/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '../../../redux/useSelector';
import { get_Profile_Call } from '../../../redux/useDispatch';
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
import PromotionalPopupModal, { MobilePromotionalPopup } from '../../../customModals/PromotionalPopupModal';
import { ApiURL } from '../../../redux/apiService/endpoint';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [primeModalVisible, setPrimeModalVisible] = useState(false);
  const [promoPopup, setPromoPopup] = useState<MobilePromotionalPopup | null>(null);
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const scrollViewRef = useRef<ScrollView>(null);
  const dailyRecYRef = useRef<number>(0);

  // Fetch active promotional popups with Ludo King Daily-Cap filter
  useEffect(() => {
    let isMounted = true;
    const today = new Date().toISOString().split('T')[0];
    const userId = profile?.matrimonyId || profile?._id || 'guest_mobile';

    const fetchPopup = async () => {
      try {
        const query = new URLSearchParams({
          placement: 'MOBILE_HOME',
          platform: 'MOBILE',
          userId: String(userId),
          clientDate: today,
        }).toString();

        const res = await fetch(ApiURL.activePopups(query), {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': String(userId),
          },
        });
        const json = await res.json();
        const popups: MobilePromotionalPopup[] = json?.data?.popups || [];

        if (isMounted && popups.length > 0) {
          setPromoPopup(popups[0]);
          setPromoModalVisible(true);

          // Track impression
          fetch(ApiURL.popupInteraction(popups[0].id || popups[0].popupId || ''), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'IMPRESSION' }),
          }).catch(() => {});
        }
      } catch {}
    };

    fetchPopup();
    return () => {
      isMounted = false;
    };
  }, [profile?.matrimonyId, profile?._id]);

  const handleClosePromoPopup = useCallback(() => {
    if (!promoPopup) return;
    const targetId = promoPopup.id || promoPopup.popupId || '';
    const today = new Date().toISOString().split('T')[0];
    const userId = profile?.matrimonyId || profile?._id || 'guest_mobile';

    setPromoModalVisible(false);

    // Call dismiss API (Server records dismissal so won't show again today)
    fetch(ApiURL.dismissPopup(targetId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: String(userId),
        clientDate: today,
        reason: 'USER_CLICKED_CROSS_CLOSE',
      }),
    }).catch(() => {});
  }, [promoPopup, profile]);

  const handlePromoCtaPress = useCallback(
    (p: MobilePromotionalPopup) => {
      setPromoModalVisible(false);
      const targetId = p.id || p.popupId || '';

      fetch(ApiURL.popupInteraction(targetId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CLICK' }),
      }).catch(() => {});

      navigation.navigate('accountSettings');
    },
    [navigation]
  );

  useEffect(() => {
    if (!profile) {
      get_Profile_Call(dispatch);
    }
  }, [dispatch, profile]);

  const completenessScore = profile?.completenessScore || 52;

  useEffect(() => {
    if (route?.params?.scrollTo === 'dailyRecommendation') {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, dailyRecYRef.current - 8),
          animated: true,
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [route?.params?.scrollTo, route?.params?.timestamp]);

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
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >

        <CelebratingBanner onPress={() => {
          navigation.navigate('Upgrade')
        }} />


        <CompleteProfileSection score={completenessScore} />

        <View
          onLayout={(e) => {
            dailyRecYRef.current = e.nativeEvent.layout.y;
          }}
        >
          <DailyRecommendationsSection
            onProfilePress={(profile: DailyRecommendation) => {
              console.log('Daily recommendation selected:', profile.name);
            }}
            onViewAll={() => {
              navigation.navigate('Matches');
            }}
          />
        </View>

        <AllMatchesSection
          onProfilePress={(profile: MatchProfile) => {
            console.log('Match selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        <HomePlanAdBanner
          onPayPress={() => {
            navigation.navigate('Upgrade');
          }}
        />

        <NewMatchesSection
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
          onProfilePress={(profile: ViewedProfile) => {
            console.log('Who viewed you selected:', profile.name);
          }}
          onViewAll={() => {
            navigation.navigate('Matches');
          }}
        />

        {/* Profiles You Viewed Section */}
        <ProfilesYouViewedSection
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
            navigation.navigate('SuccessStoryDetailScreen', { story, id: story.id });
          }}
          onViewAll={() => {
            navigation.navigate('SuccessStoriesListScreen');
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
        <PromotionalPopupModal
          visible={promoModalVisible}
          popup={promoPopup}
          onClose={handleClosePromoPopup}
          onCtaPress={handlePromoCtaPress}
        />
        {/* </ScreenShell>
   */}
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({});
export default HomeScreen;

