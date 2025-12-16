export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface Evento {
  id: number;
  nombre: string;
  categoria: string;
  encargados: string[];
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
  codigo_acceso: string;
  activo: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Asistencia {
  id: number;
  id_evento: number;
  id_usuario: string;
  codigo_estudiante: string;
  fecha_asistencia: string;
  hora_asistencia: string;
  created_at: string;
  // Joined fields
  evento?: Evento;
  usuario?: User;
}

export interface AccesoEvento {
  id: number;
  id_evento: number;
  id_usuario: string;
  codigo_usado: string;
  fecha_acceso: string;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      eventos: {
        Row: Evento;
        Insert: Omit<Evento, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Evento, 'id' | 'created_at'>>;
      };
      asistencias: {
        Row: Asistencia;
        Insert: Omit<Asistencia, 'id' | 'created_at' | 'evento' | 'usuario'>;
        Update: Partial<Omit<Asistencia, 'id' | 'created_at'>>;
      };
      accesos_eventos: {
        Row: AccesoEvento;
        Insert: Omit<AccesoEvento, 'id'>;
        Update: Partial<Omit<AccesoEvento, 'id'>>;
      };
    };
  };
}

// Form types
export interface EventoFormData {
  nombre: string;
  categoria: string;
  encargados: string[];
  fecha_inicio: string;
  fecha_fin: string;
  ubicacion: string;
}

export interface UserFormData {
  email: string;
  password: string;
  nombre: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Stats types
export interface EventoStats {
  total_asistencias: number;
  estudiantes_unicos: number;
  asistencias_por_hora: { hora: string; count: number }[];
}

export interface GeneralStats {
  total_eventos: number;
  eventos_activos: number;
  asistencias_hoy: number;
  usuarios_activos: number;
}

