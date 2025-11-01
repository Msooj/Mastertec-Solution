const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mastertec-new-clean', 'src', 'App.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Applying all fixes to App.js...\n');

// FIX 1: Add auth persistence (check session on mount)
const oldUseEffect = `  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);`;

const newUseEffect = `  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        // Check if user is admin
        if (session.user.user_metadata?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkSession();
    
    // Listen for auth changes
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
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);`;

content = content.replace(oldUseEffect, newUseEffect);

// FIX 2: Add remove from cart and flying animation
const oldAddToCart = `  const addToCart = product => setCart([...cart, product]);`;

const newAddToCart = `  const addToCart = (product, event) => {
    setCart([...cart, product]);
    // Add flying animation
    if (event?.target) {
      const button = event.target;
      const cartIcon = document.querySelector('.cart-count')?.parentElement;
      if (cartIcon) {
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Create flying element
        const flyingItem = document.createElement('div');
        flyingItem.textContent = '🛒';
        flyingItem.style.cssText = \`
          position: fixed;
          left: \${buttonRect.left}px;
          top: \${buttonRect.top}px;
          font-size: 24px;
          z-index: 9999;
          pointer-events: none;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        \`;
        document.body.appendChild(flyingItem);
        
        // Animate to cart
        setTimeout(() => {
          flyingItem.style.left = cartRect.left + 'px';
          flyingItem.style.top = cartRect.top + 'px';
          flyingItem.style.opacity = '0';
          flyingItem.style.transform = 'scale(0.3)';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
          document.body.removeChild(flyingItem);
        }, 900);
      }
    }
  };
  
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };`;

content = content.replace(oldAddToCart, newAddToCart);

// FIX 3: Update all addToCart calls to pass event
content = content.replace(/onClick=\{(\(\) => )?addToCart\(product\)\}/g, 'onClick={(e) => addToCart(product, e)}');

// FIX 4: Add remove button to cart items
const oldCartItem = `                <div key={idx} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x1</span>
                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>`;

const newCartItem = `                <div key={idx} className="cart-item">
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
                </div>`;

content = content.replace(oldCartItem, newCartItem);

// FIX 5: Fix order creation to handle demo products
const oldOrderItems = `      // Create order items
      if (orderData && orderData[0]) {
        const orderId = orderData[0].id;
        const orderItems = cart.map(item => ({
          order_id: orderId,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: 1,
          subtotal: item.price
        }));
        
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }`;

const newOrderItems = `      // Create order items
      if (orderData && orderData[0]) {
        const orderId = orderData[0].id;
        const orderItems = cart.map(item => ({
          order_id: orderId,
          product_id: typeof item.id === 'string' ? null : item.id, // Handle demo products
          product_name: item.name,
          product_price: item.price,
          quantity: 1,
          subtotal: item.price
        }));
        
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
      }`;

content = content.replace(oldOrderItems, newOrderItems);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ All fixes applied successfully!\n');
console.log('📋 Changes made:');
console.log('  1. ✅ Auth persistence - Users stay logged in after refresh');
console.log('  2. ✅ Remove from cart - Added ✕ button to remove items');
console.log('  3. ✅ Flying animation - Cart icon animation when adding items');
console.log('  4. ✅ Demo products fix - Orders work with demo products\n');
console.log('🎉 Refresh your app to see the changes!');
