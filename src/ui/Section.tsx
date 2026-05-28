/**
 * Section — labeled vertical group with optional trailing action.
 *
 *   <Section title="Account" action={<Pressable onPress={...}><AppText tone="primary">Edit</AppText></Pressable>}>
 *     <ListItem ... />
 *     <ListItem ... />
 *   </Section>
 */

import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';

type Props = PropsWithChildren<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
}>;

export function Section({ title, description, action, children }: Props) {
  return (
    <View style={styles.wrap}>
      {(title || action) && (
        <View style={styles.header}>
          {title ? (
            <AppText variant="eyebrow" tone="muted">
              {title}
            </AppText>
          ) : (
            <View />
          )}
          {action}
        </View>
      )}
      {description ? (
        <AppText variant="caption" tone="muted" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  description: { marginTop: -2, marginBottom: 2 },
  body: { gap: 8 },
});
