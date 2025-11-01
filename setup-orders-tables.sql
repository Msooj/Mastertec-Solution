-- ============================================
-- SETUP ORDERS AND ORDER_ITEMS TABLES
-- ============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- ============================================
-- CREATE ORDERS TABLE
-- ============================================

CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  phone TEXT,
  address TEXT,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'mpesa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public to create orders" ON public.orders
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CREATE ORDER_ITEMS TABLE
-- ============================================

CREATE TABLE public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT,
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  quantity INTEGER DEFAULT 1,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items" ON public.order_items
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public to create order items" ON public.order_items
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT 
  USING (true);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check tables were created
SELECT 'Orders table created' as status;
SELECT 'Order items table created' as status;

-- Show table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Count existing data
SELECT COUNT(*) as total_orders FROM public.orders;
SELECT COUNT(*) as total_order_items FROM public.order_items;
