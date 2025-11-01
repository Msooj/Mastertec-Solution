// ❌ INCORRECT EXAMPLE: What NOT to do
// This demonstrates common mistakes that cause BODY_NOT_A_STRING_FROM_FUNCTION error

export default async function handler(req, res) {
  try {
    const data = {
      message: "Success",
      products: [{ id: 1, name: "Product 1" }]
    };

    // ❌ WRONG: Returning object directly
    // This will cause: BODY_NOT_A_STRING_FROM_FUNCTION
    return data;
    
    // ❌ WRONG: Returning array directly
    // return [{ id: 1 }, { id: 2 }];
    
    // ❌ WRONG: Returning undefined (if no explicit return)
    // Missing return statement
    
    // ❌ WRONG: Returning number
    // return 42;
    
  } catch (error) {
    // ❌ WRONG: Returning error object directly
    return { error: error.message };
  }
}

// ✅ CORRECT VERSIONS (uncomment to use):
/*
export default async function handler(req, res) {
  try {
    const data = {
      message: "Success",
      products: [{ id: 1, name: "Product 1" }]
    };
    
    // ✅ CORRECT: Use res.json()
    return res.status(200).json(data);
    
  } catch (error) {
    // ✅ CORRECT: Use res.json() for errors too
    return res.status(500).json({ error: error.message });
  }
}
*/

