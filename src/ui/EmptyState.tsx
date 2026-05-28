import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { Card } from './Card';

type Props = {
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  body?: string;
  action?: React.ReactNode;
};

/**
 * EmptyState — friendly, themed placeholder. Used wherever a list could be empty
 * (history, search results, etc.).
 */
export function EmptyState({ icon = 'inbox', title, body, action }: Props) {
  const colors = useNavigationColors();
  return (
    <Card tone="surface" bordered elev="none" density="comfortable" style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryMuted }]}>
        <MaterialIcons name={icon} size={26} color={colors.primary} />
      </View>
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {body ? (
        <AppText variant="bodySm" tone="muted" align="center">
          {body}
        </AppText>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: 10, paddingVertical: 28 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  action: { marginTop: 8, alignSelf: 'stretch' },
});
