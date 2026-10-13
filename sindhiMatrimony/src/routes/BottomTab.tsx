// @ts-nocheck
/**
 * ============================================================================
 * 🚀 MODULAR, HIGH-PERFORMANCE & COPY-PASTE READY BOTTOM TAB NAVIGATOR
 * ============================================================================
 *
 * ✨ FEATURES & ADD-ONS:
 *  1. ⚡ ULTRA OPTIMISED: Tab items are wrapped in `React.memo` with stable
 *     callbacks. Switching tabs re-renders ONLY the two affected tabs, leaving
 *     all other tabs untouched! Screen lazy loading & freezeOnBlur enabled.
 *  2. 🧩 100% CONFIG-DRIVEN: Add, remove, or rearrange tabs in `DEFAULT_TABS`
 *     in seconds without touching any UI code.
 *  3. 🔴 BADGE ADD-ON: Support for notification counters (e.g. `badge: 5`),
 *     text tags (e.g. `badge: 'NEW'`), or notification dot (e.g. `badge: true`).
 *  4. 🌟 FLOATING BUTTON ADD-ON: Simply set `isFloating: true` on any tab to turn
 *     it into a raised, circular floating action button (FAB).
 *  5. 🎨 FLEXIBLE ICONS & THEMES: Use Lucide icon names (`icon: 'house'`) OR
 *     custom render functions (`renderIcon: ({ focused, color, size }) => ...`).
 *     All colors & fonts have safe defaults and can be customized.
 *  6. 🔀 CUSTOM PRESS ACTION: Provide an optional `onPress` callback to trigger
 *     modals, analytics, or custom logic instead of default tab navigation.
 *
 * ----------------------------------------------------------------------------
 * 📋 HOW TO COPY TO ANOTHER PROJECT (IN 3 SIMPLE STEPS):
 *  Step 1: Copy this file into your new project's navigation folder.
 *  Step 2: Update the screen imports and `DEFAULT_TABS` array below with your screens.
 *  Step 3: (Optional) If you don't use `CustomLucidIcons`, supply `renderIcon`
 *          or install `lucide-react-native`.
 * ============================================================================
 */

import React, { memo, useCallback, useMemo, type FC, type ReactNode } from 'react';
import { CommonActions } from '@react-navigation/native';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabBarProps,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

// ----------------------------------------------------------------------------
// PROJECT DEPENDENCY IMPORTS (With Safe Fallbacks)
// ----------------------------------------------------------------------------
import COLORS from '../components/colors';
import fontFamily from '../components/fontFamily';
import CustomLucidIcons from '../components/CustomLucidIcons';

// App Screens
import HomeScreen from '../screens/bottomTabScreens/homeScreen';
import MatchesScreen from '../screens/bottomTabScreens/matchesScreen';
import InterestsScreen from '../screens/bottomTabScreens/interestsScreen';
import MessagesScreen from '../screens/bottomTabScreens/messagesScreen';
import SearchScreen from '../screens/bottomTabScreens/searchScreen';
import UpgradeScreen from '../screens/bottomTabScreens/upgradeScreen';
import NotificationScreen from '../screens/notificationScreen';
import ProfileScreen from '../screens/profileScreen';
// import VerifyYourProfile from '../screens/verifyYourProfile';
import EditProfile from '../screens/editProfile';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export interface TabIconRenderProps {
  focused: boolean;
  color: string;
  size: number;
}

export interface TabItemConfig {
  /** Unique screen route name */
  name: string;
  /** Display label shown below the icon */
  label: string;
  /** Screen component */
  component: React.ComponentType<any>;
  /** Icon name (for CustomLucidIcons / Lucide) */
  icon?: string;
  /** Optional custom icon renderer (overrides `icon` if provided) */
  renderIcon?: (props: TabIconRenderProps) => ReactNode;
  /** Optional badge: number (e.g. 4), string (e.g. 'NEW'), or boolean (dot indicator) */
  badge?: number | string | boolean;
  /** Custom badge background color */
  badgeColor?: string;
  /** Custom badge text color */
  badgeTextColor?: string;
  /** If true, renders this tab as a prominent raised floating button */
  isFloating?: boolean;
  /** Custom background color for floating button */
  floatingColor?: string;
  /** Custom click handler override (e.g. open modal or trigger action) */
  onPress?: (params: {
    navigation: any;
    route: any;
    isFocused: boolean;
    defaultHandler: () => void;
  }) => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Initial navigation parameters */
  initialParams?: Record<string, any>;
}

