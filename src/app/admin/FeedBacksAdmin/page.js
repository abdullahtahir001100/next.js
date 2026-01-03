"use client";
import React, { useState, useEffect } from 'react';
import Select from 'react-select'; 
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf'; // Professional PDF Library
import './feedback.scss';
import Bar from "../AdminLayout";

export default function FeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Real-time Search State
  
  // Custom Popup & Modal States (Zero Browser Defaults)
  const [toast, setToast] = useState({ visible: false, type: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, title: '', onConfirm: null });

  useEffect(() => { fetchFeedbacks(); }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setFeedbacks(data);
      setLoading(false);
    } catch (err) {
      triggerToast('error', 'Failed to load inquiries from server');
    }
  };

  const triggerToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const showConfirm = (title, action) => {
    setConfirmModal({ visible: true, title, onConfirm: action });
  };

  // Professional PDF Generation Logic
  const generatePDF = (item) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo Primary
    doc.text("VIKING ARMORY - INQUIRY REPORT", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date}`, 20, 30);
    doc.line(20, 35, 190, 35); // Horizontal line

    doc.setTextColor(0);
    doc.text(`Inquiry ID: #${item.inquiryId}`, 20, 50);
    doc.text(`Customer Name: ${item.name}`, 20, 60);
    doc.text(`Email: ${item.email}`, 20, 70);
    doc.text(`Phone: ${item.phone}`, 20, 80);
    doc.text(`Status: ${item.status}`, 20, 90);

    doc.setFont("helvetica", "bold");
    doc.text("Customer Message:", 20, 110);
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(item.comment, 170);
    doc.text(splitText, 20, 120);

    doc.save(`Inquiry_${item.inquiryId}.pdf`);
    triggerToast('success', 'PDF Report generated successfully');
  };

  const validate = () => {
    let errs = {};
    if (!selectedItem.name?.trim()) errs.name = "Name is required";
    if (!selectedItem.email?.trim()) errs.email = "Email is required";
    if (!selectedItem.phone?.trim()) errs.phone = "Phone is required";
    if (!selectedItem.comment?.trim()) errs.comment = "Message cannot be empty";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      triggerToast('error', 'Validation failed. Check fields.');
      return;
    }
    const res = await fetch('/api/inquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedItem),
    });
    if (res.ok) {
      triggerToast('success', 'Inquiry updated successfully');
      setViewMode('list');
      fetchFeedbacks();
    }
    setConfirmModal({ visible: false });
  };

  const deleteRecord = async (id) => {
    const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
        triggerToast('success', 'Record removed from database');
        fetchFeedbacks();
    }
    setConfirmModal({ visible: false });
  };

  // Real-time Filtering Logic
  const filteredFeedbacks = feedbacks.filter(fb => {
    const query = searchQuery.toLowerCase();
    return (
      fb.name?.toLowerCase().includes(query) ||
      fb.email?.toLowerCase().includes(query) ||
      fb.phone?.toLowerCase().includes(query) ||
      fb.inquiryId?.toString().toLowerCase().includes(query)
    );
  });

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '12px',
      padding: '2px',
      borderColor: '#e2e8f0',
      boxShadow: 'none',
      '&:hover': { borderColor: '#4f46e5' }
    })
  };

  if (loading) return <div className="loader-container">Initializing Dashboard...</div>;

  return (
    <div className="vab-admin-main">
      <Bar />
      {/* 1. CUSTOM JS CONFIRMATION POPUP */}
      <AnimatePresence>
        {confirmModal.visible && (
          <div className="vab-modal-overlay">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="vab-confirm-card">
              <div className="confirm-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3>Action Confirmation</h3>
              <p>{confirmModal.title}</p>
              <div className="confirm-actions">
                <button className="btn-cancel" onClick={() => setConfirmModal({ visible: false })}>Cancel</button>
                <button className="btn-proceed" onClick={confirmModal.onConfirm}>Confirm Action</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. NOTIFICATION TOAST */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`vab-toast-wrapper ${toast.type}`}>
            <div className="icon-area">
              {toast.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line></svg>
              )}
            </div>
            <div className="toast-info">
              <strong>{toast.type === 'success' ? 'Confirmed' : 'Attention'}</strong>
              <p>{toast.message}</p>
            </div>
            <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 4, ease: "linear" }} className="progress-bar-line" />
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === 'list' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="view-list">
          <header className="dash-header">
            <div className="header-left">
                <h1>Customer Feedbacks</h1>
                <p>Manage inquiries and contact users directly</p>
            </div>
            
            {/* Real-time Search Box */}
            <div className="search-container">
                <div className="search-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        placeholder="Search by Name, ID, Email or Phone..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </header>

          <div className="data-card">
            <table className="vab-table">
              <thead>
                <tr>
                  <th className="start-corner">Ref ID</th>
                  <th>Customer Info</th>
                  <th>Quick Contact</th>
                  <th>Status</th>
                  <th className="end-corner">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((fb) => (
                    <tr key={fb._id} className="responsive-row">
                      <td className="start-corner" data-label="Ref ID"><span className="id-badge">#{fb.inquiryId}</span></td>
                      <td data-label="Customer">
                        <div className="user-meta">
                          <strong>{fb.name}</strong>
                          <span>{fb.email}</span>
                        </div>
                      </td>
                      <td data-label="Contact">
                          <div className="table-quick-links">
                              <button onClick={() => generatePDF(fb)} className="t-icon pdf" title="Download PDF">PDF</button>
                              <a href={`https://wa.me/${fb.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="t-icon wa" title="WhatsApp">
                                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                              </a>
                              <a href={`mailto:${fb.email}`} className="t-icon mail" title="Email">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                              </a>
                          </div>
                      </td>
                      <td data-label="Status">
                        <div className="status-badge-wrapper">
                          <span className={`pulse-dot ${fb.status === 'New' ? 'active' : ''}`}></span>
                          <span className="status-text">{fb.status}</span>
                        </div>
                      </td>
                      <td className="end-corner" data-label="Action">
                        <div className="select-box-wrap">
                          <Select 
                              styles={selectStyles}
                              placeholder="Manage"
                              options={[
                              { value: 'edit', label: 'View / Edit' },
                              { value: 'delete', label: 'Delete Record' }
                              ]}
                              onChange={(opt) => {
                                  if (opt.value === 'edit') { setSelectedItem({...fb}); setViewMode('edit'); }
                                  if (opt.value === 'delete') showConfirm("Remove this client record forever?", () => deleteRecord(fb._id));
                              }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">No inquiries match your search criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        /* FULL SCREEN EDIT TAB */
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} className="edit-view-screen">
          <div className="edit-container">
            <button className="back-link-btn" onClick={() => setViewMode('list')}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
               Back to Feedbacks
            </button>

            <div className="edit-card-content">
              <div className="card-header">
                <div>
                    <h2>Edit Inquiry Details</h2>
                    <span>ID: #{selectedItem.inquiryId}</span>
                </div>
                 <div className="header-quick-actions">
                    <button onClick={() => generatePDF(selectedItem)} className="q-link pdf">Download Report</button>
                     <a href={`https://wa.me/${selectedItem.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="q-link wa">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.63 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                    <a href={`mailto:${selectedItem.email}`} className="q-link mail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Email Client
                    </a>
                </div>
              </div>

              <div className="edit-form">
                <div className="form-row">
                  <div className="field-group">
                    <label>Client Name</label>
                    <input value={selectedItem.name} className={errors.name ? 'error-border' : ''} onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})} />
                    {errors.name && <p className="err-hint">{errors.name}</p>}
                  </div>
                  <div className="field-group">
                    <label>Phone Number</label>
                    <input type="tel" value={selectedItem.phone} className={errors.phone ? 'error-border' : ''} onChange={(e) => setSelectedItem({...selectedItem, phone: e.target.value})} />
                    {errors.phone && <p className="err-hint">{errors.phone}</p>}
                  </div>
                </div>

                <div className="form-row">
                    <div className="field-group">
                        <label>Email Address</label>
                        <input value={selectedItem.email} className={errors.email ? 'error-border' : ''} onChange={(e) => setSelectedItem({...selectedItem, email: e.target.value})} />
                        {errors.email && <p className="err-hint">{errors.email}</p>}
                    </div>
                    <div className="field-group">
                        <label>Process Status</label>
                        <Select 
                            styles={selectStyles}
                            value={{ value: selectedItem.status, label: selectedItem.status }}
                            options={[
                                { value: 'New', label: 'New / Pending' },
                                { value: 'Replied', label: 'Replied / Resolved' },
                                { value: 'Archived', label: 'Archived' }
                            ]}
                            onChange={(opt) => setSelectedItem({...selectedItem, status: opt.value})}
                        />
                    </div>
                </div>

                <div className="field-group full-width">
                  <label>Customer Message</label>
                  <textarea value={selectedItem.comment} className={errors.comment ? 'error-border' : ''} onChange={(e) => setSelectedItem({...selectedItem, comment: e.target.value})} />
                  {errors.comment && <p className="err-hint">{errors.comment}</p>}
                </div>

                <div className="form-footer">
                  <button className="update-btn" onClick={() => showConfirm("Save all changes to this record?", handleUpdate)}>Save Inquiry Record</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}