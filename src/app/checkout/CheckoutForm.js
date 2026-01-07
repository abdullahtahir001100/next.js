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
import { useRouter } from "next/navigation"; 
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from "react-select";
import { Country, State, City } from "country-state-city";

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkdWxsYWh0YWhpMDAxIiwiYSI6ImNtanpyaWt1YTBpb2EzZnM4Y25yYm13dzEifQ.EZowgonOckkEFvM4rwv-fA';

const MAP_STYLES = [
  { name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12', icon: <Sun size={14} /> },
  { name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12', icon: <Globe size={14} /> },
  { name: 'Outdoors', url: 'mapbox://styles/mapbox/outdoors-v12', icon: <Mountain size={14} /> },
  { name: 'Dark Mode', url: 'mapbox://styles/mapbox/dark-v11', icon: <Moon size={14} /> },
];

const StripePaymentSection = ({ onReady }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      onReady({ stripe, elements });
    }
  }, [stripe, elements, onReady]);

  return <PaymentElement options={{ layout: "tabs" }} />;
};

export default function CheckoutForm({ cartItems, isCodFallback, piId }) {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(isCodFallback ? "cod" : "stripe");
  const stripeRef = useRef(null); 

  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [currentStyleUrl, setCurrentStyleUrl] = useState('mapbox://styles/mapbox/streets-v12');
  const [showMapMenu, setShowMapMenu] = useState(false);

  const [popup, setPopup] = useState({ show: false, type: "", title: "", msg: "" });
  const [errors, setErrors] = useState({});
  const [saveInfo, setSaveInfo] = useState(false);

  const [form, setForm] = useState({
    email: "", phone: "",
    country: "US", firstName: "", lastName: "",
    address1: "", address2: "", city: "", state: "", zip: "",
    lat: -74.006, lng: 40.7128
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const countries = useMemo(() => Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);
  const states = useMemo(() => form.country ? State.getStatesOfCountry(form.country).map(s => ({ label: s.name, value: s.isoCode })) : [], [form.country]);
  const cities = useMemo(() => (form.country && form.state) ? City.getCitiesOfState(form.country, form.state).map(c => ({ label: c.name, value: c.name })) : [], [form.country, form.state]);

  useEffect(() => {
    const savedData = localStorage.getItem("viking_checkout_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setForm(prev => ({ ...prev, ...parsed }));
        setSaveInfo(true);
      } catch (e) { console.error("Error parsing saved info", e); }
    }
  }, []);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return; 

    const startLng = form.lng; 
    const startLat = form.lat;

    if(navigator.geolocation && !localStorage.getItem("viking_checkout_info")) {
        navigator.geolocation.getCurrentPosition((pos) => {
          initMap(pos.coords.longitude, pos.coords.latitude);
        }, () => {
          initMap(startLng, startLat);
        });
    } else {
        initMap(startLng, startLat);
    }

    function initMap(lng, lat) {
        if (!mapContainer.current) return;
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

  const updateLocationFromMap = async (lng, lat) => {
     if(marker.current) marker.current.setLngLat([lng, lat]);
     try {
       const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
       if (res.data.features.length > 0) {
         const place = res.data.features[0];
         const countryCtx = place.context?.find(c => c.id.includes('country'));
         const countryCode = countryCtx ? countryCtx.short_code.toUpperCase() : "US";
         
         setForm(prev => ({ 
             ...prev, 
             address1: place.place_name.split(',')[0],
             country: countryCode,
             zip: place.context?.find(c => c.id.includes('postcode'))?.text || prev.zip,
             lat: lng, lng: lat 
         }));
         if(errors.address1) setErrors(prev => ({...prev, address1: false}));
       }
     } catch(e) { console.error(e); }
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

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    if (!form.email) newErrors.email = true;
    if (!form.phone || form.phone.length < 5) newErrors.phone = true;
    if (!form.firstName) newErrors.firstName = true;
    if (!form.lastName) newErrors.lastName = true;
    if (!form.address1) newErrors.address1 = true;
    if (!form.country) newErrors.country = true;
    if (!form.state) newErrors.state = true;
    if (!form.city) newErrors.city = true;
    if (!form.zip) newErrors.zip = true;

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setPopup({ show: true, type: "error", title: "Missing Fields", msg: "Please fill in all highlighted red fields." });
        isValid = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        setErrors({});
    }
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
  };

  // --- CHANGED: SAVE ORDER FIRST, THEN PAY ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
        // 1. Save Info if Checked
        if(saveInfo) {
            const infoToSave = {
                email: form.email, phone: form.phone, firstName: form.firstName, lastName: form.lastName,
                country: form.country, state: form.state, city: form.city, zip: form.zip, address1: form.address1,
                lat: form.lat, lng: form.lng
            };
            localStorage.setItem("viking_checkout_info", JSON.stringify(infoToSave));
        }

        // 2. Prepare Payload
        const payload = {
            items: cartItems,
            customer: { 
                email: form.email, 
                phone: String(form.phone || ""), 
                firstName: form.firstName, 
                lastName: form.lastName 
            },
            address: form,
            paymentMethod,
            paymentIntentId: paymentMethod === 'stripe' ? piId : null
        };

        // 3. CREATE ORDER IN DB (Pending Payment)
        console.log("Creating Pending Order...");
        const saveRes = await axios.post("/api/checkout", payload);

        if (!saveRes.data.success) {
            throw new Error("Failed to create order record.");
        }
        
        const orderId = saveRes.data.orderId;

        // 4. IF STRIPE -> CONFIRM PAYMENT
        if (paymentMethod === 'stripe') {
            const { stripe, elements } = stripeRef.current || {};
            if (!stripe || !elements) return;

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Success URL sends Order ID so page can show details
                    return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
                },
            });

            if (error) {
                setPopup({ show: true, type: "error", title: "Payment Failed", msg: error.message });
                setLoading(false);
                return;
            }
            // Stripe will redirect automatically on success.
            // Webhook will update status to 'Processing' in background.
        } else {
            // COD - Just redirect
            localStorage.removeItem("cart");
            router.push(`/checkout/success?orderId=${orderId}`);
        }

    } catch (err) {
        console.error("Checkout Error:", err);
        setPopup({ 
            show: true, 
            type: "error", 
            title: "Error", 
            msg: err.response?.data?.details || err.message || "Order processing failed." 
        });
        setLoading(false);
    }
  };

  const getErrorStyle = (field) => errors[field] ? { borderColor: '#ef4444', borderWidth: '1px' } : {};

  return (
    <div className="checkout-layout">
      <div className="form-column">
        <div className="header-mobile-only"><div className="logo">VIKING ARMORY</div></div>
        <div className="express-checkout">
          <p>Express checkout</p>
          <div className="buttons">
            <button type="button" className="btn-shop">shop</button>
            <button type="button" className="btn-paypal">PayPal</button>
            <button type="button" className="btn-gpay">G Pay</button>
          </div>
        </div>
        <div className="divider">OR</div>

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
            {errors.email && <span style={{color:'#ef4444', fontSize:'12px'}}>Email is required</span>}
            
            <div style={{marginTop: '15px'}}>
               <PhoneInput 
                  country={'us'} value={form.phone} 
                  onChange={(phone) => handleInputChange('phone', phone)}
                  inputStyle={{ width:'100%', height:'45px', fontSize:'14px', borderColor: errors.phone ? '#ef4444' : '#d9d9d9' }}
                  containerStyle={{width:'100%'}}
               />
               {errors.phone && <span style={{color:'#ef4444', fontSize:'12px'}}>Phone is required</span>}
            </div>
          </section>

          {/* DELIVERY & MAP */}
          <section className="section-group">
            <h3>Delivery Location</h3>
            <div className="map-wrapper" style={{position: 'relative', height: '300px', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e1e1e1'}}>
              <div ref={mapContainer} style={{width: '100%', height: '100%'}} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                  <button type="button" onClick={() => setShowMapMenu(!showMapMenu)} style={{ background: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'flex', gap: '5px', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                    <Layers size={16}/> Map Layers <ChevronDown size={14} />
                  </button>
                  {showMapMenu && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '5px', width: '140px', background: 'white', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                          {MAP_STYLES.map((style) => (
                              <div key={style.name} onClick={() => changeMapStyle(style.url)} style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer', background: currentStyleUrl === style.url ? '#f3f4f6' : 'white', borderBottom: '1px solid #f0f0f0' }}>
                                  {style.icon} {style.name}
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              <div style={{position:'absolute', bottom: '10px', left: '10px', zIndex: 10, background: 'rgba(0,0,0,0.7)', color:'white', padding: '5px 10px', borderRadius: '4px', fontSize: '11px'}}>
                <MapPin size={10} style={{marginRight: '5px'}}/> Drag marker to pin
              </div>
            </div>

            <div className="location-bar">
               <div style={{flex: 1}}>
                  <Select 
                      options={countries} value={countries.find(c => c.value === form.country)}
                      onChange={val => { handleInputChange('country', val.value); setForm(prev => ({...prev, state: '', city: ''})); }}
                      styles={{ control: (base) => ({ ...base, minHeight: '46px', borderTopRightRadius:0, borderBottomRightRadius:0, borderColor: errors.country ? '#ef4444' : base.borderColor }) }}
                   />
               </div>
               <button type="button" className="locate-btn" onClick={handleLocateMe} title="Locate Me"><MapPin size={18} /></button>
            </div>

            <div className="split-inputs">
              <div style={{width:'100%'}}>
                  <input type="text" placeholder="First name" className="input-field" value={form.firstName} onChange={e=>handleInputChange('firstName', e.target.value)} style={getErrorStyle('firstName')} />
              </div>
              <div style={{width:'100%'}}>
                  <input type="text" placeholder="Last name" className="input-field" value={form.lastName} onChange={e=>handleInputChange('lastName', e.target.value)} style={getErrorStyle('lastName')} />
              </div>
            </div>

            <div style={{width: '100%'}}>
                <input type="text" placeholder="Address" className="input-field" value={form.address1} onChange={e=>handleInputChange('address1', e.target.value)} style={getErrorStyle('address1')} />
                {errors.address1 && <span style={{color:'#ef4444', fontSize:'12px', display:'block', marginTop:'-10px', marginBottom:'10px'}}>Address is required</span>}
            </div>
            
            <input type="text" placeholder="Apartment (optional)" className="input-field" value={form.address2} onChange={e=>setForm(p => ({...p, address2: e.target.value}))}/>

            <div className="split-inputs-3">
               <Select placeholder="State" options={states} value={states.find(s => s.value === form.state)} onChange={val => { handleInputChange('state', val.value); setForm(prev => ({...prev, city: ''})); }} isDisabled={!form.country} styles={{ control: (base) => ({ ...base, minHeight: '46px', borderColor: errors.state ? '#ef4444' : base.borderColor }) }} />
               <Select placeholder="City" options={cities} value={cities.find(c => c.value === form.city)} onChange={val => handleInputChange('city', val.value)} isDisabled={!form.state} styles={{ control: (base) => ({ ...base, minHeight: '46px', borderColor: errors.city ? '#ef4444' : base.borderColor }) }} />
               <input type="text" placeholder="ZIP" className="input-field" style={{marginBottom:0, ...getErrorStyle('zip')}} value={form.zip} onChange={e=>handleInputChange('zip', e.target.value)} />
            </div>
            
            <label className="checkbox-label" style={{marginTop:'15px'}}>
              <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} /> 
              Save this information for next time
            </label>
          </section>

          {/* SHIPPING & PAYMENT */}
          <section className="section-group">
            <h3>Shipping method</h3>
            <div className="shipping-box"><span>Standard Shipping</span><span>Free</span></div>
          </section>

          <section className="section-group">
            <h3>Payment</h3>
            <p className="secure-text">All transactions are secure and encrypted.</p>
            
            <div className="payment-accordion">
              {/* Stripe */}
              <div className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                <div className="option-header" onClick={() => !isCodFallback && setPaymentMethod('stripe')}>
                  <div className="radio"><div className={`dot ${paymentMethod === 'stripe' ? 'on' : ''}`}></div></div>
                  <span>Credit card</span>
                  <div className="icons"><CreditCard size={16}/></div>
                </div>
                {paymentMethod === 'stripe' && (
                  <div className="option-body">
                    {!isCodFallback ? (
                      <StripePaymentSection onReady={(refs) => stripeRef.current = refs} />
                    ) : (
                      <div className="error-box" style={{color: '#d32f2f', fontWeight: 'bold', display:'flex', alignItems:'center', gap:'8px'}}>
                        <AlertTriangle size={16}/> Payment gateway unavailable. Please use COD.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COD */}
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

      {/* RIGHT COLUMN */}
      <div className="summary-column">
        {cartItems.map((item, idx) => (
           <div className="summary-item" key={idx}>
             <div className="img-wrap">
               <Image src={item.image || "/placeholder.jpg"} width={64} height={64} alt={'o'} />
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