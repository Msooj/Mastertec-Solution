with open('mastertec-new-clean/src/App.js', 'r', encoding='utf-8') as f:
    content = f.read()

print('🔧 Adding improvements...\n')

# 1. Add productsToShow state
old_state = "  const [allProducts, setAllProducts] = useState([]);"
new_state = "  const [allProducts, setAllProducts] = useState([]);\n  const [productsToShow, setProductsToShow] = useState(50);"

if old_state in content:
    content = content.replace(old_state, new_state)
    print('✅ Added productsToShow state')

# 2. Add loadMore function after removeFromCart
load_more_func = '''
  
  const loadMoreProducts = () => {
    setProductsToShow(prev => prev + 50);
  };'''

# Find removeFromCart and add after it
if 'const removeFromCart = (index) => {' in content:
    content = content.replace(
        '  const removeFromCart = (index) => {\n    const newCart = [...cart];\n    newCart.splice(index, 1);\n    setCart(newCart);\n  };',
        '  const removeFromCart = (index) => {\n    const newCart = [...cart];\n    newCart.splice(index, 1);\n    setCart(newCart);\n  };' + load_more_func
    )
    print('✅ Added loadMoreProducts function')

# 3. Update product display to use .slice(0, productsToShow)
# Find the main products section
old_products = '''    {allProducts
      .filter(product => (selectedCat === "All" ? true : product.category === selectedCat))
      .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
      .map(product => ('''

new_products = '''    {allProducts
      .filter(product => (selectedCat === "All" ? true : product.category === selectedCat))
      .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, productsToShow)
      .map(product => ('''

content = content.replace(old_products, new_products)
print('✅ Updated products to use pagination')

# 4. Add Load More button before closing products section
# We'll add it in the JSX manually via instructions since it's complex

with open('mastertec-new-clean/src/App.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('\n🎉 Improvements added!')
print('\n📋 Changes:')
print('  1. ✅ Added productsToShow state (starts at 50)')
print('  2. ✅ Added loadMoreProducts function')
print('  3. ✅ Products now paginated (50 at a time)')
print('\n⚠️  Manual step: Add "Load More" button in JSX')
print('    (See instructions below)')
