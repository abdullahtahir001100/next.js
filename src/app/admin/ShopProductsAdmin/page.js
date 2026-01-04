"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Bar from "../AdminLayout";
import { 
  Trash2, UploadCloud, Save, Link as LinkIcon, List, 
  PlusSquare, Settings, AlertTriangle, CheckCircle, Search, 
  X, Edit3, Eye, Package, Hammer, Ruler, Weight, ImageIcon, 
  Activity, Tag, AlignLeft, Info, Loader2
} from "lucide-react"; 
import "./Dashboard.scss";

// --- OPTIONS ---
const categoryOptions = [
  { value: "Swords", label: "Swords" },
  { value: "Axes", label: "Axes" },
  { value: "Knives & Daggers", label: "Knives & Daggers" },
  { value: "Spears & Polearms", label: "Spears & Polearms" },
  { value: "Chef Set", label: "Chef Set" },
  { value: "Hammers & Maces", label: "Hammers & Maces" },
  { value: "Shields & Armor", label: "Shields & Armor" },
  { value: "Display & Accessories", label: "Display & Accessories" },
];

const sectionOptions = [
  ...categoryOptions,
  { value: "best-seller", label: "Best Seller Section" },
  { value: "related", label: "Related Products" },
  { value: "none", label: "None" }
];

