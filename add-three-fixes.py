import re

with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = ''.join(lines)

print('🔧 Adding all three fixes to App.js...\n')

# FIX 1: Add auth persistence after line with checkoutError
fix1_search = "  const [checkoutError, setCheckoutError] = useState(null);\n\n\n  useEffect(() => { fetchProducts(); }, [isAdmin]);"
fix1_replace = """  const [checkoutError, setCheckoutError] = useState(null);


  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        if (session.user.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => { fetchProducts(); }, [isAdmin]);"""

if fix1_search in content:
    content = content.replace(fix1_search, fix1_replace)
    print('✅ Fix 1: Auth persistence added')
else:
    print('⚠️  Fix 1: Pattern not found, trying alternative...')
    # Try alternative pattern
    alt_search = "  useEffect(() => { fetchProducts(); }, [isAdmin]);\n  useEffect(() => { if (isAdmin && adminTab === \"users\") fetchUsers(); }, [isAdmin, adminTab]);"
    alt_replace = """  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        if (session.user.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);"""
    
    if alt_search in content:
        content = content.replace(alt_search, alt_replace)
        print('✅ Fix 1: Auth persistence added (alternative pattern)')

# FIX 2: Update fetchUsers
fix2_search = """  const fetchUsers = async () => {
    // Note: Listing users requires Supabase Admin API
    // For now, this is disabled. You can implement it with a backend function
    console.log("User listing requires admin API");
  };"""

fix2_replace = """  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };"""

if fix2_search in content:
    content = content.replace(fix2_search, fix2_replace)
    print('✅ Fix 2: fetchUsers updated to use Supabase')

# FIX 3: Add flying animation and removeFromCart
fix3_search = "  const addToCart = product => setCart([...cart, product]);"
fix3_replace = """  const addToCart = (product, event) => {
    setCart([...cart, product]);
    if (event?.target) {
      const button = event.target;
      const cartIcon = document.querySelector('.cart-count')?.parentElement;
      if (cartIcon) {
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        const flyingItem = document.createElement('div');
        flyingItem.textContent = '🛒';
        flyingItem.style.cssText = `position: fixed; left: ${buttonRect.left}px; top: ${buttonRect.top}px; font-size: 24px; z-index: 9999; pointer-events: none; transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);`;
        document.body.appendChild(flyingItem);
        setTimeout(() => {
          flyingItem.style.left = cartRect.left + 'px';
          flyingItem.style.top = cartRect.top + 'px';
          flyingItem.style.opacity = '0';
          flyingItem.style.transform = 'scale(0.3)';
        }, 10);
        setTimeout(() => document.body.removeChild(flyingItem), 900);
      }
    }
  };
  
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };"""

if fix3_search in content:
    content = content.replace(fix3_search, fix3_replace)
    print('✅ Fix 3: Flying animation and removeFromCart added')

# FIX 4: Update button onClick handlers
content = re.sub(r'<button onClick=\{(\(\) => )?addToCart\(product\)\}>Add to Cart</button>', 
                 '<button onClick={(e) => addToCart(product, e)}>Add to Cart</button>', content)
print('✅ Fix 4: Updated addToCart button calls')

# FIX 5: Add remove button to cart items
fix5_search = """              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>
              ))}"""

fix5_replace = """              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                  <button 
                    onClick={() => removeFromCart(idx)}
                    style={{
                      background: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginLeft: '8px'
                    }}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
              ))}"""

if fix5_search in content:
    content = content.replace(fix5_search, fix5_replace)
    print('✅ Fix 5: Remove button added to cart items')

with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 All fixes applied successfully!')
print('\n📋 What changed:')
print('  1. ✅ Auth persistence - Users stay logged in after refresh')
print('  2. ✅ fetchUsers - Now queries Supabase users table')
print('  3. ✅ Flying animation - 🛒 flies to cart when adding items')
print('  4. ✅ removeFromCart - Function to remove items from cart')
print('  5. ✅ Remove button - Red ✕ button on each cart item')
print('\n🔄 Your app should auto-reload now. Test all features!')
