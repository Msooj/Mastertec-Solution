const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mastertec-new-clean', 'src', 'App.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Supabase import
content = content.replace(
  `import { supabase } from "./supabaseClient";`,
  `// Removed Supabase - using local backend only`
);

// 2. Fix addDemoProductsToSupabase function
content = content.replace(
  /const addDemoProductsToSupabase = async \(\) => \{[\s\S]*?fetchProducts\(\);[\s\S]*?\};/,
  `const addDemoProductsToBackend = async () => {
  try {
    for (const prod of demoProducts) {
      await axios.post(\`\${API_URL}/products\`, {
        name: prod.name,
        price: prod.price,
        category: prod.category,
        description: prod.description,
        inventory: prod.inventory,
        image: prod.image
      });
    }
    alert("Demo products added to backend!");
    fetchProducts();
  } catch (err) {
    alert("Error adding demo products: " + err.message);
  }
};`
);

// 3. Fix loginUser function
content = content.replace(
  /const loginUser = async \(e\) => \{[\s\S]*?setLoginError\(err\.message \|\| "Login failed\."\);[\s\S]*?\};/,
  `const loginUser = async (e) => {
  e.preventDefault();
  setLoginError(null);
  try {
    const res = await axios.post(\`\${API_URL}/login\`, {
      email: authEmail,
      password: authPassword
    });
    setCurrentUser(res.data);
    setShowAuth(false);
    setAuthPassword(""); 
    setAuthEmail("");
  } catch (err) {
    setLoginError(err.response?.data?.error || "Login failed.");
  }
};`
);

// 4. Fix signupUser function
content = content.replace(
  /const signupUser = async \(e\) => \{[\s\S]*?setSignupError\(err\.message \|\| "Signup failed\."\);[\s\S]*?\};/,
  `const signupUser = async (e) => {
  e.preventDefault();
  setSignupError(null);
  try {
    const res = await axios.post(\`\${API_URL}/signup\`, {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value
    });
    setCurrentUser(res.data);
    setShowAuth(false);
    alert("Account created successfully!");
  } catch (err) {
    setSignupError(err.response?.data?.error || "Signup failed.");
  }
};`
);

// 5. Fix handleAdminLogin function
content = content.replace(
  /const handleAdminLogin = async \(e\) => \{[\s\S]*?setAdminLoginError\(err\.message \|\| "Login failed"\);[\s\S]*?\};/,
  `const handleAdminLogin = async (e) => {
  e.preventDefault();
  setAdminLoginError("");
  try {
    const res = await axios.post(\`\${API_URL}/admin/login\`, {
      name: adminEmail,
      password: authPassword
    });
    setCurrentUser(res.data);
    setIsAdmin(true);
    setShowAdmin(false);
    setAuthPassword("");
    setAdminEmail("");
  } catch (err) {
    console.error(err);
    setAdminLoginError(err.response?.data?.error || "Admin login failed");
  }
};`
);

// 6. Fix logout function
content = content.replace(
  /const logout =async \(\) => \{[\s\S]*?await supabase\.auth\.signOut\(\);/,
  `const logout = () => {`
);

// 7. Fix removeProduct function
content = content.replace(
  /const removeProduct = async \(id\) => \{[\s\S]*?alert\("Error deleting product: " \+ err\.message\);[\s\S]*?\};/,
  `const removeProduct = async (id) => {
  try {
    await axios.delete(\`\${API_URL}/products/\${id}\`);
    fetchProducts();
  } catch (err) {
    alert("Error deleting product: " + (err.response?.data || err.message));
  }
};`
);

// 8. Fix addNewProduct function
content = content.replace(
  /const addNewProduct = async \(e\) => \{[\s\S]*?alert\("Error adding product: " \+ err\.message\);[\s\S]*?\};/,
  `const addNewProduct = async (e) => {
  e.preventDefault();
 try {
    await axios.post(\`\${API_URL}/products\`, {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      inventory: parseInt(newProduct.inventory),
      image: newProduct.image
    });
    setNewProduct({ name: "", price: "", discountPrice: "", category: categories[0], description: "", inventory: 10, image: "" });
    setPreviewImageAdd(null);
    setShowAddModal(false);
    fetchProducts();
  } catch (err) {
    alert("Error adding product: " + (err.response?.data || err.message));
  }
};`
);

// 9. Fix updateProduct function
content = content.replace(
  /const updateProduct = async \(e\) => \{[\s\S]*?alert\("Error updating product: " \+ err\.message\);[\s\S]*?\};/,
  `const updateProduct = async (e) => {
  e.preventDefault();
  try {
    await axios.put(\`\${API_URL}/products/\${editProduct.id}\`, {
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      category: editProduct.category,
      description: editProduct.description,
      inventory: parseInt(editProduct.inventory),
      image: editProduct.image
    });
    setEditProduct(null);
    setPreviewImageEdit(null);
    setShowEditModal(false);
    fetchProducts();
  } catch (err) {
    alert("Error updating product: " + (err.response?.data || err.message));
  }
};`
);

// 10. Fix button text
content = content.replace(
  'Add DEMO Products to Supabase',
  'Add DEMO Products to Backend'
);

// 11. Fix button onClick
content = content.replace(
  'onClick={addDemoProductsToSupabase}',
  'onClick={addDemoProductsToBackend}'
);

// 12. Fix admin form inputs
content = content.replace(
  /<input type="text" name="name"id="admin-name" required placeholder="Admin Name" \/>/,
  `<input type="text" name="name" id="admin-name" required placeholder="Admin Name" 
              value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />`
);

content = content.replace(
  /<input type="password" name="password"id="admin-password" required placeholder="Admin Password" \/>/,
  `<input type="password" name="password" id="admin-password" required placeholder="Admin Password" 
              value={authPassword} onChange={e => setAuthPassword(e.target.value)} />`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed all Supabase references in App.js');
