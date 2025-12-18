import { z } from 'zod';

// ============ Enums and Basic Types ============
export type UserRole = 'admin' | 'user';

// ============ Entity Interfaces ============
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

// ============ Database Types for Supabase ============
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
        Relationships: [];
      };
      eventos: {
        Row: Evento;
        Insert: Omit<Evento, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Evento, 'id' | 'created_at'>>;
        Relationships: [];
      };
      asistencias: {
        Row: Asistencia;
        Insert: Omit<Asistencia, 'id' | 'created_at' | 'evento' | 'usuario'>;
        Update: Partial<Omit<Asistencia, 'id' | 'created_at'>>;
        Relationships: [];
      };
      accesos_eventos: {
        Row: AccesoEvento;
        Insert: Omit<AccesoEvento, 'id'>;
        Update: Partial<Omit<AccesoEvento, 'id'>>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// ============ Form Types ============
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

// ============ Stats Types ============
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

// ============ Zod Schemas for Validation ============
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.enum(['admin', 'user']),
});

export const eventoFormSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  encargados: z.array(z.string()).optional(),
  fecha_inicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fecha_fin: z.string().min(1, 'La fecha de fin es requerida'),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
});

// Export schema types
export type LoginInput = z.infer<typeof loginSchema>;
export type UserFormInput = z.infer<typeof userFormSchema>;
export type EventoFormInput = z.infer<typeof eventoFormSchema>;

