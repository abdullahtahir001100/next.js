"use client";
import React, { useState, useEffect } from 'react';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', comment: '' });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ visible: false, type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  }, []);

  // Noticeable Popup Controller
  const triggerPopup = (type, message) => {
    setPopup({ visible: true, type, message });
    setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 4000);
  };

  // Manual JS Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = `${settings?.labelName || 'Name'} is required`;
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.comment.trim()) newErrors.comment = "Message/Comment cannot be empty";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    if (!validate()) {
      triggerPopup('error', 'Please check the form for errors.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        triggerPopup('success', 'Thank you! Your message has been sent.');
        setFormData({ name: '', phone: '', email: '', comment: '' });
      } else {
        throw new Error();
      }
    } catch (err) {
      triggerPopup('error', 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!settings) return <div className="loading-state">Loading Viking Armory...</div>;

  return (
    <main>
      {/* --- PREMIUM NOTICEABLE POPUP --- */}
      {popup.visible && (
        <div className={`vab-toast-wrapper ${popup.type}`}>
          <div className="vab-toast-icon">
            {popup.type === 'success' ? (
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
          <div className="vab-toast-text">
            <strong>{popup.type === 'success' ? 'Sent' : 'Error'}</strong>
            <p>{popup.message}</p>
          </div>
          <div className="vab-toast-loader"></div>
        </div>
      )}

      <div className="contact-page">
        <section className="map-container">
          <iframe src={settings.mapUrl} allowFullScreen="" loading="lazy"></iframe>
        </section>

        <section className='fff'>
          <div className="container">
            <div className="breadcrumb">
              {settings.breadcrumbHome} <span> &gt; {settings.breadcrumbCurrent}</span>
            </div>

            <h1 className="contact-title">{settings.pageTitle}</h1>

            <div className="contact-grid">
              <div className="form-side">
                <p>{settings.formHeading} <br /> {settings.formSubheading}</p>
                
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label>{settings.labelName}</label>
                    <input 
                      type="text" 
                      className={errors.name ? 'input-error' : ''}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>{settings.labelPhone}</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>{settings.labelEmail} <span>*</span></label>
                    <input 
                      type="email" 
                      className={errors.email ? 'input-error' : ''}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>{settings.labelComment} <span>*</span></label>
                    <textarea 
                      className={errors.comment ? 'input-error' : ''}
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    ></textarea>
                    {errors.comment && <span className="field-error">{errors.comment}</span>}
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : settings.buttonText}
                  </button>
                </form>
              </div>

              <div className="info-side">
                <h2>{settings.infoHeading}</h2>
                <p>{settings.infoDescription}</p>

                <div className="contact-details">
                  <div className="detail-item">💬 Call: {settings.phoneText}</div>
                  <div className="detail-item">✉️ {settings.emailText}</div>
                  <div className="detail-item">📍 {settings.addressText}</div>
                </div>

                <div className="opening-hours">
                  <h4>{settings.hoursHeading}</h4>
                  <p>{settings.hoursMonSat}</p>
                  <p>{settings.hoursSun}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        /* Popup Styling */
        .vab-toast-wrapper {
          position: fixed;
          top: 30px;
          right: 30px;
          z-index: 10000;
          background: #fff;
          min-width: 300px;
          padding: 18px 25px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
          overflow: hidden;
          animation: slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .vab-toast-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .success .vab-toast-icon { background: #e6fffa; color: #38b2ac; }
        .error .vab-toast-icon { background: #fff5f5; color: #e53e3e; }
        .vab-toast-icon svg { width: 22px; height: 22px; }

        .vab-toast-text strong { display: block; font-size: 16px; margin-bottom: 2px; }
        .vab-toast-text p { margin: 0; font-size: 14px; color: #718096; }

        .vab-toast-loader {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          width: 100%;
          background: rgba(0,0,0,0.05);
        }

        .vab-toast-loader::after {
          content: '';
          position: absolute;
          height: 100%;
          background: currentColor;
          animation: loaderAnim 4s linear forwards;
        }

        /* Field Errors */
        .field-error {
          color: #e53e3e;
          font-size: 13px;
          font-weight: 600;
          margin-top: 5px;
          display: block;
          animation: fadeIn 0.3s ease;
        }

        .input-error {
          border: 2px solid #feb2b2 !important;
          background-color: #fff5f5 !important;
        }

        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes loaderAnim {
          from { width: 100%; }
          to { width: 0%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}