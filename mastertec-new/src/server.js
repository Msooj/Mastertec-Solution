const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect((err) => {
  if (err) return console.log('❌ DB ERROR!');
  console.log('✅ DATABASE CONNECTED!');
});

// GET ALL PRODUCTS
app.get('/api/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

// ADD PRODUCT
app.post('/api/products', async (req, res) => {
  const { name, price, category } = req.body;
  const result = await pool.query(
    'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *',
    [name, price, category]
  );
  res.json(result.rows[0]);
});

app.listen(5000, () => {
  console.log('🚀 SERVER RUNNING ON http://localhost:5000');
});