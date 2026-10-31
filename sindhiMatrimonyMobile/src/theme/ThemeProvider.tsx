import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Appearance,
  AppState,
  AppStateStatus,
  ColorSchemeName,
  useColorScheme,
} from 'react-native';
import { Storage } from '../storage/Storage';
import {
  ThemeColors,
  ThemeMode,
  themeColorMap,
} from './colors';

export type ThemePreference = 'system' | ThemeMode;

export interface ThemeContextValue {
  /**
   * User preference: 'system' | 'light' | 'dark'
   */
  preference: ThemePreference;

  /**
   * Active resolved mode: 'light' | 'dark'
   */
  mode: ThemeMode;

  /**
   * Boolean flag for dark mode
   */
  isDark: boolean;

  /**
   * Active design system color tokens
   */
  colors: ThemeColors;

  /**
   * Update theme preference (persists automatically in MMKV Storage)
   */
  setPreference: (preference: ThemePreference) => Promise<void>;

  /**
   * Toggle directly between light and dark
   */
  toggleTheme: () => Promise<void>;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultPreference?: ThemePreference;
}

const THEME_PREFERENCE_KEY = 'theme-preference';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Root ThemeProvider component.
 * - Reads preference synchronously from MMKV Storage to prevent cold-start theme flicker.
 * - Listens to system theme changes via Appearance, AppState, and useColorScheme.
 * - Persists preference changes instantly.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultPreference = 'system',
}) => {
  const systemColorScheme = useColorScheme();

  // 1. Initial synchronous system scheme detection
  const [activeSystemScheme, setActiveSystemScheme] = useState<ThemeMode>(() => {
    const initial = Appearance.getColorScheme();
    return initial === 'dark' ? 'dark' : 'light';
  });

  // 2. Initial synchronous preference read from MMKV (eliminates theme flash)
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    try {
      const saved = Storage.getItemSync<string>(THEME_PREFERENCE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved as ThemePreference;
      }
    } catch {
      // Fallback
    }
    return defaultPreference;
  });

  const preferenceRef = useRef<ThemePreference>(preference);
  preferenceRef.current = preference;

  // 3. System Theme Sync (Appearance + AppState foreground wakeups)
  useEffect(() => {
    const updateScheme = (colorScheme?: ColorSchemeName | null) => {
      const current =
        colorScheme === 'dark' || colorScheme === 'light'
          ? colorScheme
          : Appearance.getColorScheme();
      if (current === 'dark' || current === 'light') {
        setActiveSystemScheme(prev => (prev !== current ? current : prev));
      }
    };

    const appearanceSub = Appearance.addChangeListener(({ colorScheme }) => {
      updateScheme(colorScheme);
    });

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        updateScheme(Appearance.getColorScheme());
      }
    };
    const appStateSub = AppState.addEventListener('change', handleAppStateChange);

    // Initial check on mount
    updateScheme(Appearance.getColorScheme());

    return () => {
      appearanceSub.remove();
      appStateSub.remove();
    };
  }, []);

  // 4. useColorScheme hook sync
  useEffect(() => {
    if (systemColorScheme === 'dark' || systemColorScheme === 'light') {
      setActiveSystemScheme(prev => (prev !== systemColorScheme ? systemColorScheme : prev));
    }
  }, [systemColorScheme]);

  // 5. Update preference with persistence
  const setPreference = useCallback(async (nextPreference: ThemePreference): Promise<void> => {
    if (nextPreference === preferenceRef.current) return; // Bail out if unchanged
    try {
      await Storage.setItem(THEME_PREFERENCE_KEY, nextPreference);
      setPreferenceState(nextPreference);
    } catch (error) {
      console.warn('⚠️ [ThemeProvider] Failed to save theme preference:', error);
      setPreferenceState(nextPreference);
    }
  }, []);

  // 6. Toggle directly between light & dark
  const toggleTheme = useCallback(async (): Promise<void> => {
    const currentMode = preferenceRef.current === 'system'
      ? activeSystemScheme
      : preferenceRef.current;
    const nextMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
    await setPreference(nextMode);
  }, [activeSystemScheme, setPreference]);

  // 7. Resolve active mode
  const mode: ThemeMode = preference === 'system' ? activeSystemScheme : preference;
  const isDark = mode === 'dark';
  const colors = themeColorMap[mode];

  // 8. Memoized context value
  const contextValue = useMemo<ThemeContextValue>(() => ({
    preference,
    mode,
    isDark,
    colors,
    setPreference,
    toggleTheme,
  }), [preference, mode, isDark, colors, setPreference, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Access full theme context: mode, preference, isDark, colors, setPreference, toggleTheme.
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Fast access to active theme colors directly.
 */
export const useThemeColors = (): ThemeColors => {
  const { colors } = useTheme();
  return colors;
};

/**
 * Fast access to theme preference & setter.
 */
export const useThemePreference = (): Pick<ThemeContextValue, 'preference' | 'setPreference'> => {
  const { preference, setPreference } = useTheme();
  return { preference, setPreference };
};

/**
 * Boolean hook for dark mode check.
 */
export const useIsDark = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook to generate and memoize styles based on active theme colors.
 * Automatically recalculates styles only when the theme mode or colors change.
 *
 * @example
 * const styles = useThemedStyles((colors, isDark) => StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     backgroundColor: colors.background,
 *   },
 *   title: {
 *     color: colors.text,
 *   },
 * }));
 */
export const useThemedStyles = <T,>(
  stylesFactory: (colors: ThemeColors, isDark: boolean) => T,
): T => {
  const { colors, isDark } = useTheme();
  return useMemo(() => stylesFactory(colors, isDark), [colors, isDark, stylesFactory]);
};

export default ThemeProvider;
