"use client";
import React, { useState, useEffect } from 'react';
import Bar from "../AdminLayout";

export default function AdminDashboard() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 4000);
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(settings).forEach(key => {
      if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;
      if (!settings[key] || settings[key].toString().trim() === "") {
        errors[key] = "This field is required";
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setValidationErrors({});
    if (!validateForm()) {
      showNotification('error', 'Form validation failed. Please check required fields.');
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showNotification('success', 'All changes saved to the live site!');
      } else {
        throw new Error();
      }
    } catch (err) {
      showNotification('error', 'Connection error: Unable to reach the server.');
    }
  };

  if (loading) return <div className="admin-loader">Initializing Dashboard...</div>;

  return (
    <div className="admin-wrapper">
      <Bar />
      {/* --- PREMIUM SVG NOTIFICATION POPUP --- */}
      {notification.visible && (
        <div className={`vab-toast ${notification.type}`}>
          <div className="toast-icon">
            {notification.type === 'success' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
          <div className="toast-text">
            <strong>{notification.type === 'success' ? 'Success' : 'Attention Needed'}</strong>
            <p>{notification.message}</p>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <header className="admin-header">
        <div className="header-info">
          <h1>Contact Page Editor</h1>
          <p>Modify site content in real-time</p>
        </div>
        <button className="save-btn" onClick={handleSave}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          SAVE CHANGES
        </button>
      </header>

      <div className="admin-grid">
        {Object.keys(settings).map((key) => {
          if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return null;
          const hasError = validationErrors[key];

          return (
            <div key={key} className={`input-group ${hasError ? 'error-state' : ''}`}>
              <label>{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={key}
                value={settings[key] || ''}
                onChange={(e) => setSettings({ ...settings, [e.target.name]: e.target.value })}
                placeholder={`Enter ${key}...`}
              />
              {hasError && <span className="field-error-msg">{validationErrors[key]}</span>}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .admin-wrapper {
          padding: 50px;
          max-width: 1300px;
          margin: 0 auto;
          font-family: 'Inter', -apple-system, sans-serif;
          background: #fafafa;
          min-height: 100vh;
        }

        /* --- NOTIFICATION STYLING --- */
        .vab-toast {
          position: fixed;
          top: 30px;
          right: 30px;
          min-width: 320px;
          display: flex;
          align-items: center;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
          z-index: 10000;
          overflow: hidden;
          animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .toast-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .success .toast-icon { background: #e6fffa; color: #319795; }
        .error .toast-icon { background: #fff5f5; color: #e53e3e; }
        
        .toast-icon svg { width: 22px; height: 22px; }

        .toast-text strong { display: block; font-size: 16px; margin-bottom: 2px; }
        .toast-text p { margin: 0; font-size: 14px; color: #718096; }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: rgba(0,0,0,0.05);
        }

        .toast-progress::after {
          content: '';
          position: absolute;
          height: 100%;
          background: currentColor;
          animation: progress 4s linear forwards;
        }

        .success .toast-progress::after { color: #38b2ac; }
        .error .toast-progress::after { color: #f56565; }

        /* --- DASHBOARD UI --- */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .header-info h1 { margin: 0; font-size: 32px; font-weight: 800; }
        .header-info p { margin: 5px 0 0; color: #a0aec0; }

        .save-btn {
          background: #000;
          color: #fff;
          padding: 14px 28px;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        }
          .save-btn svg{
          width: 32px;
          height: 100%  !important;
          }
        .save-btn:hover { background: #333; transform: translateY(-2px); }
        .btn-icon { width: 18px; height: 18px; }

        .admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 30px;
        }

        .input-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4a5568;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .input-group input {
          width: 100%;
          padding: 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .input-group input:focus { outline: none; border-color: #000; background: #fff; }

        .error-state input { border-color: #feb2b2; background: #fff5f5; }
        .field-error-msg { color: #e53e3e; font-size: 12px; font-weight: 600; margin-top: 6px; display: block; }

        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}