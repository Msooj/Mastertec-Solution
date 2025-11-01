import re

# Read the file
with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

print('🔧 Applying all fixes...\n')

# FIX 1: Add auth persistence
old_useeffect = '''  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);'''

new_useeffect = '''  // Check for existing session on mount
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
  
  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);'''

content = content.replace(old_useeffect, new_useeffect)
print('✅ Auth persistence added')

# FIX 2: Add removeFromCart and update addToCart
old_addtocart = '  const addToCart = product => setCart([...cart, product]);'

new_addtocart = '''  const addToCart = (product, event) => {
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
  };'''

content = content.replace(old_addtocart, new_addtocart)
print('✅ Flying animation and removeFromCart added')

# FIX 3: Update all addToCart button calls
content = re.sub(r'onClick=\{(\(\) => )?addToCart\(product\)\}', 'onClick={(e) => addToCart(product, e)}', content)
print('✅ Updated all addToCart button calls')

# FIX 4: Add remove button to cart items
old_cart_item = '''              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>
              ))}'''

new_cart_item = '''              {cart.map((item, idx) => (
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
              ))}'''

content = content.replace(old_cart_item, new_cart_item)
print('✅ Remove button added to cart items')

# Write the file
with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 All fixes applied successfully!')
print('\n📋 Changes made:')
print('  1. ✅ Auth persistence - Users stay logged in after refresh')
print('  2. ✅ Remove from cart - Added ✕ button to remove items')
print('  3. ✅ Flying animation - Cart icon animation when adding items')
print('\n🔄 Refresh your app to see the changes!')
