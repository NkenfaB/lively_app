/**
 * Layout metric helpers that other screens / the tab bar can share.
 * Centralizes the math so we have a single source of truth.
 */

import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Pixel breakdown of the bottom tab bar — used both inside the tab bar
 *  and by screens that need extra ScrollView padding so the last item
 *  isn't covered by it. */
export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  // Anything below the gesture/3-button system nav. Floor so the bar
  // doesn't collapse on devices that report 0.
  const minBottomPad = Platform.OS === 'ios' ? 12 : 12;
  const bottomPad = Math.max(insets.bottom, minBottomPad);
  // Icon (~22) + dot (~7) + label (~14) + breathing room.
  const contentHeight = 60;
  const totalHeight = contentHeight + bottomPad;
  return { contentHeight, bottomPad, totalHeight };
}

/** Bottom padding to use on tab-screen ScrollViews/FlatLists so the last
 *  item floats above the tab bar with breathing room. */
export function useTabScreenBottomPad(extra = 24) {
  const { totalHeight } = useTabBarHeight();
  return totalHeight + extra;
}

/** Bottom padding for stack screens (no tab bar) — keeps the final
 *  action button above the Android navigation pill / iOS home indicator
 *  with consistent breathing room. */
export function useStackScreenBottomPad(extra = 24) {
  const insets = useSafeAreaInsets();
  const minBottomPad = Platform.OS === 'ios' ? 12 : 12;
  return Math.max(insets.bottom, minBottomPad) + extra;
}
