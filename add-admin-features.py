#!/usr/bin/env python3
"""
Add Edit/Delete buttons and URL image input to admin panel
"""

import re

def add_admin_features():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Import AdminStyles.css
    content = content.replace(
        'import "./App.css";\nimport { FaWhatsapp }',
        'import "./App.css";\nimport "./AdminStyles.css";\nimport { FaWhatsapp }'
    )
    
    # 2. Add URL input to Add Product modal (after discount price input)
    add_image_section = '''                    <input type="text" placeholder="Discount Price" value={newProduct.discountPrice}
                      onChange={e => setNewProduct({ ...newProduct, discountPrice: e.target.value })} />
                    <div className="image-upload-section">
                      <h4>Product Image</h4>
                      <input type="text" placeholder="Image URL (paste link here)" value={newProduct.image}
                        onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                      <p style={{ textAlign: 'center', margin: '10px 0', color: '#64748b' }}>OR</p>
                      <input type="file" accept="image/*"
                        onChange={handleAddImageChange} />
                      {(previewImageAdd || newProduct.image) && <img src={previewImageAdd || newProduct.image} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                    </div>'''
    
    content = re.sub(
        r'(\s+<input type="text" placeholder="Discount Price"[^>]+>\s+<input type="file"[^>]+>\s+\{previewImageAdd[^}]+\})',
        add_image_section,
        content
    )
    
    # 3. Add URL input to Edit Product modal
    edit_image_section = '''                    <input type="text" value={editProduct.discountPrice || ""} placeholder="Discount Price" onChange={e => setEditProduct({ ...editProduct, discountPrice: e.target.value })} />
                    <div className="image-upload-section">
                      <h4>Product Image</h4>
                      <input type="text" placeholder="Image URL (paste link here)" value={editProduct.image || ""}
                        onChange={e => setEditProduct({ ...editProduct, image: e.target.value })} />
                      <p style={{ textAlign: 'center', margin: '10px 0', color: '#64748b' }}>OR</p>
                      <input type="file" accept="image/*" onChange={handleEditImageChange} />
                      {(previewImageEdit || editProduct.image) && <img src={previewImageEdit || editProduct.image} alt="Preview" style={{ maxWidth: "100px", marginTop: "10px" }} />}
                    </div>'''
    
    content = re.sub(
        r'(\s+<input type="text" value=\{editProduct\.discountPrice[^}]+\} />\s+<input type="file"[^>]+>\s+\{previewImageEdit[^}]+\})',
        edit_image_section,
        content
    )
    
    # 4. Replace admin products display with Edit/Delete buttons
    admin_products_grid = '''              <div className="admin-products-grid">
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
                ))}\n              </div>'''
    
    # Find and replace the admin products section
    pattern = r'(\s+<div id="products" className="products-section">.*?</div>\s*</div>)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        # Find the position after showEditModal closing
        edit_modal_end = content.find('</div>\n              )}', content.find('showEditModal'))
        if edit_modal_end != -1:
            insert_pos = edit_modal_end + len('</div>\n              )}')
            content = content[:insert_pos] + '\n' + admin_products_grid + content[insert_pos:]
            # Remove the old products section in admin
            content = re.sub(
                r'(\s+<div id="products" className="products-section">.*?map\(product => \(.*?</div>\s+\)\)}\s+</div>\s+</div>)',
                '',
                content,
                count=1,
                flags=re.DOTALL
            )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Admin features added successfully!")
    print("   - AdminStyles.css imported")
    print("   - URL input added to Add Product")
    print("   - URL input added to Edit Product")
    print("   - Edit/Delete buttons added to admin products")

if __name__ == "__main__":
    add_admin_features()
