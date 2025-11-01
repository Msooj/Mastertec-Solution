with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

print('🔧 Adding remove button to cart items...\n')

# Find and replace ONLY the cart item display
old_pattern = '''                  <span className="cart-item-price">Ksh {item.price}</span>
                </div>'''

new_pattern = '''                  <span className="cart-item-price">Ksh {item.price}</span>
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
                </div>'''

if old_pattern in content:
    content = content.replace(old_pattern, new_pattern)
    print('✅ Remove button added successfully!')
    
    with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('\n🎉 Done! Users can now remove items from cart.')
    print('🔄 App should reload automatically.')
else:
    print('⚠️  Pattern not found. Cart items may have different formatting.')
    print('Searching for alternative patterns...')
    
    # Try alternative
    if '<span className="cart-item-price">' in content:
        print('✓ Found cart-item-price elements')
    if 'removeFromCart' in content:
        print('✓ removeFromCart function exists')