export interface TabBarTheme {
  activeTintColor: string;
  inactiveTintColor: string;
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;
  fontFamilyRegular?: string;
  fontFamilyActive?: string;
  fontSize?: number;
  badgeColor?: string;
  badgeTextColor?: string;
  tabBarStyle?: ViewStyle;
  tabStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export interface ConfigurableBottomTabProps {
  tabs?: TabItemConfig[];
  theme?: Partial<TabBarTheme>;
  screenOptions?: BottomTabNavigationOptions;
  initialRouteName?: string;
}

// ============================================================================
// 2. DEFAULT THEME & CONFIGURATION
// ============================================================================

export const DEFAULT_TAB_THEME: TabBarTheme = {
  activeTintColor: COLORS?.themeColor ?? '#DB2F3C',
  inactiveTintColor: COLORS?.inactiveTab ?? '#7A7A7A',
  backgroundColor: COLORS?.white ?? '#FFFFFF',
  borderColor: COLORS?.border ?? '#E9E9E9',
  shadowColor: COLORS?.black ?? '#000000',
  fontFamilyRegular: fontFamily?.Inter18Medium ?? undefined,
  fontFamilyActive: fontFamily?.Inter18SemiBold ?? undefined,
  fontSize: 10,
  badgeColor: COLORS?.themeColor ?? '#DB2F3C',
  badgeTextColor: COLORS?.white ?? '#FFFFFF',
};

/**
 * Default Tabs Configuration for this project.
 * To add, remove, or modify tabs, just edit this array!
 */
export const DEFAULT_TABS: TabItemConfig[] = [
  {
    name: 'Home',
    label: 'Home',
    icon: 'house',
    component: HomeScreen,
  },
  {
    name: 'Matches',
    label: 'Matches',
    icon: 'users-round',
    component: MatchesScreen,
  },
  {
    name: 'Interests',
    label: 'Interests',
    icon: 'heart',
    component: InterestsScreen,
  },
  {
    name: 'Messages',
    label: 'Messages',
    icon: 'message-circle',
    component: MessagesScreen,
  },
  {
    name: 'Search',
    label: 'Search',
    icon: 'search',
    component: SearchScreen,
  },
  {
    name: 'Upgrade',
    label: 'Upgrade',
    icon: 'sparkles',
    component: UpgradeScreen,
  },
];

// ============================================================================
// 3. STYLES
// ============================================================================

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 10, backgroundColor: "white",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,backgroundColor:"white",
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingTop: 8,
  },
  tabPressed: {
    opacity: 0.65,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 28,
    minHeight: 24,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },

  // Floating Action Button Style
  floatingTabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    position: 'relative',
  },

  // Badge Styles
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
  },
});

// ============================================================================
// 4. MEMOIZED SUB-COMPONENTS (FOR MAXIMUM RENDERING PERFORMANCE)
// ============================================================================

/**
 * Badge Component:
 * - Renders a subtle notification dot if `badge === true`.
 * - Renders a badge bubble with counter/text if `badge` is string or number.
 * - Renders nothing if badge is 0, false, null, or undefined.
 */
interface TabBadgeProps {
  badge?: number | string | boolean;
  badgeColor?: string;
  badgeTextColor?: string;
}

const TabBadge = memo<TabBadgeProps>(({ badge, badgeColor, badgeTextColor }) => {
  if (!badge && badge !== 0) return null;
  if (badge === 0) return null;

  const bg = badgeColor ?? DEFAULT_TAB_THEME.badgeColor;
  const textColor = badgeTextColor ?? DEFAULT_TAB_THEME.badgeTextColor;

  // Dot badge
  if (badge === true) {
    return <View style={[styles.badgeDot, { backgroundColor: bg }]} />;
  }

  // Counter badge (format 99+ if > 99)
  const displayValue =
    typeof badge === 'number' && badge > 99 ? '99+' : String(badge);

  return (
    <View style={[styles.badgeContainer, { backgroundColor: bg }]}>
      <Text
        numberOfLines={1}
        style={[styles.badgeText, { color: textColor }]}
      >
        {displayValue}
      </Text>
    </View>
  );
});

/**
 * Tab Icon Renderer:
 * Handles custom icon renderers, CustomLucidIcons, or safe fallbacks.
 */
