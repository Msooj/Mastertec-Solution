with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('🔧 Inserting remove button...\n')

# Find the line with cart-item-price and insert button after it
for i in range(len(lines)):
    if 'className="cart-item-price"' in lines[i] and 'Ksh {item.price}' in lines[i]:
        # Found the price line at index i
        # The next line should be </div>
        # Insert button before that </div>
        
        button_code = '''                  <button 
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
'''
        
        # Insert button before the closing </div>
        lines.insert(i + 1, button_code)
        print(f'✅ Button inserted after line {i+1}')
        break

with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('\n🎉 Remove button added successfully!')
print('🔄 Your app should reload now.')
print('\n✅ Test it: Add items to cart → Click ✕ to remove!')
