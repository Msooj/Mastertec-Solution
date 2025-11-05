# 🔐 How to Create an Admin Account

## The Problem
You need an admin account with the `role: 'admin'` metadata to access the admin panel.

## ✅ Solution: Create Admin Account in Supabase

### Method 1: Via Supabase Dashboard (Easiest!)

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com
   - Open your project
   - Go to "Authentication" → "Users"

2. **Create a New User**
   - Click "Add User" or "Invite User"
   - Enter:
     - Email: `mastertecltd@gmail.com` (or your email)
     - Password: Create a strong password
   - Click "Create User"

3. **Add Admin Role to User**
   - Find the user you just created
   - Click on the user to edit
   - Scroll to "User Metadata" or "Raw user meta data"
   - Click "Edit"
   - Add this JSON:
     ```json
     {
       "role": "admin"
     }
     ```
   - Click "Save"

4. **Done! Now Log In**
   - Go to your website
   - Click "Admin Sign In"
   - Enter the email and password you created
   - ✅ You're now logged in as admin!

---

### Method 2: Via SQL (Advanced)

1. **Go to Supabase SQL Editor**
   - In your Supabase dashboard
   - Go to "SQL Editor"
   - Click "New Query"

2. **Run This SQL**
   ```sql
   -- First, create the user via Supabase Auth UI
   -- Then update their metadata with this SQL:
   
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'mastertecltd@gmail.com';
   ```

3. **Replace the email** with your admin email

4. **Click "Run"**

---

### Method 3: Sign Up Then Update (Quick!)

1. **Sign Up on Your Website**
   - Go to your website
   - Click "Account"
   - Click "Switch to Sign Up"
   - Create an account with:
     - Name: Admin
     - Email: your-email@example.com
     - Password: (strong password)

2. **Update User in Supabase**
   - Go to Supabase Dashboard
   - Authentication → Users
   - Find your new user
   - Edit User Metadata
   - Add: `{"role": "admin"}`
   - Save

3. **Log Out and Log In as Admin**
   - Log out from your website
   - Click "Admin Sign In"
   - Enter your email and password
   - ✅ You're now admin!

---

## 🧪 Test Admin Access

1. **Click "Admin Sign In"**
2. **Enter your admin email and password**
3. **You should see:**
   - Products tab
   - Users tab
   - Reports tab
   - "Add DEMO Products to Supabase" button
   - "Add Product" button

---

## ⚠️ Important Notes

### Admin Login Now Works Properly! ✅
- **Fixed:** Admin login now actually signs you in
- **Fixed:** Uses email instead of name
- **Fixed:** Checks for admin role after login
- **Security:** Non-admin users are logged out immediately

### User Metadata Format
The admin role MUST be in `user_metadata` like this:
```json
{
  "role": "admin"
}
```

### Multiple Admins
You can create multiple admin accounts by:
1. Creating multiple users
2. Adding `{"role": "admin"}` to each user's metadata

---

## 🎉 Quick Start

**Fastest way to get admin access:**

1. Go to Supabase → Authentication → Users
2. Click "Add User"
3. Email: `mastertecltd@gmail.com`
4. Password: `@Toronto.24`
5. After creating, edit user
6. Add metadata: `{"role": "admin"}`
7. Save
8. Go to your website
9. Click "Admin Sign In"
10. Enter: `mastertecltd@gmail.com` / `@Toronto.24`
11. ✅ You're in!

---

## 🔒 Security Tips

- Use a strong password for admin accounts
- Don't share admin credentials
- Change default passwords immediately
- Only give admin role to trusted users
- Consider using your personal email for admin

---

**Now you can log in as admin and add products!** 🚀
