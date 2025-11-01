const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mastertec-new-clean', 'src', 'App.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Restore Supabase import
content = content.replace(
  `// Removed Supabase - using local backend only`,
  `import { supabase } from "./supabaseClient";`
);

// 2. Update addDemoProductsToBackend to use Supabase
content = content.replace(
  /const addDemoProductsToBackend = async \(\) => \{[\s\S]*?alert\("Error adding demo products: " \+ err\.message\);[\s\S]*?\};/,
  `const addDemoProductsToSupabase = async () => {
  try {
    const productData = demoProducts.map(prod => ({
      name: prod.name,
      price: prod.price,
      discountprice: prod.discountPrice,
      category: prod.category,
      description: prod.description,
      inventory: prod.inventory,
      image: prod.image
    }));
    const { data, error } = await supabase.from("products").insert(productData);
    if (error) throw error;
    alert("Demo products added to Supabase!");
    fetchProducts();
  } catch (err) {
    alert("Error adding demo products: " + err.message);
  }
};`
);

// 3. Update fetchProducts to use Supabase
content = content.replace(
  /const fetchProducts = async \(\) => \{[\s\S]*?console\.error\("Error fetching products:", err\);[\s\S]*?\};/,
  `const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setAllProducts([...demoProducts, ...(data || [])]);
    } catch (err) {
      setAllProducts(demoProducts);
      console.error("Error fetching products:", err);
    }
  };`
);

// 4. Keep loginUser with Supabase Auth
content = content.replace(
  /const loginUser = async \(e\) => \{[\s\S]*?setLoginError\(err\.response\?\.data\?\.error \|\| "Login failed\."\);[\s\S]*?\};/,
  `const loginUser = async (e) => {
  e.preventDefault();
  setLoginError(null);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });
    if (error) throw error;
    setCurrentUser(data.user);
    setShowAuth(false);
    setAuthPassword(""); 
    setAuthEmail("");
  } catch (err) {
    setLoginError(err.message || "Login failed.");
  }
};`
);

// 5. Keep signupUser with Supabase Auth
content = content.replace(
  /const signupUser = async \(e\) => \{[\s\S]*?setSignupError\(err\.response\?\.data\?\.error \|\| "Signup failed\."\);[\s\S]*?\};/,
  `const signupUser = async (e) => {
  e.preventDefault();
  setSignupError(null);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          name: e.target.name.value
        }
      }
    });
    if (error) throw error;
    setCurrentUser(data.user);
    setShowAuth(false);
    alert("Account created! Please check your email to verify.");
  } catch (err) {
    setSignupError(err.message || "Signup failed.");
  }
};`
);

// 6. Update handleAdminLogin to check user metadata
content = content.replace(
  /const handleAdminLogin = async \(e\) => \{[\s\S]*?setAdminLoginError\(err\.response\?\.data\?\.error \|\| "Admin login failed"\);[\s\S]*?\};/,
  `const handleAdminLogin = async (e) => {
  e.preventDefault();
  setAdminLoginError("");
  try {
    // First, sign in with email/password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: authPassword
    });
    if (authError) throw authError;
    
    // Check if user has admin role in metadata
    if (authData.user && authData.user.user_metadata && authData.user.user_metadata.role === 'admin') {
      setCurrentUser(authData.user);
      setIsAdmin(true);
      setShowAdmin(false);
      setAuthPassword("");
      setAdminEmail("");
    } else {
      setAdminLoginError("You don't have admin privileges");
      await supabase.auth.signOut();
    }
  } catch (err) {
    console.error(err);
    setAdminLoginError(err.message || "Admin login failed");
  }
};`
);

// 7. Restore logout with Supabase
content = content.replace(
  /const logout = \(\) => \{/,
  `const logout = async () => {
    await supabase.auth.signOut();`
);

// 8. Update removeProduct to use Supabase
content = content.replace(
  /const removeProduct = async \(id\) => \{[\s\S]*?alert\("Error deleting product: " \+ \(err\.response\?\.data \|\| err\.message\)\);[\s\S]*?\};/,
  `const removeProduct = async (id) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    fetchProducts();
  } catch (err) {
    alert("Error deleting product: " + err.message);
  }
};`
);

// 9. Update addNewProduct to use Supabase
content = content.replace(
  /const addNewProduct = async \(e\) => \{[\s\S]*?alert\("Error adding product: " \+ \(err\.response\?\.data \|\| err\.message\)\);[\s\S]*?\};/,
  `const addNewProduct = async (e) => {
  e.preventDefault();
 try {
    const { data, error } = await supabase.from("products").insert([{
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      discountprice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : null,
      category: newProduct.category,
      description: newProduct.description,
      inventory: parseInt(newProduct.inventory),
      image: newProduct.image
    }]);
    if (error) throw error;
    setNewProduct({ name: "", price: "", discountPrice: "", category: categories[0], description: "", inventory: 10, image: "" });
    setPreviewImageAdd(null);
    setShowAddModal(false);
    fetchProducts();
  } catch (err) {
    alert("Error adding product: " + err.message);
  }
};`
);

// 10. Update updateProduct to use Supabase
content = content.replace(
  /const updateProduct = async \(e\) => \{[\s\S]*?alert\("Error updating product: " \+ \(err\.response\?\.data \|\| err\.message\)\);[\s\S]*?\};/,
  `const updateProduct = async (e) => {
  e.preventDefault();
  try {
    const { error } = await supabase.from("products").update({
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      discountprice: editProduct.discountPrice ? parseFloat(editProduct.discountPrice) : null,
      category: editProduct.category,
      description: editProduct.description,
      inventory: parseInt(editProduct.inventory),
      image: editProduct.image
    }).eq("id", editProduct.id);
    if (error) throw error;
    setEditProduct(null);
    setPreviewImageEdit(null);
    setShowEditModal(false);
    fetchProducts();
  } catch (err) {
    alert("Error updating product: " + err.message);
  }
};`
);

// 11. Fix button text
content = content.replace(
  'Add DEMO Products to Backend',
  'Add DEMO Products to Supabase'
);

// 12. Fix button onClick
content = content.replace(
  'onClick={addDemoProductsToBackend}',
  'onClick={addDemoProductsToSupabase}'
);

// 13. Update fetchUsers to use Supabase (if you want to list auth users, you'll need admin API)
// For now, we'll remove the users tab functionality as it requires service role key
content = content.replace(
  /const fetchUsers = async \(\) => \{[\s\S]*?console\.error\("Error fetching users:", err\);[\s\S]*?\};/,
  `const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Restored Supabase integration in App.js');
console.log('📝 Please check setup-supabase.md for database setup instructions');
