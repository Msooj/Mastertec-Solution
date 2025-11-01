#!/usr/bin/env python3
"""
Complete Admin Panel Fix
- Adds orders state
- Enables fetchUsers from Supabase
- Adds fetchOrders from Supabase  
- Adds Edit/Delete buttons to admin products
- Adds Reports with orders data
"""

def fix_admin_complete():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add orders state
    content = content.replace(
        '  const [users, setUsers] = useState([]);',
        '  const [users, setUsers] = useState([]);\n  const [orders, setOrders] = useState([]);'
    )
    
    # 2. Fix fetchUsers
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
    
    # 3. Add fetchOrders function after fetchUsers
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
    
    # 4. Add useEffect for orders
    content = content.replace(
        '  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);',
        '''  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);
  useEffect(() => { if (isAdmin && adminTab === "reports") fetchOrders(); }, [isAdmin, adminTab]);'''
    )
    
    # 5. Replace admin products section with Edit/Delete buttons
    old_products = '''             <div id="products" className="products-section">
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
    
    new_products = '''              <h2>Manage Products</h2>
              <div className="product-grid">
                {allProducts.map(product => (
                  <div key={product.id} className="product-card" style={{ position: "relative" }}>
                    <img src={product.image || "/Logo.jpg"} alt={product.name} />
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="price">Ksh {product.price}</div>
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
    
    content = content.replace(old_products, new_products)
    
    # 6. Replace Reports section
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
                  <p style={{ color: "#64748b" }}>No orders yet</p>
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
            </div>
          )}'''
    
    content = content.replace(old_reports, new_reports)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Complete Admin Panel Fixed!")
    print("   - Orders state added")
    print("   - fetchUsers enabled")
    print("   - fetchOrders added")
    print("   - Edit/Delete buttons on products")
    print("   - Reports with orders data")

if __name__ == "__main__":
    fix_admin_complete()
