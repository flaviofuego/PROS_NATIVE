import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@pros/shared';

// Type for the storage adapter
export interface SupabaseStorageAdapter {
  getItem: (key: string) => Promise<string | null> | string | null;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
}

// Options for creating a supabase client
export interface CreateSupabaseClientOptions {
  url?: string;
  anonKey?: string;
  storage?: SupabaseStorageAdapter;
  detectSessionInUrl?: boolean;
}

/**
 * Create a Supabase client with custom options
 * This is used by both web and mobile apps with their own storage adapters
 */
export function createSupabaseClient(options: CreateSupabaseClientOptions = {}): SupabaseClient<Database> {
  const url = options.url || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const anonKey = options.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    console.warn('Supabase URL or Anon Key not provided. Some features may not work.');
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      storage: options.storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: options.detectSessionInUrl ?? false,
    },
  });
}

// Default browser storage adapter
export const browserStorage: SupabaseStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};

// Re-export types
export type { Database } from '@pros/shared';
export type { SupabaseClient } from '@supabase/supabase-js';

