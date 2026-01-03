"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './armory-admin.scss';
import Bar from "../AdminLayout";
import VikingLoader from "../../components/VikingLoader";
// --- ICONS ---
const Icons = {
  Plus: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Cloud: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Link: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
  Save: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
  Warn: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Image: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

export default function ArmoryCMS() {
  const [data, setData] = useState(null);
  
  // MODAL LOGIC
  const [modalMode, setModalMode] = useState(null); // 'forge' | 'edit' | 'warn'
  const [activeItem, setActiveItem] = useState({ title: '', count: '', desc: '', image: '', link: '', btnText: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [imgInputMode, setImgInputMode] = useState('upload'); // 'upload' | 'url'
  
  // UI LOGIC
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/CollectionAdmin')
      .then(res => res.json())
      .then(setData)
      .catch(() => triggerToast("Failed to connect to DB."));
  }, []);

  const triggerToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3000);
  };

  const validateForm = () => {
    if (!activeItem.title?.trim()) { triggerToast("Title required!"); return false; }
    if (!activeItem.link?.trim()) { triggerToast("Link required!"); return false; }
    if (!activeItem.image?.trim()) { triggerToast("Image required!"); return false; }
    if (!activeItem.count?.trim()) { triggerToast("Product count required!"); return false; }
    if (!activeItem.btnText?.trim()) { triggerToast("Button Text required!"); return false; }
    if (!activeItem.desc?.trim()) { triggerToast("Description required!"); return false; }
    return true;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST', body: JSON.stringify({ fileUri: reader.result })
        });
        const result = await res.json();
        setActiveItem(prev => ({ ...prev, image: result.url }));
        triggerToast("Image Uploaded!");
      } catch { triggerToast("Upload Failed!"); } 
      finally { setUploading(false); }
    };
  };

  // ACTIONS
  const openForge = () => {
    setActiveItem({ title: '', count: '', desc: '', image: '', link: '', btnText: 'SHOP NOW' });
    setImgInputMode('upload');
    setModalMode('forge');
  };

  const openEdit = (item, index) => {
    setActiveItem({ ...item });
    setEditIndex(index);
    setImgInputMode('upload');
    setModalMode('edit');
  };

  const openWarn = (item, index) => {
    setActiveItem(item);
    setEditIndex(index);
    setModalMode('warn');
  };

  const confirmAction = () => {
    if (modalMode !== 'warn' && !validateForm()) return;

    if (modalMode === 'forge') {
      setData({ ...data, collections: [...data.collections, activeItem] });
      triggerToast("Item Forged!");
    } else if (modalMode === 'edit') {
      const updated = [...data.collections];
      updated[editIndex] = activeItem;
      setData({ ...data, collections: updated });
      triggerToast("Item Updated!");
    } else if (modalMode === 'warn') {
      const updated = data.collections.filter((_, i) => i !== editIndex);
      setData({ ...data, collections: updated });
      triggerToast("Item Deleted.");
    }
    setModalMode(null);
  };

  const handleSaveAll = async () => {
    try {
      const res = await fetch('/api/CollectionAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) triggerToast("Changes Synced Live!");
    } catch { triggerToast("Sync Failed!"); }
  };

  if (!data) return <div className="vab-admin-portal"><VikingLoader/></div>;

  return (

    <div className="vab-admin-portal">
      <Bar />
      <div className="vab-container">
        
        {/* --- TOAST --- */}
        <AnimatePresence>
          {toast.visible && (
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="vab-toast">
              {toast.msg}
              <motion.div className="progress" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DYNAMIC MODAL --- */}
        <AnimatePresence>
          {modalMode && (
            <div className="vab-overlay">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }}
                className={`vab-modal theme-${modalMode} ${modalMode !== 'warn' ? 'wide' : ''}`}
              >
                {/* HEADER */}
                <div className="modal-header">
                  <div className="icon-box">
                    {modalMode === 'forge' ? <Icons.Plus /> : modalMode === 'edit' ? <Icons.Edit /> : <Icons.Warn />}
                  </div>
                  <h2>
                    {modalMode === 'forge' ? 'Forge New Item' : modalMode === 'edit' ? 'Edit Details' : 'Confirm Action'}
                  </h2>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  {modalMode === 'warn' ? (
                    <p>Are you sure you want to delete <strong>{activeItem.title}</strong>? This action is permanent.</p>
                  ) : (
                    <div className="form-grid">
                      <div className="field">
                        <label>Title</label>
                        <input value={activeItem.title} onChange={e => setActiveItem({...activeItem, title: e.target.value})} placeholder="Item Title" />
                      </div>
                      <div className="field">
                        <label>Redirect Link</label>
                        <input value={activeItem.link} onChange={e => setActiveItem({...activeItem, link: e.target.value})} placeholder="/collections/swords" />
                      </div>
                      
                      {/* --- TABS & IMAGE INPUT --- */}
                      <div className="field full">
                        <label>Collection Image</label>
                        <div className="tabs-container">
                          <div className={`tab ${imgInputMode === 'upload' ? 'active' : ''}`} onClick={() => setImgInputMode('upload')}>Upload File</div>
                          <div className={`tab ${imgInputMode === 'url' ? 'active' : ''}`} onClick={() => setImgInputMode('url')}>Paste URL</div>
                        </div>

                        {imgInputMode === 'upload' ? (
                          <div className={`browse-zone ${uploading ? 'disabled' : ''}`} onClick={() => !uploading && document.getElementById('file-in').click()}>
                            {activeItem.image ? <img src={activeItem.image} alt="Preview" /> : (
                              <div className="placeholder">
                                {uploading ? <Icons.Cloud /> : <Icons.Image />}
                                <span>{uploading ? 'Uploading...' : 'Click to Upload'}</span>
                              </div>
                            )}
                            <input type="file" id="file-in" hidden onChange={handleUpload} />
                          </div>
                        ) : (
                          <input 
                            value={activeItem.image} 
                            onChange={e => setActiveItem({...activeItem, image: e.target.value})} 
                            placeholder="https://example.com/image.jpg" 
                          />
                        )}
                        {/* URL PREVIEW */}
                        {imgInputMode === 'url' && activeItem.image && (
                          <div className="browse-zone" style={{height:'100px', marginTop:'10px', cursor:'default'}}>
                             <img src={activeItem.image} alt="Preview" onError={(e) => e.target.style.display='none'} />
                          </div>
                        )}
                      </div>

                      <div className="field">
                        <label>Product Count</label>
                        <input value={activeItem.count} onChange={e => setActiveItem({...activeItem, count: e.target.value})} placeholder="e.g. 15 Products" />
                      </div>
                      <div className="field">
                        <label>Button Text</label>
                        <input value={activeItem.btnText} onChange={e => setActiveItem({...activeItem, btnText: e.target.value})} placeholder="SHOP NOW" />
                      </div>
                      <div className="field full">
                        <label>Description</label>
                        <textarea rows="3" value={activeItem.desc} onChange={e => setActiveItem({...activeItem, desc: e.target.value})} />
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button className="btn ghost" onClick={() => setModalMode(null)}>Cancel</button>
                  <button 
                    disabled={uploading} 
                    className={`btn ${modalMode === 'warn' ? 'danger' : 'primary'}`} 
                    onClick={confirmAction}
                  >
                    {modalMode === 'forge' ? 'Add Item' : modalMode === 'edit' ? 'Save Changes' : 'Yes, Delete'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <header className="vab-header">
          <h1>Armory CMS</h1>
          <button className="btn primary" onClick={openForge}><Icons.Plus /> Forge Collection</button>
        </header>

        {/* HERO SECTION */}
        <div className="vab-card">
          <div className="card-header">Hero Settings</div>
          <div className="card-content">
             <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px'}}>
               <div>
                 <label style={{display:'block', marginBottom:'8px', fontSize:'11px', fontWeight:700, color:'#64748b'}}>HERO TITLE</label>
                 <input value={data.hero.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'15px'}} />
               </div>
               <div>
                 <label style={{display:'block', marginBottom:'8px', fontSize:'11px', fontWeight:700, color:'#64748b'}}>BREADCRUMB TEXT</label>
                 <input value={data.hero.breadcrumb} onChange={e => setData({...data, hero: {...data.hero, breadcrumb: e.target.value}})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'15px'}} />
               </div>
             </div>
             <label style={{display:'block', marginBottom:'8px', fontSize:'11px', fontWeight:700, color:'#64748b'}}>DESCRIPTION</label>
             <textarea rows="2" value={data.hero.description} onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontFamily:'inherit'}} />
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="vab-card">
          <div className="card-header">Active Inventory</div>
          <table>
            <thead>
              <tr>
                <th width='20%'>Image</th>
                <th width='20%'>Title & Link</th>
                <th width='20%'>Count</th>
                <th width='20%'>Btn Text</th>
                <th width='20%'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.collections.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    {item.image ? <img src={item.image} className="thumb" alt="" /> : <span style={{fontSize:'10px', color:'#94a3b8'}}>N/A</span>}
                  </td>
                  <td>
                    <div className="row-title">{item.title}</div>
                    <div className="sub-text">{item.link}</div>
                  </td>
                  <td><span className="badge">{item.count}</span></td>
                  <td style={{fontSize:'13px', color:'#111'}}>{item.btnText}</td>
                  <td>
                    <div style={{display:'flex', gap:'10px'}}>
                      <button className="btn edit" onClick={() => openEdit(item, idx)}>
                        <Icons.Edit /> Edit
                      </button>
                      <button className="btn danger" onClick={() => openWarn(item, idx)}>
                        <Icons.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <button className="btn-fab" onClick={handleSaveAll} disabled={uploading}>
          <Icons.Save /> {uploading ? 'Wait...' : 'Sync Changes'}
        </button>
      </div>
    </div>
  );
}