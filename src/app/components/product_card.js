"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function ProductCard({ product }) {
  const imgRef = useRef(null);
  const wishlistBtnRef = useRef(null);
  const overlayRef = useRef(null);
  const quickViewRef = useRef(null);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);

  useEffect(() => {
    if (!imgRef.current) return;

    if (isHovered) {
      // --- HOVER IN LOGIC ---
      // 1. Pehle image ko fade out karein
      gsap.to(imgRef.current, {
        opacity: 1,
        duration: 0.2,
        onComplete: () => {
          // 2. Image change karein
          setCurrentImage(product.hover);
          
          // 3. Image change hone ke BAAD zoom-in animation (Duration 1)
          gsap.fromTo(imgRef.current, 
            { scale: 1, opacity: 1 }, 
            { 
              scale: 1.1, // Card ke andar zoom level
              opacity: 1, 
              duration: 1, delay:.3,
              ease: "power2.out" 
            }
          );
        }
      });
    } else {
      // --- HOVER OUT LOGIC (REVERSE) ---
      gsap.to(imgRef.current, {
        opacity: 0,
        scale: 1, // Wapis normal scale par layein
        duration: 0.2,
        onComplete: () => {
          setCurrentImage(product.image);
          gsap.to(imgRef.current, { opacity: 1, duration: 0.2 });
        }
      });
    }
  }, [isHovered, product.hover, product.image]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    gsap.to(wishlistBtnRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.2 });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
    gsap.to(quickViewRef.current, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    gsap.to(wishlistBtnRef.current, { opacity: 0, pointerEvents: "none", duration: 0.2 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(quickViewRef.current, { opacity: 0, y: 20, pointerEvents: "none", duration: 0.3, ease: "power2.in" });
  };

  const handleWishlistClick = () => {
    setIsWishlisted((prev) => !prev);
    gsap.to(wishlistBtnRef.current, { scale: 1.3, duration: 0.1, yoyo: true, repeat: 1 });
  };

  return (
    <div className="col_" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="flexcol">
        <div className="image-container">
          {product.onSale && <span className="sale-label">Sale</span>}

          {/* Zoom effect ke liye container par overflow: hidden laazmi hai */}
          <div className="product-image-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
            <img
              ref={imgRef}
              src={currentImage}
              alt={product.name}
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                transformOrigin: 'center center' 
              }}
            />
          </div>

          <div ref={overlayRef} className="image-overlay" />
          <div ref={quickViewRef} className="quick-view">
            <button>Quick View</button>
          </div>
        </div>

        <div className="product-details">
          <h4>{product.name}</h4>
          
        </div>
<div className="price">
            <span className="old-price">{product.price}</span>
            <span className="new-price">{product.salePrice}</span>
          </div>
        <div className="buttons flexbox">
          <button className="btn">Buy Now</button>
          <div
            ref={wishlistBtnRef}
            className={`product-wishlist ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistClick}
          >
            <Image src={product.wishlistIcon} alt="Wishlist" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
}