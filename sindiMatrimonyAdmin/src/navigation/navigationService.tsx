export let navigateFunction: ((path: string, options?: any) => void) | null = null;

export const setNavigator = (nav: (path: string, options?: any) => void) => {
  navigateFunction = nav;
};

export const navigate = (path: string, options?: any) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  } else if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

export const reset = (path: string, options?: any) => {
  navigate(path, options);
};

export const goBack = () => {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
};

const navigationService = {
  navigate,
  reset,
  goBack,
  setNavigator,
};

export default navigationService;
