#!/usr/bin/env python3
"""
Fix Reports and Users CSS - Simple inline styles
"""

def fix_reports_and_users():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find and replace Users section
    for i, line in enumerate(lines):
        if '{adminTab === "users" &&' in line:
            # Replace the next few lines with better styled version
            lines[i+1] = '            <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>\n'
            lines[i+2] = '              <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Users</h2>\n'
            lines[i+3] = '              <ul style={{ listStyle: "none", padding: 0 }}>\n'
            break
    
    # Find and replace Reports section  
    for i, line in enumerate(lines):
        if '{adminTab === "reports" &&' in line:
            # Find the closing of this section
            j = i + 1
            depth = 1
            while j < len(lines) and depth > 0:
                if '})' in lines[j]:
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            
            # Replace entire reports section
            new_reports = '''            <div>
              <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Reports & Analytics</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>TOTAL PRODUCTS</h3>
                  <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{allProducts.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>TOTAL USERS</h3>
                  <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{users.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>CATEGORIES</h3>
                  <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{categories.length}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", padding: "30px", borderRadius: "12px", color: "white" }}>
                  <h3 style={{ fontSize: "14px", marginBottom: "10px", opacity: 0.9 }}>DEALS ACTIVE</h3>
                  <p style={{ fontSize: "36px", fontWeight: "700", margin: 0 }}>{allProducts.filter(p => p.discountPrice).length}</p>
                </div>
              </div>
              <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <h3 style={{ color: "#1e293b", marginBottom: "15px" }}>⚠️ Low Stock Alert</h3>
                {allProducts.filter(p => p.inventory < 5).length === 0 ? (
                  <div style={{ padding: "20px", background: "#f0fdf4", borderRadius: "8px", color: "#166534" }}>✓ All products have sufficient stock</div>
                ) : (
                  <div>
                    {allProducts.filter(p => p.inventory < 5).map(p => (
                      <div key={p.id} style={{ padding: "15px", background: "#fef2f2", borderRadius: "8px", marginBottom: "10px", color: "#991b1b" }}>
                        <strong>{p.name}</strong> - Only {p.inventory} left in stock
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
'''
            # Replace the section
            lines[i:j+1] = [new_reports + '          )}\n']
            break
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print("✅ Reports and Users CSS fixed!")
    print("   - Users tab has better styling")
    print("   - Reports tab shows analytics")

if __name__ == "__main__":
    fix_reports_and_users()
