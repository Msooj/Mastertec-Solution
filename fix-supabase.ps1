$filePath = "mastertec-new-clean\src\App.js"
$content = Get-Content $filePath -Raw

# Remove Supabase import
$content = $content -replace 'import \{ supabase \} from "./supabaseClient";', '// Removed Supabase - using local backend only'

# Fix function names
$content = $content -replace 'addDemoProductsToSupabase', 'addDemoProductsToBackend'
$content = $content -replace 'Add DEMO Products to Supabase', 'Add DEMO Products to Backend'

# Fix logout
$content = $content -replace 'const logout =async \(\) => \{[^}]+await supabase\.auth\.signOut\(\);', 'const logout = () => {'

# Fix addDemoProducts function
$oldDemo = @'
const addDemoProductsToBackend = async \(\) => \{
  try \{
    const productData = demoProducts\.map\(prod => \(\{
      name: prod\.name,
      price: prod\.price,
      discountprice: prod\.discountPrice,
      category: prod\.category,
      description: prod\.description,
      inventory: prod\.inventory,
      image: prod\.image
    \}\)\);
    const \{ data, error \} = await supabase\.from\("products"\)\.insert\(productData\);
    if \(error\) throw error;
    alert\("Demo products added!"\);
    fetchProducts\(\);
  \} catch \(err\) \{
    alert\("Error adding demo products: " \+ err\.message\);
  \}
\};
'@

$newDemo = @'
const addDemoProductsToBackend = async () => {
  try {
    for (const prod of demoProducts) {
      await axios.post(`${API_URL}/products`, {
        name: prod.name,
        price: prod.price,
        category: prod.category,
        description: prod.description,
        inventory: prod.inventory,
        image: prod.image
      });
    }
    alert("Demo products added to backend!");
    fetchProducts();
  } catch (err) {
    alert("Error adding demo products: " + err.message);
  }
};
'@

$content = $content -replace $oldDemo, $newDemo

Set-Content $filePath $content -NoNewline
Write-Host "Fixed Supabase references in App.js"
