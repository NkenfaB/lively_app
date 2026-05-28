/**
 * HeroBanner — image + scrim + title + body, used across Home/History/Settings/etc.
 * Replaces the four repeated `<Card>{image}{overlay}{text}</Card>` blocks.
 *
 *   <HeroBanner source={images.homeBanner} title="History" body="Saved locally." />
 */

import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useNavigationColors } from '@/theme/useNavigationTheme';
import { AppText } from './AppText';
import { Card } from './Card';
import { metrics } from './metrics';

type Props = {
  source: ImageSourcePropType;
  title: string;
  body?: string;
  height?: number;
  /** Optional small overline (e.g. "Daily check"). */
  eyebrow?: string;
};

export function HeroBanner({ source, title, body, height = 156, eyebrow }: Props) {
  const colors = useNavigationColors();
  return (
    <Card density="none" elev="md" style={[styles.card, { height }]}>
      <Image source={source} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', colors.scrim]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.text}>
        {eyebrow ? (
          <AppText variant="eyebrow" style={styles.eyebrow}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="h2" style={styles.title}>
          {title}
        </AppText>
        {body ? (
          <AppText variant="bodySm" style={styles.body}>
            {body}
          </AppText>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden', borderRadius: metrics.radius.lg },
  image: { width: '100%', height: '100%' },
  text: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 4 },
  eyebrow: { color: 'rgba(255,255,255,0.85)' },
  title: { color: '#fff' },
  body: { color: 'rgba(255,255,255,0.92)' },
});
