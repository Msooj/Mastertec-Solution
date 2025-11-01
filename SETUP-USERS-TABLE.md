# 👥 Setting Up Users Table in Supabase

## The Problem
Supabase stores authenticated users in `auth.users` (a protected table), but your app needs a custom `users` table to:
- Display user lists in the admin panel
- Store additional user information (role, name, etc.)
- Query users easily

## The Solution
Create a custom `users` table that automatically syncs with `auth.users` using a database trigger.

---

## 📋 Step-by-Step Setup

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase dashboard: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### Step 2: Run the Users Table Script

Copy the **entire contents** of `create-users-table.sql` and paste it into the SQL Editor, then click **"Run"**.

This script will:
- ✅ Create a `users` table
- ✅ Set up Row Level Security policies
- ✅ Create a trigger to auto-sync new signups
- ✅ **Migrate all existing auth users** to the users table

### Step 3: Verify It Worked

Run this query to see your users:

```sql
SELECT * FROM public.users;
```

You should see all your existing users from `auth.users` now in the `users` table!

---

## 🔄 How It Works

### Automatic Sync
When a new user signs up:
1. Supabase creates the user in `auth.users`
2. The trigger automatically creates a matching record in `public.users`
3. User data (email, name, role) is copied over

### Table Structure

```
users table:
├── id (UUID) - matches auth.users.id
├── email (TEXT) - user's email
├── name (TEXT) - user's display name
├── role (TEXT) - 'customer' or 'admin'
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🎯 What Changed in Your App

Your `App.js` now fetches users from the `users` table:

```javascript
const fetchUsers = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    setUsers(data || []);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};
```

---

## 👨‍💼 Admin Panel - Users Tab

Now when you:
1. Log in as admin
2. Click the **"Users"** tab

You'll see a list of all users with:
- Name
- Email
- Role (customer/admin)

---

## 🔧 Managing User Roles

### To Make a User an Admin:

**Option 1: Via Supabase Dashboard**
1. Go to Authentication > Users
2. Click on the user
3. Add to User Metadata: `{"role": "admin"}`
4. The trigger will sync this to the users table

**Option 2: Via SQL**
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

---

## 📊 Useful Queries

### View all admins
```sql
SELECT * FROM public.users WHERE role = 'admin';
```

### View all customers
```sql
SELECT * FROM public.users WHERE role = 'customer';
```

### Count users by role
```sql
SELECT role, COUNT(*) 
FROM public.users 
GROUP BY role;
```

### Update a user's name
```sql
UPDATE public.users 
SET name = 'New Name' 
WHERE email = 'user@example.com';
```

---

## 🔒 Security (Row Level Security)

The users table has these policies:

1. **Anyone can view all users** (for admin panel)
2. **Users can view their own data**
3. **Users can update their own data**

You can modify these policies in Supabase Dashboard > Authentication > Policies

---

## ✅ Testing

1. Sign up a new user in your app
2. Go to Supabase Dashboard > SQL Editor
3. Run: `SELECT * FROM public.users ORDER BY created_at DESC LIMIT 1;`
4. You should see the new user automatically added!

---

## 🎉 Done!

Your users table is now set up and will automatically stay in sync with Supabase Auth!
