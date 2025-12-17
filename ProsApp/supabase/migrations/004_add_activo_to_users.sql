-- Add 'activo' column to users table for soft delete functionality
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- Create index for filtering active users
CREATE INDEX IF NOT EXISTS idx_users_activo ON public.users(activo);

-- Comment for documentation
COMMENT ON COLUMN public.users.activo IS 'Indicates if the user is active (false = soft deleted)';


