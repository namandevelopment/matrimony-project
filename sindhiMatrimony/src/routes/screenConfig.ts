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
];


