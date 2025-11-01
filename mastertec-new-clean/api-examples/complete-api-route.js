// ✅ COMPLETE EXAMPLE: Full-featured Vercel API Route
// This shows how to handle GET, POST, PUT, DELETE with proper string responses

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  const { method } = req;

  try {
    // GET: Fetch products
    if (method === 'GET') {
      // Simulate fetching from database
      const products = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 }
      ];
      
      // ✅ CORRECT: Always use res.json() or res.send(JSON.stringify())
      return res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    }

    // POST: Create product
    if (method === 'POST') {
      const { name, price } = req.body;
      
      if (!name || !price) {
        // ✅ CORRECT: Validation errors also use res.json()
        return res.status(400).json({
          success: false,
          error: "Name and price are required"
        });
      }

      // Simulate creating product
      const newProduct = {
        id: Date.now(),
        name,
        price,
        createdAt: new Date().toISOString()
      };

      // ✅ CORRECT: Success response
      return res.status(201).json({
        success: true,
        data: newProduct
      });
    }

    // PUT: Update product
    if (method === 'PUT') {
      const { id, ...updates } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Product ID is required"
        });
      }

      // Simulate update
      const updatedProduct = {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        data: updatedProduct
      });
    }

    // DELETE: Delete product
    if (method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Product ID is required"
        });
      }

      return res.status(200).json({
        success: true,
        message: `Product ${id} deleted successfully`
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${method} not allowed`
    });

  } catch (error) {
    // ✅ CORRECT: Always catch errors and return JSON
    console.error('API Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      // Don't expose sensitive error details in production
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
}

// ✅ KEY TAKEAWAYS:
// 1. Always use res.json() or res.send(JSON.stringify(...))
// 2. Every code path must return a response
// 3. Error responses must also be JSON strings
// 4. Status codes should be set explicitly
// 5. Never return objects/arrays directly

