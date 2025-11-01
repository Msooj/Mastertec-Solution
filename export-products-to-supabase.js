const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'shop.db');
const db = new sqlite3.Database(dbPath);

console.log('📦 Exporting products from SQLite database...\n');

db.all('SELECT * FROM products', [], (err, rows) => {
  if (err) {
    console.error('❌ Error reading products:', err);
    return;
  }

  if (rows.length === 0) {
    console.log('⚠️  No products found in database');
    return;
  }

  console.log(`✅ Found ${rows.length} products\n`);

  // Generate SQL INSERT statements
  let sql = `-- ============================================
-- IMPORT PRODUCTS FROM SQLITE TO SUPABASE
-- Generated: ${new Date().toISOString()}
-- Total Products: ${rows.length}
-- ============================================

`;

  rows.forEach((product, index) => {
    const name = product.name.replace(/'/g, "''"); // Escape single quotes
    const description = (product.description || '').replace(/'/g, "''");
    const image = (product.image || '').replace(/'/g, "''");
    
    sql += `-- Product ${index + 1}: ${product.name}
INSERT INTO products (name, price, category, description, inventory, image)
VALUES (
  '${name}',
  ${product.price},
  '${product.category}',
  '${description}',
  ${product.inventory || 0},
  '${image}'
);

`;
  });

  sql += `-- ============================================
-- VERIFICATION
-- ============================================
SELECT COUNT(*) as total_products FROM products;
SELECT category, COUNT(*) as count FROM products GROUP BY category;
`;

  // Save to file
  const outputPath = path.join(__dirname, 'import-products.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log('✅ SQL file generated successfully!');
  console.log(`📄 File: import-products.sql`);
  console.log(`\n📋 Next steps:`);
  console.log('1. Open Supabase SQL Editor');
  console.log('2. Copy contents of import-products.sql');
  console.log('3. Paste and run in SQL Editor');
  console.log(`4. This will import all ${rows.length} products to Supabase\n`);

  // Also show summary
  console.log('📊 Products by Category:');
  const categories = {};
  rows.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} products`);
  });

  db.close();
});
