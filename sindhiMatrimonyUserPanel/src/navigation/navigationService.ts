/* eslint-disable @next/next/no-location-assign-relative-destination */
/**
 * Web Navigation Service
 * Sindhi Matrimony Application (Web / Next.js)
 *
 * Provides routing and screen navigation helpers for browser environment.
 */

const routeMap: Record<string, string> = {
  LoginScreen: '/#login',
  Login: '/#login',
  LandingScreen: '/',
  HomeScreen: '/',
  DashboardScreen: '/dashboard',
  RegistrationScreen: '/registration',
  OnboardingScreen: '/onboarding',
  NotificationsScreen: '/notifications',
  MessagesScreen: '/messages',
  MatchesScreen: '/matches',
  SearchScreen: '/search',
  ProfileScreen: '/profile',
};

export const reset = (routeName: string, _params?: any): void => {
  if (typeof window === 'undefined') return;

  const destination = routeMap[routeName] || (routeName.startsWith('/') ? routeName : `/${routeName.toLowerCase()}`);

  try {
    if (routeName === 'LoginScreen' || routeName === 'Login') {
      // Dispatches custom event so active UI components (e.g. Header, LandingScreen) can instantly open login modal
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
    window.location.href = destination;
  } catch {
    window.location.href = '/';
  }
};

export const navigate = (routeName: string, params?: any): void => {
  reset(routeName, params);
};

export const goBack = (): void => {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
};

const navigationService = {
  reset,
  navigate,
  goBack,
};

export default navigationService;
