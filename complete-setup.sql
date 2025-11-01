-- ============================================
-- COMPLETE SUPABASE SETUP SCRIPT
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: CREATE PRODUCTS TABLE
-- ============================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discountprice NUMERIC,
  category TEXT NOT NULL,
  description TEXT,
  inventory INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update products
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE 
  TO authenticated
  USING (true);

-- ============================================
-- PART 2: CREATE USERS TABLE
-- ============================================

-- Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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
-- PART 3: CREATE AUTO-SYNC TRIGGER FOR USERS
-- ============================================

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PART 4: MIGRATE EXISTING AUTH USERS
-- ============================================

-- Migrate existing auth users to users table
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
  role = EXCLUDED.role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT 'Products table created' as status, COUNT(*) as count FROM products;
SELECT 'Users table created' as status, COUNT(*) as count FROM public.users;

-- Show all users
SELECT 
  id, 
  email, 
  name, 
  role, 
  created_at 
FROM public.users 
ORDER BY created_at DESC;
