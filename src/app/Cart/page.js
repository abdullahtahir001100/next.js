"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { X, Minus, Plus, ShoppingBag, Info, PlusCircle, AlertTriangle } from "lucide-react";
import { gsap } from "gsap";
import "./cart.scss";

// Noticeable Popup (Standardized for your site)
const NoticeablePopup = ({ t, type, message }) => (
  <div className={`custom-popup-box ${type} animate-popup`}>
    <div className="popup-body">
      <div className="svg-icon-wrap"><Info size={24} /></div>
      <div className="content">
        <h4>{type === 'success' ? 'SYSTEM UPDATE' : 'ERROR'}</h4>
        <p>{message}</p>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="close-btn"><X size={14} /></button>
    </div>
  </div>
);

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetchCart();
  }, []);

  // Animate items on load
  useEffect(() => {
    if (items.length > 0) {
      gsap.from(".cart-item", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [loading]);

  const fetchCart = async () => {
    const local = JSON.parse(localStorage.getItem("cart") || "[]");
    if (local.length === 0) { setItems([]); setLoading(false); return; }
    try {
      const { data } = await axios.post("/api/cart", { ids: local.map(i => i.id) });
      setItems(data.map(p => ({ ...p, quantity: local.find(l => l.id === p._id)?.quantity || 1 })));
    } catch (e) {
      toast.custom((t) => <NoticeablePopup t={t} type="error" message="Failed to sync cart data." />);
    } finally { setLoading(false); }
  };

  const updateStorage = (newItems) => {
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems.map(i => ({ id: i._id, quantity: i.quantity }))));
  };

  const adjustQty = (id, delta) => {
    updateStorage(items.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const confirmRemove = (id) => {
    setConfirmDelete(id);
  };

  const handleRemove = () => {
    const itemToRemove = document.querySelector(`.cart-item[data-id="${confirmDelete}"]`);
    
    // GSAP Exit Animation
    gsap.to(itemToRemove, {
      height: 0,
      opacity: 0,
      padding: 0,
      margin: 0,
      duration: 0.4,
      onComplete: () => {
        const newItems = items.filter(i => i._id !== confirmDelete);
        updateStorage(newItems);
        setConfirmDelete(null);
        toast.custom((t) => <NoticeablePopup t={t} type="success" message="Removed from collection." />);
      }
    });
  };

  const subtotal = items.reduce((acc, i) => acc + (parseFloat(i.salePrice || i.price) * i.quantity), 0);

  if (loading) return null; // Use your existing FullPageLoader here

  // FULL SCREEN EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="empty-cart-fullscreen">
          <div className="icon-wrap"><ShoppingBag size={60} /></div>
          <h2>Your arsenal is empty</h2>
          <p>You haven't added any legendary blades to your collection yet. Browse our forge to get started.</p>
          <Link href="/"><button className="checkout-btn" style={{ width: 'auto', padding: '18px 60px' }}>Explore Weapons</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <Toaster position="top-right" />
      
      <div className="breadcrumb"><Link href="/">Home</Link> <span>&gt;</span> Your Cart</div>
      <h1 className="main-title">Your Cart</h1>

      <div className="cart-flex">
        {/* LEFT COLUMN: PRODUCT LIST */}
        <div className="cart-list" ref={listRef}>
          <div className="table-header">
            <span>Product</span><span>Price</span><span>Quantity</span><span>Total</span><span></span>
          </div>

          {items.map(item => (
            <div className="cart-item" key={item._id} data-id={item._id}>
              <div className="item-main">
                <Image src={item.mainImage} alt={item.name} width={80} height={80} />
                <h3>{item.name}</h3>
              </div>
              <div className="item-price" data-label="Price">
                <span className="current">${item.salePrice || item.price}</span>
              </div>
              <div className="qty-pill">
                <button onClick={() => adjustQty(item._id, -1)} aria-label="Decrease"><Minus size={14}/></button>
                <span>{item.quantity}</span>
                <button onClick={() => adjustQty(item._id, 1)} aria-label="Increase"><Plus size={14}/></button>
              </div>
              <div className="item-total" data-label="Total">
                ${(parseFloat(item.salePrice || item.price) * item.quantity).toFixed(2)}
              </div>
              <X className="remove-icon" size={18} onClick={() => confirmRemove(item._id)} />
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: STICKY SUMMARY */}
        <aside className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span className="label">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span className="label">Shipping Estimate <PlusCircle size={14}/></span>
          </div>
          <div className="summary-row bold">
            <span className="label">TOTAL:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="tax-note">Tax included and shipping calculated at checkout. Forge your legacy now.</p>
          
          <button className="checkout-btn"><Link href='/checkout'>Proceed To Checkout</Link></button>
          <Link href="/"><button className="continue-btn">Continue Shopping</button></Link>
        </aside>
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <AlertTriangle className="warn-icon" size={50} />
            <h3>Remove Weapon?</h3>
            <p>Are you sure you want to remove this blade from your selection? This action cannot be undone.</p>
            <div className="btn-group">
              <button className="cancel" onClick={() => setConfirmDelete(null)}>Keep Item</button>
              <button className="confirm" onClick={handleRemove}>Confirm Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}