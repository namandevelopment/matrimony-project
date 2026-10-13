export let navigateFunction: ((path: string, options?: any) => void) | null = null;

export const setNavigator = (nav: (path: string, options?: any) => void) => {
  navigateFunction = nav;
};

export const navigate = (path: string, options?: any) => {
  if (navigateFunction) {
    navigateFunction(path, options);
  } else {
    window.location.href = path;
  }
};

export const goBack = () => {
  window.history.back();
};
