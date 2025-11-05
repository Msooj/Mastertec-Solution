-- ============================================
-- CREATE ADMIN ACCOUNT (mastertecltd@gmail.com)
-- ============================================
-- 
-- IMPORTANT: Before running this SQL:
-- 1. Go to Supabase Dashboard
-- 2. Go to Authentication → Users
-- 3. Click "Add User" 
-- 4. Enter:
--    - Email: mastertecltd@gmail.com
--    - Password: @Toronto.24
-- 5. Click "Create User"
--
-- Then run this SQL in your Supabase SQL Editor
-- ============================================

-- Step 1: Update user metadata to add admin role
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE email = 'mastertecltd@gmail.com';

-- Step 2: Update the public users table to mark as admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'mastertecltd@gmail.com';

-- Step 3: If user doesn't exist in public.users yet, insert them
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', 'Admin'),
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'mastertecltd@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ============================================
-- VERIFICATION: Run this to check if admin was created
-- ============================================
-- SELECT email, role, raw_user_meta_data FROM auth.users WHERE email = 'mastertecltd@gmail.com';
-- SELECT * FROM public.users WHERE email = 'mastertecltd@gmail.com';