"use client";
import React, { useState, useEffect } from 'react';
import Bar from "../AdminLayout";
import VikingLoader from "../../components/VikingLoader";

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
        errors[key] = "Required";
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    setValidationErrors({});
    if (!validateForm()) {
      showNotification('error', 'Form validation failed.');
      return;
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showNotification('success', 'All changes saved live!');
      } else {
        throw new Error();
      }
    } catch (err) {
      showNotification('error', 'Unable to reach the server.');
    }
  };

  if (loading) return <div className="admin-loader"><VikingLoader/></div>;

  return (
    <div className="admin-wrapper">
      <Bar />
      
      {/* --- RESPONSIVE TOAST --- */}
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
            <strong>{notification.type === 'success' ? 'Success' : 'Error'}</strong>
            <p>{notification.message}</p>
          </div>
          <div className="toast-progress"></div>
        </div>
      )}

      <header className="admin-header">
        <div className="header-info">
          <h1>Contact Editor</h1>
          <p>Modify site content in real-time</p>
        </div>
        <button className="save-btn" onClick={handleSave}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          SAVE
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
          padding: 20px;
          max-width: 1300px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          background: #fafafa;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .header-info h1 { margin: 0; font-size: 26px; font-weight: 800; }
        .header-info p { margin: 5px 0 0; color: #a0aec0; font-size: 14px; }

        .save-btn {
          background: #000;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.2s;
          width: 100%;
        }
          .save-btn svg{
          width:18px;
          }
        .admin-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        /* --- DESKTOP ADJUSTMENTS --- */
        @media (min-width: 768px) {
          .admin-wrapper { padding: 50px; }
          .admin-header { flex-direction: row; justify-content: space-between; align-items: flex-end; }
          .header-info h1 { font-size: 32px; }
          .save-btn { width: auto; }
          .admin-grid { grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 30px; }
        }

        /* --- NOTIFICATION STYLING --- */
        .vab-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          padding: 15px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          z-index: 10000;
          overflow: hidden;
          animation: slideIn 0.4s ease-out;
        }

        @media (min-width: 768px) {
          .vab-toast { left: auto; width: 320px; top: 30px; right: 30px; }
        }

        .toast-icon {
          width: 35px;
          height: 35px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .success .toast-icon { background: #e6fffa; color: #319795; }
        .error .toast-icon { background: #fff5f5; color: #e53e3e; }
        .toast-icon svg { width: 20px; height: 20px; }
        .toast-text strong { display: block; font-size: 15px; }
        .toast-text p { margin: 0; font-size: 13px; color: #718096; }

        .toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; background: rgba(0,0,0,0.05); }
        .toast-progress::after {
          content: '';
          position: absolute;
          height: 100%;
          background: currentColor;
          animation: progress 4s linear forwards;
        }
        .success .toast-progress::after { color: #38b2ac; }
        .error .toast-progress::after { color: #f56565; }

        /* --- INPUTS --- */
        .input-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4a5568;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: 0.2s;
        }

        .input-group input:focus { outline: none; border-color: #000; }
        .error-state input { border-color: #feb2b2; background: #fff5f5; }
        .field-error-msg { color: #e53e3e; font-size: 11px; font-weight: 600; margin-top: 4px; display: block; }

        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}