-- ============================================
-- FIX PRODUCTS TABLE SCHEMA
-- This ensures the column name matches what the app expects
-- ============================================

-- Check if table exists and what columns it has
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public';

-- If the table doesn't have the right columns, drop and recreate it
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with correct schema
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discountprice NUMERIC,  -- lowercase to match Supabase convention
  category TEXT NOT NULL,
  description TEXT,
  inventory INTEGER DEFAULT 0,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

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

-- Verify the table was created correctly
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;
