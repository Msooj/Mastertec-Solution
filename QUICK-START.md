# 🚀 Quick Start - Supabase Integration

## ✅ Your App is Now Using Supabase!

### What's Working:
- ✅ Supabase client configured
- ✅ App compiled successfully
- ✅ All authentication using Supabase Auth
- ✅ All product operations using Supabase database
- ✅ Frontend running on http://localhost:3000

### ⚠️ Next Step Required:

**You MUST set up the database tables in Supabase before the app will work!**

## 📋 Quick Setup (5 minutes)

### 1. Open Supabase Dashboard
Visit: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy

### 2. Go to SQL Editor
Click "SQL Editor" in the left sidebar

### 3. Run This SQL Script

Copy and paste this entire script, then click "Run":

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
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update products
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated users to delete products
CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE TO authenticated USING (true);
```

### 4. Create Your Admin Account

1. Go to your app: http://localhost:3000
2. Click "Account" button
3. Sign up with your email and password
4. Go back to Supabase Dashboard > Authentication > Users
5. Click on your user
6. Add this to "User Metadata":
   ```json
   {"role": "admin"}
   ```
7. Save changes

### 5. Test It!

1. Refresh your app
2. Click "Admin Sign In"
3. Log in with your email/password
4. Click "Add DEMO Products to Supabase"
5. Products should now appear!

## 🎯 What Each Feature Does:

| Feature | Uses Supabase For |
|---------|-------------------|
| Sign Up | Supabase Auth |
| Login | Supabase Auth |
| Admin Login | Supabase Auth + User Metadata |
| View Products | Supabase Database (products table) |
| Add Product | Supabase Database |
| Edit Product | Supabase Database |
| Delete Product | Supabase Database |

## 🔧 Troubleshooting

### "relation 'products' does not exist"
→ You haven't run the SQL script yet. Go to Step 3 above.

### "You don't have admin privileges"
→ Add `{"role": "admin"}` to your user metadata in Supabase Dashboard.

### Products not showing
→ Make sure you're logged in and clicked "Add DEMO Products to Supabase"

### Can't add/edit/delete products
→ Make sure you're logged in as an admin user

## 📚 Full Documentation

For detailed setup instructions, see: `SUPABASE-SETUP-GUIDE.md`

## 🎉 That's It!

Your app is now fully integrated with Supabase cloud database!
