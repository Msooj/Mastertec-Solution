# 🔍 How to Find and Fix Your API Routes

## Step 1: Locate Your API Routes

Vercel API routes are typically in one of these locations:

### Option A: `/api` directory at project root
```
mastertec-new-clean/
├── api/
│   ├── hello.js          ← Check these files!
│   ├── products.js       ← Check these files!
│   └── users.js          ← Check these files!
└── src/
```

### Option B: Next.js `/pages/api` directory (if using Next.js)
```
mastertec-new-clean/
├── pages/
│   └── api/
│       └── route.js      ← Check this!
```

### Option C: Root-level files matching pattern
Check for files like:
- `api/` directory
- Files ending in `.api.js` or `.api.ts`
- Files in `functions/` directory (older Vercel pattern)

---

## Step 2: Search for Problematic Patterns

Use these search terms in your code editor to find problematic code:

### Search Pattern 1: Direct returns
Search for: `return \{` or `return \[`
```javascript
// ❌ These patterns are problematic:
return { data: ... };
return [ ... ];
return someObject;
```

### Search Pattern 2: Missing res.json()
Search for: `export default.*handler` 
Then check if they use `res.json()` or `res.send()`

### Search Pattern 3: Async returns
Search for: `export default async function handler`
Then verify they use `res.json()` before returning

---

## Step 3: Check Each API Route

For each file in your `api/` directory, verify:

### ✅ Checklist for Each Route:

```javascript
export default async function handler(req, res) {
  // ✅ 1. Does it use res.json()?
  return res.status(200).json(data);
  
  // ✅ 2. Are all return paths using res.json()?
  if (error) {
    return res.status(500).json({ error: ... }); // ✅ Good
  }
  
  // ✅ 3. No direct object returns?
  // ❌ return { data: ... }; // Bad!
}
```

---

## Step 4: Common File Patterns to Check

### Pattern: Fetch and Return
```javascript
// ❌ PROBLEM
export default async function handler(req, res) {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return data;  // ❌ Wrong!
}

// ✅ FIX
export default async function handler(req, res) {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return res.status(200).json(data);  // ✅ Fixed!
}
```

### Pattern: Database Query
```javascript
// ❌ PROBLEM
export default async function handler(req, res) {
  const products = await db.query('SELECT * FROM products');
  return products;  // ❌ Wrong!
}

// ✅ FIX
export default async function handler(req, res) {
  const products = await db.query('SELECT * FROM products');
  return res.status(200).json(products);  // ✅ Fixed!
}
```

### Pattern: Conditional Returns
```javascript
// ❌ PROBLEM
export default function handler(req, res) {
  if (req.method === 'GET') {
    return { message: "GET" };  // ❌ Wrong!
  }
  if (req.method === 'POST') {
    return { message: "POST" };  // ❌ Wrong!
  }
}

// ✅ FIX
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ message: "GET" });  // ✅ Fixed!
  }
  if (req.method === 'POST') {
    return res.status(200).json({ message: "POST" });  // ✅ Fixed!
  }
  return res.status(405).json({ error: "Method not allowed" });  // ✅ Fixed!
}
```

---

## Step 5: Use Vercel Logs to Find the Exact Route

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Functions" tab
4. Look for the error: `BODY_NOT_A_STRING_FROM_FUNCTION`
5. The log will show which API route caused it
6. Fix that specific file

---

## Step 6: Quick Fix Script

If you want to check all your API routes at once, create this helper:

```javascript
// check-api-routes.js
const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for direct returns without res.json
  if (content.includes('export default')) {
    const hasResJson = content.includes('res.json') || content.includes('res.send');
    const hasDirectReturn = /return\s+[\{\[]/.test(content);
    
    if (hasDirectReturn && !hasResJson) {
      issues.push('Direct object/array return without res.json()');
    }
    
    if (content.includes('async function handler') && !hasResJson) {
      issues.push('Async handler might not be using res.json()');
    }
  }
  
  return issues;
}

// Run check
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
  const files = fs.readdirSync(apiDir);
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const issues = checkFile(path.join(apiDir, file));
      if (issues.length > 0) {
        console.log(`⚠️  ${file}:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
      }
    }
  });
}
```

Run with: `node check-api-routes.js`

---

## Step 7: Verify the Fix

After fixing your routes:

1. **Test locally:**
   ```bash
   vercel dev
   ```

2. **Check each route:**
   ```bash
   curl http://localhost:3000/api/your-route
   ```

3. **Verify response is JSON:**
   The response should be valid JSON, not an error.

---

## Still Can't Find It?

If you can't locate your API routes:

1. **Check Vercel Dashboard:**
   - Functions tab shows all deployed API routes
   - Error logs show which route failed

2. **Check Build Logs:**
   - Vercel build output shows detected API routes
   - Look for "Detected API Routes" message

3. **Search Your Entire Project:**
   ```bash
   # Search for API route patterns
   grep -r "export default.*handler" .
   grep -r "res.json\|res.send" .
   ```

---

## Need Help?

1. Check `VERCEL_API_ERROR_GUIDE.md` for detailed explanation
2. See `api-examples/` for working examples
3. Check `QUICK-FIX-SUMMARY.md` for the fastest fix

