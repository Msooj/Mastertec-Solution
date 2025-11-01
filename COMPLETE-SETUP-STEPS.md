# 🚀 Complete Supabase Setup - Step by Step

## 📋 What This Will Fix

1. ✅ Create products table in Supabase
2. ✅ Create users table in Supabase  
3. ✅ Import all 100 products from SQLite to Supabase
4. ✅ Migrate all existing auth users to users table
5. ✅ Set up admin account for login

---

## 🎯 Step 1: Set Up Database Tables (5 minutes)

### 1.1 Open Supabase SQL Editor

1. Go to: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### 1.2 Run Complete Setup Script

1. Open the file: **`complete-setup.sql`**
2. Copy **ALL** the contents (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button
5. Wait for success message

**What this does:**
- Creates `products` table with proper permissions
- Creates `users` table with proper permissions
- Sets up auto-sync trigger for new users
- Migrates all existing auth users to users table

---

## 🎯 Step 2: Import Your Products (2 minutes)

### 2.1 Import Products SQL

1. In Supabase SQL Editor, click **"New Query"** again
2. Open the file: **`import-products.sql`**
3. Copy **ALL** the contents
4. Paste into Supabase SQL Editor
5. Click **"Run"** button

**What this does:**
- Imports all 100 products from your SQLite database
- Includes all categories: CCTV, Networking, Alarms, etc.

### 2.2 Verify Products Were Imported

Run this query:
```sql
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category 
ORDER BY category;
```

You should see 9-10 products per category!

---

## 🎯 Step 3: Set Up Admin Account (3 minutes)

### 3.1 Create or Identify Your Admin Account

**Option A: Create New Admin Account**
1. Go to your app: http://localhost:3000
2. Click "Account" button
3. Click "Switch to Sign Up"
4. Sign up with:
   - **Name:** Admin User
   - **Email:** admin@mastertech.com (or your email)
   - **Password:** (choose a strong password - remember it!)
5. Click "Sign Up"

**Option B: Use Existing Account**
- Just note the email and password of an account you already have

### 3.2 Make Account an Admin

1. Go to Supabase Dashboard: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy
2. Click **"Authentication"** → **"Users"**
3. Find your user (search by email)
4. Click on the user
5. In **"User Metadata"** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click **"Save"**

### 3.3 Update Users Table

In Supabase SQL Editor, run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@mastertech.com';
-- ⚠️ Replace with YOUR actual admin email!
```

---

## 🎯 Step 4: Test Everything (2 minutes)

### 4.1 Test Admin Login

1. Go to your app: http://localhost:3000
2. Click **"Admin Sign In"** button
3. Enter:
   - **Admin Name:** Your admin EMAIL (e.g., admin@mastertech.com)
   - **Password:** Your password
4. Click "Sign In"

✅ You should now see the admin panel!

### 4.2 Test Products

1. In admin panel, you should see all 100 products
2. Try adding a new product
3. Try editing a product
4. Try deleting a product

### 4.3 Test Users Tab

1. Click **"Users"** tab in admin panel
2. You should see all your users listed
3. Each user should show: name, email, role

---

## 📊 Summary of What You'll Have

After completing these steps:

| Feature | Status |
|---------|--------|
| Products Table | ✅ 100 products imported |
| Users Table | ✅ All auth users synced |
| Admin Account | ✅ Ready to use |
| Admin Panel | ✅ Fully functional |
| Add/Edit/Delete Products | ✅ Working |
| View Users | ✅ Working |

---

## 🔧 Troubleshooting

### "Invalid credentials" when logging in as admin
- Make sure you're using your **EMAIL** in the "Admin Name" field (not a username)
- Verify the password is correct
- Check that the account exists in Authentication > Users

### "You don't have admin privileges"
- Make sure you added `{"role": "admin"}` to user metadata
- Run the UPDATE query to set role in users table
- Log out and log back in

### Products not showing
- Make sure you ran `import-products.sql`
- Check: `SELECT COUNT(*) FROM products;` should return 100
- Refresh the page

### Users tab is empty
- Make sure you ran `complete-setup.sql`
- Check: `SELECT COUNT(*) FROM public.users;`
- The trigger should have migrated all auth users

---

## 📁 Files You Need

1. **`complete-setup.sql`** - Run this FIRST
2. **`import-products.sql`** - Run this SECOND
3. **`FIX-ADMIN-LOGIN.md`** - Reference for admin login issues

---

## ⏱️ Total Time: ~12 minutes

Follow the steps in order and you'll have everything working!

## 🎉 Done!

Once you complete all steps, your app will be fully functional with Supabase! 🚀
