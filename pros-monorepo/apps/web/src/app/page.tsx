import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@pros/shared';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const profileRole = (profile ?? null) as unknown as Pick<User, 'role'> | null;

  if (profileRole?.role === 'admin') {
    redirect('/dashboard');
  } else {
    redirect('/eventos');
  }
}

