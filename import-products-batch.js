const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'backend', 'shop.db');
const db = new sqlite3.Database(dbPath);

console.log('📦 Creating smaller batch files for Supabase...\n');

db.all('SELECT * FROM products', [], (err, rows) => {
  if (err) {
    console.error('❌ Error reading products:', err);
    return;
  }

  const batchSize = 20; // 20 products per file
  const batches = [];
  
  for (let i = 0; i < rows.length; i += batchSize) {
    batches.push(rows.slice(i, i + batchSize));
  }

  console.log(`✅ Creating ${batches.length} batch files (${batchSize} products each)\n`);

  batches.forEach((batch, batchIndex) => {
    let sql = `-- ============================================
-- IMPORT PRODUCTS - BATCH ${batchIndex + 1} of ${batches.length}
-- Products ${batchIndex * batchSize + 1} to ${Math.min((batchIndex + 1) * batchSize, rows.length)}
-- ============================================

`;

    batch.forEach((product, index) => {
      const name = product.name.replace(/'/g, "''");
      const description = (product.description || '').replace(/'/g, "''");
      const image = (product.image || '').replace(/'/g, "''");
      
      sql += `INSERT INTO products (name, price, category, description, inventory, image)
VALUES ('${name}', ${product.price}, '${product.category}', '${description}', ${product.inventory || 0}, '${image}');
`;
    });

    sql += `\n-- Batch ${batchIndex + 1} complete!\n`;

    const filename = `import-products-batch-${batchIndex + 1}.sql`;
    fs.writeFileSync(path.join(__dirname, filename), sql, 'utf8');
    console.log(`✅ Created: ${filename}`);
  });

  console.log(`\n📋 Next steps:`);
  console.log(`1. Open Supabase SQL Editor`);
  console.log(`2. Run each batch file in order:`);
  batches.forEach((_, i) => {
    console.log(`   - import-products-batch-${i + 1}.sql`);
  });
  console.log(`3. All ${rows.length} products will be imported!\n`);

  db.close();
});
