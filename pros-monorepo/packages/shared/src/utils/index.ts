/**
 * Generate a unique access code for events
 */
export function generateAccessCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM:SS format
 */
export function getCurrentTime(): string {
  return new Date().toTimeString().split(' ')[0];
}

/**
 * Format a date string to a localized display format
 */
export function formatDate(dateString: string, locale: string = 'es-ES'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date string to a short display format
 */
export function formatDateShort(dateString: string, locale: string = 'es-ES'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a time string to a localized display format
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date range includes today
 */
export function isEventActive(fechaInicio: string, fechaFin: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  end.setHours(23, 59, 59, 999);
  return today >= start && today <= end;
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Parse error messages from Supabase
 */
export function parseSupabaseError(error: unknown): string {
  if (!error) return 'Error desconocido';
  
  if (typeof error === 'string') return error;
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('already registered') || message.includes('duplicate')) {
      return 'Este correo electrónico ya está registrado';
    }
    if (message.includes('invalid login') || message.includes('invalid credentials')) {
      return 'Credenciales inválidas';
    }
    if (message.includes('email not confirmed')) {
      return 'Por favor confirma tu correo electrónico';
    }
    if (message.includes('rate limit')) {
      return 'Demasiados intentos. Espera unos minutos';
    }
    
    return error.message;
  }
  
  return 'Error desconocido';
}

/**
 * Delay execution for a given number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

