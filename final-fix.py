with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('🔧 Applying fixes by line insertion...\n')

# Find the line with useEffect for fetchProducts
for i, line in enumerate(lines):
    if 'useEffect(() => { fetchProducts(); }, [isAdmin]);' in line:
        # Insert auth persistence code BEFORE this line
        auth_code = """  useEffect(() => {
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
  
"""
        lines.insert(i, auth_code)
        print(f'✅ Auth persistence added at line {i+1}')
        break

# Find addToCart and replace it
for i, line in enumerate(lines):
    if 'const addToCart = product => setCart([...cart, product]);' in line:
        # Replace this line and add removeFromCart
        new_code = """  const addToCart = (product, event) => {
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
  };
"""
        lines[i] = new_code
        print(f'✅ Flying animation and removeFromCart added at line {i+1}')
        break

# Find fetchUsers and update it
in_fetchusers = False
fetchusers_start = -1
for i, line in enumerate(lines):
    if 'const fetchUsers = async () => {' in line:
        in_fetchusers = True
        fetchusers_start = i
    elif in_fetchusers and '};' in line and i > fetchusers_start:
        # Replace the entire fetchUsers function
        new_fetchusers = """  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };
"""
        # Remove old lines
        del lines[fetchusers_start:i+1]
        # Insert new function
        lines.insert(fetchusers_start, new_fetchusers)
        print(f'✅ fetchUsers updated at line {fetchusers_start+1}')
        break

# Find cart items and add remove button
content = ''.join(lines)
old_cart = '''              {cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>
              ))}'''

new_cart = '''              {cart.map((item, idx) => (
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

if old_cart in content:
    content = content.replace(old_cart, new_cart)
    print('✅ Remove button added to cart items')
else:
    print('⚠️  Cart items pattern not found')

with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 All fixes applied!')
print('\n🔄 Your app should reload automatically.')
print('Test: Refresh page (should stay logged in), add to cart (see animation), remove items (✕ button)')
