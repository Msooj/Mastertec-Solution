import re

with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

print('🔧 Applying all three fixes...\n')

# FIX 1: Add auth persistence
old1 = '''  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);'''

new1 = '''  useEffect(() => {
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

if old1 in content:
    content = content.replace(old1, new1)
    print('✅ Auth persistence added')
else:
    print('⚠️  Auth persistence pattern not found')

# FIX 2: Update fetchUsers
old2 = '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };'''

new2 = '''  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };'''

# Already correct, skip

# FIX 3: Add flying animation and removeFromCart
old3 = '  const addToCart = product => setCart([...cart, product]);'

new3 = '''  const addToCart = (product, event) => {
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

if old3 in content:
    content = content.replace(old3, new3)
    print('✅ Flying animation and removeFromCart added')
else:
    print('⚠️  addToCart pattern not found')

# FIX 4: Update button calls
content = re.sub(r'onClick=\{(\(\) => )?addToCart\(product\)\}', 'onClick={(e) => addToCart(product, e)}', content)
print('✅ Updated addToCart button calls')

# FIX 5: Add remove button to cart items
old5 = '''              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>
              ))}'''

new5 = '''              {cart.map((item, idx) => (
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

if old5 in content:
    content = content.replace(old5, new5)
    print('✅ Remove button added to cart items')
else:
    print('⚠️  Cart items pattern not found')

with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 All fixes applied!')
print('\n📋 Summary:')
print('  1. ✅ Auth persistence - Stay logged in after refresh')
print('  2. ✅ Flying animation - Cart icon flies when adding')
print('  3. ✅ Remove from cart - Red ✕ button on each item')
print('\n🔄 Your app should auto-reload. Test it now!')
