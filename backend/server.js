const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase initialization
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json({ limit: '25mb' }));

console.log('Starting server with Supabase...');

// Root route
app.get('/', (req, res) => {
  res.send('Mastertec Backend running with Supabase!');
});

// PRODUCTS ROUTES
app.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/products/category/:category', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('category', req.params.category);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, category, description, inventory = 10, image } = req.body;
    const { data, error } = await supabase.from('products').insert([{ name, price, category, description, inventory, image }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { name, price, category, description, inventory, image } = req.body;
    const { data, error } = await supabase.from('products').update({ name, price, category, description, inventory, image }).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// USER ROUTES
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('users').insert([{ name, email, password: hashed, role: 'customer' }]).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'User not found' });
    const ok = await bcrypt.compare(password, data.password);
    if (!ok) return res.status(401).json({ error: 'Wrong password' });
    res.json({ id: data.id, name: data.name, email: data.email, role: data.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id, name, email, role');
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN ROUTES
app.post('/admin/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const { data, error } = await supabase.from('admin').select('*').eq('name', name).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Admin not found' });
    const ok = await bcrypt.compare(password, data.password);
    if (!ok) return res.status(401).json({ error: 'Wrong password' });
    res.json({ id: data.id, name: data.name, email: data.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDERS ROUTES
app.post('/orders', async (req, res) => {
  try {
    const { user_id, total, phone, address } = req.body;
    const { data, error } = await supabase.from('orders').insert([{ user_id, total, phone, address, status: 'pending' }]).select();
    if (error) throw error;
    res.json({ ...data[0], message: 'Order received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REPORTS ENDPOINT
app.get('/reports/summary', async (req, res) => {
  try {
    const { data: orders } = await supabase.from('orders').select('id, total');
    const { data: users } = await supabase.from('users').select('id');
    const { data: products } = await supabase.from('products').select('id');
    res.json({
      totalOrders: orders ? orders.length : 0,
      totalSales: orders ? orders.reduce((sum, o) => sum + (o.total || 0), 0) : 0,
      totalUsers: users ? users.length : 0,
      totalProducts: products ? products.length : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});  