// --- CUSTOM NOTICEABLE POPUP ---
const NoticeablePopup = ({ t, type, message, icon: Icon, progress }) => {
  return (
    <div className={`custom-popup-box ${type}`}>
        
      <div className="popup-body">
        <div className="svg-icon-wrap">
          {Icon ? <Icon size={32} /> : <Info size={32} />}
        </div>
        <div className="content">
          <h4>{type.toUpperCase()}</h4>
          <p>{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="close-btn"><X size={14} /></button>
      </div>
      {progress !== undefined && (
        <div className="popup-progress-bar">
          <div className="fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

// --- IMAGE UPLOADER WITH WORKING PROGRESS BAR ---
const ImageUploader = ({ label, onUpload, value, multiple = false }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("upload");

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setLoading(true);
    let uploadedUrls = multiple ? [...(value || [])] : [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const filePromise = new Promise((resolve) => {
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          try {
            const res = await axios.post("/api/upload", {
              fileUri: reader.result,
              folder: "viking_armory_products"
            }, {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
              }
            });
            if (res.data.url) {
              multiple ? uploadedUrls.push(res.data.url) : (uploadedUrls = res.data.url);
            }
            resolve();
          } catch (err) {
            toast.error("Upload failed");
            resolve();
          }
        };
      });
      await filePromise;
    }
    onUpload(uploadedUrls);
    setLoading(false);
    setProgress(0);
    toast.success("Media Uploaded Successfully");
  };

  return (
    <div className="img-upload-field">
      <div className="label-row">
        <label>{label}</label>
        <div className="mode-tabs">
          <button type="button" className={mode === 'upload' ? 'active' : ''} onClick={() => setMode('upload')}>File</button>
          <button type="button" className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')}>URL</button>
        </div>
      </div>
      <div className={`upload-box ${loading ? 'is-loading' : ''}`}>
        {loading && <div className="inner-progress"><div className="bar" style={{width: `${progress}%`}}></div></div>}
        {!multiple && value ? (
          <div className="preview">
            <img src={value} alt="Preview" />
            <button type="button" className="remove-btn" onClick={() => onUpload("")}><X size={14} /></button>
          </div>
        ) : (
          <div className="upload-controls">
            {mode === 'upload' ? (
              <div className="placeholder">
                <input type="file" onChange={handleFileChange} accept="image/*" multiple={multiple} />
                <UploadCloud size={24} />
                <span>{loading ? `Uploading ${progress}%` : "Choose File"}</span>
              </div>
            ) : (
              <input type="text" placeholder="Image URL..." onBlur={(e) => {
                if(!e.target.value) return;
                multiple ? onUpload([...(value || []), e.target.value]) : onUpload(e.target.value);
                e.target.value = "";
              }} />
            )}
          </div>
        )}
      </div>
      {multiple && value?.length > 0 && (
        <div className="multi-preview-grid">
          {value.map((url, i) => (
            <div key={url + i} className="mini-thumb">
              <img src={url} alt="Gallery" />
              <button type="button" onClick={() => onUpload(value.filter((_, idx) => idx !== i))}><X size={10} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); 
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { register: regProd, handleSubmit: submitProd, control: ctrlProd, reset: resetProd, setValue: setProdVal, watch: watchProd } = useForm({
    defaultValues: { stock: 1, onSale: false, smallImages: [], sectionPath: "none", vendor: "Viking Armory Blades", click_count: 0, recentSales: "No Sales" }
  });

  const { register: regSec, handleSubmit: submitSec, control: ctrlSec, setValue: setSecValue, watch: watchSec } = useForm();
  const currentSectionData = watchSec();

  useEffect(() => { setMounted(true); fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoadingData(true);
    try {
      const res = await axios.get('/api/shopProducts?limit=100');
      if (res.data.success) setProducts(res.data.data);
    } catch (err) { toast.error("Fetch failed"); }
    finally { setLoadingData(false); }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.productId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const triggerErrorPopup = (message, icon) => {
    toast.custom((t) => (
      <NoticeablePopup t={t} type="error" message={message} icon={icon || AlertTriangle} progress={100} />
    ));
  };

  const onProductSubmit = async (data) => {
    if(!data.productId) return triggerErrorPopup("SKU ID is required", Tag);
    if(!data.name) return triggerErrorPopup("Name is required", Package);
    if(!data.price) return triggerErrorPopup("Price is required", Activity);
    if(!data.mainImage) return triggerErrorPopup("Main Image is required", ImageIcon);

    const actionToast = toast.custom((t) => (
      <NoticeablePopup t={t} type="processing" message="Saving to Database..." icon={Activity} progress={50} />
    ));

    try {
      const payload = { 
        ...data, 
        productType: data.productType?.value || data.productType, 
        sectionPath: data.sectionPath?.value || data.sectionPath 
      };
      
      if (editingId) {
        // FIXED: Using ?id= to match Backend GET/PUT/DELETE logic
        await axios.put(`/api/shopProducts?id=${editingId}`, payload);
        toast.dismiss(actionToast);
        toast.custom((t) => <NoticeablePopup t={t} type="success" message="Updated Successfully!" icon={CheckCircle} progress={100} />);
      } else {
        await axios.post('/api/shopProducts', payload);
        toast.dismiss(actionToast);
        toast.custom((t) => <NoticeablePopup t={t} type="success" message="Product Created!" icon={CheckCircle} progress={100} />);
      }
      resetProd(); setEditingId(null); fetchProducts(); setActiveTab("list");
    } catch (err) { 
      toast.dismiss(actionToast);
      triggerErrorPopup(err.response?.data?.error || "Error saving product");
    }
  };

  const handleEditRequest = (p) => {
    setEditingId(p._id);
    setProdVal("productId", p.productId);
    setProdVal("name", p.name);
    setProdVal("productType", categoryOptions.find(o => o.value === p.productType) || p.productType);
    setProdVal("vendor", p.vendor);
    setProdVal("price", p.price);
    setProdVal("salePrice", p.salePrice);
    setProdVal("onSale", p.onSale);
    setProdVal("stock", p.stock);
    setProdVal("mainImage", p.mainImage);
    setProdVal("hoverImage", p.hoverImage);
    setProdVal("smallImages", p.smallImages || []);
    setProdVal("sectionPath", sectionOptions.find(o => o.value === p.sectionPath) || p.sectionPath);
    setProdVal("description", p.description);
    setProdVal("bladeMaterial", p.bladeMaterial);
    setProdVal("handleMaterial", p.handleMaterial);
    setProdVal("overallLength", p.overallLength);
    setProdVal("bladeLength", p.bladeLength);
    setProdVal("weight", p.weight);
    setProdVal("recentSales", p.recentSales);
    setProdVal("click_count", p.click_count);
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="confirm-delete-popup">
        <Trash2 size={40} />
        <h3>Delete Blade?</h3>
        <p>This action is permanent.</p>
        <div className="confirm-btns">
          <button onClick={async () => {
             toast.dismiss(t.id);
             // FIXED: Using ?id= to match Backend logic
             await axios.delete(`/api/shopProducts?id=${id}`);
             toast.success("Deleted");
             fetchProducts();
          }}>Delete</button>
          <button onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ));
  };

  const onSectionSubmit = async (data) => {
    if(!data.sectionName) return triggerErrorPopup("Select a section");
    try {
      const payload = { ...data, sectionName: data.sectionName.value };
      await axios.post('/api/sections', payload);
      toast.success("UI Settings Updated");
    } catch (err) { triggerErrorPopup("Sync failed"); }
  };

  const handleSectionSelect = async (option) => {
    setSecValue("sectionName", option);
    try {
      const res = await axios.get(`/api/sections?name=${option.value}`);
      const data = res.data.data;
      setSecValue("mainTitle", data?.mainTitle || "");
      setSecValue("mainDescription", data?.mainDescription || "");
      setSecValue("mainPic", data?.mainPic || "");
    } catch (err) {}
  };

  if (!mounted) return null;

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />
      <Bar />
      <header className="dashboard-header">
        <div className="nav-tabs">
          <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}><List size={18} /> Inventory</button>
          <button className={activeTab === 'add' ? 'active' : ''} onClick={() => {setActiveTab('add'); if(!editingId) resetProd(); }}><PlusSquare size={18} /> {editingId ? "Edit" : "Add"}</button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><Settings size={18} /> Settings</button>
        </div>
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search sku or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </header>
      
      <main className="content-area">
        {activeTab === 'add' && (
            <div className="form-card animate-fade-in">
                <div className="card-top">
                    <h2>{editingId ? "Update Product" : "Forge New Entry"}</h2>
                </div>
                <form onSubmit={submitProd(onProductSubmit)} className="admin-form" noValidate>
                    <div className="form-layout-grid">
                      <div className="col-side">
                        <section className="form-sub-section">
                            <h3><Tag size={16}/> Identity</h3>
                            <div className="field"><label>SKU ID</label><input {...regProd("productId")} /></div>
                            <div className="field"><label>Name</label><input {...regProd("name")} /></div>
                            <div className="field"><label>Category</label>
                                <Controller name="productType" control={ctrlProd} render={({ field }) => (
                                  <Select {...field} options={categoryOptions} className="react-select" />
                                )}/>
                            </div>
                            <div className="field"><label>Vendor</label><input {...regProd("vendor")} /></div>
                        </section>
                        <section className="form-sub-section">
                            <h3><Hammer size={16}/> Specs</h3>
                            <div className="grid-2">
                                <div className="field"><label>Blade</label><input {...regProd("bladeMaterial")} /></div>
                                <div className="field"><label>Handle</label><input {...regProd("handleMaterial")} /></div>
                            </div>
                            <div className="grid-3">
                                <div className="field"><label>Overall</label><input {...regProd("overallLength")} /></div>
                                <div className="field"><label>Blade</label><input {...regProd("bladeLength")} /></div>
                                <div className="field"><label>Weight</label><input {...regProd("weight")} /></div>
                            </div>
                        </section>
                      </div>
                      <div className="col-side">
                        <section className="form-sub-section">
                            <h3>$ Pricing</h3>
                            <div className="grid-2">
                                <div className="field"><label>Price ($)</label><input {...regProd("price")} /></div>
                                <div className="field"><label>Sale ($)</label><input {...regProd("salePrice")} /></div>
                            </div>
                            <div className="grid-2">
                                <div className="field"><label>Stock</label><input type="number" {...regProd("stock")} /></div>
                                <div className="field checkbox-field">
                                    <label htmlFor="onSaleBadge">On Sale</label>
                                    <div className="svg-checkbox">
                                      <input type="checkbox" {...regProd("onSale")} id="onSaleBadge" />
                                      <div className="checkbox-visual">
                                        <CheckCircle className="check-icon" size={16} />
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="form-sub-section">
                            <h3><ImageIcon size={16}/> Gallery</h3>
                            <div className="grid-2">
                              <Controller name="mainImage" control={ctrlProd} render={({ field }) => (
                                  <ImageUploader label="Main" value={field.value} onUpload={(url) => field.onChange(url)} />
                              )}/>
                              <Controller name="hoverImage" control={ctrlProd} render={({ field }) => (
                                  <ImageUploader label="Hover" value={field.value} onUpload={(url) => field.onChange(url)} />
                              )}/>
                            </div>
                            <Controller name="smallImages" control={ctrlProd} render={({ field }) => (
                                <ImageUploader label="Gallery (smallImages)" multiple value={field.value} onUpload={(urls) => field.onChange(urls)} />
                            )}/>
                        </section>
                      </div>
                    </div>
                    <div className="form-wide-section">
                        <div className="field"><label>Description</label><textarea {...regProd("description")} rows="4" /></div>
                        <div className="grid-3">
                            <div className="field"><label>Section</label>
                                <Controller name="sectionPath" control={ctrlProd} render={({ field }) => (<Select {...field} options={sectionOptions} />)}/>
                            </div>
                            <div className="field"><label>Sales Note</label><input {...regProd("recentSales")} /></div>
                            <div className="field"><label>Clicks</label><input type="number" {...regProd("click_count")} /></div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-save"><Save size={18} /> {editingId ? "Update Armory" : "Save Entry"}</button>
                        {editingId && <button type="button" onClick={() => {setEditingId(null); resetProd();}} className="btn-cancel">Cancel Edit</button>}
                    </div>
                </form>
            </div>
        )}

        {activeTab === 'list' && (
            <div className="list-card animate-fade-in">
                {loadingData ? (
                  <div className="loader-container">
                    <Loader2 className="spinner" size={40} />
                    <p>Fetching Armory...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="no-products">
                    <Package size={60} />
                    <h3>No Products Found</h3>
                    <p>Try adjusting your search or add a new blade.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Item</th><th>Name</th><th>SKU</th><th>Price</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                             {filteredProducts.map(p => (
                                <tr key={p._id}>
                                    <td><img src={p.mainImage} className="row-img" alt="viking" /></td>
                                    <td><div className="row-name">{p.name}</div></td>
                                    <td><code>{p.productId}</code></td>
                                    <td><strong>${p.price}</strong></td>
                                    <td>
                                        <div className="action-row">
                                          <button onClick={() => handleEditRequest(p)} className="edit-btn"><Edit3 size={16} /></button>
                                          <button onClick={() => handleDelete(p._id)} className="del-btn"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="settings-grid animate-fade-in">
                <div className="form-card">
                    <form onSubmit={submitSec(onSectionSubmit)} className="admin-form" noValidate>
                        <div className="field">
                            <label>Target Section</label>
                            <Controller name="sectionName" control={ctrlSec} render={({ field }) => (
                                <Select {...field} options={sectionOptions} onChange={(val) => { field.onChange(val); handleSectionSelect(val); }} />
                            )}/>
                        </div>
                        <Controller name="mainPic" control={ctrlSec} render={({ field }) => (
                            <ImageUploader label="Banner Image" value={field.value} onUpload={(url) => field.onChange(url)} />
                        )}/>
                        <div className="field"><label>Title</label><input {...regSec("mainTitle")} /></div>
                        <div className="field"><label>Description</label><textarea {...regSec("mainDescription")} rows="3" /></div>
                        <button type="submit" className="btn-save full">Update Banner</button>
                    </form>
                </div>
                <div className="preview-card hide-mobile">
                    <div className="banner-preview">
                        {currentSectionData?.mainPic ? (
                            <div className="preview-box" style={{backgroundImage: `url(${currentSectionData.mainPic})`}}>
                                <div className="overlay"><h1>{currentSectionData.mainTitle}</h1></div>
                            </div>
                        ) : <div className="preview-empty">Select category to preview</div>}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}