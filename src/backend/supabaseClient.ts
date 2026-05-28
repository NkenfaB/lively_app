import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function tryGetSecureStore():
  | {
      getItemAsync: (key: string) => Promise<string | null>;
      setItemAsync: (key: string, value: string) => Promise<void>;
      deleteItemAsync: (key: string) => Promise<void>;
    }
  | null {
  // Don't hard-import; the native module may not be present until a full rebuild.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-secure-store');
    return mod;
  } catch {
    return null;
  }
}

function createAuthStorage() {
  const fallback = {
    async getItem(key: string) {
      return AsyncStorage.getItem(key);
    },
    async setItem(key: string, value: string) {
      await AsyncStorage.setItem(key, value);
    },
    async removeItem(key: string) {
      await AsyncStorage.removeItem(key);
    },
  };

  const secureStore = tryGetSecureStore();
  const secure = secureStore
    ? {
        async getItem(key: string) {
          return secureStore.getItemAsync(key);
        },
        async setItem(key: string, value: string) {
          await secureStore.setItemAsync(key, value);
        },
        async removeItem(key: string) {
          await secureStore.deleteItemAsync(key);
        },
      }
    : fallback;

  return { secure, fallback };
}

const { secure, fallback } = createAuthStorage();

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: secure,
        // Expo app lifecycle: keep the session around.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (input, init) => fetch(input, init),
        headers: { 'X-Client-Info': 'lively-expo' },
      },
    })
  : null;

export async function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your .env file.'
    );
  }
}

export async function swapAuthStorageToAsync() {
  // Supabase doesn't allow swapping storage after creation; recreate a client if SecureStore causes issues.
  // Kept here as a helper for future: a full swap requires a new client instance.
  await fallback.getItem('noop');
}
