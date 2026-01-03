"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './dashboard.scss';
import Bar from "../AdminLayout";
import { emmetHTML, emmetCSS } from 'emmet-monaco-es';

const TABS = [
  { name: 'About Page', slug: 'about' },
  { name: 'Whitelist', slug: 'whitelist' },
  { name: 'Contact', slug: 'contact' },
  { name: 'General Conditions', slug: 'general-conditions' },
  { name: 'Return & Refund', slug: 'return-refund' },
  { name: 'Shipping & Delivery', slug: 'shipping-delivery' }
];

// --- VS Code Style Professional SVGs ---
const SuccessSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const ErrorSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);

const InfoSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const TrashSVG = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff5f56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

export default function VSDashboard() {
  const [activeTab, setActiveTab] = useState('about');
  const [files, setFiles] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Custom UI States
  const [modal, setModal] = useState({ show: false, type: '', data: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [newFileName, setNewFileName] = useState('');

  const editorRef = useRef(null);
  const filesRef = useRef([]);

  useEffect(() => { filesRef.current = files; }, [files]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
  };

  // --- SAVE LOGIC (Har line ki fuzool indentation saaf karne ke liye) ---
  const handleSave = async (currentFiles = filesRef.current) => {
    const cleanedFiles = currentFiles.map(file => ({
      ...file,
      // Regex har line ke shuru ki tabs/spaces ko uda deta hai taaki frontend par alignment sahi rahe
      value: file.value.replace(/^\s+/gm, '').trim() 
    }));

    try {
      const res = await fetch('/api/content_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: activeTab, files: cleanedFiles }),
      });
      if (res.ok) {
        setFiles(cleanedFiles);
        showToast("Changes deployed to Viking Engine!", "success");
      }
    } catch (err) {
      showToast("Deployment failed. Check DB connection.", "error");
    }
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    emmetHTML(monaco);
    emmetCSS(monaco);

    // CTRL + S Shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave(filesRef.current);
    });

    monaco.languages.html.htmlDefaults.setOptions({
      suggest: { html5: true, selfClosingTagName: true },
      format: { tabSize: 2, insertSpaces: true }
    });

    editor.focus();
  }

  // --- DATA FETCHING ---
  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/content_all?slug=${activeTab}`);
        const data = await res.json();
        if (data && data.files?.length > 0) {
          setFiles(data.files);
        } else {
          setFiles([
            { name: 'index.html', language: 'html', value: '' },
            { name: 'style.css', language: 'css', value: '/* Styles */' }
          ]);
        }
        setActiveFileIndex(0);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    loadPageData();
  }, [activeTab]);

  const handleAddFile = () => {
    if (!newFileName) return;
    const ext = newFileName.split('.').pop();
    const lang = ext === 'css' ? 'css' : ext === 'js' ? 'javascript' : 'html';
    const updated = [...files, { name: newFileName, language: lang, value: '' }];
    setFiles(updated);
    setActiveFileIndex(updated.length - 1);
    setModal({ show: false, type: '', data: null });
    setNewFileName('');
    showToast(`File "${newFileName}" initialized.`, "success");
  };

  const confirmDeleteFile = async () => {
    const fileName = files[modal.data].name;
    const updated = files.filter((_, i) => i !== modal.data);
    setFiles(updated);
    setActiveFileIndex(0);
    setModal({ show: false, type: '', data: null });
    await handleSave(updated);
    showToast(`Asset "${fileName}" removed.`, "error");
  };

  const currentFile = files[activeFileIndex] || {};

  return (

    <div className="vs-container">
      <Bar />
      {/* --- NOTICEABLE TOAST SYSTEM --- */}
      {toast.show && (
        <div className={`vs-toast-fixed ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? <SuccessSVG /> : <ErrorSVG />}
          </div>
          <div className="toast-content">{toast.message}</div>
          <div className="toast-progress"></div>
        </div>
      )}

      {/* --- VS CODE STYLE MODALS --- */}
      {modal.show && (
        <div className="vs-modal-overlay">
          <div className="vs-modal-card">
            <div className="modal-icon-header">
              {modal.type === 'ADD' ? <InfoSVG /> : <TrashSVG />}
            </div>
            
            {modal.type === 'ADD' ? (
              <div className="modal-body">
                <h3>New Asset Creation</h3>
                <p>Enter the filename with extension (e.g., about.html, theme.css)</p>
                <input 
                  autoFocus 
                  placeholder="index.html"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFile()}
                />
                <div className="modal-actions">
                  <button className="confirm-btn" onClick={handleAddFile}>Create</button>
                  <button className="cancel-btn" onClick={() => setModal({ show: false })}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="modal-body">
                <h3 className="danger-text">Permanent Deletion?</h3>
                <p>Delete <b>{files[modal.data]?.name}</b>? This cannot be undone from the database.</p>
                <div className="modal-actions">
                  <button className="danger-btn" onClick={confirmDeleteFile}>Delete Asset</button>
                  <button className="cancel-btn" onClick={() => setModal({ show: false })}>Keep It</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="vs-navbar">
        <div className="brand">VIKING <span>STUDIO</span></div>
        <div className="tab-scroll">
          {TABS.map((t) => (
            <button key={t.slug} className={activeTab === t.slug ? 'active' : ''} onClick={() => setActiveTab(t.slug)}>
              {t.name}
            </button>
          ))}
        </div>
        <button className="save-btn" onClick={() => handleSave()}>
          Sync & Deploy
        </button>
      </nav>

      <div className="vs-body">
        {/* --- LEFT EXPLORER SIDEBAR --- */}
        <aside className="vs-sidebar">
          <div className="sidebar-header">
            <span>EXPLORER</span>
            <button className="add-file-trigger" onClick={() => setModal({ show: true, type: 'ADD' })} title="New File">+</button>
          </div>
          <div className="file-list">
            {files.map((file, i) => (
              <div key={i} className={`file-item ${activeFileIndex === i ? 'active' : ''}`} onClick={() => setActiveFileIndex(i)}>
                <span className={`file-icon ${file.language}`}></span>
                {file.name}
                <span className="close-icon" onClick={(e) => {
                  e.stopPropagation();
                  setModal({ show: true, type: 'DELETE', data: i });
                }}>×</span>
              </div>
            ))}
          </div>
        </aside>

        {/* --- MAIN EDITOR AREA --- */}
        <main className="vs-editor">
          <div className="editor-tab-indicator">
            {activeTab.toUpperCase()} &gt; {currentFile.name}
          </div>
          {loading ? (
            <div className="loader-box">Connecting to Repository...</div>
          ) : (
            <Editor
              height="calc(100vh - 85px)"
              theme="vs-dark"
              language={currentFile.language}
              value={currentFile.value}
              onMount={handleEditorDidMount}
              onChange={(val) => {
                const newFiles = [...files];
                if(newFiles[activeFileIndex]) {
                  newFiles[activeFileIndex].value = val;
                  setFiles(newFiles);
                }
              }}
              options={{ 
                fontSize: 16, 
                minimap: { enabled: true }, 
                autoClosingTags: true,
                fixedOverflowWidgets: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                acceptSuggestionOnEnter: "on"
              }}
            />
          )}
        </main>
      </div>

      {/* --- VS CODE STATUS BAR --- */}
      <footer className="vscode-footer">
        <div className="footer-left">
          <span>⟳ main*</span>
          <span>⊗ 0 ⚠ 0</span>
        </div>
        <div className="footer-right">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>{currentFile.language?.toUpperCase()}</span>
        </div>
      </footer>
    </div>
  );
}