import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, AuthError } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else {
        const userData = data as User;
        
        // Verificar si el usuario está activo
        if (userData.activo === false) {
          // Usuario desactivado - cerrar sesión
          console.log('User is deactivated, signing out');
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          Alert.alert(
            'Cuenta Desactivada',
            'Tu cuenta ha sido desactivada. Contacta al administrador para más información.'
          );
        } else {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      // Verificar si el usuario está activo antes de permitir el login
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('activo')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          return { error: new Error('Error al verificar el estado del usuario') };
        }

        if (userData?.activo === false) {
          // Usuario desactivado - cerrar sesión inmediatamente
          await supabase.auth.signOut();
          return { 
            error: new Error('Tu cuenta ha sido desactivada. Contacta al administrador.') 
          };
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
