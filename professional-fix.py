#!/usr/bin/env python3
"""
Professional Fix - Proper code structure
"""

def professional_fix():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Add missing orders state after users
    if 'const [orders, setOrders] = useState([]);' not in content:
        content = content.replace(
            'const [users, setUsers] = useState([]);',
            'const [users, setUsers] = useState([]);\n  const [orders, setOrders] = useState([]);'
        )
        print("✅ Added orders state")
    
    # Fix 2: Move addDemoProductsToSupabase inside component if it's outside
    # Check if it's declared before state declarations
    if 'const [showEditModal, setShowEditModal] = useState(false);\nconst addDemoProductsToSupabase' in content:
        # It's in wrong place, need to move it after all state declarations
        # Extract the function
        import re
        match = re.search(r'(const addDemoProductsToSupabase = async \(\) => \{[^}]+\};\n)', content, re.DOTALL)
        if match:
            func_code = match.group(1)
            # Remove from wrong location
            content = content.replace(func_code, '')
            # Add after state declarations (after showEditModal)
            content = content.replace(
                'const [showEditModal, setShowEditModal] = useState(false);',
                'const [showEditModal, setShowEditModal] = useState(false);\n\n  ' + func_code.strip()
            )
            print("✅ Fixed addDemoProductsToSupabase placement")
    
    # Fix 3: Ensure fetchUsers is enabled
    if 'console.log("User listing requires admin API");' in content:
        content = content.replace(
            '''const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };''',
            '''const fetchUsers = async () => {
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
    
    # Fix 4: Add fetchOrders if missing
    if 'const fetchOrders' not in content:
        # Add after fetchUsers
        content = content.replace(
            '''const fetchUsers = async () => {
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
            '''const fetchUsers = async () => {
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
        print("✅ Added fetchOrders function")
    
    # Fix 5: Add useEffect for orders
    if 'useEffect(() => { if (isAdmin && adminTab === "reports") fetchOrders(); }' not in content:
        content = content.replace(
            'useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);',
            '''useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);
  useEffect(() => { if (isAdmin && adminTab === "reports") fetchOrders(); }, [isAdmin, adminTab]);'''
        )
        print("✅ Added useEffect for orders")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Professional fixes applied!")
    print("   Check compilation status...")

if __name__ == "__main__":
    professional_fix()
