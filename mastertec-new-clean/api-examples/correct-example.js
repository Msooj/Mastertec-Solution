// ✅ CORRECT EXAMPLE: Vercel API Route
// This file demonstrates the CORRECT way to create a Vercel serverless function

export default async function handler(req, res) {
  // Handle CORS if needed
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  try {
    // Example: Fetching data
    const data = {
      message: "Success",
      timestamp: new Date().toISOString(),
      products: [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" }
      ]
    };

    // ✅ CORRECT: Use res.json() - automatically converts to JSON string
    return res.status(200).json(data);
    
    // Alternative correct approaches:
    // res.status(200).send(JSON.stringify(data));
    // res.status(200).json({ success: true, data: data });
    
  } catch (error) {
    // ✅ CORRECT: Error responses must also be strings
    return res.status(500).json({ 
      error: error.message,
      code: 'INTERNAL_ERROR'
    });
  }
}

