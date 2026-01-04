"use client";
import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import L from "leaflet";
import axios from "axios";
import { Search, Truck, CreditCard, ShieldCheck, X, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const markerIcon = new L.Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [30, 30], iconAnchor: [15, 30] });

export default function CheckoutFormRedesign({ cartProducts, isCodOnly }) {
  const stripe = isCodOnly ? null : useStripe(); 
  const elements = isCodOnly ? null : useElements();

  const [method, setMethod] = useState(isCodOnly ? "cod" : "stripe");
  const [loading, setLoading] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [pos, setPos] = useState([31.5204, 74.3587]);
  const [formData, setFormData] = useState({
    email: "", phone: "",
    ship: { country: "US", firstName: "", lastName: "", address1: "", address2: "", city: "", state: "", zip: "" },
    billingSameAsShipping: true,
    saveInfo: false
  });

  const total = cartProducts.reduce((acc, i) => acc + (parseFloat(i.salePrice || i.price) * i.quantity), 0);

  const fetchAddress = async (lat, lon) => {
    try {
      const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const a = data.address;
      setFormData(p => ({ ...p, ship: { ...p.ship, address1: a.road || data.display_name.split(',')[0], city: a.city || a.town || "", zip: a.postcode || "" }}));
      setMapModal(false);
      toast.success("Location Pinpointed!");
    } catch (e) { toast.error("Could not fetch address"); }
  };

  function MapEvents() {
    useMapEvents({ click(e) { setPos([e.latlng.lat, e.latlng.lng]); fetchAddress(e.latlng.lat, e.latlng.lng); } });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        items: cartProducts.map(p => ({ id: p._id, quantity: p.quantity })),
        email: formData.email, phone: formData.phone,
        shippingAddress: formData.ship,
        billingSameAsShipping: formData.billingSameAsShipping,
        saveInfo: formData.saveInfo,
        paymentMethod: method
    };

    if (method === "cod") {
      try {
        const { data } = await axios.post("/api/checkout", payload);
        if (data.success) window.location.href = `/checkout/success?orderId=${data.orderId}`;
      } catch (err) { toast.error("Order failed"); }
    } else {
      if (!stripe || !elements) return;
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/checkout/success` },
      });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="vc-grid-container">
      <div className="vc-main-column">
        <h1 className="vc-logo">VIKING ARMORY</h1>
        <form onSubmit={handleSubmit}>
          <section className="vc-section">
            <h2 className="vc-title">Contact</h2>
            <input type="email" placeholder="Email" required className="vc-input" onChange={e=>setFormData({...formData, email: e.target.value})} />
            <PhoneInput country={'us'} value={formData.phone} onChange={p => setFormData({...formData, phone: p})} containerClass="vc-phone-container" />
          </section>

          <section className="vc-section">
            <h2 className="vc-title">Delivery</h2>
            <div className="vc-map-trigger" onClick={() => setMapModal(true)}>
                <Search size={18} /> Pin location on Map
            </div>
            <div className="vc-input-row">
                <Select placeholder="Country" options={Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode }))} onChange={v => setFormData({...formData, ship: {...formData.ship, country: v.value}})} />
            </div>
            <div className="vc-input-grid">
                <input type="text" placeholder="First Name" className="vc-input" onChange={e=>setFormData({...formData, ship: {...formData.ship, firstName: e.target.value}})} />
                <input type="text" placeholder="Last Name" className="vc-input" onChange={e=>setFormData({...formData, ship: {...formData.ship, lastName: e.target.value}})} />
            </div>
            <input type="text" value={formData.ship.address1} placeholder="Address" className="vc-input" readOnly />
            <div className="vc-input-grid triple">
                <Select placeholder="State" options={State.getStatesOfCountry(formData.ship.country).map(s => ({ label: s.name, value: s.isoCode }))} onChange={v => setFormData({...formData, ship: {...formData.ship, state: v.value}})} />
                <Select placeholder="City" options={City.getCitiesOfState(formData.ship.country, formData.ship.state).map(c => ({ label: c.name, value: c.name }))} onChange={v => setFormData({...formData, ship: {...formData.ship, city: v.value}})} />
                <input type="text" value={formData.ship.zip} placeholder="ZIP code" className="vc-input" />
            </div>
          </section>

          <section className="vc-section">
            <h2 className="vc-title">Payment</h2>
            <div className="vc-method-selector">
              {!isCodOnly && (
                <div className={`vc-option ${method === 'stripe' ? 'active' : ''}`} onClick={() => setMethod('stripe')}>
                  <CreditCard size={18} /> Card
                </div>
              )}
              <div className={`vc-option ${method === 'cod' ? 'active' : ''}`} onClick={() => setMethod('cod')}>
                <Truck size={18} /> Cash on Delivery
              </div>
            </div>
          </section>

          {method === "stripe" ? <PaymentElement /> : <div className="vc-cod-alert"><ShieldCheck size={20} /> Pay cash at delivery.</div>}

          <button type="submit" disabled={loading} className="vc-pay-button">
            {loading ? "Processing..." : "Complete Order"}
          </button>
        </form>
      </div>

      <aside className="vc-sidebar">
        <div className="vc-summary-sticky">
           {cartProducts.map(item => (
             <div key={item._id} className="vc-summary-item">
               <div className="img-wrap"><Image src={item.mainImage} alt={item.name} width={64} height={64} /><span className="badge">{item.quantity}</span></div>
               <p>{item.name}</p>
               <strong>${(parseFloat(item.salePrice || item.price) * item.quantity).toFixed(2)}</strong>
             </div>
           ))}
           <div className="vc-total-row"><span>Total</span><strong>USD ${total.toFixed(2)}</strong></div>
        </div>
      </aside>

      {mapModal && (
          <div className="vc-modal-overlay">
              <div className="vc-map-modal">
                  <div className="modal-header"><h3>Pin Arsenal Location</h3><X onClick={()=>setMapModal(false)} /></div>
                  <div className="map-container">
                    <MapContainer center={pos} zoom={13} style={{height: '100%'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pos} icon={markerIcon} /><MapEvents />
                    </MapContainer>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}