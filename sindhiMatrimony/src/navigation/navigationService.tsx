import {
  CommonActions,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef: any = createNavigationContainerRef();

export const isNavigationReady = () => navigationRef.isReady();

/**
 * Navigate
 */
export const navigate = (screenName: any, params?: any) => {
  if (isNavigationReady()) {
    navigationRef.navigate(screenName as never, params as never);
  }
};

/**
 * Replace Current Screen
 */
export const replace = (screenName: string, params?: Record<string, any>) => {
  if (isNavigationReady()) {
    navigationRef.dispatch(StackActions.replace(screenName, params));
  }
};

/**
 * Push New Screen
 */
export const push = (screenName: string, params?: Record<string, any>) => {
  if (isNavigationReady()) {
    navigationRef.dispatch(StackActions.push(screenName, params));
  }
};

/**
 * Go Back
 */
export const goBack = () => {
  if (isNavigationReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

/**
 * Pop Screens
 */
export const pop = (count = 1) => {
  if (isNavigationReady()) {
    navigationRef.dispatch(StackActions.pop(count));
  }
};

/**
 * Pop To Top
 */
export const popToTop = () => {
  if (isNavigationReady()) {
    navigationRef.dispatch(StackActions.popToTop());
  }
};

/**
 * Reset Navigation Stack
 */
export const reset = (screenName: string, params?: Record<string, any>) => {
  if (isNavigationReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screenName, params }],
      }),
    );
  }
};

/**
 * Get Current Route
 */
export const getCurrentRoute = () => {
  if (isNavigationReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
};

/**
 * Get Current Route Name
 */
export const getCurrentRouteName = () => {
  return getCurrentRoute()?.name ?? '';
};
