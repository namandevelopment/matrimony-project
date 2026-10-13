/**
 * Global static image registry for Sindhi Matrimony Admin.
 * All image assets are indexed directly with complete paths.
 */
export const IMAGES = {
  adminLogin: new URL('../assets/images/adminLogin.png', import.meta.url).href,
  loginMobile: new URL('../assets/images/loginMobile.png', import.meta.url).href,
  logo: new URL('../assets/images/logo.webp', import.meta.url).href,
  splashscreen: new URL('../assets/images/splashscreen.png', import.meta.url).href,
  userAvatar: new URL('../assets/images/user_avatar.png', import.meta.url).href,
  privacyIcon: new URL('../assets/images/privacy_icon.png', import.meta.url).href,
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;
