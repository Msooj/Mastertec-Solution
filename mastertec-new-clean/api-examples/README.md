# API Route Examples

This directory contains examples of correct and incorrect Vercel API route implementations.

## Quick Start

To use these examples in your Vercel deployment:

1. **Copy an example** from this directory
2. **Place it** in an `api/` directory at your project root:
   ```
   mastertec-new-clean/
   ├── api/
   │   └── your-route.js  (copy from examples)
   └── src/
   ```

3. **Access it** at: `https://your-domain.vercel.app/api/your-route`

## Files

- `correct-example.js` - ✅ Shows the correct pattern
- `incorrect-example.js` - ❌ Shows what NOT to do (commented out)
- `edge-function-example.js` - ✅ Edge Function pattern
- `complete-api-route.js` - ✅ Full CRUD example

## Testing Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
cd mastertec-new-clean
vercel dev

# Test your API route
curl http://localhost:3000/api/your-route
```

## Common Patterns

### Pattern 1: Simple GET
```javascript
export default function handler(req, res) {
  res.status(200).json({ message: "Hello" });
}
```

### Pattern 2: With Async
```javascript
export default async function handler(req, res) {
  const data = await fetchData();
  res.status(200).json(data);
}
```

### Pattern 3: Error Handling
```javascript
export default async function handler(req, res) {
  try {
    const data = await fetchData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Remember

**Always** use `res.json()` or `res.send(JSON.stringify(...))` - never return objects directly!

