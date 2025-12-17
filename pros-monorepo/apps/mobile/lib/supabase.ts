import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createSupabaseClient, type SupabaseStorageAdapter } from '@pros/supabase/client';
import { generateAccessCode, getCurrentDate, getCurrentTime } from '@pros/shared';

// Custom storage that works for both web and native
const customStorage: SupabaseStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createSupabaseClient({
  storage: customStorage,
  detectSessionInUrl: Platform.OS === 'web',
});

// Re-export helpers shared (mantiene compatibilidad con imports existentes)
export { generateAccessCode, getCurrentDate, getCurrentTime };
