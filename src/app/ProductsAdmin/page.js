"use client";
import { useState, useEffect } from "react";
import { 
  Trash2, Edit, Plus, Image as ImageIcon, Database, Save, Package, 
  Shield, Info, X, Upload, PlusCircle, CheckCircle, List, Loader2, Link as LinkIcon
} from "lucide-react";

import './Dashboard.scss';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Tab states for the Product Modal Media Section
  const [mainImgTab, setMainImgTab] = useState("upload");
  const [hoverImgTab, setHoverImgTab] = useState("upload");

  // Notification State
  const [notification, setNotification] = useState(null);

  // --- 1. INITIAL STATE WITH ALL 19 FIELDS (Prevents Controlled/Uncontrolled Warning) ---
  const initialProductState = {
    name: "",
    productType: "",
    price: "",
    salePrice: "",
    mainImage: "",
    mainPreview: "",
    hoverImage: "",
    hoverPreview: "",
    smallImages: [],     
    smallPreviews: [],   
    onSale: false,
    vendor: "Viking Armory Blades",
    stock: 1,
    sectionPath: "none",
    description: "",
    // The 5 New Technical Fields
    bladeMaterial: "",
    handleMaterial: "",
    overallLength: "",
    bladeLength: "",
    weight: "",
    recentSales: "No Sales",
    click_count: 0 
  };
  const [productForm, setProductForm] = useState(initialProductState);
  const [formErrors, setFormErrors] = useState({});

  // Site Content States
  const [heroSlider, setHeroSlider] = useState([]);
  const [infoBar, setInfoBar] = useState([]); 
  const [categories, setCategories] = useState({ col_1: [], col_2: [], col_3: [] });
  const [aboutData, setAboutData] = useState({ text: "", src: "", link: "" });

  // Modals for Content Media
  const [showHeroModal, setShowHeroModal] = useState(null); 
  const [heroTab, setHeroTab] = useState('upload');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [aboutTab, setAboutTab] = useState('upload');
  const [showCategoryModal, setShowCategoryModal] = useState(null); 
  const [categoryTab, setCategoryTab] = useState('upload');
  const [showInfoModal, setShowInfoModal] = useState(null); 
  const [infoTab, setInfoTab] = useState('upload');
  const [tempData, setTempData] = useState({ src: "", link: "", text: "" });

  // Helper for notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      const list = data.products || data;
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const types = ["hero_slider", "categories", "about_section", "info_bar"];
      const [hero, cats, about, info] = await Promise.all(
        types.map(t => fetch(`/api/content?type=${t}`).then(r => r.json()).catch(() => null))
      );
      setHeroSlider(Array.isArray(hero) ? hero : []);
      setCategories(cats || { col_1: [], col_2: [], col_3: [] });
      setAboutData(about || { text: "", src: "", link: "" });
      setInfoBar(Array.isArray(info) ? info : []);
    } catch (err) {
      console.error("Fetch content error:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
    fetchContent();
  }, []);

  if (!mounted) return null;

  // Image Upload with Preview
  const handleImageUpload = async (e, field, index = null, contentType = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    let targetIndex = index; 

    if (contentType) {
      setTempData(prev => ({ ...prev, src: localUrl }));
    } else {
      if (field === 'mainImage') {
        setProductForm(prev => ({ ...prev, mainPreview: localUrl }));
      } else if (field === 'hoverImage') {
        setProductForm(prev => ({ ...prev, hoverPreview: localUrl }));
      } else if (field === 'smallImages') {
        if (index === null) {
             targetIndex = productForm.smallImages.length;
             setProductForm(prev => ({ 
                 ...prev, 
                 smallPreviews: [...prev.smallPreviews, localUrl],
                 smallImages: [...prev.smallImages, ""] 
             }));
        } else {
             const updatedPreviews = [...productForm.smallPreviews];
             updatedPreviews[index] = localUrl;
             setProductForm(prev => ({ ...prev, smallPreviews: updatedPreviews }));
        }
      }
    }

    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileUri: reader.result, folder: "viking_armory" }),
        });
        const data = await res.json();
        const url = data.url; 

        if (url) {
          if (contentType === 'hero' && index !== null) {
            const updated = [...heroSlider];
            updated[index] = { ...updated[index], src: url };
            setHeroSlider(updated);
            setTempData(prev => ({ ...prev, src: url }));
          } else if (contentType === 'about') {
            setAboutData(prev => ({ ...prev, src: url }));
            setTempData(prev => ({ ...prev, src: url }));
          } else if (contentType === 'category' && index) {
            const { col, idx } = index;
            setCategories(prev => ({
              ...prev,
              [col]: prev[col].map((item, i) => i === idx ? { ...item, src: url } : item)
            }));
            setTempData(prev => ({ ...prev, src: url }));
          } else if (contentType === 'info') {
             const updated = [...infoBar];
             updated[index] = { ...updated[index], src: url };
             setInfoBar(updated);
             setTempData(prev => ({ ...prev, src: url }));
          } else {
            if (field === 'mainImage') {
              setProductForm(prev => ({ ...prev, mainImage: url, mainPreview: url }));
            } else if (field === 'hoverImage') {
              setProductForm(prev => ({ ...prev, hoverImage: url, hoverPreview: url }));
            } else if (field === 'smallImages') {
              const images = [...productForm.smallImages];
              if (targetIndex >= images.length) images.push(url);
              else images[targetIndex] = url;

              const previews = [...productForm.smallPreviews];
              if (targetIndex >= previews.length) previews.push(url);
              else previews[targetIndex] = url;

              setProductForm(prev => ({ ...prev, smallImages: images, smallPreviews: previews }));
            }
          }
        }
      } catch (err) {
        console.error("Upload error:", err);
        showNotification("Image upload failed", "error");
      }
      setLoading(false);
    };
  };

  const handleDrop = (e, field, index = null, contentType = null) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } };
      handleImageUpload(syntheticEvent, field, index, contentType);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!productForm.name.trim()) errors.name = "Name required";
    if (!productForm.price || parseFloat(productForm.price) <= 0) errors.price = "Valid price required";
    if (!productForm.mainImage && !productForm.mainPreview) errors.mainImage = "Main image required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingId(null);
        setProductForm(initialProductState);
        setFormErrors({});
        await fetchData();
        showNotification(editingId ? "Product updated successfully" : "Product created successfully");
      }
    } catch (err) {
      console.error("Submit error:", err);
      showNotification("Failed to save product", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete product?")) {
      setLoading(true);
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await fetchData();
      setLoading(false);
      showNotification("Product deleted");
    }
  };

  const handleSaveContent = async (type, data) => {
    setLoading(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: type, data }),
      });
      showNotification(`${type.replace('_', ' ')} saved successfully`);
    } catch (err) {
      console.error("Save error:", err);
      showNotification("Failed to save content", "error");
    }
    setLoading(false);
  };

  const removeGalleryImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      smallImages: prev.smallImages.filter((_, i) => i !== index),
      smallPreviews: prev.smallPreviews.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="dashboard-layout">
      {/* PROFESSIONAL HEADER */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="brand">
            <Shield size={28} className="brand-icon"/>
            <h1 className="brand-name">ARMORY<span>ADMIN</span></h1>
          </div>
          
          <nav className="top-nav">
            <button className={`nav-link ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
              <Package size={18} /> <span>Inventory</span>
            </button>
            <button className={`nav-link ${activeTab === "hero" ? "active" : ""}`} onClick={() => setActiveTab("hero")}>
              <ImageIcon size={18} /> <span>Hero</span>
            </button>
            <button className={`nav-link ${activeTab === "info_bar" ? "active" : ""}`} onClick={() => setActiveTab("info_bar")}>
              <List size={18} /> <span>Info Bar</span>
            </button>
            <button className={`nav-link ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
              <Database size={18} /> <span>Categories</span>
            </button>
            <button className={`nav-link ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
              <Info size={18} /> <span>About</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <div className="content-container">
          
          {notification && (
            <div className={`toast-notification ${notification.type}`}>
              <CheckCircle size={20} />
              <span>{notification.message}</span>
            </div>
          )}

          {activeTab === "products" && (
            <div className="fade-in">
              <div className="page-header">
                <div className="header-titles">
                  <h2>Product Inventory</h2>
                  <p>Manage catalog items, pricing and stock.</p>
                </div>
                <button className="btn btn-primary" onClick={() => {
                  setEditingId(null); 
                  setProductForm(initialProductState); 
                  setFormErrors({});
                  setShowModal(true);
                }}>
                  <Plus size={18} /> Add Product
                </button>
              </div>

              <div className="card product-card-container" style={{ position: 'relative', minHeight: '400px' }}>
                {/* --- LOCAL LOADING STATE --- */}
                {loading && (
                  <div className="local-loader" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Loader2 className="spinner" size={40} />
                    <p style={{ marginTop: '10px', fontWeight: '600' }}>Updating Armory...</p>
                  </div>
                )}

                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th width="80">Image</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Stats</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <img 
                              src={product.mainImage || "/placeholder.jpg"} 
                              alt={product.name}
                              className="table-img"
                            />
                          </td>
                          <td>
                            <div className="fw-bold">{product.name}</div>
                            <div className="text-muted small">{product.productType}</div>
                          </td>
                          <td className="text-primary fw-bold">${product.price}</td>
                          <td>
                            <span className={`status-badge ${product.stock > 0 ? 'success' : 'danger'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td>
                            <span className="click-counter">
                              {product.click_count} clicks
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="action-buttons">
                              <button onClick={() => {
                                setEditingId(product._id);
                                // Merging initial state with product ensures no missing fields (fixes warning)
                                setProductForm({
                                  ...initialProductState,
                                  ...product,
                                  mainPreview: product.mainImage,
                                  hoverPreview: product.hoverImage,
                                  smallPreviews: product.smallImages || []
                                });
                                setShowModal(true);
                              }} className="btn-icon edit">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete(product._id)} className="btn-icon delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && !loading && (
                        <tr>
                          <td colSpan="6" className="text-center p-5">No products found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "hero" && (
            <div className="fade-in">
              <div className="page-header">
                <div className="header-titles">
                  <h2>Hero Slider</h2>
                  <p>Manage homepage banners.</p>
                </div>
                <div className="header-actions">
                  <button className="btn btn-outline" onClick={() => setHeroSlider([...heroSlider, { src: "", link: "" }])}>
                    <PlusCircle size={18} /> Add Slide
                  </button>
                  <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("hero_slider", heroSlider)}>
                    Save Changes
                  </button>
                </div>
              </div>
              <div className="grid-responsive">
                {heroSlider.map((slide, index) => (
                  <div key={index} className="card media-card">
                    <div className="card-media">
                      <img src={slide.src || "https://placehold.co/400x300?text=Hero"} alt="Hero" />
                      <div className="card-overlay">
                        <button className="btn btn-sm btn-white" onClick={() => { setTempData({ src: slide.src, link: slide.link || '' }); setHeroTab('upload'); setShowHeroModal(index); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setHeroSlider(heroSlider.filter((_, i) => i !== index))}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "info_bar" && (
            <div className="fade-in">
              <div className="page-header">
                <div className="header-titles"><h3>Info Ticker</h3></div>
                <div className="header-actions">
                  <button className="btn btn-outline" onClick={() => setInfoBar([...infoBar, { src: "", text: "" }])}><PlusCircle size={18} /> Add Item</button>
                  <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("info_bar", infoBar)}>Save Changes</button>
                </div>
              </div>
              <div className="grid-responsive">
                {infoBar.map((item, index) => (
                  <div key={index} className="card media-card">
                    <div className="card-media">
                      <img src={item.src || "https://placehold.co/100x100?text=Icon"} style={{width:'50px', margin:'auto'}} alt="Icon" />
                      <div className="card-overlay">
                        <button className="btn btn-sm btn-white" onClick={() => { setTempData({ src: item.src, text: item.text || '' }); setShowInfoModal(index); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setInfoBar(infoBar.filter((_, i) => i !== index))}>Remove</button>
                      </div>
                    </div>
                    <div className="card-footer"><p className="text-center small">{item.text}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="fade-in">
              <div className="page-header">
                <div className="header-titles"><h2>Category Grid</h2><p>Manage category links.</p></div>
                <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("categories", categories)}>Save Categories</button>
              </div>
              <div className="grid-cols-3">
                {["col_1", "col_2", "col_3"].map(col => (
                  <div key={col} className="column-wrapper">
                    <div className="column-head">
                      <h4>{col.toUpperCase()}</h4>
                      <button className="btn-icon-add" onClick={() => setCategories(prev => ({...prev, [col]: [...prev[col], { src: "", link: "" }]}))}><Plus size={16} /></button>
                    </div>
                    <div className="column-list">
                      {categories[col].map((item, idx) => (
                        <div key={idx} className="list-item-card">
                          <img src={item.src || "https://placehold.co/400x300?text=Category"} className="list-thumb" alt="" />
                          <div className="list-actions">
                              <button className="btn-text" onClick={() => { setTempData({ src: item.src, link: item.link || '' }); setCategoryTab('upload'); setShowCategoryModal({ col, idx }); }}>Edit</button>
                              <button className="btn-text danger" onClick={() => setCategories(prev => ({...prev, [col]: prev[col].filter((_, i) => i !== idx)}))}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="fade-in">
               <div className="page-header">
                <div className="header-titles"><h2>About Section</h2><p>Edit story and image.</p></div>
                <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("about_section", aboutData)}>Save Changes</button>
              </div>
              <div className="card">
                  <div className="split-view">
                      <div className="form-section">
                          <label className="form-label">Story Text</label>
                          <textarea className="form-control" rows={12} value={aboutData.text} onChange={(e) => setAboutData({ ...aboutData, text: e.target.value })} />
                      </div>
                      <div className="preview-section">
                          <label className="form-label">Image Preview</label>
                          <div className="image-preview-box"><img src={aboutData.src || "https://placehold.co/500x400?text=About"} alt="About" /></div>
                          <button className="btn btn-outline full-width mt-3" onClick={() => { setTempData({ src: aboutData.src, link: aboutData.link || '' }); setAboutTab('upload'); setShowAboutModal(true); }}>Change Media</button>
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- ALL MODALS --- */}
      {(showModal || showHeroModal !== null || showAboutModal || showCategoryModal || showInfoModal !== null) && (
         <div className="modal-backdrop" onClick={() => { if (!loading) { setShowModal(false); setShowHeroModal(null); setShowAboutModal(false); setShowCategoryModal(null); setShowInfoModal(null); }}}>
            <div className={`modal-dialog ${showModal ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
              
              {showModal && (
                <>
                  <div className="modal-top">
                    <h3>{editingId ? "Edit Product" : "New Product"}</h3>
                    <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="modal-content-scroll">
                    <div className="form-grid">
                      <div className="form-item">
                        <label className="form-label">Name *</label>
                        <input className="form-control" value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} />
                        {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                      </div>
                      <div className="form-item">
                        <label className="form-label">Product Type</label>
                        <input className="form-control" value={productForm.productType} onChange={(e) => setProductForm(p => ({ ...p, productType: e.target.value }))} />
                      </div>
                      <div className="form-item">
                        <label className="form-label">Price *</label>
                        <input className="form-control" value={productForm.price} onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))} />
                        {formErrors.price && <div className="error-text">{formErrors.price}</div>}
                      </div>
                      <div className="form-item">
                        <label className="form-label">Sale Price</label>
                        <input className="form-control" value={productForm.salePrice} onChange={(e) => setProductForm(p => ({ ...p, salePrice: e.target.value }))} />
                      </div>
                      <div className="form-item">
                        <label className="form-label">Stock</label>
                        <input className="form-control" type="number" value={productForm.stock} onChange={(e) => setProductForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} />
                      </div>
                      <div className="form-item">
                        <label className="form-label">Vendor</label>
                        <input className="form-control" value={productForm.vendor} onChange={(e) => setProductForm(p => ({ ...p, vendor: e.target.value }))} />
                      </div>
                      <div className="form-item">
                        <label className="form-label">Section Path</label>
                        <select className="form-control" value={productForm.sectionPath} onChange={(e) => setProductForm(p => ({ ...p, sectionPath: e.target.value }))}>
                          <option value="none">None</option><option value="best-seller">Best Seller</option><option value="sword">Sword</option><option value="related">Related</option>
                        </select>
                      </div>

                      {/* NEW DETAILED FIELDS (15-19) */}
                      <div className="form-item"><label className="form-label">Blade Material</label><input className="form-control" placeholder="e.g. Damascus Steel" value={productForm.bladeMaterial} onChange={(e) => setProductForm(p => ({ ...p, bladeMaterial: e.target.value }))} /></div>
                      <div className="form-item"><label className="form-label">Handle Material</label><input className="form-control" placeholder="e.g. Walnut Wood" value={productForm.handleMaterial} onChange={(e) => setProductForm(p => ({ ...p, handleMaterial: e.target.value }))} /></div>
                      <div className="form-item"><label className="form-label">Overall Length</label><input className="form-control" placeholder='e.g. 12"' value={productForm.overallLength} onChange={(e) => setProductForm(p => ({ ...p, overallLength: e.target.value }))} /></div>
                      <div className="form-item"><label className="form-label">Blade Length</label><input className="form-control" placeholder='e.g. 7"' value={productForm.bladeLength} onChange={(e) => setProductForm(p => ({ ...p, bladeLength: e.target.value }))} /></div>
                      <div className="form-item"><label className="form-label">Weight</label><input className="form-control" placeholder="e.g. 450g" value={productForm.weight} onChange={(e) => setProductForm(p => ({ ...p, weight: e.target.value }))} /></div>
                      
                      <div className="form-item"><label className="form-label">Click Count</label><input className="form-control" type="number" value={productForm.click_count} onChange={(e) => setProductForm(p => ({ ...p, click_count: parseInt(e.target.value) || 0 }))} /></div>
                      <div className="form-item"><label className="form-label">Recent Sales Text</label><input className="form-control" value={productForm.recentSales} onChange={(e) => setProductForm(p => ({ ...p, recentSales: e.target.value }))} /></div>
                      
                      <div className="form-item check-item"><label className="checkbox-label"><input type="checkbox" checked={productForm.onSale} onChange={(e) => setProductForm(p => ({ ...p, onSale: e.target.checked }))} /> On Sale</label></div>
                      <div className="form-item full-span"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} /></div>
                    </div>

                    <div className="media-section">
                      {/* MAIN IMAGE WITH TABS */}
                      <div className="form-item">
                        <label className="form-label">Main Image</label>
                        <div className="tab-switcher compact-tabs">
                          <button type="button" onClick={() => setMainImgTab('upload')} className={`tab-btn ${mainImgTab === 'upload' ? 'active' : ''}`}><Upload size={14}/> Upload</button>
                          <button type="button" onClick={() => setMainImgTab('url')} className={`tab-btn ${mainImgTab === 'url' ? 'active' : ''}`}><LinkIcon size={14}/> Link</button>
                        </div>
                        
                        {mainImgTab === 'upload' ? (
                          <div className="dropzone medium" onDrop={(e) => handleDrop(e, 'mainImage')} onDragOver={e => e.preventDefault()}>
                            <img src={productForm.mainPreview || productForm.mainImage || "https://placehold.co/200"} className="drop-preview" alt="" />
                            <input type="file" id="main" className="file-input" onChange={(e) => handleImageUpload(e, 'mainImage')} />
                            <label htmlFor="main" className="drop-label"><Upload size={20} /> <span>Upload</span></label>
                          </div>
                        ) : (
                          <div className="url-input-container">
                             <input className="form-control" placeholder="Paste image URL here..." value={productForm.mainImage} onChange={(e) => setProductForm(p => ({ ...p, mainImage: e.target.value, mainPreview: e.target.value }))} />
                             {productForm.mainPreview && <img src={productForm.mainPreview} className="url-preview-thumb" alt="Preview" />}
                          </div>
                        )}
                      </div>

                      {/* HOVER IMAGE WITH TABS */}
                      <div className="form-item">
                        <label className="form-label">Hover Image</label>
                        <div className="tab-switcher compact-tabs">
                          <button type="button" onClick={() => setHoverImgTab('upload')} className={`tab-btn ${hoverImgTab === 'upload' ? 'active' : ''}`}><Upload size={14}/> Upload</button>
                          <button type="button" onClick={() => setHoverImgTab('url')} className={`tab-btn ${hoverImgTab === 'url' ? 'active' : ''}`}><LinkIcon size={14}/> Link</button>
                        </div>

                        {hoverImgTab === 'upload' ? (
                          <div className="dropzone medium" onDrop={(e) => handleDrop(e, 'hoverImage')} onDragOver={e => e.preventDefault()}>
                            <img src={productForm.hoverPreview || productForm.hoverImage || "https://placehold.co/200"} className="drop-preview" alt="" />
                            <input type="file" id="hover" className="file-input" onChange={(e) => handleImageUpload(e, 'hoverImage')} />
                            <label htmlFor="hover" className="drop-label"><Upload size={20} /> <span>Upload</span></label>
                          </div>
                        ) : (
                          <div className="url-input-container">
                            <input className="form-control" placeholder="Paste image URL here..." value={productForm.hoverImage} onChange={(e) => setProductForm(p => ({ ...p, hoverImage: e.target.value, hoverPreview: e.target.value }))} />
                            {productForm.hoverPreview && <img src={productForm.hoverPreview} className="url-preview-thumb" alt="Preview" />}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="gallery-section">
                      <label className="form-label">Gallery Small Images</label>
                      <div className="gallery-container">
                        {productForm.smallImages.map((img, i) => (
                          <div key={i} className="dropzone small" onDrop={(e) => handleDrop(e, 'smallImages', i)} onDragOver={e => e.preventDefault()}>
                            <img src={productForm.smallPreviews[i] || img || "https://placehold.co/100"} className="drop-preview" alt="" />
                            <input type="file" id={`small-${i}`} className="file-input" onChange={(e) => handleImageUpload(e, 'smallImages', i)} />
                            <label htmlFor={`small-${i}`} className="drop-label compact"><Upload size={14} /></label>
                            <button type="button" onClick={() => removeGalleryImage(i)} className="delete-overlay"><X size={12} /></button>
                          </div>
                        ))}
                        <button type="button" className="add-gallery-btn" onClick={() => document.getElementById('small-new').click()}><Plus size={20} /></button>
                        <input type="file" id="small-new" style={{display:'none'}} onChange={(e) => handleImageUpload(e, 'smallImages', null)} />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>Save Product</button>
                    </div>
                  </form>
                </>
              )}

              {/* CMS Media Upload Modal */}
              {!showModal && (
                <>
                  <div className="modal-top"><h3>Media Settings</h3><button className="close-btn" onClick={() => { setShowHeroModal(null); setShowAboutModal(false); setShowCategoryModal(null); setShowInfoModal(null); }}><X size={20} /></button></div>
                  <div className="modal-content">
                    <div className="tab-switcher">
                      <button onClick={() => { if (showHeroModal !== null) setHeroTab('upload'); else if (showAboutModal) setAboutTab('upload'); else if (showCategoryModal) setCategoryTab('upload'); else if (showInfoModal !== null) setInfoTab('upload'); }} className={`tab-btn ${(showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'upload' ? 'active' : ''}`}>Upload</button>
                      <button onClick={() => { if (showHeroModal !== null) setHeroTab('url'); else if (showAboutModal) setAboutTab('url'); else if (showCategoryModal) setCategoryTab('url'); else if (showInfoModal !== null) setInfoTab('url'); }} className={`tab-btn ${(showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'url' ? 'active' : ''}`}>URL</button>
                    </div>
                    <div className="tab-body">
                      {(showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'upload' ? (
                        <div className="dropzone large" onDrop={(e) => { 
                            if(showHeroModal !== null) handleDrop(e, null, showHeroModal, 'hero');
                            else if (showAboutModal) handleDrop(e, null, null, 'about');
                            else if (showCategoryModal) handleDrop(e, null, showCategoryModal, 'category');
                            else if (showInfoModal !== null) handleDrop(e, null, showInfoModal, 'info');
                          }} onDragOver={e => e.preventDefault()}>
                          <img src={tempData.src || "https://placehold.co/400x300"} className="drop-preview" alt="" />
                          <input type="file" id="content-upload" className="file-input" onChange={(e) => {
                            if(showHeroModal !== null) handleImageUpload(e, null, showHeroModal, 'hero');
                            else if (showAboutModal) handleImageUpload(e, null, null, 'about');
                            else if (showCategoryModal) handleImageUpload(e, null, showCategoryModal, 'category');
                            else if (showInfoModal !== null) handleImageUpload(e, null, showInfoModal, 'info');
                          }} />
                          <label htmlFor="content-upload" className="drop-label"><Upload size={32} /> <span>Select File</span></label>
                        </div>
                      ) : (
                        <div className="url-form">
                            <div className="form-item"><label className="form-label">Image URL</label><input className="form-control" value={tempData.src} onChange={(e) => setTempData(p => ({ ...p, src: e.target.value }))} /></div>
                        </div>
                      )}
                      <div className="url-form mt-3">
                         {showInfoModal !== null ? (
                           <div className="form-item"><label className="form-label">Text</label><input className="form-control" value={tempData.text} onChange={(e) => setTempData(p => ({ ...p, text: e.target.value }))} /></div>
                         ) : (
                           <div className="form-item"><label className="form-label">Link</label><input className="form-control" value={tempData.link} onChange={(e) => setTempData(p => ({ ...p, link: e.target.value }))} /></div>
                         )}
                      </div>
                    </div>
                    <div className="modal-actions">
                        <button className="btn btn-primary" onClick={() => {
                            if (showHeroModal !== null) { const u = [...heroSlider]; u[showHeroModal] = { ...u[showHeroModal], src: tempData.src, link: tempData.link }; setHeroSlider(u); setShowHeroModal(null); }
                            else if (showAboutModal) { setAboutData({ ...aboutData, src: tempData.src, link: tempData.link }); setShowAboutModal(false); }
                            else if (showCategoryModal) { const { col, idx } = showCategoryModal; const u = {...categories}; u[col][idx] = { ...u[col][idx], src: tempData.src, link: tempData.link }; setCategories(u); setShowCategoryModal(null); }
                            else if (showInfoModal !== null) { const u = [...infoBar]; u[showInfoModal] = { ...u[showInfoModal], src: tempData.src, text: tempData.text }; setInfoBar(u); setShowInfoModal(null); }
                        }}>Apply Changes</button>
                    </div>
                  </div>
                </>
              )}
            </div>
         </div>
      )}
    </div>
  );
}