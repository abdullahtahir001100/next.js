"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { 
  MapPin, CheckCircle, AlertOctagon, Loader2, Globe, Layers, 
  AlertTriangle, CreditCard, Truck, Mountain, Moon, Sun, ChevronDown 
} from "lucide-react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// PLUGINS
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from "react-select";
import { Country, State, City } from "country-state-city";

// Best Practice: Use Env Variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWJkdWxsYWh0YWhpMDAxIiwiYSI6ImNtanpyaWt1YTBpb2EzZnM4Y25yYm13dzEifQ.EZowgonOckkEFvM4rwv-fA';

const MAP_STYLES = [
  { name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12', icon: <Sun size={14} /> },
  { name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12', icon: <Globe size={14} /> },
  { name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12', icon: <Mountain size={14} /> },
  { name: 'Dark Mode', url: 'mapbox://styles/mapbox/dark-v11', icon: <Moon size={14} /> },
];

export default function CheckoutForm({ cartItems, isCodFallback }) {
  // 1. DIRECT STRIPE HOOKS (Allowed because parent has <Elements>)
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(isCodFallback ? "cod" : "stripe");

  // Map State
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [currentStyleUrl, setCurrentStyleUrl] = useState('mapbox://styles/mapbox/streets-v12');
  const [showMapMenu, setShowMapMenu] = useState(false);

  // UI State
  const [popup, setPopup] = useState({ show: false, type: "", title: "", msg: "" });
  const [errors, setErrors] = useState({});

  // Form State
  const [form, setForm] = useState({
    email: "", phone: "",
    country: "US", firstName: "", lastName: "",
    address1: "", address2: "", city: "", state: "", zip: "",
    lat: -74.006, lng: 40.7128
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- LOCATION DATA MEMOIZED ---
  const countries = useMemo(() => Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);
  const states = useMemo(() => form.country ? State.getStatesOfCountry(form.country).map(s => ({ label: s.name, value: s.isoCode })) : [], [form.country]);
  const cities = useMemo(() => (form.country && form.state) ? City.getCitiesOfState(form.country, form.state).map(c => ({ label: c.name, value: c.name })) : [], [form.country, form.state]);

  // --- MAP INITIALIZATION ---
  useEffect(() => {
    if (map.current) return;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          initMap(pos.coords.longitude, pos.coords.latitude);
        }, () => {
          initMap(form.lng, form.lat); // Default fallback
        });
    } else {
        initMap(form.lng, form.lat);
    }

    function initMap(lng, lat) {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: currentStyleUrl,
            center: [lng, lat],
            zoom: 12
        });

        marker.current = new mapboxgl.Marker({ color: "#d32f2f", draggable: true })
            .setLngLat([lng, lat])
            .addTo(map.current);

        map.current.on('click', (e) => updateLocationFromMap(e.lngLat.lng, e.lngLat.lat));
        marker.current.on('dragend', () => {
            const lngLat = marker.current.getLngLat();
            updateLocationFromMap(lngLat.lng, lngLat.lat);
        });
    }
  }, []);

  // --- MAP HELPERS ---
  const updateLocationFromMap = async (lng, lat) => {
     if(marker.current) marker.current.setLngLat([lng, lat]);
     
     try {
       const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
       if (res.data.features.length > 0) {
         const place = res.data.features[0];
         const countryCtx = place.context?.find(c => c.id.includes('country'));
         const countryCode = countryCtx ? countryCtx.short_code.toUpperCase() : "US";
         
         // Attempt to auto-fill state/city based on context
         const stateCtx = place.context?.find(c => c.id.includes('region'));
         const cityCtx = place.context?.find(c => c.id.includes('place'));

         // Note: Mapbox state codes might not match isoCodes perfectly, but we try
         // Ideally, you would map Mapbox names to your `states` array here
         
         setForm(prev => ({ 
             ...prev, 
             address1: place.place_name.split(',')[0],
             country: countryCode,
             zip: place.context?.find(c => c.id.includes('postcode'))?.text || prev.zip,
             lat: lng, 
             lng: lat 
         }));
         
         if(errors.address1) setErrors(prev => ({...prev, address1: false}));
       }
     } catch(e) { console.error("Mapbox Geocoding Error:", e); }
  };

  const changeMapStyle = (styleUrl) => {
    if (!map.current) return;
    map.current.setStyle(styleUrl);
    setCurrentStyleUrl(styleUrl);
    setShowMapMenu(false);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
       const { latitude, longitude } = pos.coords;
       if(map.current) map.current.flyTo({ center: [longitude, latitude], zoom: 15 });
       updateLocationFromMap(longitude, latitude);
       setLoading(false);
    }, () => setLoading(false));
  };

  // --- VALIDATION & INPUT ---
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const required = ['email', 'phone', 'firstName', 'lastName', 'address1', 'country', 'state', 'city', 'zip'];
    
    required.forEach(field => {
        if(!form[field] || form[field].length < 1) newErrors[field] = true;
    });

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setPopup({ show: true, type: "error", title: "Missing Fields", msg: "Please fill in all highlighted fields." });
        isValid = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        setErrors({});
    }
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: false });
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (paymentMethod === 'stripe' && (!stripe || !elements)) {
        // Stripe hasn't loaded yet
        return;
    }

    setLoading(true);

    try {
        // 1. SAVE ORDER TO MONGODB
        const saveOrderRes = await axios.post("/api/checkout", {
            items: cartItems,
            customer: { email: form.email, phone: form.phone, firstName: form.firstName, lastName: form.lastName },
            address: form,
            paymentMethod
        });

        if (!saveOrderRes.data.success) throw new Error("Failed to create order record");

        const orderId = saveOrderRes.data.orderId;

        // 2. STRIPE PAYMENT
        if (paymentMethod === 'stripe') {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Redirects to success page on completion
                    return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
                    payment_method_data: {
                        billing_details: {
                            name: `${form.firstName} ${form.lastName}`,
                            email: form.email,
                            phone: form.phone,
                            address: { 
                                line1: form.address1, 
                                city: form.city, 
                                state: form.state, 
                                postal_code: form.zip, 
                                country: form.country 
                            }
                        }
                    }
                },
            });

            if (error) {
                setPopup({ show: true, type: "error", title: "Payment Failed", msg: error.message });
            }
        } 
        // 3. COD
        else {
             setPopup({ show: true, type: "success", title: "Order Confirmed", msg: `Order #${orderId.slice(-6).toUpperCase()} placed!` });
             // Redirect manually for COD
             setTimeout(() => window.location.href = `/checkout/success?orderId=${orderId}`, 2000);
        }

    } catch (err) {
        console.error(err);
        setPopup({ show: true, type: "error", title: "Order Error", msg: "Could not process order. Please try again." });
    } finally {
        setLoading(false);
    }
  };

  const getErrorStyle = (field) => errors[field] ? { borderColor: '#ef4444', borderWidth: '1px' } : {};

  return (
    <div className="checkout-layout">
      {/* LEFT COLUMN */}
      <div className="form-column">
        <div className="header-mobile-only"><div className="logo">VIKING ARMORY</div></div>

        {/* --- FORM START --- */}
        <form onSubmit={handleSubmit} noValidate>
          {/* CONTACT */}
          <section className="section-group">
            <div className="section-header">
              <h3>Contact</h3>
              <Link href="/login" className="login-link">Log in</Link>
            </div>
            
            <input 
                type="text" placeholder="Email" className="input-field" 
                value={form.email} onChange={e => handleInputChange('email', e.target.value)}
                style={getErrorStyle('email')}
            />
            
            <div style={{marginTop: '15px'}}>
               <PhoneInput 
                  country={'us'} value={form.phone} 
                  onChange={phone => handleInputChange('phone', phone)}
                  inputStyle={{ width:'100%', height:'45px', borderColor: errors.phone ? '#ef4444' : '#d9d9d9' }}
                  containerStyle={{width:'100%'}}
               />
            </div>
          </section>

          {/* DELIVERY & MAP */}
          <section className="section-group">
            <h3>Delivery Location</h3>
            
            <div className="map-wrapper" style={{position: 'relative', height: '300px', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e1e1e1'}}>
              <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
              
              {/* Layer Toggle Button */}
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                  <button type="button" onClick={() => setShowMapMenu(!showMapMenu)} className="map-layer-btn">
                    <Layers size={16}/> Map Layers <ChevronDown size={14} />
                  </button>
                  {showMapMenu && (
                      <div className="map-layer-menu">
                          {MAP_STYLES.map((style) => (
                              <div key={style.name} onClick={() => changeMapStyle(style.url)} className="map-layer-item">
                                  {style.icon} {style.name}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
            </div>

            {/* Address Form Fields */}
            <div className="location-bar">
               <div style={{flex: 1}}>
                  <Select 
                     options={countries} 
                     value={countries.find(c => c.value === form.country)}
                     onChange={val => { handleInputChange('country', val.value); setForm(f => ({...f, state: '', city: ''})); }}
                     styles={{ control: (base) => ({ ...base, minHeight: '46px', borderColor: errors.country ? '#ef4444' : base.borderColor }) }}
                  />
               </div>
               <button type="button" className="locate-btn" onClick={handleLocateMe}><MapPin size={18} /></button>
            </div>

            <div className="split-inputs">
                <input type="text" placeholder="First name" className="input-field" value={form.firstName} onChange={e=>handleInputChange('firstName', e.target.value)} style={getErrorStyle('firstName')} />
                <input type="text" placeholder="Last name" className="input-field" value={form.lastName} onChange={e=>handleInputChange('lastName', e.target.value)} style={getErrorStyle('lastName')} />
            </div>

            <input type="text" placeholder="Address" className="input-field" value={form.address1} onChange={e=>handleInputChange('address1', e.target.value)} style={getErrorStyle('address1')} />
            <input type="text" placeholder="Apartment (optional)" className="input-field" value={form.address2} onChange={e=>setForm({...form, address2: e.target.value})}/>

            <div className="split-inputs-3">
               <Select placeholder="State" options={states} value={states.find(s => s.value === form.state)} onChange={val => { handleInputChange('state', val.value); setForm(f => ({...f, city: ''})); }} styles={{ control: (base) => ({ ...base, minHeight: '46px', borderColor: errors.state ? '#ef4444' : base.borderColor }) }} isDisabled={!form.country}/>
               <Select placeholder="City" options={cities} value={cities.find(c => c.value === form.city)} onChange={val => handleInputChange('city', val.value)} styles={{ control: (base) => ({ ...base, minHeight: '46px', borderColor: errors.city ? '#ef4444' : base.borderColor }) }} isDisabled={!form.state}/>
               <input type="text" placeholder="ZIP" className="input-field" style={{marginBottom:0, ...getErrorStyle('zip')}} value={form.zip} onChange={e=>handleInputChange('zip', e.target.value)}/>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="section-group">
            <h3>Payment</h3>
            <p className="secure-text">All transactions are secure and encrypted.</p>
            
            <div className="payment-accordion">
              {/* Stripe Option */}
              <div className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                <div className="option-header" onClick={() => !isCodFallback && setPaymentMethod('stripe')}>
                  <div className="radio"><div className={`dot ${paymentMethod === 'stripe' ? 'on' : ''}`}></div></div>
                  <span>Credit card</span>
                  <div className="icons"><CreditCard size={16}/></div>
                </div>
                {paymentMethod === 'stripe' && (
                  <div className="option-body">
                    {!isCodFallback ? (
                      // DIRECT STRIPE ELEMENT - No extra wrapper needed
                      <PaymentElement options={{ layout: "tabs" }} />
                    ) : (
                      <div className="error-box" style={{color: '#d32f2f', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'8px'}}>
                        <AlertTriangle size={16}/> Payment gateway unavailable. Please use COD.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COD Option */}
              <div className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <div className="option-header" onClick={() => setPaymentMethod('cod')}>
                  <div className="radio"><div className={`dot ${paymentMethod === 'cod' ? 'on' : ''}`}></div></div>
                  <span>Cash on Delivery (COD)</span>
                  <div className="icons"><Truck size={16}/></div>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="option-body"><p>Pay cash when your order arrives at your doorstep.</p></div>
                )}
              </div>
            </div>
          </section>

          <button type="submit" className="pay-now-btn" disabled={loading}>
            {loading ? <Loader2 className="spin" /> : (paymentMethod === 'stripe' ? "Pay now" : "Complete Order")}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN (SUMMARY) */}
      <div className="summary-column">
        {cartItems.map((item, idx) => (
           <div className="summary-item" key={idx}>
             <div className="img-wrap">
               <Image src={item.image || "/placeholder.jpg"} width={64} height={64} alt={item.name} style={{objectFit:'cover'}} />
               <span className="qty-badge">{item.quantity}</span>
             </div>
             <div className="details"><p>{item.name}</p></div>
             <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
           </div>
        ))}
        <div className="totals-block">
          <div className="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="row total">
             <span>Total</span>
             <div className="usd-wrap"><span className="curr">USD</span><span className="val">${subtotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popup.show && (
        <div className="popup-overlay">
          <div className={`popup-box ${popup.type}`}>
            <div className="icon">
                {popup.type === 'success' ? <CheckCircle size={40}/> : <AlertOctagon size={40}/>}
            </div>
            <h3>{popup.title}</h3>
            <p>{popup.msg}</p>
            <button onClick={() => setPopup({...popup, show: false})}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}