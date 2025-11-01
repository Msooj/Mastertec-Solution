// ✅ CORRECT EXAMPLE: Vercel Edge Function
// Edge functions use the Fetch API Response object

export const config = {
  runtime: 'edge', // This makes it an Edge Function
};

export default async function handler(req) {
  try {
    // Process request
    const url = new URL(req.url);
    const data = {
      message: "Hello from Edge Function",
      path: url.pathname,
      timestamp: new Date().toISOString()
    };

    // ✅ CORRECT: Return Response object with JSON.stringify()
    return new Response(
      JSON.stringify(data),  // MUST be a string!
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS if needed
        }
      }
    );
    
  } catch (error) {
    // ✅ CORRECT: Error responses also use Response object
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// ❌ WRONG: Don't do this in Edge functions
/*
export default async function handler(req) {
  const data = { message: "Hello" };
  return data;  // ❌ This will cause the error!
}
*/

