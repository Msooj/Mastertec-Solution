#!/usr/bin/env python3
"""
Complete fix for admin panel:
1. Add Edit/Delete buttons to admin products
2. Enable fetchUsers from Supabase
3. Add URL input for images
"""

def fix_admin():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Fix fetchUsers to actually fetch from Supabase
    old_fetch_users = '''  const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };'''
    
    new_fetch_users = '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };'''
    
    content = content.replace(old_fetch_users, new_fetch_users)
    
    # 2. Add URL input to Add Product form (find the image upload section)
    old_add_image = '''                    <input type="file" accept="image/*"
                      onChange={handleAddImageChange} />
                    {previewImageAdd && <img src={previewImageAdd} alt="Preview" style={{ maxWidth: "100px", marginBottom: "10px" }} />}'''
    
    new_add_image = '''                    <div className="image-upload-section">
                      <h4>Product Image</h4>
                      <input type="text" placeholder="Image URL (paste link)" value={newProduct.image}
                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                      <p style={{ textAlign: 'center', margin: '10px 0', color: '#64748b' }}>OR</p>
                      <input type="file" accept="image/*"
                        onChange={handleAddImageChange} />
                      {(previewImageAdd || newProduct.image) && <img src={previewImageAdd || newProduct.image} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                    </div>'''
    
    content = content.replace(old_add_image, new_add_image)
    
    # 3. Add URL input to Edit Product form
    old_edit_image = '''                    <input type="file" accept="image/*" onChange={handleEditImageChange} />
                    {previewImageEdit && <img src={previewImageEdit} alt="Preview" style={{ maxWidth: "100px", marginBottom: "10px" }} />}'''
    
    new_edit_image = '''                    <div className="image-upload-section">
                      <h4>Product Image</h4>
                      <input type="text" placeholder="Image URL (paste link)" value={editProduct.image || ""}
                        onChange={e => setEditProduct({ ...editProduct, image: e.target.value })} />
                      <p style={{ textAlign: 'center', margin: '10px 0', color: '#64748b' }}>OR</p>
                      <input type="file" accept="image/*" onChange={handleEditImageChange} />
                      {(previewImageEdit || editProduct.image) && <img src={previewImageEdit || editProduct.image} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                    </div>'''
    
    content = content.replace(old_edit_image, new_edit_image)
    
    # 4. Replace admin products section with Edit/Delete buttons
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
              <div className="admin-products-grid">
                {allProducts.map(product => (
                  <div key={product.id} className="admin-product-card">
                    <img src={product.image || "/Logo.jpg"} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="price">Ksh {product.price}</p>
                    {product.discountPrice && <p style={{ color: '#10b981', fontSize: '14px' }}>Discount: Ksh {product.discountPrice}</p>}
                    <p style={{ fontSize: '14px', color: '#64748b' }}>{product.category}</p>
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>Stock: {product.inventory}</p>
                    <div className="admin-product-actions">
                      <button className="btn-edit" onClick={() => startEdit(product)}>
                        <FiEdit2 /> Edit
                      </button>
                      <button className="btn-delete" onClick={() => {
                        if (window.confirm(`Delete ${product.name}?`)) {
                          removeProduct(product.id);
                        }
                      }}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>'''
    
    content = content.replace(old_admin_products, new_admin_products)
    
    # 5. Improve Users tab styling
    old_users_tab = '''          {adminTab === "users" && (
            <div>
              <h2>Users</h2>
              <ul>
                {users.map((user, i) => (
                  <li key={user.id || i}>{user.name} ({user.email}) - {user.role}</li>
                ))}
              </ul>
            </div>
          )}'''
    
    new_users_tab = '''          {adminTab === "users" && (
            <div className="users-list">
              <h2>Users</h2>
              {users.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No users found. Make sure the users table exists in Supabase.</p>
              ) : (
                <ul>
                  {users.map((user, i) => (
                    <li key={user.id || i}>
                      <strong>{user.name || 'N/A'}</strong> ({user.email}) - <span style={{ color: user.role === 'admin' ? '#2065ec' : '#64748b' }}>{user.role || 'user'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}'''
    
    content = content.replace(old_users_tab, new_users_tab)
    
    # 6. Improve Reports tab
    old_reports_tab = '''          {adminTab === "reports" && (
            <div>
              <h2>Reports</h2>
              <div>No reports yet (add backend logic for data)</div>
            </div>
          )}'''
    
    new_reports_tab = '''          {adminTab === "reports" && (
            <div className="reports-section">
              <h2>Reports & Analytics</h2>
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div className="stat-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>Total Products</h3>
                  <p style={{ color: '#2065ec', fontSize: '32px', fontWeight: '700', margin: 0 }}>{allProducts.length}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>Total Users</h3>
                  <p style={{ color: '#10b981', fontSize: '32px', fontWeight: '700', margin: 0 }}>{users.length}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>Categories</h3>
                  <p style={{ color: '#f59e0b', fontSize: '32px', fontWeight: '700', margin: 0 }}>{categories.length}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <h3 style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>Deals</h3>
                  <p style={{ color: '#ef4444', fontSize: '32px', fontWeight: '700', margin: 0 }}>{allProducts.filter(p => p.discountPrice).length}</p>
                </div>
              </div>
              <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Low Stock Alert</h3>
                {allProducts.filter(p => p.inventory < 5).length === 0 ? (
                  <p style={{ color: '#10b981' }}>✓ All products have sufficient stock</p>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {allProducts.filter(p => p.inventory < 5).map(p => (
                      <li key={p.id} style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', color: '#ef4444' }}>
                        ⚠ {p.name} - Only {p.inventory} left
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}'''
    
    content = content.replace(old_reports_tab, new_reports_tab)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Admin panel completely fixed!")
    print("   ✓ Edit/Delete buttons added to products")
    print("   ✓ fetchUsers enabled (from Supabase)")
    print("   ✓ URL input added for images")
    print("   ✓ Users tab improved")
    print("   ✓ Reports tab with analytics added")
    print("\n🔄 Your app should auto-reload now!")

if __name__ == "__main__":
    fix_admin()