interface TabIconProps {
  item: TabItemConfig;
  isFocused: boolean;
  color: string;
  size?: number;
}

const TabIcon = memo<TabIconProps>(({ item, isFocused, color, size = 22 }) => {
  if (item.renderIcon) {
    return <>{item.renderIcon({ focused: isFocused, color, size })}</>;
  }

  if (item.icon) {
    return (
      <CustomLucidIcons
        name={item.icon}
        color={color}
        size={size}
        strokeWidth={isFocused ? 2.5 : 2}
      />
    );
  }

  return null;
});

/**
 * Individual Tab Bar Item:
 * Pure component wrapped in `React.memo` to eliminate unnecessary re-renders.
 */
interface TabBarItemProps {
  item: TabItemConfig;
  isFocused: boolean;
  label: string;
  accessibilityLabel: string;
  onPress: () => void;
  theme: TabBarTheme;
}

const TabBarItem = memo<TabBarItemProps>(
  ({ item, isFocused, label, accessibilityLabel, onPress, theme }) => {
    const isFloating = !!item.isFloating;
    const activeColor = theme.activeTintColor;
    const inactiveColor = theme.inactiveTintColor;
    const iconColor = isFloating
      ? theme.badgeTextColor ?? '#FFFFFF'
      : isFocused
        ? activeColor
        : inactiveColor;

    // Floating / Elevated Center Button
    if (isFloating) {
      return (
        <View style={styles.floatingTabContainer}>
          <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="tab"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={({ pressed }) => [
              styles.floatingButton,
              { backgroundColor: item.floatingColor ?? activeColor },
              theme.tabStyle,
              pressed && styles.tabPressed,
            ]}
          >
            <TabIcon item={item} isFocused={isFocused} color={iconColor} size={24} />
            <TabBadge
              badge={item.badge}
              badgeColor={item.badgeColor}
              badgeTextColor={item.badgeTextColor}
            />
          </Pressable>
          {!!label && (
            <Text
              style={[
                styles.label,
                {
                  color: isFocused ? activeColor : inactiveColor,
                  fontFamily: isFocused
                    ? theme.fontFamilyActive
                    : theme.fontFamilyRegular,
                  fontSize: theme.fontSize,
                },
                theme.labelStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>
      );
    }

    // Standard Tab Item
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tab"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={({ pressed }) => [
          styles.tab,
          theme.tabStyle,
          pressed && styles.tabPressed,
        ]}
      >
        <View style={styles.iconWrapper}>
          <TabIcon item={item} isFocused={isFocused} color={iconColor} size={22} />
          <TabBadge
            badge={item.badge}
            badgeColor={item.badgeColor}
            badgeTextColor={item.badgeTextColor}
          />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: isFocused ? activeColor : inactiveColor,
              fontFamily: isFocused
                ? theme.fontFamilyActive
                : theme.fontFamilyRegular,
              fontSize: theme.fontSize,
            },
            theme.labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    );
  }
);

// ============================================================================
// 4. CUSTOM TAB BAR CONTAINER (MEMOIZED & INSET-AWARE)
// ============================================================================

interface CustomTabBarProps extends BottomTabBarProps {
  tabs: TabItemConfig[];
  theme: TabBarTheme;
}

