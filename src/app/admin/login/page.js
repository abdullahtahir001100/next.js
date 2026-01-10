"use client";
import React, { useState, useEffect, useRef } from 'react';
import OtpInput from 'react-otp-input';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import './AuthPage.scss';

export default function AuthPage() {
  const [step, setStep] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [otp, setOtp] = useState('');
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const cardRef = useRef(null);
  const progressBarRef = useRef(null);

  const triggerPopup = (message, type = 'error') => {
    const id = Date.now();
    setPopups((prev) => [{ id, message, type }, ...prev].slice(0, 3));
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 3000);
  };

  useEffect(() => {
    popups.forEach((p) => {
      gsap.fromTo(`#bar-${p.id}`, { width: "100%" }, { width: "0%", duration: 3, ease: "none" });
      gsap.fromTo(`#popup-${p.id}`, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
    });
  }, [popups]);

  useEffect(() => {
    // Progress logic: Forgot(33%) -> OTP(66%) -> Reset(100%)
    if (step !== 'login' && progressBarRef.current) {
      const progressMap = { forgot: 33, otp: 66, reset: 100 };
      gsap.to(progressBarRef.current, { width: `${progressMap[step]}%`, duration: 0.4 });
    }
    gsap.fromTo(cardRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
  }, [step]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if(loading) return;
    setLoading(true);

    try {
      if (step === 'login') {
        const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (res.ok) {
          triggerPopup("Success! Redirecting...", "success");
          router.push('/admin/ShopProductsAdmin');
          setTimeout(() => { window.location.href = '/admin/ShopProductsAdmin'; }, 800);
        } else { triggerPopup(data.message); }
      } 
      else if (step === 'forgot') {
        const res = await fetch('/api/auth/otp', { method: 'POST', body: JSON.stringify({ email }) });
        if (res.ok) { triggerPopup("OTP Sent!", "success"); setStep('otp'); } 
        else { triggerPopup("Failed to send OTP"); }
      }
      else if (step === 'otp') {
        const res = await fetch('/api/auth/verify', { method: 'POST', body: JSON.stringify({ email, otp }) });
        if (res.ok) { setStep('reset'); } 
        else { triggerPopup("Invalid OTP!"); }
      }
      else if (step === 'reset') {
        if (password !== confirmPass) { setLoading(false); return triggerPopup("Passwords mismatch!"); }
        const res = await fetch('/api/auth/reset', { method: 'POST', body: JSON.stringify({ email, password }) });
        if (res.ok) { triggerPopup("Reset Successful!", "success"); setStep('login'); }
      }
    } catch (err) { triggerPopup("Network Error!"); }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="popup-container">
        {popups.map((p) => (
          <div key={p.id} id={`popup-${p.id}`} className={`popup-box ${p.type}`}>
            <span>{p.message}</span>
            <div className="popup-progress-bg"><div id={`bar-${p.id}`} className="inner-bar"></div></div>
          </div>
        ))}
      </div>

      <div className="auth-card" ref={cardRef}>
        {/* FIX: Sirf forgot flow mein progress bar show hogi */}
        {step !== 'login' && (
          <div className="main-step-progress">
            <div className="fill" ref={progressBarRef}></div>
          </div>
        )}

        <form onSubmit={handleAuthAction}>
          <h2>{step === 'login' ? 'Admin Access' : 'Security Check'}</h2>
          
          {step === 'login' && (
            <div className="form-fade">
              <div className="field-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email" />
              </div>
              <div className="field-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <p className="link-helper" onClick={()=>setStep('forgot')}>Forgot Password?</p>
            </div>
          )}

          {step === 'forgot' && (
            <div className="form-fade">
              <div className="field-group">
                <label>Authorized Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" />
              </div>
              <p className="link-helper center" onClick={()=>setStep('login')}>Back to Login</p>
            </div>
          )}

          {step === 'otp' && (
            <div className="otp-container">
              <p>Enter 6-digit verification code</p>
              <OtpInput 
                value={otp} 
                onChange={setOtp} 
                numInputs={6} 
                renderInput={(props)=><input {...props} className="otp-input-field" />}
                containerStyle="otp-wrapper"
              />
            </div>
          )}

          {step === 'reset' && (
            <div className="form-fade">
              <div className="field-group">
                <input type="password" placeholder="New Password" onChange={(e)=>setPassword(e.target.value)} />
              </div>
              <div className="field-group">
                <input type="password" placeholder="Confirm New Password" onChange={(e)=>setConfirmPass(e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className="btn-action" disabled={loading}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}