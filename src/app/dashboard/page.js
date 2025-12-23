"use client";
import { useState, useEffect } from "react";
import { 
  Trash2, Edit, Plus, Image as ImageIcon, Database, Save, Package, 
  Shield, Info, X, Upload, PlusCircle, CheckCircle, List
} from "lucide-react";

import './Dashboard.scss';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  // Notification State
  const [notification, setNotification] = useState(null);

  // Product Form State (14 Fields Logic Restored)
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
    vendor: "",
    stock: 0,
    sectionPath: "none",
    description: "",
    recentSales: "",
    click_count: 0 
  };
  const [productForm, setProductForm] = useState(initialProductState);
  const [formErrors, setFormErrors] = useState({});

  // Site Content States
  const [heroSlider, setHeroSlider] = useState([]);
  const [infoBar, setInfoBar] = useState([]); 
  const [categories, setCategories] = useState({ col_1: [], col_2: [], col_3: [] });
  const [aboutData, setAboutData] = useState({ text: "", src: "", link: "" });

  // Modals for Content
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

  // FETCH
  const fetchData = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch products error:", err);
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

    // Local preview (Immediate Feedback)
    const localUrl = URL.createObjectURL(file);
    let targetIndex = index; // We need to track the index if we create a new slot

    if (contentType) {
      setTempData(prev => ({ ...prev, src: localUrl }));
    } else {
      if (field === 'mainImage') {
        setProductForm(prev => ({ ...prev, mainPreview: localUrl }));
      } else if (field === 'hoverImage') {
        setProductForm(prev => ({ ...prev, hoverPreview: localUrl }));
      } else if (field === 'smallImages') {
        // Handle updating existing OR adding new gallery image
        if (index === null) {
             // New Image Case: Add placeholder to array immediately so we have an index
             targetIndex = productForm.smallImages.length;
             setProductForm(prev => ({ 
                 ...prev, 
                 smallPreviews: [...prev.smallPreviews, localUrl],
                 smallImages: [...prev.smallImages, ""] 
             }));
        } else {
             // Existing Image Case
             const updatedPreviews = [...productForm.smallPreviews];
             updatedPreviews[index] = localUrl;
             setProductForm(prev => ({ ...prev, smallPreviews: updatedPreviews }));
        }
      }
    }

    // Upload to Cloudinary
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
            // Product images
            if (field === 'mainImage') {
              setProductForm(prev => ({ ...prev, mainImage: url, mainPreview: url }));
            } else if (field === 'hoverImage') {
              setProductForm(prev => ({ ...prev, hoverImage: url, hoverPreview: url }));
            } else if (field === 'smallImages') {
              // Update using targetIndex which is now guaranteed to be correct
              const images = [...productForm.smallImages];
              // If we added a new slot in the preview step, we update that slot.
              // If the array grew in the meantime, we ensure we target the correct index.
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

  // Drop Handler
  const handleDrop = (e, field, index = null, contentType = null) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = { target: { files: [file] } };
      handleImageUpload(syntheticEvent, field, index, contentType);
    }
  };

  // Validation
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
        fetchData();
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
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchData();
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

  // Gallery Logic
  const addGalleryImage = () => {
    // Trigger upload for a new index (null index triggers the "New" logic in handleImageUpload)
    document.getElementById('small-new').click();
  };

  const removeGalleryImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      smallImages: prev.smallImages.filter((_, i) => i !== index),
      smallPreviews: prev.smallPreviews.filter((_, i) => i !== index)
    }));
  };

  const updateHeroSlide = (index, field, value) => {
    const updated = [...heroSlider];
    updated[index] = { ...updated[index], [field]: value };
    setHeroSlider(updated);
  };

  const updateCategoryItem = (col, idx, field, value) => {
    setCategories(prev => ({
      ...prev,
      [col]: prev[col].map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <div className="dashboard-layout">
      {/* PROFESSIONAL HEADER INSTEAD OF SIDEBAR */}
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
          
          {/* TOAST NOTIFICATION */}
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

              <div className="card">
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
                            <span className="click-counter" title="Total Clicks">
                              {product.click_count} clicks
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="action-buttons">
                              <button onClick={() => {
                                setEditingId(product._id);
                                setProductForm({
                                  ...product,
                                  mainPreview: product.mainImage,
                                  hoverPreview: product.hoverImage,
                                  smallPreviews: product.smallImages
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
                      {products.length === 0 && (
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
                    {loading ? "Processing..." : "Save Changes"}
                  </button>
                </div>
              </div>
              <div className="grid-responsive">
                {heroSlider.map((slide, index) => (
                  <div key={index} className="card media-card">
                    <div className="card-media">
                      <img 
                        src={slide.src || "https://placehold.co/400x300?text=Hero"} 
                        alt="Hero slide"
                      />
                      <div className="card-overlay">
                        <button className="btn btn-sm btn-white" onClick={() => {
                          setTempData({ src: slide.src, link: slide.link || '' });
                          setHeroTab('upload');
                          setShowHeroModal(index);
                        }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setHeroSlider(heroSlider.filter((_, i) => i !== index))}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="card-footer">
                       <span className="badge">Slide {index + 1}</span>
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
                  <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("info_bar", infoBar)}>
                    {loading ? "Processing..." : "Save Changes"}
                  </button>
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
                <div className="header-titles">
                  <h2>Category Grid</h2>
                  <p>Manage homepage category links.</p>
                </div>
                <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("categories", categories)}>
                  {loading ? "Processing..." : "Save Categories"}
                </button>
              </div>
              <div className="grid-cols-3">
                {["col_1", "col_2", "col_3"].map(col => (
                  <div key={col} className="column-wrapper">
                    <div className="column-head">
                      <h4>{col.replace('_', ' ').toUpperCase()}</h4>
                      <button className="btn-icon-add" onClick={() => setCategories(prev => ({...prev, [col]: [...prev[col], { src: "", link: "" }]}))}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="column-list">
                      {categories[col].map((item, idx) => (
                        <div key={idx} className="list-item-card">
                          <img 
                            src={item.src || "https://placehold.co/400x300?text=Category"} 
                            className="list-thumb"
                            alt="Category"
                          />
                          <div className="list-actions">
                              <button className="btn-text" onClick={() => {
                                setTempData({ src: item.src, link: item.link || '' });
                                setCategoryTab('upload');
                                setShowCategoryModal({ col, idx });
                              }}>
                              Edit
                              </button>
                              <button className="btn-text danger" onClick={() => setCategories(prev => ({...prev, [col]: prev[col].filter((_, i) => i !== idx)}))}>
                              Remove
                              </button>
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
                <div className="header-titles">
                  <h2>About Section</h2>
                  <p>Edit story and image.</p>
                </div>
                <button className="btn btn-primary" disabled={loading} onClick={() => handleSaveContent("about_section", aboutData)}>
                  {loading ? "Processing..." : "Save Changes"}
                </button>
              </div>
              <div className="card">
                  <div className="split-view">
                      <div className="form-section">
                          <label className="form-label">Story Text</label>
                          <textarea className="form-control" rows={12} value={aboutData.text} onChange={(e) => setAboutData({ ...aboutData, text: e.target.value })} />
                      </div>
                      <div className="preview-section">
                          <label className="form-label">Image Preview</label>
                          <div className="image-preview-box">
                            <img 
                              src={aboutData.src || "https://placehold.co/500x400?text=About"} 
                              alt="About"
                            />
                          </div>
                          <button className="btn btn-outline full-width mt-3" onClick={() => {
                            setTempData({ src: aboutData.src, link: aboutData.link || '' });
                            setAboutTab('upload');
                            setShowAboutModal(true);
                          }}>
                          Change Image / Link
                          </button>
                      </div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* GLOBAL MODALS */}
      {(showModal || showHeroModal !== null || showAboutModal || showCategoryModal || showInfoModal !== null) && (
         <div className="modal-backdrop" onClick={() => {
           if (loading) return; // Prevent closing if uploading
           setShowModal(false);
           setShowHeroModal(null);
           setShowAboutModal(false);
           setShowCategoryModal(null);
           setShowInfoModal(null);
         }}>
           <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
             
             {/* PRODUCT FORM MODAL */}
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
                       <input className="form-control" value={productForm.name} onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))} />
                       {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                     </div>
                     <div className="form-item">
                       <label className="form-label">Type</label>
                       <input className="form-control" value={productForm.productType} onChange={(e) => setProductForm(prev => ({ ...prev, productType: e.target.value }))} />
                     </div>
                     <div className="form-item">
                       <label className="form-label">Price *</label>
                       <input className="form-control" type="number" value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} />
                       {formErrors.price && <div className="error-text">{formErrors.price}</div>}
                     </div>
                     <div className="form-item">
                       <label className="form-label">Sale Price</label>
                       <input className="form-control" type="number" value={productForm.salePrice} onChange={(e) => setProductForm(prev => ({ ...prev, salePrice: e.target.value }))} />
                     </div>
                     <div className="form-item">
                       <label className="form-label">Stock</label>
                       <input className="form-control" type="number" value={productForm.stock} onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))} />
                     </div>
                     <div className="form-item">
                       <label className="form-label">Clicks</label>
                       <input className="form-control" type="number" value={productForm.click_count} onChange={(e) => setProductForm(prev => ({ ...prev, click_count: e.target.value }))} />
                     </div>
                     <div className="form-item">
                       <label className="form-label">Vendor</label>
                       <input className="form-control" value={productForm.vendor} onChange={(e) => setProductForm(prev => ({ ...prev, vendor: e.target.value }))} />
                     </div>
                     <div className="form-item">
                       <label className="form-label">Section Path</label>
                       <select className="form-control" value={productForm.sectionPath} onChange={(e) => setProductForm(prev => ({ ...prev, sectionPath: e.target.value }))} >
                         <option value="none">None</option>
                         <option value="best-seller">Best Seller</option>
                         <option value="sword">Sword</option>
                         <option value="related">Related</option>
                       </select>
                     </div>
                     <div className="form-item">
                       <label className="form-label">Recent Sales</label>
                       <input className="form-control" value={productForm.recentSales} onChange={(e) => setProductForm(prev => ({ ...prev, recentSales: e.target.value }))} />
                     </div>
                     <div className="form-item check-item">
                       <label className="checkbox-label">
                         <input type="checkbox" checked={productForm.onSale} onChange={(e) => setProductForm(prev => ({ ...prev, onSale: e.target.checked }))} />
                         On Sale
                       </label>
                     </div>
                     <div className="form-item full-span">
                       <label className="form-label">Description</label>
                       <textarea className="form-control" rows={4} value={productForm.description} onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))} />
                     </div>
                   </div>

                   <div className="media-section">
                     <div className="form-item">
                       <label className="form-label">Main Image *</label>
                       <div className="dropzone medium" onDrop={(e) => handleDrop(e, 'mainImage')} onDragOver={e => e.preventDefault()}>
                         <img src={productForm.mainPreview || productForm.mainImage || "https://placehold.co/200?text=Main"} className="drop-preview" alt="" />
                         <input type="file" id="main" className="file-input" accept="image/*" onChange={(e) => handleImageUpload(e, 'mainImage')} />
                         <label htmlFor="main" className="drop-label">
                           <Upload size={20} /> <span>{loading ? "Uploading..." : "Upload"}</span>
                         </label>
                       </div>
                       {formErrors.mainImage && <div className="error-text">{formErrors.mainImage}</div>}
                     </div>

                     <div className="form-item">
                       <label className="form-label">Hover Image</label>
                       <div className="dropzone medium" onDrop={(e) => handleDrop(e, 'hoverImage')} onDragOver={e => e.preventDefault()}>
                         <img src={productForm.hoverPreview || productForm.hoverImage || "https://placehold.co/200?text=Hover"} className="drop-preview" alt="" />
                         <input type="file" id="hover" className="file-input" accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} />
                         <label htmlFor="hover" className="drop-label">
                           <Upload size={20} /> <span>{loading ? "Uploading..." : "Upload"}</span>
                         </label>
                       </div>
                     </div>
                   </div>

                   {/* SMALL IMAGES GALLERY (RESTORED) */}
                   <div className="gallery-section">
                     <label className="form-label">Gallery Images</label>
                     <div className="gallery-container">
                       {productForm.smallImages.map((img, i) => (
                         <div key={i} className="dropzone small" onDrop={(e) => handleDrop(e, 'smallImages', i)} onDragOver={e => e.preventDefault()}>
                           <img src={productForm.smallPreviews[i] || img || "https://placehold.co/100?text=Small"} className="drop-preview" alt="" />
                           <input type="file" id={`small-${i}`} className="file-input" accept="image/*" onChange={(e) => handleImageUpload(e, 'smallImages', i)} />
                           <label htmlFor={`small-${i}`} className="drop-label compact">
                             <Upload size={14} />
                           </label>
                           <button onClick={() => removeGalleryImage(i)} className="delete-overlay">
                             <X size={12} />
                           </button>
                         </div>
                       ))}
                       {/* Hidden input to trigger 'New' upload logic */}
                       <input type="file" id="small-new" style={{display:'none'}} accept="image/*" onChange={(e) => handleImageUpload(e, 'smallImages', null)} />
                       <button type="button" className="add-gallery-btn" onClick={() => document.getElementById('small-new').click()}>
                         <Plus size={20} />
                       </button>
                     </div>
                   </div>

                   <div className="modal-actions">
                     <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                     <button type="submit" className="btn btn-primary" disabled={loading}>
                       {loading ? "Saving..." : "Save Product"}
                     </button>
                   </div>
                 </form>
               </>
             )}

             {/* GENERIC UPLOAD MODAL */}
             {(!showModal) && (
               <>
                 <div className="modal-top">
                   <h3>Edit Content Media</h3>
                   <button className="close-btn" onClick={() => {
                      setShowHeroModal(null);
                      setShowAboutModal(false);
                      setShowCategoryModal(null);
                      setShowInfoModal(null);
                   }}><X size={20} /></button>
                 </div>
                 <div className="modal-content">
                   <div className="tab-switcher">
                     <button 
                       onClick={() => {
                          if (showHeroModal !== null) setHeroTab('upload');
                          else if (showAboutModal) setAboutTab('upload');
                          else if (showCategoryModal) setCategoryTab('upload');
                          else if (showInfoModal !== null) setInfoTab('upload');
                       }} 
                       className={`tab-btn ${
                          (showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'upload' ? 'active' : ''}`}
                     >
                       Upload File
                     </button>
                     <button 
                       onClick={() => {
                          if (showHeroModal !== null) setHeroTab('url');
                          else if (showAboutModal) setAboutTab('url');
                          else if (showCategoryModal) setCategoryTab('url');
                          else if (showInfoModal !== null) setInfoTab('url');
                       }} 
                       className={`tab-btn ${
                          (showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'url' ? 'active' : ''}`}
                     >
                       External URL
                     </button>
                   </div>

                   <div className="tab-body">
                     {(showHeroModal!==null?heroTab:showAboutModal?aboutTab:showCategoryModal?categoryTab:infoTab) === 'upload' ? (
                       <div className="dropzone large" onDrop={(e) => {
                           if(showHeroModal !== null) handleDrop(e, null, showHeroModal, 'hero');
                           else if (showAboutModal) handleDrop(e, null, null, 'about');
                           else if (showCategoryModal) handleDrop(e, null, showCategoryModal, 'category');
                           else if (showInfoModal !== null) handleDrop(e, null, showInfoModal, 'info');
                       }} onDragOver={e => e.preventDefault()}>
                         <img src={tempData.src || "https://placehold.co/400x300?text=Preview"} className="drop-preview" alt="" />
                         <input type="file" id="content-upload" className="file-input" accept="image/*" onChange={(e) => {
                             if(showHeroModal !== null) handleImageUpload(e, null, showHeroModal, 'hero');
                             else if (showAboutModal) handleImageUpload(e, null, null, 'about');
                             else if (showCategoryModal) handleImageUpload(e, null, showCategoryModal, 'category');
                             else if (showInfoModal !== null) handleImageUpload(e, null, showInfoModal, 'info');
                         }} />
                         <label htmlFor="content-upload" className="drop-label">
                           <Upload size={32} /> <span>{loading ? "Uploading..." : "Click or Drop Image"}</span>
                         </label>
                       </div>
                     ) : (
                       <div className="url-form">
                          <div className="form-item">
                            <label className="form-label">Image URL</label>
                            <input className="form-control" value={tempData.src} onChange={(e) => setTempData(prev => ({ ...prev, src: e.target.value }))} />
                          </div>
                          {showInfoModal === null && <div className="form-item">
                            <label className="form-label">Link URL (Optional)</label>
                            <input className="form-control" value={tempData.link} onChange={(e) => setTempData(prev => ({ ...prev, link: e.target.value }))} />
                          </div>}
                       </div>
                     )}
                     <div className="url-form mt-3">
                        {showInfoModal !== null ? (
                          <div className="form-item"><label className="form-label">Ticker Text</label><input className="form-control" value={tempData.text} onChange={(e) => setTempData(prev => ({ ...prev, text: e.target.value }))} /></div>
                        ) : null}
                     </div>
                   </div>

                   <div className="modal-actions">
                      <button className="btn btn-primary" disabled={loading || (tempData.src && tempData.src.startsWith('blob:'))} onClick={() => {
                          if (showHeroModal !== null) {
                              const updated = [...heroSlider];
                              updated[showHeroModal] = { ...updated[showHeroModal], src: tempData.src, link: tempData.link };
                              setHeroSlider(updated);
                              setShowHeroModal(null);
                          } else if (showAboutModal) {
                              setAboutData({ ...aboutData, src: tempData.src, link: tempData.link });
                              setShowAboutModal(false);
                          } else if (showCategoryModal) {
                              const { col, idx } = showCategoryModal;
                              const updated = {...categories};
                              updated[col][idx] = { ...updated[col][idx], src: tempData.src, link: tempData.link };
                              setCategories(updated);
                              setShowCategoryModal(null);
                          } else if (showInfoModal !== null) {
                              const updated = [...infoBar];
                              updated[showInfoModal] = { ...updated[showInfoModal], src: tempData.src, text: tempData.text };
                              setInfoBar(updated);
                              setShowInfoModal(null);
                          }
                      }}>
                        {loading ? "Uploading..." : "Apply Changes"}
                      </button>
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