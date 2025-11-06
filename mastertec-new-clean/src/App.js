import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiCamera, FiServer, FiShield, FiBattery, FiCpu, FiWifi, FiPhone, FiEye, FiInbox, FiBarChart2, FiUser,
  FiShoppingCart, FiPlusCircle, FiTrash2, FiEdit2, FiArrowLeft
} from "react-icons/fi";
import "./App.css";
import "./AdminStyles.css";
import { FaWhatsapp } from "react-icons/fa";
import Footer from "./Footer";
import { supabase } from "./supabaseClient";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel CSS



const API_URL = "http://localhost:5000";


const categoryIcons = {
  CCTV: <FiCamera />,
  Networking: <FiServer />,
  Alarms: <FiShield />,
  "Electric Fencing": <FiBattery />,
  Computing: <FiCpu />,
  "Wi-Fi": <FiWifi />,
  Telephone: <FiPhone />,
  Biometrics: <FiEye />,
  "Fibre Optic": <FiInbox />,
  Backups: <FiBattery />,
  Electrical: <FiBarChart2 />
};
const categories = Object.keys(categoryIcons);

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [allProducts, setAllProducts] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("products");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reportsData, setReportsData] = useState(null);
  const [flyingProduct, setFlyingProduct] = useState(null);
  const isLoggedIn = // however you check for authenticated user, e.g. from props, context, or a global state
    currentUser !== null;

  // Add discountPrice for deals
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: categories[0],
    description: "",
    inventory: 10,
    image: ""
  });
  const [editProduct, setEditProduct] = useState(null);


  const [previewImageAdd, setPreviewImageAdd] = useState(null);
  const [previewImageEdit, setPreviewImageEdit] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [checkoutDetails, setCheckoutDetails] = useState({ phone: "", address: "" });
  const [checkoutError, setCheckoutError] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [cartTab, setCartTab] = useState("items"); // "items" or "history"
  const [showServiceBooking, setShowServiceBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ phone: "", address: "", date: "", notes: "" });
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "/cctv_installation.jpg",
      title: "Professional CCTV Installation Services",
      description: "Protect your property with state-of-the-art CCTV systems. Our expert technicians provide complete installation, configuration, and setup of high-definition surveillance cameras for homes and businesses. Enjoy 24/7 monitoring, remote access, HD recording, and professional maintenance support for comprehensive security coverage.",
      alt: "CCTV Installation",
      category: "CCTV"
    },
    {
      image: "/Electric_fencing.jpg",
      title: "Electric Fencing Installation & Maintenance",
      description: "Secure your perimeter with our professional electric fencing solutions. We provide complete installation of durable, high-quality fencing systems, thorough testing, and ongoing maintenance support. Designed for maximum protection and reliability for residential and commercial properties.",
      alt: "Electric Fencing",
      category: "Electric Fencing"
    },
    {
      image: "/Alarm_systems.jpg",
      title: "Advanced Alarm System Installation",
      description: "Stay protected with our cutting-edge alarm system solutions. Our certified technicians install and configure state-of-the-art alarm systems with 24/7 monitoring, instant alerts, and professional response capabilities. Complete peace of mind for your residential or commercial property.",
      alt: "Alarm Systems",
      category: "Alarms"
    }
  ];

  const services = [
    { id: 1, name: "CCTV Installation", description: "Professional CCTV system setup and installation", emoji: "📹" },
    { id: 2, name: "Electric Fencing", description: "Complete electric fencing installation and maintenance", emoji: "⚡" },
    { id: 3, name: "Access Control", description: "Advanced access control systems installation", emoji: "🔐" },
    { id: 4, name: "Alarm Systems", description: "Professional alarm system setup", emoji: "🔔" },
    { id: 5, name: "Networking Setup", description: "Network infrastructure and cabling", emoji: "🌐" },
    { id: 6, name: "Consultation", description: "Free security consultation for your property", emoji: "💼" }
  ];

  // Handle URL routing for /admin
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === "/admin" || path === "/admin/") {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
      }
    };

    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Navigate to admin when showAdmin changes
  useEffect(() => {
    if (showAdmin && !window.location.pathname.includes("/admin")) {
      window.history.pushState({}, "", "/admin");
    } else if (!showAdmin && window.location.pathname.includes("/admin")) {
      window.history.pushState({}, "", "/");
    }
  }, [showAdmin]);

  useEffect(() => {
    console.log("App mounted, fetching products...");
    fetchProducts();
  }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);
  useEffect(() => { if (isAdmin && adminTab === "orders") fetchOrders(); }, [isAdmin, adminTab]);
  useEffect(() => { if (isAdmin && adminTab === "reports") fetchReports(); }, [isAdmin, adminTab]);


  const fetchProducts = async () => {
    try {
      console.log("Fetching products from Supabase...");
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      console.log("Products fetched:", data);
      // Map Supabase products to normalize discountPrice field
      const normalizedProducts = (data || []).map(product => ({
        ...product,
        discountPrice: product.discountprice || product.discountPrice || null,
        price: product.price || 0
      }));
      console.log("Normalized products:", normalizedProducts);
      setAllProducts(normalizedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setAllProducts([]);
      // Try fallback to backend if Supabase fails
      try {
        console.log("Trying backend fallback...");
        const response = await axios.get(`${API_URL}/products`);
        console.log("Backend products:", response.data);
        setAllProducts(response.data || []);
      } catch (backendErr) {
        console.error("Backend fallback also failed:", backendErr);
        setAllProducts([]);
      }
    }
  };
  const fetchUsers = async () => {
    try {
      // Fetch users from Supabase users table
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Fallback: try backend API if Supabase fails
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data || []);
      } catch (backendErr) {
        console.error("Backend fallback also failed:", backendErr);
        setUsers([]);
      }
    }
  };
  const fetchOrders = async () => {
    try {
      // Fetch orders from Supabase with user information
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get user info for each order
      const ordersWithUsers = await Promise.all(
        (data || []).map(async (order) => {
          try {
            const { data: userData } = await supabase
              .from("users")
              .select("name, email")
              .eq("id", order.user_id)
              .single();
            
            return {
              ...order,
              userName: userData?.name || "Unknown",
              userEmail: userData?.email || order.user_id
            };
          } catch (err) {
            return {
              ...order,
              userName: "Unknown",
              userEmail: order.user_id
            };
          }
        })
      );
      
      setOrders(ordersWithUsers);
    } catch (err) {
      console.error("Error fetching orders:", err);
      // Fallback to backend
      try {
        const response = await axios.get(`${API_URL}/orders`);
        setOrders(response.data || []);
      } catch (backendErr) {
        setOrders([]);
      }
    }
  };
  const fetchReports = async () => {
    try {
      // Fetch from Supabase with proper error handling
      const { count: productCount, error: productError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (productError) console.warn("Product count error:", productError);
      
      const { count: userCount, error: userError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      if (userError) console.warn("User count error:", userError);
      
      let orderCount = 0;
      let ordersData = [];
      
      // Try to fetch orders
      try {
        const { count, error: orderError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });
        if (orderError) console.warn("Order count error:", orderError);
        orderCount = count || 0;
        
        const { data } = await supabase.from("orders").select("total");
        ordersData = data || [];
      } catch (orderErr) {
        console.warn("Error fetching orders:", orderErr);
        orderCount = 0;
        ordersData = [];
      }
      
      const totalSales = (ordersData || []).reduce((sum, order) => sum + (parseFloat(order?.total) || 0), 0);
      
      setReportsData({
        totalOrders: orderCount || 0,
        totalSales: totalSales || 0,
        totalUsers: userCount || 0,
        totalProducts: productCount || 0
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      // Fallback to backend
      try {
        const response = await axios.get(`${API_URL}/reports/summary`);
        setReportsData(response.data || {});
      } catch (backendErr) {
        console.error("Backend fallback failed:", backendErr);
        // Set default values if everything fails
        setReportsData({
          totalOrders: 0,
          totalSales: 0,
          totalUsers: 0,
          totalProducts: 0
        });
      }
    }
  };


  const fetchPurchaseHistory = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setPurchaseHistory(data || []);
    } catch (err) {
      console.error("Error fetching purchase history:", err);
      setPurchaseHistory([]);
    }
  };

  const loginUser = async (e) => {
  e.preventDefault();
  setLoginError(null);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword
    });
    if (error) throw error;
    setCurrentUser(data.user);
    fetchPurchaseHistory(data.user.id);
    setShowAuth(false);
    setAuthPassword(""); 
    setAuthEmail("");
  } catch (err) {
    setLoginError(err.message || "Login failed.");
  }
};
const signupUser = async (e) => {
  e.preventDefault();
  setSignupError(null);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: e.target.email.value,
      password: e.target.password.value,
      options: {
        data: {
          name: e.target.name.value
        }
      }
    });
    if (error) throw error;
    setCurrentUser(data.user);
    setShowAuth(false);
    alert("Account created! Please check your email to verify.");
  } catch (err) {
    setSignupError(err.message || "Signup failed.");
  }
};

 const handleAdminLogin = async (e) => {
  e.preventDefault();
  setAdminLoginError("");
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    // Try backend admin login first
    const response = await axios.post(`${API_URL}/admin/login`, { email, password });
    if (response.data) {
      setCurrentUser({ email: response.data.email, name: response.data.name });
      setIsAdmin(true);
      setShowAdmin(false);
      setAdminLoginError("");
      return;
    }
  } catch (backendErr) {
    console.log("Backend login failed, trying Supabase...", backendErr.message);
  }

  // Fallback to Supabase Auth
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    // Check if user has admin role in metadata
    if (data.user && data.user.user_metadata && data.user.user_metadata.role === 'admin') {
      setCurrentUser(data.user);
      setIsAdmin(true);
      setShowAdmin(false);
      setAdminLoginError("");
    } else {
      // If not admin, sign them out immediately
      await supabase.auth.signOut();
      setAdminLoginError("You don't have admin privileges. Please contact support.");
    }
  } catch (err) {
    console.error(err);
    setAdminLoginError(err.message || "Login failed. Please check your credentials.");
  }
};

  const logout =async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
    setShowAdmin(false);
    setShowAuth(false);
    setAdminTab("products");
  };

  const handleServiceBooking = () => {
    if (!currentUser) {
      setAuthTab("login");
      setShowAuth(true);
      return;
    }

    if (!selectedService || !bookingDetails.phone || !bookingDetails.address) {
      alert("Please fill in all required fields (phone and address)");
      return;
    }

    const service = services.find(s => s.id === selectedService);
    const message = `Hi Mastertec! I'd like to book a service.\n\nService: ${service.name}\nPhone: ${bookingDetails.phone}\nAddress: ${bookingDetails.address}${bookingDetails.date ? `\nPreferred Date: ${bookingDetails.date}` : ""}${bookingDetails.notes ? `\nNotes: ${bookingDetails.notes}` : ""}\n\nLooking forward to your response!`;

    const whatsappUrl = `https://wa.me/254790999150?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Reset form
    setShowServiceBooking(false);
    setSelectedService(null);
    setBookingDetails({ phone: "", address: "", date: "", notes: "" });
    alert("Redirecting to WhatsApp! Our team will get back to you shortly.");
  };


  const addToCart = (product, e) => {
    e?.preventDefault();
    if (!currentUser && !isAdmin) {
      // Show login prompt if not logged in
      setShowCart(false);
      setAuthTab("login");
      setShowAuth(true);
      alert("Please log in or sign up to add items to cart.");
      return;
    }
    
    // Get the button element for animation
    const button = e?.target;
    if (button) {
      const rect = button.getBoundingClientRect();
      setFlyingProduct({
        name: product.name,
        image: product.image || "/Logo.jpg",
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2
      });
      
      // Remove animation state after animation completes
      setTimeout(() => {
        setFlyingProduct(null);
        setCart([...cart, product]);
      }, 800); // Animation duration
    } else {
      setCart([...cart, product]);
    }
  };
  
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  const removeProduct = async (id) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    fetchProducts();
    fetchReports(); // Update reports including total products count
    alert("✅ Product deleted successfully!");
  } catch (err) {
    alert("Error deleting product: " + err.message);
  }
};


  const handleAddImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPreviewImageAdd(evt.target.result);
        setNewProduct({ ...newProduct, image: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEditImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setPreviewImageEdit(evt.target.result);
        setEditProduct({ ...editProduct, image: evt.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
const addSampleProducts = async () => {
  const sampleProducts = [
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

  try {
    let successCount = 0;
    for (const product of sampleProducts) {
      const { error } = await supabase.from("products").insert([{
        name: product.name,
        price: product.price,
        discountprice: null,
        category: product.category,
        description: product.description,
        inventory: product.inventory,
        image: product.image
      }]);
      
      if (!error) successCount++;
    }
    
    alert(`✅ Added ${successCount} sample products!`);
    fetchProducts();
    fetchReports(); // Update reports including total products count
  } catch (err) {
    alert("Error adding sample products: " + err.message);
  }
};

const addNewProduct = async (e) => {
  e.preventDefault();
  try {
    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      discountprice: newProduct.discountPrice ? parseFloat(newProduct.discountPrice) : null,
      category: newProduct.category,
      description: newProduct.description,
      inventory: parseInt(newProduct.inventory),
      image: newProduct.image || "/Logo.jpg"
    };
    
    const { data, error } = await supabase.from("products").insert([productData]).select();
    
    if (error) {
      console.error("Supabase error:", error);
      alert("Error adding product to Supabase: " + error.message + "\n\nCheck your browser console for details.");
      return;
    }
    
    if (data && data.length > 0) {
      alert("✅ Product successfully added to Supabase!");
      setNewProduct({ name: "", price: "", discountPrice: "", category: categories[0], description: "", inventory: 10, image: "" });
      setPreviewImageAdd(null);
      setShowAddModal(false);
      fetchProducts(); // Refresh product list
      fetchReports(); // Update reports including total products count
    } else {
      alert("⚠️ Product was created but no data was returned. Please refresh to see your product.");
      fetchProducts();
      fetchReports();
    }
  } catch (err) {
    console.error("Error adding product:", err);
    alert("Error adding product: " + err.message + "\n\nCheck your browser console for details.");
  }
};



  const startEdit = (product) => {
    // Normalize discountPrice field
    const normalizedProduct = {
      ...product,
      discountPrice: product.discountPrice || product.discountprice || ""
    };
    setEditProduct(normalizedProduct);
    setPreviewImageEdit(product.image || null);
    setShowEditModal(true);
  };


  const updateProduct = async (e) => {
  e.preventDefault();
  try {
    const { error } = await supabase.from("products").update({
      name: editProduct.name,
      price: parseFloat(editProduct.price),
      discountprice: editProduct.discountPrice ? parseFloat(editProduct.discountPrice) : null,
      category: editProduct.category,
      description: editProduct.description,
      inventory: parseInt(editProduct.inventory),
      image: editProduct.image
    }).eq("id", editProduct.id);
    if (error) throw error;
    setEditProduct(null);
    setPreviewImageEdit(null);
    setShowEditModal(false);
    fetchProducts();
    fetchReports(); // Update reports after product edit
    alert("✅ Product updated successfully!");
  } catch (err) {
    alert("Error updating product: " + err.message);
  }
};



 


  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);


  // Calculate cart icon position for animation
  const getCartIconPosition = () => {
    const cartButton = document.querySelector('.cart-count')?.closest('button');
    if (cartButton) {
      const rect = cartButton.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }
    return { x: window.innerWidth - 100, y: 50 }; // Fallback position
  };

  return (
    <div className="app-bg">
      {/* Flying Product Animation */}
      {flyingProduct && (() => {
        const cartPos = getCartIconPosition();
        const deltaX = cartPos.x - flyingProduct.startX;
        const deltaY = cartPos.y - flyingProduct.startY;
        const animationId = `flyToCart-${Date.now()}`;

        return (
          <>
            <style>{`
  @keyframes ${animationId} {
    0% {
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(${deltaX}px, ${deltaY}px) scale(0.3) rotate(360deg);
      opacity: 0.3;
    }
  }
`}</style>
            <div
              style={{
                position: 'fixed',
                top:  flyingProduct.startY + 'px',
                left:flyingProduct.startX + 'px',
                width: '60px',
                height: '60px',
                zIndex: 9999,
                pointerEvents: 'none',
                animation:animationId + '0.8s ease-in-out forwards',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <img
                src={flyingProduct.image}
                alt={flyingProduct.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '3px solid #2563eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </>
        );
      })()}
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/254790999150?text=Hello%20Mastertec%20Solutions"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "64px",
          height: "64px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#25d366",
          borderRadius: "50%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)"
        }}
        aria-label="WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp size={32} color="#fff" />
      </a>


      {/* Header/Navbar Section */}
      <div className="navbar">
        <div className="navbar-content">
          <div className="brand" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/Logo.jpg" alt="Logo" style={{ height: "48px", width: "48px" }} />
            <span>Mastertec Solution</span>
          </div>
          <div className="header-center">
            <input
              className="search-bar"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' })}
            />
            <button className="search-btn" onClick={() => document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' })}>
              🔍
            </button>
          </div>
          <div className="nav-actions">
            {!isAdmin && (
              <button className="auth-btn"
                onClick={() => {
                  if (currentUser) {
                    logout();
                  } else {
                    setAuthTab("login"); setShowAuth(true);
                  }
                }}>
                Account {currentUser ? "Log Out" : ""}
                <FiUser style={{ marginLeft: 7 }} />
              </button>
            )}
            {!isAdmin && (
              <button className="auth-btn" onClick={() => setShowCart(true)}>
                <span className="react-icon"><FiShoppingCart /></span>
                <span className="cart-count">{cart.length}</span>
              </button>
            )}
            <button
              className="auth-btn"
              onClick={() => {
                const aboutFooter = document.getElementById("about-footer");
                if (aboutFooter) {
                  aboutFooter.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Contact Us
            </button>
            {!currentUser && (
              <button className="auth-btn" onClick={() => setShowAdmin(true)}>
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      {showAuth && (
        <div className="auth-modal">
          {authTab === "login" ? (
            <form className="auth-form" onSubmit={loginUser}>
               <input type="email" name="email" id="login-email" required placeholder="Email"
      value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
    <input type="password" name="password" id="login-password" required placeholder="Password"
      value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
  <button type="submit">Log In</button>
   {loginError && <div className="auth-error">{loginError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setAuthTab("signup")}>Switch to Sign Up</button>
                <button type="button" onClick={() => setShowAuth(false)}>Cancel</button>
              </div>
            </form>
          ) : (
             <form className="auth-form" onSubmit={signupUser}>
                <input type="text" name="name" id="signup-name" required placeholder="Full Name" />
                <input type="email" name="email" id="signup-email" required placeholder="Email" />
                <input type="password" name="password" id="signup-password" required placeholder="Password" />
                <button type="submit">Sign Up</button>
             {signupError && <div className="auth-error">{signupError}</div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setAuthTab("login")}>Switch to Log In</button>
                <button type="button" onClick={() => setShowAuth(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
      {showAdmin && (
        <div className="auth-modal">
          <form className="auth-form" onSubmit={handleAdminLogin}>
            <h3>Admin Sign In</h3>
            <input type="email" name="email" id="admin-email" required placeholder="Admin Email" />
            <input type="password" name="password" id="admin-password" required placeholder="Admin Password" />
            <button type="submit">Sign In</button>
            <button type="button" onClick={() => setShowAdmin(false)}>Cancel</button>
            {adminLoginError && <div className="auth-error">{adminLoginError}</div>}
          </form>
        </div>
      )}
      {isAdmin ? (
        <div className="admin-area">
          <button className="shop-btn" style={{ marginBottom: 20 }} onClick={() => {
            setIsAdmin(false);
            setShowAdmin(false);
            window.history.pushState({}, "", "/");
          }}>
            <FiArrowLeft /> Back to Shop
          </button>
          <div className="admin-tabs" style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <button onClick={() => setAdminTab("products")} className={adminTab === "products" ? "admin-tab-selected" : ""}>Products</button>
            <button onClick={() => setAdminTab("users")} className={adminTab === "users" ? "admin-tab-selected" : ""}>Users</button>
            <button onClick={() => setAdminTab("orders")} className={adminTab === "orders" ? "admin-tab-selected" : ""}>Orders</button>
            <button onClick={() => setAdminTab("reports")} className={adminTab === "reports" ? "admin-tab-selected" : ""}>Reports</button>
          </div>
          {adminTab === "products" && (
            <>
              <div style={{ display: "flex", gap: "10px", margin: "1em 0" }}>
                <button className="admin-btn" onClick={() => setShowAddModal(true)}>
                  <FiPlusCircle /> Add New Product
                </button>
                <button className="admin-btn" onClick={addSampleProducts} style={{ background: "#16a34a" }}>
                  📦 Load Sample Products
                </button>
              </div>
              {showAddModal && (
                <div className="modal-bg">
                  <form onSubmit={addNewProduct} className="admin-product-form modal-form">
                    <h3>Add Product</h3>
                    <input type="text" placeholder="Name" value={newProduct.name}
                      required onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <input type="text" placeholder="Price" value={newProduct.price}
                      required onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                    <input type="text" placeholder="Discount Price" value={newProduct.discountPrice}
                      onChange={e => setNewProduct({ ...newProduct, discountPrice: e.target.value })} />
                    <input type="file" accept="image/*"
                      onChange={handleAddImageChange} />
                    {previewImageAdd && <img src={previewImageAdd} alt="Preview" style={{ maxWidth: "100px", marginBottom: "10px" }} />}
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Description" value={newProduct.description}
                      required onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <input type="number" placeholder="Inventory" value={newProduct.inventory}
                      required onChange={e => setNewProduct({ ...newProduct, inventory: e.target.value })} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" className="admin-btn"><FiPlusCircle /> Add</button>
                      <button type="button" className="admin-btn" onClick={() => { setShowAddModal(false); setPreviewImageAdd(null); }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              {showEditModal && editProduct && (
                <div className="modal-bg">
                  <form className="admin-product-form modal-form" onSubmit={updateProduct}>
                    <h3>Edit Product</h3>
                    <input type="text" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} required />
                    <input type="text" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} required />
                    <input type="text" value={editProduct.discountPrice || ""} placeholder="Discount Price" onChange={e => setEditProduct({ ...editProduct, discountPrice: e.target.value })} />
                    <input type="file" accept="image/*" onChange={handleEditImageChange} />
                    {previewImageEdit && <img src={previewImageEdit} alt="Preview" style={{ maxWidth: "100px", marginBottom: "10px" }} />}
                    <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}>
                      {categories.map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                    <input type="text" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} required />
                    <input type="number" value={editProduct.inventory} onChange={e => setEditProduct({ ...editProduct, inventory: e.target.value })} required />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" className="admin-btn"><FiEdit2 /> Save</button>
                      <button type="button" className="admin-btn" onClick={() => { setEditProduct(null); setShowEditModal(false); setPreviewImageEdit(null); }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              <div id="products" className="products-section">
              
              {/* PRODUCTS WITH DISCOUNTS */}
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ borderBottom: "3px solid #fbbf24", paddingBottom: "10px", color: "#d97706" }}>
                  🎉 Products with Discounts ({allProducts.filter(p => p.discountPrice || p.discountprice).length})
                </h2>
                <div className="product-grid">
                  {allProducts.filter(p => p.discountPrice || p.discountprice).map(product => (
                    <div key={product.id} className="product-card">
                      <img src={product.image || "/Logo.jpg"} alt={product.name} />
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="price">
                          <span style={{ textDecoration: "line-through", color: "#999" }}>Ksh {product.price}</span>
                          <br />
                          <span className="discounted-price" style={{ fontSize: "1.2em", color: "#dc2626", fontWeight: "bold" }}>
                            Deal: Ksh {product.discountPrice || product.discountprice}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button className="admin-btn" onClick={() => startEdit(product)} style={{ flex: 1 }}>
                          <FiEdit2 /> Edit
                        </button>
                        <button className="admin-btn" onClick={() => removeProduct(product.id)} style={{ flex: 1, background: "#dc2626" }}>
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {allProducts.filter(p => p.discountPrice || p.discountprice).length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#999" }}>
                      <p>No discount products yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PRODUCTS WITHOUT DISCOUNTS */}
              <div>
                <h2 style={{ borderBottom: "3px solid #3b82f6", paddingBottom: "10px", color: "#1e40af" }}>
                  📦 Regular Products ({allProducts.filter(p => !(p.discountPrice || p.discountprice)).length})
                </h2>
                <div className="product-grid">
                  {allProducts.filter(p => !(p.discountPrice || p.discountprice)).map(product => (
                    <div key={product.id} className="product-card">
                      <img src={product.image || "/Logo.jpg"} alt={product.name} />
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="price">
                          Ksh {product.price}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button className="admin-btn" onClick={() => startEdit(product)} style={{ flex: 1 }}>
                          <FiEdit2 /> Edit
                        </button>
                        <button className="admin-btn" onClick={() => removeProduct(product.id)} style={{ flex: 1, background: "#dc2626" }}>
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {allProducts.filter(p => !(p.discountPrice || p.discountprice)).length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: "#999" }}>
                      <p>No regular products yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {allProducts.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
                  <p>No products yet. Create new ones!</p>
                </div>
              )}
              </div>
            </>
          )}

          {adminTab === "users" && (
            <div>
              <h2>Users</h2>
              <ul>
                {users.map((user, i) => (
                  <li key={user.id || i}>{user.name} ({user.email}) - {user.role}</li>
                ))}
              </ul>
            </div>
          )}
          {adminTab === "orders" && (
            <div>
              <h2>Customer Orders</h2>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{ 
                      background: "#fff", 
                      padding: "20px", 
                      borderRadius: "8px", 
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid #2563eb"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                        <span style={{ 
                          background: order.status === 'pending' ? '#fbbf24' : order.status === 'completed' ? '#16a34a' : '#dc2626',
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.9em"
                        }}>
                          {order.status || 'pending'}
                        </span>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Customer:</strong> {order.userName || 'Unknown'} ({order.userEmail || order.user_id})
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Phone:</strong> {order.phone || 'Not provided'}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Delivery Address:</strong> {order.address || 'Not provided'}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Total:</strong> Ksh {order.total || 0}
                      </div>
                      {order.created_at && (
                        <div style={{ color: "#666", fontSize: "0.9em" }}>
                          <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {adminTab === "reports" && (
            <div>
              <h2>Reports</h2>
              {reportsData ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
                  <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h3>Total Orders</h3>
                    <p style={{ fontSize: "2em", fontWeight: "bold", color: "#2563eb" }}>{reportsData.totalOrders || 0}</p>
                  </div>
                  <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h3>Total Sales</h3>
                    <p style={{ fontSize: "2em", fontWeight: "bold", color: "#16a34a" }}>Ksh {reportsData.totalSales || 0}</p>
                  </div>
                  <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: "2em", fontWeight: "bold", color: "#dc2626" }}>{reportsData.totalUsers || 0}</p>
                  </div>
                  <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h3>Total Products</h3>
                    <p style={{ fontSize: "2em", fontWeight: "bold", color: "#ea580c" }}>{reportsData.totalProducts || 0}</p>
                  </div>
                </div>
              ) : (
                <div>Loading reports...</div>
              )}
            </div>
          )}
        </div>
 ) : (
   <>
     {/* Non-admin content goes here */}
     <div className="hero-section" style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
       <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} width="100%" onChange={setCurrentSlide} interval={5000} transitionEffect="slideInRight">
         {heroSlides.map((slide, index) => (
           <div key={index} style={{ position: 'relative', width: '100%', height: window.innerWidth <= 480 ? '300px' : window.innerWidth <= 768 ? '280px' : '400px', overflow: 'visible' }}>
             <img src={slide.image} alt={slide.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div className="legend">
               <h2>{slide.title}</h2>
               <p>{slide.description}</p>
               <button className="cta-btn" onClick={() => { setSelectedCat(slide.category); document.querySelector('.category-tabs')?.scrollIntoView({ behavior: 'smooth' }); }}>
                 Shop Now
               </button>
             </div>
           </div>
         ))}
       </Carousel>
     </div>

     <div className="category-tabs">
       <button
         key="All"
         className={`cat-btn${selectedCat === "All" ? " cat-selected" : ""}`}
         onClick={() => { setSelectedCat("All"); document.querySelector('.deals-section')?.scrollIntoView({ behavior: 'smooth' }); }}
       >
         <span className="cat-icon">🔍</span>
         All
       </button>
       {categories.map(cat => (
         <button
           key={cat}
           className={`cat-btn${selectedCat === cat ? " cat-selected" : ""}`}
           onClick={() => { setSelectedCat(cat); document.querySelector('.deals-section')?.scrollIntoView({ behavior: 'smooth' }); }}
         >
           <span className="cat-icon">{categoryIcons[cat]}</span>
           {cat}
         </button>
       ))}
     </div>

     {/* --- DEALS SECTION --- */}
     <div className="deals-section">
       <h2>Deals & Discounts</h2>
       <div className="product-grid">
         {allProducts
           .filter(product => {
             const discountPrice = product.discountPrice || product.discountprice;
             const hasDiscount = discountPrice && parseFloat(discountPrice) < parseFloat(product.price || 0);
             const matchesCategory = selectedCat === "All" || product.category === selectedCat;
             const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
             return hasDiscount && matchesCategory && matchesSearch;
           })
           .map(product => {
             const discountPrice = product.discountPrice || product.discountprice;
             return (
               <div key={product.id} className="product-card">
                 <img src={product.image || "/Logo.jpg"} alt={product.name} />
                 <div className="product-info">
                   <h3>{product.name}</h3>
                   <div className="price">
                     <span className="discounted-price">Ksh {discountPrice}</span>
                     <span className="original-price">Ksh {product.price}</span>
                   </div>
                   <p>{product.description}</p>
                   {currentUser ? (
                     <button
                       style={{ background: '#25d366', color: 'white', marginLeft: '8px', marginTop: '4px' }}
                       onClick={() => {
                         const phone = '254790999150';
                         const message = encodeURIComponent(`Hello, I want to buy the ${product.name} (Ksh ${product.price}).`);
                         window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                       }}
                     >
                       Order via WhatsApp
                     </button>
                   ) : (
                     <button
                       style={{ background: '#ff9500', color: 'white', marginLeft: '8px', marginTop: '4px', cursor: 'pointer' }}
                       onClick={() => { 
                         setAuthTab("login"); 
                         setShowAuth(true); 
                       }}
                     >
                       Log in to Buy
                     </button>
                   )}
                 </div>
               </div>
             );
           })}
       </div>
     </div>
     {/* --- END DEALS SECTION --- */}

     <div id="products" className="products-section">
       <h2>Our Products</h2>
       <div className="product-grid">
         {allProducts
             .filter(product => (selectedCat === "All" ? true : product.category === selectedCat))
             .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
             .map(product => (
               <div key={product.id} className="product-card">
                 <img src={product.image || "/Logo.jpg"} alt={product.name} />
                 <div className="product-info">
                   <h3>{product.name}</h3>
                   <p>{product.description}</p>
                   <div className="price">Ksh {product.price}</div>
                   {currentUser ? (
                     <button
                       style={{ background: '#25d366', color: 'white', marginLeft: '8px', marginTop: '4px' }}
                       onClick={() => {
                         const phone = '254790999150';
                         const message = encodeURIComponent(
                           `Hello, I want to buy the ${product.name} (Ksh ${product.price}).`
                         );
                         window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                       }}
                     >
                       Buy via WhatsApp
                     </button>
                   ) : (
                     <button
                       style={{ background: '#ff9500', color: 'white', marginLeft: '8px', marginTop: '4px', cursor: 'pointer' }}
                       onClick={() => {
                         setAuthTab("login");
                         setShowAuth(true);
                       }}
                     >
                       Log in to Buy
                     </button>
                   )}
                 </div>
               </div>
             ))
         }
       </div>
     </div>

     {showCart && (
       <div className="cart-sidebar">
         <h3>Shopping & Order History</h3>
         {currentUser && (
           <div style={{ display: "flex", gap: "8px", marginBottom: "16px", borderBottom: "2px solid #eee", paddingBottom: "8px" }}>
             <button
               onClick={() => setCartTab("items")}
               style={{
                 flex: 1,
                 padding: "8px 12px",
                 background: cartTab === "items" ? "#ff9500" : "#f0f0f0",
                 color: cartTab === "items" ? "white" : "#333",
                 border: "none",
                 borderRadius: "4px",
                 cursor: "pointer",
                 fontWeight: "bold",
                 fontSize: "0.95em"
               }}
             >
               🛒 Current Items ({cart.length})
             </button>
             <button
               onClick={() => setCartTab("history")}
               style={{
                 flex: 1,
                 padding: "8px 12px",
                 background: cartTab === "history" ? "#ff9500" : "#f0f0f0",
                 color: cartTab === "history" ? "white" : "#333",
                 border: "none",
                 borderRadius: "4px",
                 cursor: "pointer",
                 fontWeight: "bold",
                 fontSize: "0.95em"
               }}
             >
               📋 Purchase History
             </button>
           </div>
         )}

         {cartTab === "items" && (
           <>
             {cart.length === 0 && <div style={{ padding: "10px", color: "#666" }}>No items in cart.</div>}
             {cart.map((item, idx) => (
               <div key={idx} className="cart-item" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderBottom: "1px solid #eee" }}>
                 <span className="cart-item-name" style={{ flex: 1 }}>{item.name}</span>
                 <span className="cart-item-qty">x1</span>
                 <span className="cart-item-price">Ksh {item.price}</span>
                 <button
                   onClick={() => removeFromCart(idx)}
                   style={{
                     background: "#dc2626",
                     color: "white",
                     border: "none",
                     borderRadius: "4px",
                     padding: "4px 8px",
                     cursor: "pointer",
                     fontSize: "0.9em"
                   }}
                   title="Remove from cart"
                 >
                   ✕
                 </button>
               </div>
             ))}
             <div style={{ marginTop: 16, fontWeight: "bold", padding: "10px", background: "#f9f9f9", borderRadius: "4px" }}>
               Total: Ksh {cartTotal}
             </div>
           </>
         )}

         {cartTab === "history" && (
           <div style={{ maxHeight: "400px", overflowY: "auto" }}>
             {currentUser ? (
               <>
                 {purchaseHistory && purchaseHistory.length > 0 ? (
                   purchaseHistory.map((order, idx) => (
                     <div key={idx} style={{ padding: "12px", borderBottom: "1px solid #eee", marginBottom: "8px", background: "#f9f9f9", borderRadius: "4px" }}>
                       <div style={{ fontWeight: "bold", color: "#ff9500", marginBottom: "6px" }}>
                         Order #{order.id?.toString().slice(-6) || idx + 1}
                       </div>
                       <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "4px" }}>
                         <strong>Amount:</strong> Ksh {order.total_amount}
                       </div>
                       <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "4px" }}>
                         <strong>Items:</strong> {order.items_count || 1}
                       </div>
                       <div style={{ fontSize: "0.9em", color: "#666", marginBottom: "4px" }}>
                         <strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleDateString() : "N/A"}
                       </div>
                       <div style={{ fontSize: "0.9em", color: "#666" }}>
                         <strong>Status:</strong> <span style={{ color: order.status === "completed" ? "#10b981" : "#f59e0b" }}>{order.status || "Pending"}</span>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                     No purchase history yet.
                   </div>
                 )}
               </>
             ) : (
               <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                 Please log in to view your purchase history.
               </div>
             )}
           </div>
         )}

         <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
           {cartTab === "items" && cart.length > 0 && currentUser && (
             <button
               style={{
                 flex: 1,
                 background: "#10b981",
                 color: "#fff",
                 border: "none",
                 borderRadius: "4px",
                 padding: "8px 16px",
                 fontSize: "14px",
                 cursor: "pointer",
                 fontWeight: "bold",
                 boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
               }}
               onClick={() => {
                 const phone = '254790999150';
                 const message = encodeURIComponent(`Hello, I want to buy these items:\n${cart.map(item => `- ${item.name} (Ksh ${item.price})`).join('\n')}\n\nTotal: Ksh ${cartTotal}\n\nPlease provide delivery details.`);
                 window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
               }}
               title="Proceed to Payment"
             >
               ✓ Buy via WhatsApp
             </button>
           )}
           <button className="Close-btn"
             style={{
               flex: 1,
               background: "#f44336",
               color: "#fff",
               border: "none",
               borderRadius: "4px",
               padding: "8px 16px",
               fontSize: "14px",
               cursor: "pointer",
               fontWeight: "bold",
               boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
             }}
             onClick={() => setShowCart(false)}
             title="Close Cart"
           >
             × Close
           </button>
         </div>
       </div>
     )}
     
     {/* SERVICE BOOKING MODAL */}
     {showServiceBooking && (
       <div style={{
         position: "fixed",
         top: 0,
         left: 0,
         width: "100%",
         height: "100%",
         background: "rgba(0,0,0,0.5)",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         zIndex: 999
       }} onClick={() => setShowServiceBooking(false)}>
         <div style={{
           background: "#fff",
           borderRadius: "8px",
           padding: "24px",
           maxWidth: "500px",
           width: "90%",
           boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
         }} onClick={e => e.stopPropagation()}>
           <h2 style={{ marginTop: 0, color: "#333", fontSize: "24px", marginBottom: "16px" }}>
             🔧 Book a Service
           </h2>
           
           <form onSubmit={(e) => {
             e.preventDefault();
             handleServiceBooking();
           }} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
             
             {/* Service Selection */}
             <div>
               <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#555" }}>
                 Select Service *
               </label>
               <select
                 value={selectedService}
                 onChange={(e) => setSelectedService(e.target.value)}
                 style={{
                   width: "100%",
                   padding: "10px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   fontSize: "14px",
                   fontFamily: "inherit"
                 }}
                 required
               >
                 <option value="">-- Choose a service --</option>
                 {services.map(service => (
                   <option key={service.id} value={service.id}>
                     {service.emoji} {service.name} - {service.description}
                   </option>
                 ))}
               </select>
             </div>

             {/* Phone Number */}
             <div>
               <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#555" }}>
                 Phone Number *
               </label>
               <input
                 type="tel"
                 value={bookingDetails.phone}
                 onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                 placeholder="e.g., +254790999150"
                 style={{
                   width: "100%",
                   padding: "10px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   fontSize: "14px",
                   boxSizing: "border-box"
                 }}
                 required
               />
             </div>

             {/* Address */}
             <div>
               <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#555" }}>
                 Address *
               </label>
               <input
                 type="text"
                 value={bookingDetails.address}
                 onChange={(e) => setBookingDetails({ ...bookingDetails, address: e.target.value })}
                 placeholder="Enter your address"
                 style={{
                   width: "100%",
                   padding: "10px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   fontSize: "14px",
                   boxSizing: "border-box"
                 }}
                 required
               />
             </div>

             {/* Booking Date */}
             <div>
               <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#555" }}>
                 Preferred Date *
               </label>
               <input
                 type="date"
                 value={bookingDetails.date}
                 onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                 style={{
                   width: "100%",
                   padding: "10px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   fontSize: "14px",
                   boxSizing: "border-box"
                 }}
                 required
               />
             </div>

             {/* Additional Notes */}
             <div>
               <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#555" }}>
                 Additional Notes (Optional)
               </label>
               <textarea
                 value={bookingDetails.notes}
                 onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                 placeholder="Tell us more about your requirements..."
                 style={{
                   width: "100%",
                   padding: "10px",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   fontSize: "14px",
                   boxSizing: "border-box",
                   minHeight: "80px",
                   fontFamily: "inherit",
                   resize: "vertical"
                 }}
               />
             </div>

             {/* Buttons */}
             <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
               <button
                 type="submit"
                 style={{
                   flex: 1,
                   background: "#ff9500",
                   color: "#fff",
                   border: "none",
                   borderRadius: "4px",
                   padding: "12px",
                   fontSize: "14px",
                   fontWeight: "bold",
                   cursor: "pointer",
                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                 }}
               >
                 ✓ Book via WhatsApp
               </button>
               <button
                 type="button"
                 onClick={() => setShowServiceBooking(false)}
                 style={{
                   flex: 1,
                   background: "#f44336",
                   color: "#fff",
                   border: "none",
                   borderRadius: "4px",
                   padding: "12px",
                   fontSize: "14px",
                   fontWeight: "bold",
                   cursor: "pointer",
                   boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                 }}
               >
                 × Close
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
     </>
   )}
   <Footer/>
    </div>
  );
}

export default App;