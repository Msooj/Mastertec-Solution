# Supabase Database Setup

You need to create the following tables in your Supabase database:

## 1. Products Table
```sql
CREATE TABLE products (
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

-- Allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 2. Orders Table (Optional)
```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total NUMERIC NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Steps to Set Up:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: ithmgtvazxkxzvxwuawy
3. Go to SQL Editor
4. Run the SQL commands above
5. For admin access, you'll use Supabase Auth with user metadata

## Admin Setup:

To create an admin user:
1. Sign up a user through the app
2. Go to Supabase Dashboard > Authentication > Users
3. Click on the user
4. Add to "User Metadata":
```json
{
  "role": "admin"
}
```
