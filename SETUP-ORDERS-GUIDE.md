# 📦 Setup Orders & Order Items

## What I Fixed

1. ✅ Created SQL script to set up orders and order_items tables
2. ✅ Updated your app to save orders to Supabase when customers checkout
3. ✅ Orders now include customer info, phone, address, and all items

---

## 🚀 Quick Setup

### Step 1: Create Orders Tables in Supabase

1. Go to Supabase SQL Editor: https://app.supabase.com/project/ithmgtvazxkxzvxwuawy
2. Click **"New Query"**
3. Open **`setup-orders-tables.sql`**
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **"Run"**

This creates:
- ✅ `orders` table - Stores order details
- ✅ `order_items` table - Stores individual items in each order
- ✅ Security policies for data access
- ✅ Indexes for better performance

### Step 2: Test It!

1. Go to your app: http://localhost:3000
2. Add some products to cart
3. Click cart icon
4. Fill in phone number and address
5. Click **"Pay Now (MPESA STK)"**
6. ✅ Order will be saved to Supabase!

### Step 3: View Orders in Supabase

Check your orders:

```sql
-- View all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- View order items
SELECT 
  o.id as order_id,
  o.user_email,
  o.total,
  o.status,
  oi.product_name,
  oi.product_price,
  oi.quantity
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;

-- Count orders by status
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

---

## 📊 What's Stored

### Orders Table:
- Order ID
- User ID (if logged in)
- User email
- User name
- Phone number
- Delivery address
- Total amount
- Status (pending, completed, cancelled)
- Payment method
- Created date

### Order Items Table:
- Item ID
- Order ID (links to orders table)
- Product ID
- Product name
- Product price
- Quantity
- Subtotal

---

## 🎯 How It Works Now

When a customer clicks "Pay Now":

1. ✅ Creates order record in `orders` table
2. ✅ Creates item records in `order_items` table for each cart item
3. ✅ Stores customer phone and address
4. ✅ Calculates and saves total
5. ✅ Shows success message
6. ✅ Clears the cart

---

## 🔒 Security

- Users can only view their own orders
- Admins can view all orders
- Guest users can create orders (for non-logged-in customers)
- Row Level Security enabled on both tables

---

## 💡 Next Steps

You can enhance this by:
- Adding an "Orders" tab in admin panel to view all orders
- Adding order status updates (pending → processing → completed)
- Sending email notifications
- Integrating real MPESA STK push

---

## ✅ Summary

**Just run `setup-orders-tables.sql` in Supabase and you're done!**

Orders will now be saved automatically when customers checkout. 🎉
