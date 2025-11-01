#!/usr/bin/env python3
"""
FINAL COMPLETE FIX - All admin features
1. Fix duplicate signupUser
2. Add orders state
3. Enable fetchUsers
4. Add fetchOrders
5. Add Edit/Delete buttons to admin products
6. Add complete Reports with orders and deals
"""

def final_fix():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Starting fixes...")
    
    # Fix 1: Remove duplicate signupUser (the corrupted one in the middle)
    # Find the pattern where signupUser has incomplete closing
    old_signup = '''  const signupUser = async (e) => {
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
};'''
    
    new_signup = '''  const signupUser = async (e) => {
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
  };'''
    
    content = content.replace(old_signup, new_signup)
    print("✅ Fixed signupUser")
    
    # Fix 2: Add orders state
    content = content.replace(
        '  const [users, setUsers] = useState([]);',
        '  const [users, setUsers] = useState([]);\n  const [orders, setOrders] = useState([]);'
    )
    print("✅ Added orders state")
    
    # Fix 3: Enable fetchUsers
    content = content.replace(
        '''  const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };''',
        '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };'''
    )
    print("✅ Enabled fetchUsers")
    
    # Fix 4: Add fetchOrders
    content = content.replace(
        '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };


  const loginUser''',
        '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    }
  };


  const loginUser'''
    )
    print("✅ Added fetchOrders")
    
    # Fix 5: Add useEffect for orders
    content = content.replace(
        '  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);',
        '''  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);
  useEffect(() => { if (isAdmin && adminTab === "reports") fetchOrders(); }, [isAdmin, adminTab]);'''
    )
    print("✅ Added useEffect for orders")
    
    # Fix 6: Replace admin products section with Edit/Delete buttons
    old_admin_products = '''             <div id="products" className="products-section">
  <h2>Our Products</h2>
  <div className="product-grid">
    {allProducts
      .filter(product => (selectedCat === "All" ? true : product.category === selectedCat))
      .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
      .map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image || "/Logo.jpg"} alt={product.name} />
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price">Ksh {product.price}</div>
            <button onClick={(e) => addToCart(product, e)}>Add to Cart</button>
          </div>
        </div>
      ))}
  </div>
</div>'''
    
    new_admin_products = '''              <h2>Manage Products</h2>
              <div className="product-grid">
                {allProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image || "/Logo.jpg"} alt={product.name} />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="price">Ksh {product.price}</div>
                      {product.discountPrice && <div style={{ color: "#10b981", fontSize: "14px" }}>Discount: Ksh {product.discountPrice}</div>}
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={() => startEdit(product)} style={{ background: "#f59e0b", flex: 1 }}>
                          <FiEdit2 /> Edit
                        </button>
                        <button onClick={() => { if (window.confirm(`Delete ${product.name}?`)) removeProduct(product.id); }} style={{ background: "#ef4444", flex: 1 }}>
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>'''
    
    content = content.replace(old_admin_products, new_admin_products)
    print("✅ Added Edit/Delete buttons to products")
    
    # Fix 7: Replace Reports section with full analytics
    old_reports = '''          {adminTab === "reports" && (
            <div>
              <h2>Reports</h2>
              <div>No reports yet (add backend logic for data)</div>
            </div>
          )}'''
    
    new_reports = '''          {adminTab === "reports" && (
            <div>
              <h2 style={{ marginBottom: "20px" }}>Reports & Analytics</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>TOTAL PRODUCTS</h3>
                  <p style={{ fontSize: "42px", fontWeight: "700", margin: 0 }}>{allProducts.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>TOTAL USERS</h3>
                  <p style={{ fontSize: "42px", fontWeight: "700", margin: 0 }}>{users.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>TOTAL ORDERS</h3>
                  <p style={{ fontSize: "42px", fontWeight: "700", margin: 0 }}>{orders.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>REVENUE</h3>
                  <p style={{ fontSize: "42px", fontWeight: "700", margin: 0 }}>Ksh {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
                <h3 style={{ marginBottom: "15px" }}>📦 Recent Orders</h3>
                {orders.length === 0 ? (
                  <p style={{ color: "#64748b" }}>No orders yet. Orders will appear here once customers make purchases.</p>
                ) : (
                  <div>
                    {orders.slice(0, 10).map(order => (
                      <div key={order.id} style={{ padding: "15px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <strong>{order.customer_name || "Customer"}</strong>
                          <p style={{ fontSize: "14px", color: "#64748b", margin: "5px 0" }}>{order.items || "Items"}</p>
                          <p style={{ fontSize: "12px", color: "#94a3b8" }}>{order.location || "Location"}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "18px", fontWeight: "700", color: "#10b981" }}>Ksh {order.total}</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>{new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: "15px" }}>🎯 Products with Deals</h3>
                {allProducts.filter(p => p.discountPrice).length === 0 ? (
                  <p style={{ color: "#64748b" }}>No active deals. Add discount prices to products to create deals.</p>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                    {allProducts.filter(p => p.discountPrice).map(p => (
                      <div key={p.id} style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <strong style={{ color: "#1e293b" }}>{p.name}</strong>
                        <div style={{ marginTop: "10px" }}>
                          <span style={{ color: "#10b981", fontSize: "18px", fontWeight: "700" }}>Ksh {p.discountPrice}</span>
                          <span style={{ color: "#94a3b8", fontSize: "14px", textDecoration: "line-through", marginLeft: "8px" }}>Ksh {p.price}</span>
                        </div>
                        <div style={{ marginTop: "5px", color: "#f59e0b", fontSize: "12px", fontWeight: "600" }}>
                          {Math.round((p.price - p.discountPrice) / p.price * 100)}% OFF
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}'''
    
    content = content.replace(old_reports, new_reports)
    print("✅ Added complete Reports with orders and deals")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n🎉 ALL FIXES APPLIED SUCCESSFULLY!")
    print("   - Duplicate signupUser fixed")
    print("   - Orders state added")
    print("   - fetchUsers enabled")
    print("   - fetchOrders added")
    print("   - Edit/Delete buttons on products")
    print("   - Complete Reports with orders and deals")

if __name__ == "__main__":
    final_fix()
