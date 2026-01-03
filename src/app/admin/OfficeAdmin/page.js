"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import mammoth from 'mammoth'; 
import './dashboard.scss';
import 'react-quill-new/dist/quill.snow.css';
import Bar from "../AdminLayout";
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="o365-boot-screen">
    <div className="boot-logo">V</div>
    <div className="boot-text">Opening Viking Armory Cloud...</div>
  </div>
});

const TABS = [
  { name: 'About Page', slug: 'about' },
  { name: 'Whitelist', slug: 'whitelist' },
  { name: 'Contact', slug: 'contact' },
  { name: 'General Conditions', slug: 'general-conditions' },
  { name: 'Return & Refund', slug: 'return-refund' },
  { name: 'Shipping & Delivery', slug: 'shipping-delivery' }
];

export default function VikingOfficeUltimate() {
  const [activeTab, setActiveTab] = useState('about');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: '' });
  const [modal, setModal] = useState({ show: false, title: '' });
  const fileInputRef = useRef(null);

  // --- Fetch Logic ---
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/content_all?slug=${activeTab}`);
      const data = await res.json();
      if (data && data.files?.length > 0) {
        const html = data.files.find(f => f.language === 'html');
        setContent(html?.value || '');
      } else {
        setContent('');
      }
    } catch (err) {
      showToast("Cloud sync failed", "error");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- DOCX / File Upload Logic ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();

    try {
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setContent(result.value);
        showToast("DOCX imported!", "success");
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target.result);
          showToast("File imported!", "success");
        };
        reader.readAsText(file);
      }
      setModal({ show: false });
    } catch (err) {
      showToast("File processing failed", "error");
    }
  };

  // --- Deployment Logic ---
  const handleDeploy = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/content_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: activeTab,
          files: [{ name: 'index.html', language: 'html', value: content }]
        }),
      });
      if (res.ok) showToast("Changes deployed to live site!", "success");
    } catch (err) {
      showToast("Deployment Error", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false }), 4000);
  };

  const modules = {
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'], 
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ],
  };

  return (
    <div id="viking-dashboard-scope">
      <Bar />
      <div className="o365-container">
        {toast.show && (
          <div className={`noticeable-alert ${toast.type}`}>
            <div className="alert-content">
              <span className="icon">{toast.type === 'success' ? '✓' : '✕'}</span>
              {toast.msg}
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {modal.show && (
          <div className="modern-modal-overlay">
            <div className="modern-modal-card">
              <div className="modal-top">
                <h3>{modal.title}</h3>
                <button onClick={() => setModal({ show: false })}>×</button>
              </div>
              <div className="modal-mid">
                <div className="upload-wrapper">
                  <span className="big-icon">📄</span>
                  <p>Accepts <strong>.docx, .html, .txt</strong></p>
                  <button className="upload-cta" onClick={() => fileInputRef.current.click()}>Select File</button>
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept=".docx,.html,.txt" />
                </div>
              </div>
            </div>
          </div>
        )}

        <header className="o365-system-bar">
          <div className="left-group">
            <div className="w-icon">W</div>
            <span className="doc-title">{activeTab.toUpperCase()} - Word for Web</span>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Search for tools (Alt + Q)" />
          </div>
          <div className="right-group">
            <button className="import-btn" onClick={() => setModal({ show: true, title: 'Import Document' })}>Import</button>
            <button className="deploy-cta" onClick={handleDeploy}>
              {isSyncing ? "Syncing..." : "Share & Deploy"}
            </button>
            <div className="user-profile">AT</div>
          </div>
        </header>

        <div className="o365-ribbon">
          <nav className="ribbon-tabs">
            <span className="active">Home</span>
            <span>Insert</span>
            <span>Layout</span>
            <span>References</span>
            <span>Review</span>
            <span>View</span>
          </nav>
          
          <div className="quick-nav">
            <div className="nav-label">PAGES:</div>
            {TABS.map(t => (
              <button 
                key={t.slug} 
                className={activeTab === t.slug ? 'active' : ''} 
                onClick={() => setActiveTab(t.slug)}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <main className="o365-workspace">
          <div className="sheet-scroller">
            {loading ? (
              <div className="page-skeleton">
                <div className="skeleton-header"></div>
                <div className="skeleton-body"></div>
              </div>
            ) : (
              <div className="a4-sheet-container">
                <ReactQuill 
                  key={activeTab}
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules} 
                  placeholder="Draft your document..."
                />
              </div>
            )}
          </div>
        </main>

        <footer className="o365-status-bar">
          <div className="s-left">Page 1 of 1 | English (US)</div>
          <div className="s-right">Viking Armory Pro | 100% Zoom</div>
        </footer>
      </div>
    </div>
  );
}