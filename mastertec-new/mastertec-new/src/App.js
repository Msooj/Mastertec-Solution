import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiCamera, FiServer, FiShield, FiBattery, FiCpu, FiWifi, FiPhone, FiEye, FiInbox, FiBarChart2, FiUser,
  FiShoppingCart, FiPlusCircle, FiTrash2, FiEdit2, FiArrowLeft
} from "react-icons/fi";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
  const [authPassword, setAuthPassword] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState("products");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: categories[0],
    description: "",
    inventory: 10,
    image: ""
  });
  const [editProduct, setEditProduct] = useState(null);

  const [previewImageAdd, setPreviewImageAdd] = useState(null);
  const [previewImageEdit, setPreviewImageEdit] = useState(null);

  const [checkoutDetails, setCheckoutDetails] = useState({ phone: "", address: "" });
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => { fetchProducts(); }, [isAdmin]);
  useEffect(() => { if(isAdmin && adminTab === "users") fetchUsers(); }, [isAdmin, adminTab]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setAllProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email: authEmail, password: authPassword });
      setCurrentUser(data);
      setShowAuth(false);
      setAuthPassword(""); setAuthEmail("");
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed.");
    }
  };
  const signupUser = async (e) => {
    e.preventDefault();
    setSignupError(null);
    try {
      const { data } = await axios.post(`${API_URL}/signup`, { name: e.target.name.value, email: e.target.email.value, password: e.target.password.value });
      setCurrentUser(data);
      setShowAuth(false);
    } catch (err) {
      setSignupError(err.response?.data?.error || "Signup failed.");
    }
  };
  const adminLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError("");
    try {
      const { data } = await axios.post(`${API_URL}/admin/login`, { name: e.target.name.value, password: e.target.password.value });
      setIsAdmin(true);
      setShowAdmin(false);
    } catch (err) {
      setAdminLoginError("Admin login failed: " + (err.response?.data?.error || "Wrong password"));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setShowAdmin(false);
    setShowAuth(false);
    setAdminTab("products");
  };

  const addToCart = product => setCart([...cart, product]);

  const removeProduct = async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
    fetchProducts();
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

  const addNewProduct = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/products`, newProduct);
    setNewProduct({ name: "", price: "", category: categories[0], description: "", inventory: 10, image: "" });
    setPreviewImageAdd(null);
    setShowAddModal(false);
    fetchProducts();
  };

  const startEdit = (product) => {
    setEditProduct({ ...product });
    setPreviewImageEdit(product.image || null);
    setShowEditModal(true);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/products/${editProduct.id}`, editProduct);
    setEditProduct(null);
    setPreviewImageEdit(null);
    setShowEditModal(false);
    fetchProducts();
  };

  const handleMpesaPayment = () => {
    if (!checkoutDetails.phone || !checkoutDetails.address) {
      setCheckoutError("Please provide phone number and address");
      return;
    }
    alert(`STK push sent to ${checkoutDetails.phone} for delivery to ${checkoutDetails.address}`);
    setShowCart(false);
    setCheckoutDetails({phone: "", address: ""});
    setCheckoutError(null);
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  return (
    <div className="app-bg">
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
            />
          </div>
          <div className="nav-actions">
            <button className="cart-btn" onClick={() => setShowCart(true)}>
              <FiShoppingCart size={22} />
              <span className="cart-count">{cart.length}</span>
            </button>
            {currentUser ? (
              <>
                <span style={{ marginRight: 10, fontWeight: "bold" }}>
                  Welcome, {currentUser.name || currentUser.email.split("@")[0]}!
                </span>
                <button className="auth-btn" onClick={logout}>
                  Log Out
                </button>
              </>
            ) : (
              <button className="auth-btn" onClick={() => { setAuthTab("login"); setShowAuth(true); }}>
                Login / Sign Up <FiUser style={{marginLeft: 7}} />
              </button>
            )}
            <button className="admin-btn" onClick={() => setShowAdmin(true)}>
              Admin Sign In
            </button>
          </div>
        </div>
      </div>
      {showAuth && (
        <div className="auth-modal">
          {authTab === "login" ? (
            <form className="auth-form" onSubmit={loginUser}>
              <input type="email" name="email" required placeholder="Email"
                value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
              <input type="password" name="password" required placeholder="Password"
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
              <input type="text" name="name" required placeholder="Name" />
              <input type="email" name="email" required placeholder="Email" />
              <input type="password" name="password" required placeholder="Password" />
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
          <form className="auth-form" onSubmit={adminLogin}>
            <h3>Admin Sign In</h3>
            <input type="text" name="name" required placeholder="Admin Name" />
            <input type="password" name="password" required placeholder="Admin Password" />
            <button type="submit">Sign In</button>
            <button type="button" onClick={() => setShowAdmin(false)}>Cancel</button>
            {adminLoginError && <div className="auth-error">{adminLoginError}</div>}
          </form>
        </div>
      )}
      {isAdmin ? (
        <div className="admin-area">
          <button className="shop-btn" style={{marginBottom:20}} onClick={() => setIsAdmin(false)}>
            <FiArrowLeft /> Back to Shop
          </button>
          <div className="admin-tabs" style={{ display: "flex", gap: 20, marginBottom: 20 }}>
            <button onClick={() => setAdminTab("products")} className={adminTab === "products" ? "admin-tab-selected" : ""}>Products</button>
            <button onClick={() => setAdminTab("users")} className={adminTab === "users" ? "admin-tab-selected" : ""}>Users</button>
            <button onClick={() => setAdminTab("reports")} className={adminTab === "reports" ? "admin-tab-selected" : ""}>Reports</button>
          </div>
          {adminTab === "products" && (
            <>
              <button className="admin-btn" style={{margin: "1em 0"}} onClick={() => setShowAddModal(true)}>
                <FiPlusCircle /> Add Product
              </button>
              {showAddModal && (
                <div className="modal-bg">
                  <form onSubmit={addNewProduct} className="admin-product-form modal-form">
                    <h3>Add Product</h3>
                    <input type="text" placeholder="Name" value={newProduct.name}
                      required onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <input type="text" placeholder="Price" value={newProduct.price}
                      required onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <input type="file" accept="image/*"
                      onChange={handleAddImageChange} />
                    {previewImageAdd && <img src={previewImageAdd} alt="Preview" style={{maxWidth: "100px", marginBottom: "10px"}} />}
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Description" value={newProduct.description}
                      required onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    <input type="number" placeholder="Inventory" value={newProduct.inventory}
                      required onChange={e => setNewProduct({...newProduct, inventory: e.target.value})} />
                    <div style={{display:"flex",gap:10}}>
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
                    <input type="text" value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} required />
                    <input type="text" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: e.target.value})} required />
                    <input type="file" accept="image/*" onChange={handleEditImageChange} />
                    {previewImageEdit && <img src={previewImageEdit} alt="Preview" style={{maxWidth: "100px", marginBottom: "10px"}} />}
                    <select value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})}>
                      {categories.map(cat => (
                        <option value={cat} key={cat}>{cat}</option>
                      ))}
                    </select>
                    <input type="text" value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} required />
                    <input type="number" value={editProduct.inventory} onChange={e => setEditProduct({...editProduct, inventory: e.target.value})} required />
                    <div style={{display:"flex",gap:10}}>
                      <button type="submit" className="admin-btn"><FiEdit2 /> Save</button>
                      <button type="button" className="admin-btn" onClick={() => { setEditProduct(null); setShowEditModal(false); setPreviewImageEdit(null); }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="products-section">
                <h2>All Products</h2>
                <div className="product-grid">
                  {allProducts.map(p => (
                    <div className="product-card" key={p.id}>
                      <img src={p.image || "/Logo.jpg"} alt={p.name} />
                      <div className="product-info">
                        <h3>{p.name}</h3>
                        <div className="price">Ksh {p.price}</div>
                        <p>{p.description}</p>
                        <span style={{fontSize:12}}>{p.category}, {p.inventory} in stock</span>
                        <div style={{display:'flex',gap:8,marginTop:8}}>
                          <button className="admin-btn" onClick={() => startEdit(p)}>
                            <FiEdit2 /> Edit
                          </button>
                          <button className="admin-btn" onClick={() => removeProduct(p.id)}>
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
          {adminTab === "reports" && (
            <div>
              <h2>Reports</h2>
              <div>No reports yet (add backend logic for data)</div>
            </div>
          )}
        </div>
      ) : (
      <>
        <div className="hero-section">
          <h1>Get the Best Security & Tech Solutions</h1>
          <p>Choose from top brands and categories, delivered fast across Kenya</p>
          <a href="#products" className="shop-btn">Shop Now</a>
        </div>
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn${selectedCat === cat ? " cat-selected" : ""}`}
              onClick={() => setSelectedCat(cat)}
            >
              <span className="cat-icon">{categoryIcons[cat]}</span>
              {cat}
            </button>
          ))}
        </div>
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
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {showCart && (
          <div className="cart-sidebar">
            <h3>Your Cart</h3>
            {cart.length === 0 && <div>No items in cart.</div>}
            {cart.map((item, idx) => (
              <div key={idx} className="cart-item">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-qty">x1</span>
                <span className="cart-item-price">Ksh {item.price}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, fontWeight: "bold" }}>
              Total: Ksh {cartTotal}
            </div>
            <div style={{ marginTop: 20 }}>
              <input
                type="text"
                placeholder="Your phone number"
                value={checkoutDetails.phone}
                onChange={e => setCheckoutDetails({...checkoutDetails, phone: e.target.value})}
                style={{ width: "100%", marginBottom: 8 }}
              />
              <input
                type="text"
                placeholder="Delivery address"
                value={checkoutDetails.address}
                onChange={e => setCheckoutDetails({...checkoutDetails, address: e.target.value})}
                style={{ width: "100%", marginBottom: 8 }}
              />
              {checkoutError && <div className="auth-error">{checkoutError}</div>}
              {/* PURCHASE BUTTON LOGIC: SIGN-IN REQUIRED */}
              {currentUser ? (
                <button className="checkout-btn" style={{ marginBottom: 8 }} onClick={handleMpesaPayment}>
                  Pay Now (MPESA STK)
                </button>
              ) : (
                <button className="checkout-btn" style={{ marginBottom: 8 }} onClick={() => {
                  setShowCart(false);
                  setAuthTab("login");
                  setShowAuth(true);
                }}>
                  Login or Sign Up to Complete Purchase
                </button>
              )}
              <button className="checkout-btn" onClick={() => setShowCart(false)}>
                Close Cart
              </button>
            </div>
          </div>
        )}
      </>
      )}
    </div>
  );
}

export default App;
