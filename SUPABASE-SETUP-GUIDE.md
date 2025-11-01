# 🚀 Supabase Setup Guide for Mastertec Solutions

Your app is now configured to use Supabase! Follow these steps to complete the setup.

## ✅ What's Already Done

- ✅ Supabase client configured with your credentials
- ✅ App.js updated to use Supabase for all operations
- ✅ Authentication integrated with Supabase Auth
- ✅ Product CRUD operations using Supabase database

## 📋 Required Steps

### Step 1: Access Your Supabase Dashboard

1. Go to: https://app.supabase.com
2. Sign in to your account
3. Select your project: **ithmgtvazxkxzvxwuawy**

### Step 2: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these commands:

#### Create Products Table

```sql
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
```

#### Create Orders Table (Optional)

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### Step 3: Set Up Authentication

Your app uses Supabase Auth. No additional setup needed, but you should:

1. Go to **Authentication** > **Providers** in Supabase dashboard
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if desired

### Step 4: Create an Admin User

To access the admin panel:

1. **Sign up** a user through your app
2. Go to Supabase Dashboard > **Authentication** > **Users**
3. Find the user you just created
4. Click on the user to edit
5. In the **User Metadata** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save the changes

Now this user can log in to the admin panel!

### Step 5: Add Demo Products (Optional)

Once logged in as admin:
1. Click **Admin Sign In** button
2. Log in with your admin credentials
3. Click **Add DEMO Products to Supabase** button
4. This will populate your database with sample products

## 🔑 Your Supabase Configuration

**Project URL:** https://ithmgtvazxkxzvxwuawy.supabase.co
**Anon Key:** (Already configured in `.env` file)

## 🎯 Features Now Using Supabase

### Authentication
- ✅ User signup with email/password
- ✅ User login
- ✅ Admin login (requires user metadata role)
- ✅ Logout

### Products
- ✅ Fetch all products
- ✅ Add new products (admin only)
- ✅ Edit products (admin only)
- ✅ Delete products (admin only)
- ✅ Add demo products (admin only)

### Data Storage
- ✅ All products stored in Supabase
- ✅ User authentication managed by Supabase Auth
- ✅ Images stored as URLs or base64 in database

## 🔒 Security Notes

1. **Row Level Security (RLS)** is enabled on all tables
2. Only authenticated users can modify products
3. Admin role is checked via user metadata
4. Public users can view products but not modify them

## 🐛 Troubleshooting

### "relation 'products' does not exist"
- Make sure you ran the SQL commands in Step 2

### "new row violates row-level security policy"
- Make sure you're logged in when trying to add/edit/delete products
- Check that RLS policies are created correctly

### Admin login shows "You don't have admin privileges"
- Make sure you added `{"role": "admin"}` to user metadata
- Log out and log back in after adding admin role

### Products not showing up
- Check browser console for errors
- Verify the products table has data
- Check RLS policies allow SELECT for public

## 📞 Need Help?

Check the Supabase documentation:
- https://supabase.com/docs/guides/database
- https://supabase.com/docs/guides/auth

## 🎉 You're All Set!

Once you complete these steps, your app will be fully integrated with Supabase!
