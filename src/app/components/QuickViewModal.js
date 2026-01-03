"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import gsap from "gsap";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const FALLBACK_SRC = "https://placehold.co/600x400?text=No+Image";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Swiper State
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [soldCount, setSoldCount] = useState(10); 

  // --- ANIMATIONS ---
  useEffect(() => {
    if (isOpen) {
      gsap.set(overlayRef.current, { display: "block" });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      
      gsap.set(modalRef.current, { display: "flex" });
      gsap.fromTo(
        modalRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
      );
      // Simulate real-time urgency (or fetch from DB if available)
      setSoldCount(product.recentSales || Math.floor(Math.random() * (15 - 5 + 1) + 5));
    } else {
      gsap.to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }) 
      });
      gsap.to(modalRef.current, { 
        y: 30, 
        opacity: 0, 
        scale: 0.98, 
        duration: 0.3, 
        onComplete: () => gsap.set(modalRef.current, { display: "none" }) 
      });
      setThumbsSwiper(null); // Reset thumbs to avoid 'destroyed' error on reopen
    }
  }, [isOpen, product]);

  if (!product) return null;

  // Filter valid images from REAL data
  const galleryImages = [
    product.mainImage,
    product.hoverImage,
    ...(product.smallImages || [])
  ].filter(img => img && img.length > 5);

  // --- ZOOM HANDLER ---
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    const img = e.currentTarget.querySelector('.qv-zoom-target');
    if (img) {
        img.style.transformOrigin = `${x}% ${y}%`;
        img.style.transform = "scale(1.5)"; 
    }
  };

  const handleMouseLeave = (e) => {
    const img = e.currentTarget.querySelector('.qv-zoom-target');
    if (img) {
        img.style.transformOrigin = "center center";
        img.style.transform = "scale(1)";
    }
  };

  // --- BUY HANDLER (Real DB Update) ---
  const handleBuy = async () => {
    try {
        alert(`Added ${quantity} item(s) to cart!`);
        
        // Update Sales in DB
        await fetch('/api/products/update-sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                productId: product._id, 
                quantitySold: quantity 
            }),
        });
    } catch (error) {
        console.error("Failed to update sales", error);
    }
  };

  return (
    <>
      <div ref={overlayRef} onClick={onClose} className="qv-overlay" />

      <div ref={modalRef} className="qv-modal">
        <button onClick={onClose} className="qv-close-btn">✕</button>

        <div className="qv-grid">
          
          {/* --- LEFT: GALLERY --- */}
          <div className="qv-gallery-section">
             
             {/* MAIN SLIDER */}
             <div className="qv-main-swiper-wrap">
                <Swiper
                    key={`main-${product._id}`} 
                    modules={[Navigation, Thumbs]}
                    // CRITICAL FIX: Safe check for thumbs
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    navigation={true} 
                    spaceBetween={10}
                    slidesPerView={1}
                    className="qv-main-swiper"
                >
                    {galleryImages.length > 0 ? galleryImages.map((src, i) => (
                        <SwiperSlide key={i}>
                            <div 
                                className="qv-image-container" 
                                onMouseMove={handleMouseMove} 
                                onMouseLeave={handleMouseLeave}
                            >
                                <Image 
                                    src={src} 
                                    alt={product.name} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="qv-img-contain qv-zoom-target"
                                    onError={e => e.target.src = FALLBACK_SRC} 
                                    priority={i === 0}
                                />
                            </div>
                        </SwiperSlide>
                    )) : (
                        <SwiperSlide>
                             <div className="qv-image-container">
                                <Image src={FALLBACK_SRC} alt="Fallback" fill className="qv-img-cover" />
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
             </div>

             {/* THUMBNAILS */}
             <div className="qv-thumb-swiper-wrap">
                <Swiper
                    key={`thumb-${product._id}`}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[Navigation, Thumbs, FreeMode]}
                    navigation={false} 
                    className="qv-thumb-swiper"
                >
                    {galleryImages.map((src, i) => (
                        <SwiperSlide key={i} className="qv-thumb-slide">
                            <div className="qv-thumb-container">
                                <Image src={src} alt="Thumb" fill className="qv-img-cover" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
             </div>
          </div>

          {/* --- RIGHT: DETAILS --- */}
          <div className="qv-details-section">
            <div className="qv-header">
                <h2 className="qv-product-title">{product.name}</h2>
                <div className="qv-urgency-tag">
                    <span className="qv-fire-icon">🔥</span> {soldCount} sold in last 25 hours
                </div>
            </div>

            <div className="qv-meta-info">
                <p><strong>Vendor:</strong> {product.vendor || "Viking Armory"}</p>
                <p><strong>Availability:</strong> <span className={product.stock > 0 ? "qv-stock-in" : "qv-stock-out"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span></p>
                <p><strong>Type:</strong> {product.productType || "Knives"}</p>
            </div>

            <div className="qv-pricing">
                <span className="qv-price-current">${product.salePrice || product.price}</span>
                {product.salePrice && (
                    <span className="qv-price-old">${product.price}</span>
                )}
            </div>

            <p className="qv-installment-text">
                From <strong>$17.50/mo</strong> at 0% APR with <span className="qv-shop-logo">shop</span> pay.
            </p>

            <div className="qv-quantity-wrapper">
                <label className="qv-label">Quantity</label>
                <div className="qv-quantity-control">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qv-qty-btn">-</button>
                    <span className="qv-qty-display">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="qv-qty-btn">+</button>
                </div>
            </div>

            <div className="qv-actions">
                <button onClick={handleBuy} className="qv-btn qv-btn-primary">Buy Now</button>
                <button className="qv-btn qv-btn-secondary">Buy with Shop</button>
            </div>
            
            <div className="qv-viewing-count">
                <span>👁 10 customers are viewing this product</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* LAYOUT */
        .qv-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 998;
            opacity: 0;
        }
        .qv-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 95%;
            max-width: 1000px;
            max-height: 90vh;
            background-color: #ffffff;
            z-index: 999;
            border-radius: 12px;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            flex-direction: column;
        }
        .qv-close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            z-index: 20;
            background: transparent;
            border: none;
            font-size: 24px;
            color: #666;
            cursor: pointer;
            transition: color 0.2s;
            line-height: 1;
        }
        .qv-close-btn:hover { color: #000; }
        .qv-grid {
            display: flex;
            flex-direction: row;
            height: 100%;
            overflow-y: auto;
        }

        /* GALLERY */
        .qv-gallery-section {
            width: 55%;
            background-color: #f8f9fa;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .qv-main-swiper-wrap {
            margin-bottom: 15px;
            border-radius: 8px;
            background: white;
            border: 1px solid #e5e5e5;
            overflow: hidden;
            position: relative;
        }
        .qv-image-container {
            position: relative;
            width: 100%;
            aspect-ratio: 1/1;
            overflow: hidden; 
            cursor: crosshair;
        }
        .qv-zoom-target {
            object-fit: contain;
            padding: 10px;
            transition: transform 0.1s ease-out;
        }
        .qv-img-cover { object-fit: cover; }
        .qv-thumb-swiper-wrap { width: 100%; }

        /* THUMBS */
        .qv-thumb-slide {
            opacity: 0.5;
            transition: opacity 0.2s;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
        }
        .qv-thumb-slide:global(.swiper-slide-thumb-active) {
            opacity: 1;
            border-color: #000;
        }
        .qv-thumb-container {
            position: relative;
            width: 100%;
            height: 70px;
        }

        /* DETAILS */
        .qv-details-section {
            width: 45%;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            overflow-y: auto;
        }
        .qv-product-title {
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 10px 0;
            color: #1a1a1a;
            line-height: 1.2;
        }
        .qv-urgency-tag {
            display: inline-flex;
            align-items: center;
            font-size: 13px;
            font-weight: 600;
            color: #d32f2f;
            background: #fff0f0;
            padding: 4px 10px;
            border-radius: 4px;
        }
        .qv-meta-info {
            font-size: 14px;
            color: #555;
            line-height: 1.8;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .qv-meta-info strong { color: #222; }
        .qv-stock-in { color: #2e7d32; font-weight: 600; }
        .qv-stock-out { color: #d32f2f; font-weight: 600; }
        .qv-pricing {
            display: flex;
            align-items: baseline;
            gap: 12px;
        }
        .qv-price-current {
            font-size: 28px;
            font-weight: 800;
            color: #222;
        }
        .qv-price-old {
            font-size: 18px;
            text-decoration: line-through;
            color: #999;
        }
        .qv-installment-text {
            font-size: 13px;
            color: #666;
            margin: 0;
        }
        .qv-shop-logo {
            color: #5a31f4;
            font-weight: 800;
        }
        .qv-quantity-wrapper { margin-top: 10px; }
        .qv-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .qv-quantity-control {
            display: inline-flex;
            align-items: center;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
        }
        .qv-qty-btn {
            padding: 10px 16px;
            background: #fff;
            border: none;
            cursor: pointer;
            font-size: 16px;
            color: #555;
            transition: background 0.2s;
        }
        .qv-qty-btn:hover { background: #f5f5f5; }
        .qv-qty-display {
            padding: 0 12px;
            font-weight: 600;
            min-width: 30px;
            text-align: center;
            font-size: 15px;
        }
        .qv-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 10px;
        }
        .qv-btn {
            width: 100%;
            padding: 14px;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: transform 0.1s, opacity 0.2s;
        }
        .qv-btn:active { transform: scale(0.98); }
        .qv-btn-primary {
            background-color: #1a1a1a;
            color: white;
        }
        .qv-btn-primary:hover { background-color: #000; }
        .qv-btn-secondary {
            background-color: #5a31f4;
            color: white;
        }
        .qv-btn-secondary:hover { opacity: 0.9; }
        .qv-viewing-count {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666;
            margin-top: 5px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
            .qv-grid { flex-direction: column; }
            .qv-gallery-section { width: 100%; padding: 20px; }
            .qv-details-section { width: 100%; padding: 25px; }
            .qv-product-title { font-size: 22px; }
        }
      `}</style>
    </>
  );
}