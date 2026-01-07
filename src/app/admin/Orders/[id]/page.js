"use client";
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Select from "react-select";
import { 
  ChevronLeft, Calendar, User, Mail, Phone, MapPin, 
  CreditCard, Truck, AlertTriangle, Trash2, CheckCircle, 
  X, RefreshCcw, SearchX, ShieldCheck, MessageCircle, Lock
} from "lucide-react";
import "./order-details.scss";

// --- CUSTOM POPUP COMPONENT ---
const Popup = ({ show, type, title, message, onConfirm, onCancel, progress }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-box ${type}`}>
        {/* ICONS */}
        <div className="icon-wrapper">
          {type === 'success' && <CheckCircle size={40} />}
          {type === 'error' && <X size={40} />}
          {type === 'confirm' && <AlertTriangle size={40} />}
          {type === 'loading' && <RefreshCcw size={40} className="spin" />}
          {type === 'locked' && <Lock size={40} />}
        </div>

        {/* CONTENT */}
        <div className="popup-content">
          <h3>{title}</h3>
          <p>{message}</p>
          
          {/* PROGRESS BAR (Only for loading/processing) */}
          {type === 'loading' && (
             <div className="progress-container">
               <div className="progress-bar" style={{ width: `${progress}%` }}></div>
             </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="popup-actions">
          {type === 'confirm' && (
            <>
              <button className="btn-cancel" onClick={onCancel}>Cancel</button>
              <button className="btn-confirm-delete" onClick={onConfirm}>Yes, Delete</button>
            </>
          )}
          {(type === 'success' || type === 'error' || type === 'locked') && (
            <button className="btn-close" onClick={onCancel}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- STATUS OPTIONS ---
const STATUS_OPTIONS = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
];

export default function OrderDetails({ params }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id;
  const router = useRouter();

  // Data States
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // UI States
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  // Popup State
  const [popup, setPopup] = useState({ 
    show: false, 
    type: '', // success, error, confirm, loading, locked
    title: '', 
    message: '',
    progress: 0 
  });

  // --- FETCH DATA ---
  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/AllOrders/${orderId}`);
        if (data.success) {
          setOrder(data.order);
          
          // Set initial dropdown value only if status is valid for manual update
          const currentOpt = STATUS_OPTIONS.find(opt => opt.value === data.order.status);
          if (currentOpt) {
              setSelectedStatus(currentOpt);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // --- HELPER TO SIMULATE PROGRESS ---
  const simulateProgress = (callback) => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setPopup(prev => ({ ...prev, progress: prog }));
      if (prog >= 100) {
        clearInterval(interval);
        callback();
      }
    }, 150);
  };

  // --- HANDLERS ---
  const handleUpdateStatus = () => {
    if (!selectedStatus) return;

    // SECURITY CHECK: If Pending Payment, block action
    if (order.status === 'Pending Payment' || order.status === 'Payment Failed') {
        setPopup({ 
            show: true, type: 'locked', title: 'Action Locked', 
            message: 'You cannot update the status manually while payment is pending or failed.' 
        });
        return;
    }

    setPopup({ 
      show: true, type: 'loading', title: 'Updating Order...', 
      message: 'Please wait while we update the order status.', progress: 10 
    });

    simulateProgress(async () => {
      try {
        await axios.put(`/api/AllOrders/${orderId}`, { status: selectedStatus.value });
        setOrder(prev => ({ ...prev, status: selectedStatus.value }));
        
        setPopup({ 
          show: true, type: 'success', title: 'Success!', 
          message: `Order status has been updated to ${selectedStatus.label}.` 
        });
      } catch (err) {
        setPopup({ 
          show: true, type: 'error', title: 'Error', 
          message: 'Failed to update status. Please try again.' 
        });
      }
    });
  };

  const confirmDelete = () => {
    setPopup({ 
      show: true, type: 'confirm', title: 'Delete Order?', 
      message: 'This action is permanent and cannot be undone. Are you sure?',
      onConfirm: executeDelete 
    });
  };

  const executeDelete = () => {
    setPopup({ 
      show: true, type: 'loading', title: 'Deleting...', 
      message: 'Removing order from database.', progress: 10 
    });

    simulateProgress(async () => {
      try {
        await axios.delete(`/api/AllOrders/${orderId}`);
        router.push("/admin/Orders");
      } catch (err) {
        setPopup({ 
          show: true, type: 'error', title: 'Delete Failed', 
          message: 'Could not delete the order. Try again later.' 
        });
      }
    });
  };

  const closePopup = () => {
    setPopup({ ...popup, show: false });
  };

  // --- HELPERS FOR CONTACT LINKS ---
  const getWhatsAppLink = (phone) => {
      if (!phone) return '#';
      // Remove all non-numeric characters for the link
      const cleanNumber = phone.replace(/[^0-9]/g, ''); 
      return `https://wa.me/${cleanNumber}`;
  };

  // --- RENDER STATES ---
  if (loading) return <div className="state-screen"><div className="spinner"></div><p>Loading Order...</p></div>;
  
  if (error || !order) return (
    <div className="state-screen error">
       <div className="icon-box"><SearchX size={48} /></div>
       <h2>Order Not Found</h2>
       <p>The order <span>#{orderId}</span> does not exist.</p>
       <Link href="/admin/Orders" className="btn-primary"><ChevronLeft size={16}/> Back to Orders</Link>
    </div>
  );

  // Check if locked
  const isActionLocked = order.status === 'Pending Payment' || order.status === 'Payment Failed';

  // Format Status for Badge CSS class
  const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="order-details-page">
      <Popup 
        show={popup.show} 
        type={popup.type} 
        title={popup.title} 
        message={popup.message} 
        progress={popup.progress}
        onConfirm={popup.onConfirm}
        onCancel={closePopup}
      />

      <div className="top-nav">
        <Link href="/admin/Orders" className="back-btn">
          <ChevronLeft size={16} /> Back to Orders
        </Link>
        <div className="breadcrumb">Dashboard / Orders / Details</div>
      </div>

      <header className="page-header">
        <div className="left">
          <h1>Order Details</h1>
          <span className={`status-badge ${statusClass}`}>{order.status}</span>
        </div>
        <div className="right">
          <p>Order ID: <span>{order._id}</span></p>
          <p className="date-text">
             <Calendar size={14} /> 
             {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </header>

      <div className="details-grid">
        <div className="left-col">
          <section className="card timeline-card">
             <h3><RefreshCcw size={18}/> Order Timeline</h3>
             <div className="timeline">
                <div className={`step completed`}>
                   <div className="dot"></div>
                   <div className="info"><h4>Order Placed</h4><p>{new Date(order.createdAt).toLocaleString()}</p></div>
                </div>

                {/* SHOW IF PENDING PAYMENT */}
                {order.status === 'Pending Payment' && (
                     <div className="step warning">
                        <div className="dot"></div>
                        <div className="info"><h4>Pending Payment</h4><p>Customer has not paid yet.</p></div>
                     </div>
                )}
                {/* SHOW IF FAILED */}
                {order.status === 'Payment Failed' && (
                     <div className="step error">
                        <div className="dot"></div>
                        <div className="info"><h4>Payment Failed</h4><p>Transaction unsuccessful.</p></div>
                     </div>
                )}

                <div className={`step ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                   <div className="dot"></div>
                   <div className="info"><h4>Processing</h4><p>Order is being prepared.</p></div>
                </div>
                <div className={`step ${['Shipped', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                   <div className="dot"></div>
                   <div className="info"><h4>Shipped</h4><p>Package is in transit.</p></div>
                </div>
                <div className={`step ${order.status === 'Delivered' ? 'completed' : ''}`}>
                   <div className="dot"></div>
                   <div className="info"><h4>Delivered</h4><p>Package arrived at destination.</p></div>
                </div>
             </div>
          </section>

          <section className="card product-card">
            <h3><Truck size={18}/> Product Details</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="img-wrapper">
                    <Image src={item.image || "/placeholder.jpg"} width={60} height={60} alt={item.name} />
                  </div>
                  <div className="item-info"><h4>{item.name}</h4><p>Qty: {item.quantity}</p></div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card summary-card">
            <h3><ShieldCheck size={18}/> Payment & Summary</h3>
            <div className="summary-rows">
               <div className="row"><span>Subtotal</span><span>${order.financials.subtotal.toFixed(2)}</span></div>
               <div className="row"><span>Discount</span><span className="discount">-${order.financials.discount || 0}</span></div>
               <div className="row"><span>Shipping</span><span>${order.financials.shipping || 0}</span></div>
               <div className="row total"><span>Total Payable</span><span>${order.financials.total.toFixed(2)}</span></div>
               <div className="payment-method">
                  <span className="label">Payment Method:</span> 
                  <span className="method-tag">
                    {order.payment.method === 'stripe' ? <CreditCard size={14}/> : <Truck size={14}/>} 
                    {order.payment.method.toUpperCase()}
                  </span>
               </div>
               {/* PAYMENT STATUS EXTRA INFO */}
               <div style={{ marginTop: '10px', fontSize: '13px', display:'flex', justifyContent:'space-between' }}>
                    <span style={{color: '#6b7280'}}>Payment Status:</span>
                    <span style={{
                        fontWeight: 'bold', 
                        color: order.payment.status === 'paid' ? '#10b981' : '#f59e0b'
                    }}>
                        {order.payment.status ? order.payment.status.toUpperCase() : 'PENDING'}
                    </span>
               </div>
            </div>
          </section>
        </div>

        <div className="right-col">
          <section className="card customer-card">
             <h3><User size={18}/> Customer Info</h3>
             
             <div className="info-group">
                 <div className="icon"><User size={16}/></div>
                 <div>
                     <label>Name</label>
                     <p>{order.customer?.firstName || 'Guest'} {order.customer?.lastName || ''}</p>
                 </div>
             </div>
             
             {/* CLICKABLE EMAIL */}
             <div className="info-group">
                 <div className="icon"><Mail size={16}/></div>
                 <div>
                     <label>Email</label>
                     <a href={`mailto:${order.customer?.email}`} className="contact-link">
                        {order.customer?.email || 'N/A'}
                     </a>
                 </div>
             </div>
             
             {/* CLICKABLE PHONE & WHATSAPP */}
             <div className="info-group">
                 <div className="icon"><Phone size={16}/></div>
                 <div>
                     <label>Phone</label>
                     <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        <a href={`tel:${order.customer?.phone}`} className="contact-link">
                            {order.customer?.phone || 'N/A'}
                        </a>
                        {order.customer?.phone && (
                            <a 
                                href={getWhatsAppLink(order.customer?.phone)} 
                                target="_blank" 
                                className="whatsapp-btn"
                                title="Chat on WhatsApp"
                            >
                                <MessageCircle size={14} /> WhatsApp
                            </a>
                        )}
                     </div>
                 </div>
             </div>
             
             <div className="info-group">
                 <div className="icon"><MapPin size={16}/></div>
                 <div>
                     <label>Address</label>
                     <p>{order.shippingAddress?.address1}, {order.shippingAddress?.city}</p>
                 </div>
             </div>
             
             <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress?.address1 + " " + order.shippingAddress?.city)}`} target="_blank" className="map-link">View on Google Maps</a>
          </section>

          <section className={`card action-card ${isActionLocked ? 'locked' : ''}`}>
             <h3>
                {isActionLocked ? <Lock size={18}/> : <CheckCircle size={18}/>} 
                Update Status
             </h3>
             
             {isActionLocked ? (
                 <div className="locked-msg">
                     <AlertTriangle size={16} />
                     <p>Status updates are disabled because payment is <strong>{order.status}</strong>.</p>
                 </div>
             ) : (
                 <>
                    <div className="select-container">
                        <Select 
                            options={STATUS_OPTIONS} 
                            value={selectedStatus} 
                            onChange={setSelectedStatus} 
                            classNamePrefix="react-select" 
                        />
                    </div>
                    <button className="btn-update" onClick={handleUpdateStatus}>Apply New Status</button>
                 </>
             )}
          </section>

          <section className="card danger-card">
             <h3><AlertTriangle size={18}/> Danger Zone</h3>
             <p className="warning-text">This action is irreversible.</p>
             <button className="btn-delete" onClick={confirmDelete}><Trash2 size={16} /> Delete Order</button>
          </section>
        </div>
      </div>
    </div>
  );
}