#!/usr/bin/env python3
"""
Simple fix: Only enable fetchUsers
"""

def fix_users():
    file_path = "mastertec-new-clean/src/App.js"
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix fetchUsers
    old = '''  const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };'''
    
    new = '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };'''
    
    content = content.replace(old, new)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ fetchUsers enabled!")
    print("   Users will now load from Supabase 'users' table")

if __name__ == "__main__":
    fix_users()
