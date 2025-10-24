const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 5000;

// Allow much larger JSON payloads (good for base64 images, can increase further if needed)
app.use(cors());
app.use(express.json({ limit: '25mb' }));

console.log('Starting server...');

const db = new sqlite3.Database('./shop.db', (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    return;
  }
  console.log('✅ Connected to SQLite database.');
});

// Table creation and demo insert logic
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    category TEXT,
    description TEXT,
    inventory INTEGER,
    image TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total INTEGER,
    phone TEXT,
    address TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
  )`);

  // Demo users & admin
  db.get('SELECT COUNT(*) as count FROM users', [], async (err, row) => {
    if (!row || row.count === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'Alice Maina', 'alice@example.com', hashedPassword, 'customer'
      ]);
      db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
        'Bob Mwangi', 'bob@example.com', hashedPassword, 'customer'
      ]);
      // Admin hashed
      const adminPass = await bcrypt.hash('admin123', 10);
      db.get('SELECT COUNT(*) as count FROM admin', [], (err, arow) => {
        if (!arow || arow.count === 0) {
          db.run('INSERT INTO admin (name, email, password) VALUES (?, ?, ?)', [
            'Admin User', 'admin@mastertech.com', adminPass
          ]);
        }
      });
    }
  });

  // Demo Products
  db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
    if (row.count === 0) {
      insertInitialProducts();
    }
  });
});

// Insert demo products function
function insertInitialProducts() {
  const categories = [
    'CCTV', 'Networking', 'Alarms', 'Electric Fencing', 'Computing', 
    'Wi-Fi', 'Telephone', 'Biometrics', 'Fibre Optic', 'Backups', 'Electrical'
  ];
  const insertStmt = db.prepare(
    'INSERT INTO products (name, price, category, description, inventory, image) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const cat of categories) {
    for (let i = 1; i <= 9; i++) {
      insertStmt.run(
        `${cat} Product ${i}`,
        Math.floor(Math.random() * 15000) + 3500,
        cat,
        'High quality product for Kenya\'s tech market.',
        Math.floor(Math.random() * 50) + 5,
        `https://picsum.photos/seed/${cat}${i}/260/180`
      );
    }
  }
  insertStmt.run(
    'VIP CCTV Camera',
    100000,
    'CCTV',
    'Exclusive high-end camera.',
    2,
    'https://images.unsplash.com/photo-1526178613658-ad29d90e5056?auto=format&fit=crop&w=600&q=80'
  );
  insertStmt.finalize();
}

// ---------- [REPORTS ENDPOINT] ----------
app.get('/reports/summary', (req, res) => {
  let result = {};
  db.get('SELECT COUNT(*) AS totalOrders, SUM(total) AS totalSales FROM orders', [], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    result.totalOrders = orders.totalOrders || 0;
    result.totalSales = orders.totalSales || 0;
    db.get('SELECT COUNT(*) AS totalUsers FROM users', [], (err, users) => {
      if (err) return res.status(500).json({ error: err.message });
      result.totalUsers = users.totalUsers || 0;
      db.get('SELECT COUNT(*) AS totalProducts FROM products', [], (err, products) => {
        if (err) return res.status(500).json({ error: err.message });
        result.totalProducts = products.totalProducts || 0;
        res.json(result);
      });
    });
  });
});
// ---------- END REPORTS ENDPOINT ----------

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Mastertech Solutions Backend is running! Visit /products to see product data.');
});

// ======== PRODUCTS ROUTES ========
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.get('/products/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post('/products', (req, res) => {
  const { name, price, category, description, inventory = 10, image } = req.body;
  db.run(
    `INSERT INTO products (name, price, category, description, inventory, image) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, category, description, inventory, image],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID, name, price, category, description, inventory, image });
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, inventory, image } = req.body;
  db.run(
    `UPDATE products SET name = ?, price = ?, category = ?, description = ?, inventory = ?, image = ? WHERE id = ?`,
    [name, price, category, description, inventory, image, id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: parseInt(id), name, price, category, description, inventory, image });
    }
  );
});

app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ deleted: this.changes });
  });
});

// ======== USER ROUTES ========
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, 'customer'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).send(err.message);
        }
        res.json({ id: this.lastID, name, email, role: 'customer' });
      }
    );
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).send(err.message);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) return res.status(401).json({ error: 'Wrong password' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
});

app.get('/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// ======== ADMIN ROUTES ========
app.post('/admin/login', (req, res) => {
  const { name, password } = req.body;
  db.get('SELECT * FROM admin WHERE name = ?', [name], async (err, admin) => {
    if (err) return res.status(500).send(err.message);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const passwordOk = await bcrypt.compare(password, admin.password);
    if (!passwordOk) return res.status(401).json({ error: 'Wrong password' });
    res.json({ id: admin.id, name: admin.name, email: admin.email });
  });
});

// ======== ORDERS ROUTES ========
app.post('/orders', (req, res) => {
  const { user_id, total, phone, address } = req.body;
  db.run(
    'INSERT INTO orders (user_id, total, phone, address, status) VALUES (?, ?, ?, ?, ?)',
    [user_id, total, phone, address, 'pending'],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({
        id: this.lastID,
        user_id,
        total,
        phone,
        address,
        status: 'pending',
        message: 'Order received! You will get an M-Pesa STK push shortly.'
      });
    }
  );
});

app.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
