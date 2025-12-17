// Hooks will be implemented per-platform due to React Native vs React DOM differences
// This file exports shared hook utilities and types

export interface AuthState {
  user: import('@pros/shared').User | null;
  session: import('@supabase/supabase-js').Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export type UseAuthReturn = AuthState & AuthActions;

// Event query helpers
export interface EventFilters {
  activo?: boolean;
  categoria?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface EventsQueryResult {
  eventos: import('@pros/shared').Evento[];
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Attendance query helpers
export interface AttendanceFilters {
  eventoId?: number;
  usuarioId?: string;
  fecha?: string;
}

export interface AttendanceQueryResult {
  asistencias: import('@pros/shared').Asistencia[];
  total: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

