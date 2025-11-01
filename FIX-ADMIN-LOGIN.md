# 🔧 Fix Admin Login Issue

## The Problem
Admin login is failing with "Invalid credentials" because the admin login in your app works differently than regular user login.

## How Admin Login Currently Works

Looking at your `App.js`, the admin login:
1. Uses **email and password** (not username)
2. Checks if the user has `role: "admin"` in their user metadata
3. Signs in through Supabase Auth

## 🎯 Solution: Set Up Your Admin Account

### Step 1: Create/Use an Admin Account

**Option A: Create a New Admin Account**
1. Go to your app: http://localhost:3000
2. Click "Account" button
3. Click "Switch to Sign Up"
4. Sign up with:
   - Name: Admin User
   - Email: admin@mastertech.com (or your preferred email)
   - Password: (choose a strong password)

**Option B: Use an Existing Account**
- Just note down the email and password of an existing account

### Step 2: Make the Account an Admin in Supabase

1. Go to Supabase Dashboard: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy
2. Click **"Authentication"** in the left sidebar
3. Click **"Users"** tab
4. Find your user (search by email)
5. Click on the user to open details
6. Scroll to **"User Metadata"** section
7. Click "Edit" or add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click "Save"

### Step 3: Update Users Table (After Running SQL Script)

After you run `complete-setup.sql`, also run this to update the role:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'admin@mastertech.com';
-- Replace with your actual admin email
```

### Step 4: Test Admin Login

1. Go to your app
2. Click **"Admin Sign In"** button
3. Enter:
   - **Admin Name**: Your admin email (e.g., admin@mastertech.com)
   - **Admin Password**: Your password
4. Click "Sign In"

## ⚠️ Important Notes

### The Admin Login Form Uses:
- **"Admin Name" field** → Enter your EMAIL (not a username)
- **"Admin Password" field** → Enter your password

This is a bit confusing because it says "name" but you need to enter your email address.

## 🔧 Alternative: Fix the Admin Login Form

If you want to make it clearer, I can update the form to say "Email" instead of "Name". Let me know!

## 📋 Quick Checklist

- [ ] Run `complete-setup.sql` in Supabase SQL Editor
- [ ] Create or identify your admin account
- [ ] Add `{"role": "admin"}` to user metadata in Supabase
- [ ] Update users table with admin role
- [ ] Try logging in with EMAIL (not username) in the "Admin Name" field

## 🐛 Still Having Issues?

### "Invalid credentials" error:
- Make sure you're using the correct email and password
- Check that the account exists in Authentication > Users
- Try logging in as a regular user first to verify credentials

### "You don't have admin privileges" error:
- Check user metadata has `{"role": "admin"}`
- Run the SQL update query to set role in users table
- Log out and log back in

### Can't find the user in Supabase:
- The account might not have been created
- Try signing up again through the app
- Check Authentication > Users to see all accounts
