-- ============================================
-- SETUP USERS TABLE ONLY
-- ============================================

-- Drop existing users table if it exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Create the users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Allow public read for all users" ON public.users;

-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public read for all users (for admin panel)
CREATE POLICY "Allow public read for all users" ON public.users
  FOR SELECT 
  USING (true);

-- ============================================
-- CREATE AUTO-SYNC TRIGGER
-- ============================================

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- MIGRATE EXISTING AUTH USERS
-- ============================================

-- Migrate all existing auth users to users table
INSERT INTO public.users (id, email, name, role)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'role', 'customer')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- ============================================
-- VERIFICATION
-- ============================================

-- Show all users
SELECT 
  id, 
  email, 
  name, 
  role, 
  created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Count users
SELECT COUNT(*) as total_users FROM public.users;
