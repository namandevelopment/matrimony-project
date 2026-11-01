import LoginScreen from '../screens/authScreens/LoginScreen';
import LoginWithPassword from '../screens/authScreens/LoginWithPassword';
import ResetPassword from '../screens/authScreens/ResetPassword';
import ValidateOTPScreen from '../screens/authScreens/ValidateOTPScreen';
import SplashScreen from '../screens/splashScreen';
import BottomTab from './BottomTab';
import EditProfile from '../screens/editProfile';
import HelpCenter from '../screens/helpCenter';
import VerifyYourProfile from '../screens/verifyYourProfile';
import AddHoroscope from '../screens/addHoroscope';
import HoroscopeView from '../screens/horoscopeView';
import FamilyDetailsScreen from '../screens/familyDetails';
import SupportChatScreen from '../screens/supportChatScreen';
import SuccessStoryDetailScreen from '../screens/successStoryDetailScreen';
import SuccessStoriesListScreen from '../screens/successStoriesListScreen';
import TermsConditionsScreen from '../screens/termsAndConditions';
import PrivacyPolicyScreen from '../screens/privacyPolicy';
import PartnerPreferenceScreen from '../screens/partnerPreference';
import PrivacySettingsScreen from '../screens/privacySettings';
import AccountSettingsScreen from '../screens/accountSettings';

export const screens = [
  {
    name: 'SplashScreen',
    component: SplashScreen,
  },

  {
    name: 'LoginScreen',
    component: LoginScreen,
  },

  {
    name: 'ResetPassword',
    component: ResetPassword,
  },

  {
    name: 'ValidateOTPScreen',
    component: ValidateOTPScreen,
  },

  {
    name: 'LoginWithPassword',
    component: LoginWithPassword,
  },
  {
    name: 'BottomTab',
    component: BottomTab,
  },

  {
    name: 'EditProfile',
    component: EditProfile,
  },

  {
    name: 'HelpCenter',
    component: HelpCenter,
  },

  {
    name: 'SupportChatScreen',
    component: SupportChatScreen,
  },

  {
    name: 'SuccessStoryDetailScreen',
    component: SuccessStoryDetailScreen,
  },

  {
    name: 'SuccessStoriesListScreen',
    component: SuccessStoriesListScreen,
  },

  {
    name: 'VerifyYourProfile',
    component: VerifyYourProfile,
  },
  {
    name: 'AddHoroscope',
    component: AddHoroscope,
  },
  {
    name: 'Horoscope',
    component: HoroscopeView,
  },
  {
    name: 'HoroscopeView',
    component: HoroscopeView,
  },
  {
    name: 'FamilyDetails',
    component: FamilyDetailsScreen,
  },
  {
    name: 'EditFamilyDetails',
    component: FamilyDetailsScreen,
  },
  {
    name: 'TermsAndConditions',
    component: TermsConditionsScreen,
  },
  {
    name: 'TermsConditionsScreen',
    component: TermsConditionsScreen,
  },
  {
    name: 'PrivacyPolicy',
    component: PrivacyPolicyScreen,
  },
  {
    name: 'PrivacyPolicyScreen',
    component: PrivacyPolicyScreen,
  },
  {
    name: 'PartnerPreferenceScreen',
    component: PartnerPreferenceScreen,
  },
  {
    name: 'PartnerPreference',
    component: PartnerPreferenceScreen,
  },
  {
    name: 'PrivacySettings',
    component: PrivacySettingsScreen,
  },
  {
    name: 'PrivacySettingsScreen',
    component: PrivacySettingsScreen,
  },
  {
    name: 'AccountSettings',
    component: AccountSettingsScreen,
  },
  {
    name: 'AccountSettingsScreen',
    component: AccountSettingsScreen,
  },
];


