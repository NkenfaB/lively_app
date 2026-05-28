import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { haptic } from '@/ui/haptics';
import { useTabBarHeight } from '@/ui/layoutMetrics';

function TabIcon(props: { name: React.ComponentProps<typeof MaterialIcons>['name']; color: string; focused: boolean }) {
  const colors = useNavigationColors();
  return (
    <View style={styles.iconWrap}>
      <MaterialIcons size={22} name={props.name} color={props.color} />
      <View
        style={[
          styles.dot,
          { backgroundColor: props.focused ? colors.primary : 'transparent' },
        ]}
      />
    </View>
  );
}

/** Custom label so we can guarantee the full text shows. The default
 *  react-navigation label clips ("Histo…") on devices where the tab item
 *  width is tight — we render our own with adjustsFontSizeToFit + a small
 *  minimum font scale to ensure it always fits the tab cell. */
function TabLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
      allowFontScaling={false}
      style={[styles.label, { color }]}>
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const colors = useNavigationColors();
  const { totalHeight, bottomPad } = useTabBarHeight();

  return (
    <Tabs
      screenListeners={{
        tabPress: () => haptic.selection(),
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.outline,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineMuted,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingTop: 8,
          paddingBottom: bottomPad,
          height: totalHeight,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          paddingHorizontal: 2,
          justifyContent: 'flex-start',
        },
        tabBarIconStyle: { marginTop: 2 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
          tabBarLabel: ({ color }) => <TabLabel label="Home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => <TabIcon name="history" color={color} focused={focused} />,
          tabBarLabel: ({ color }) => <TabLabel label="History" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon name="settings" color={color} focused={focused} />,
          tabBarLabel: ({ color }) => <TabLabel label="Settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
