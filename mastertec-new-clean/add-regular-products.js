const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const productsToAdd = [
  {
    name: "Wireless CCTV Camera",
    price: 6500,
    category: "CCTV",
    description: "Super HD wireless CCTV for home & business.",
    inventory: 20,
    image: "/Logo.jpg"
  },
  {
    name: "Smart Alarm System",
    price: 8000,
    category: "Alarms",
    description: "Protect your property with remotely activated alarms.",
    inventory: 10,
    image: "/Logo.jpg"
  },
  {
    name: "Fiber Optic Router",
    price: 12000,
    category: "Networking",
    description: "Fast, reliable fiber optics for stable internet.",
    inventory: 15,
    image: "/Logo.jpg"
  },
  {
    name: "Wireless CCTV Camera",
    price: 6500,
    category: "CCTV",
    description: "Super HD wireless CCTV for home & business.",
    inventory: 20,
    image: "/Logo.jpg"
  }
];

async function addProducts() {
  try {
    console.log("Adding products to Supabase...");
    
    for (const product of productsToAdd) {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select();
      
      if (error) {
        console.error(`Error adding ${product.name}:`, error);
      } else {
        console.log(`✅ Added: ${product.name}`);
      }
    }
    
    console.log("\n✅ All products added successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

addProducts();