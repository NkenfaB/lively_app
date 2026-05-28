import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Screen } from '@/ui/Screen';
import { AppText } from '@/ui/AppText';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Alert } from '@/ui/Alert';
import { InputField } from '@/ui/InputField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearAuthError,
  selectAuth,
  signInWithPassword,
  signUpWithPassword,
} from '@/store/slices/authSlice';
import { useNavigationColors } from '@/theme/useNavigationTheme';
import { metrics } from '@/ui/metrics';
import { A, enterDown } from '@/ui/animated';
import { useStackScreenBottomPad } from '@/ui/layoutMetrics';
import { useToast } from '@/ui/Toast';
import { haptic } from '@/ui/haptics';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colors = useNavigationColors();
  const auth = useAppSelector(selectAuth);
  const toast = useToast();
  const bottomPad = useStackScreenBottomPad();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => email.includes('@') && password.length >= 6, [email, password]);

  async function submit() {
    if (!canSubmit) return;
    try {
      if (mode === 'signin') {
        await dispatch(signInWithPassword({ email, password })).unwrap();
        toast.success('Signed in.');
      } else {
        await dispatch(signUpWithPassword({ email, password })).unwrap();
        toast.success('Account created. Check your email if confirmation is required.');
      }
      router.back();
    } catch {
      // selector below will surface the error
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 48 : 0}>
        <View style={[styles.content, { paddingBottom: bottomPad }]}>
          <A.View entering={enterDown(0)}>
            <AppText variant="eyebrow" tone="muted">
              {mode === 'signin' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </AppText>
            <AppText variant="h1" style={styles.title}>
              {mode === 'signin' ? 'Sign in to Lively' : 'Start syncing'}
            </AppText>
            <AppText variant="bodySm" tone="muted" style={{ marginTop: 4 }}>
              Sync your screenings across devices and receive model updates.
            </AppText>
          </A.View>

          {/* Mode segmented */}
          <A.View entering={enterDown(60)}>
            <View style={[styles.modeRow, { backgroundColor: colors.surfaceContainer }]}>
              {(['signin', 'signup'] as Mode[]).map((m) => (
                <Pressable
                  key={m}
                  onPress={() => {
                    haptic.selection();
                    setMode(m);
                  }}
                  style={[
                    styles.modeSeg,
                    m === mode && { backgroundColor: colors.surface, shadowColor: colors.shadowColor, shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
                  ]}>
                  <AppText
                    style={{
                      color: m === mode ? colors.onSurface : colors.onSurfaceVariant,
                      fontFamily: m === mode ? 'Inter_700Bold' : 'Inter_600SemiBold',
                      fontSize: 13,
                    }}>
                    {m === 'signin' ? 'Sign in' : 'Sign up'}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </A.View>

          <A.View entering={enterDown(120)}>
            <Card tone="surface" bordered elev="none" density="comfortable" style={{ gap: 14 }}>
              <InputField
                label="EMAIL"
                value={email}
                onChangeText={(t) => {
                  dispatch(clearAuthError());
                  setEmail(t.trim());
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="you@example.com"
                leading={<MaterialIcons name="mail-outline" size={18} color={colors.outline} />}
              />

              <InputField
                label="PASSWORD"
                value={password}
                onChangeText={(t) => {
                  dispatch(clearAuthError());
                  setPassword(t);
                }}
                secureTextEntry={!showPassword}
                placeholder="At least 6 characters"
                leading={<MaterialIcons name="lock-outline" size={18} color={colors.outline} />}
                trailing={
                  <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={18}
                      color={colors.outline}
                    />
                  </Pressable>
                }
              />

              {auth.errorMessage ? <Alert intent="danger" message={auth.errorMessage} /> : null}
            </Card>
          </A.View>

          <A.View entering={enterDown(180)} style={styles.actions}>
            <Button
              title={
                auth.status === 'loading'
                  ? mode === 'signin'
                    ? 'Signing in…'
                    : 'Creating…'
                  : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'
              }
              variant="primary"
              hapticFeedback="medium"
              loading={auth.status === 'loading'}
              disabled={!canSubmit}
              onPress={submit}
            />
            <Button title="Continue offline" variant="ghost" size="md" onPress={() => router.back()} />
          </A.View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: metrics.screenPadding, gap: 14, flex: 1 },
  title: { marginTop: 4 },
  modeRow: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: metrics.radius.pill,
    alignSelf: 'flex-start',
    gap: 2,
  },
  modeSeg: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: metrics.radius.pill,
  },
  actions: { gap: 8, marginTop: 'auto', paddingBottom: 8 },
});
