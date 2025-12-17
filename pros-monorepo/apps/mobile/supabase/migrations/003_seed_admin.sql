-- This is an example seed file for creating an initial admin user
-- You should run this AFTER creating the user in Supabase Auth

-- Example: Create an admin profile for a user that already exists in auth.users
-- Replace 'YOUR_AUTH_USER_UUID' with the actual UUID from auth.users
-- and update the email and name accordingly

-- INSERT INTO public.users (id, email, role, nombre)
-- VALUES (
--     'YOUR_AUTH_USER_UUID'::uuid,
--     'admin@example.com',
--     'admin',
--     'Administrador Principal'
-- );

-- Alternatively, you can create a trigger to automatically create a user profile
-- when someone signs up:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, nombre)
    VALUES (
        NEW.id,
        NEW.email,
        'user',  -- Default role is 'user'
        COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Note: To manually promote a user to admin, run:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';