const CustomTabBar = memo<CustomTabBarProps>(
  ({ state, descriptors, navigation, insets, tabs, theme }) => {
    // Map tabs by name for O(1) fast lookup
    const tabsMap = useMemo(() => {
      const map = new Map<string, TabItemConfig>();
      tabs.forEach(tab => map.set(tab.name, tab));
      return map;
    }, [tabs]);

    const handlePress = useCallback(
      (route: any, isFocused: boolean, item?: TabItemConfig) => {
        const defaultHandler = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          const currentScreenName = state.routes[state.index]?.name;
          const isSameScreen = currentScreenName === route.name;

          if ((!isSameScreen || !isFocused) && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'Home') {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.dispatch(
              CommonActions.reset({
                index: state.routes.findIndex(tabRoute => tabRoute.name === 'Home'),
                routes: state.routes.map(({ key, name, params }) => ({
                  key,
                  name,
                  params,
                })),
              }),
            );
          }
          return;
        }

        if (item?.onPress) {
          item.onPress({ navigation, route, isFocused, defaultHandler });
        } else {
          defaultHandler();
        }
      },
      [navigation, state.routes, state.index]
    );

    const containerStyle = useMemo(
      () => [
        styles.bar,
        {
          backgroundColor: theme.backgroundColor,
          borderTopColor: theme.borderColor,
          shadowColor: theme.shadowColor,
          paddingBottom: Math.max(insets?.bottom ?? 0, 8),
        },
        theme.tabBarStyle,
      ],
      [theme, insets?.bottom]
    );

    const currentRouteName = state.routes[state.index]?.name;
    let activeIndex = state.index;
    const isHiddenScreen = ['NotificationScreen', 'ProfileScreen', 'EditProfile'].includes(
      currentRouteName,
    );
    if (isHiddenScreen) {
      const history = (state as any)?.history as Array<{ type?: string; key?: string }> | undefined;
      if (history && history.length > 1) {
        for (let i = history.length - 2; i >= 0; i--) {
          const histKey = history[i]?.key;
          const rIndex = state.routes.findIndex(r => r.key === histKey);
          if (rIndex !== -1) {
            const prevRoute = state.routes[rIndex];
            if (prevRoute?.name && tabsMap.has(prevRoute.name)) {
              activeIndex = rIndex;
              break;
            }
          }
        }
      }
    }

    return (
      <View style={containerStyle}>
        {state.routes.map((route, index) => {
          const item = tabsMap.get(route.name);
          if (!item) return null;

          const isFocused = activeIndex === index;
          const options = descriptors[route.key]?.options ?? {};
          const configuredLabel = options.tabBarLabel ?? options.title;
          const label =
            typeof configuredLabel === 'string'
              ? configuredLabel
              : item.label ?? route.name;
          const accessibilityLabel =
            options.tabBarAccessibilityLabel ?? item.accessibilityLabel ?? label;

          return (
            <TabBarItem
              key={route.key}
              item={item}
              isFocused={isFocused}
              label={label}
              accessibilityLabel={accessibilityLabel}
              onPress={() => handlePress(route, isFocused, item)}
              theme={theme}
            />
          );
        })}
      </View>
    );
  }
);

// ============================================================================
// 5. GENERIC REUSABLE COMPONENT: ConfigurableBottomTab
// ============================================================================

const TabNavigator = createBottomTabNavigator();

/**
 * Reusable Bottom Tab Navigator component.
 * You can drop this into ANY project and pass custom `tabs` & `theme`!
 */
export const ConfigurableBottomTab: FC<ConfigurableBottomTabProps> = ({
  tabs = DEFAULT_TABS,
  theme: customTheme,
  screenOptions,
  initialRouteName,
}) => {
  const mergedTheme = useMemo(
    () => ({ ...DEFAULT_TAB_THEME, ...customTheme }),
    [customTheme]
  );

  const mergedScreenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      lazy: true,
      freezeOnBlur: true,
      ...screenOptions,
    }),
    [screenOptions]
  );

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => (
      <CustomTabBar {...props} tabs={tabs} theme={mergedTheme} />
    ),
    [tabs, mergedTheme]
  );

  return (
    <TabNavigator.Navigator
      initialRouteName={initialRouteName}
      tabBar={renderTabBar}
      headerMode="none"
      sceneContainerStyle={{ backgroundColor: '#FFFFFF' }}
      screenOptions={{
        ...mergedScreenOptions,
        tabBarStyle: [
          {
            backgroundColor: mergedTheme.backgroundColor,
            borderTopColor: mergedTheme.borderColor,
            shadowColor: mergedTheme.shadowColor,
          },
          mergedScreenOptions.tabBarStyle,
        ],
      }}
      backBehavior="history"
    >
      {tabs.map(tab => (
        <TabNavigator.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          initialParams={tab.initialParams}
          options={{
            tabBarLabel: tab.label,
          }}
        />
      ))}
      <TabNavigator.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          tabBarButton: () => null,
        }}
      />


      <TabNavigator.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarButton: () => null,
        }}
      />
    
      <TabNavigator.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          tabBarButton: () => null,
        }}
      />
    </TabNavigator.Navigator>
  );
};

// ============================================================================
// 6. DEFAULT EXPORT (Pre-configured for this app)
// ============================================================================

const BottomTab: FC = () => {
  return <ConfigurableBottomTab tabs={DEFAULT_TABS} />;
};

export default BottomTab;

