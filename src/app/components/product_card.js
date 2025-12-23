"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

const FALLBACK_SRC = "https://placehold.co/600x400?text=No+Image";

export default function ProductCard({ product }) {
  const imgRef = useRef(null);
  const wishlistBtnRef = useRef(null);
  const overlayRef = useRef(null);
  const quickViewRef = useRef(null);

  // --- 1. SAFETY CHECK: Ensure product exists ---
  if (!product) return null;

  // Use the correct keys from your database: mainImage and hoverImage
  const mainImg = product.mainImage && product.mainImage !== "" ? product.mainImage : FALLBACK_SRC;
  const hoverImg = product.hoverImage && product.hoverImage !== "" ? product.hoverImage : mainImg;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(mainImg);

  // Sync state if product changes
  useEffect(() => {
    setCurrentImage(mainImg);
  }, [mainImg]);

  useEffect(() => {
    if (!imgRef.current) return;

    if (isHovered) {
      // --- HOVER IN LOGIC ---
      gsap.to(imgRef.current, {
        opacity: 0.8,
        duration: 0.2,
        onComplete: () => {
          setCurrentImage(hoverImg);
          gsap.fromTo(imgRef.current, 
            { scale: 1, opacity: 0.8 }, 
            { 
              scale: 1.1, 
              opacity: 1, 
              duration: 1, 
              delay: 0.1,
              ease: "power2.out" 
            }
          );
        }
      });
    } else {
      // --- HOVER OUT LOGIC ---
      gsap.to(imgRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.2,
        onComplete: () => {
          setCurrentImage(mainImg);
          gsap.to(imgRef.current, { opacity: 1, duration: 0.2 });
        }
      });
    }
  }, [isHovered, mainImg, hoverImg]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (wishlistBtnRef.current) gsap.to(wishlistBtnRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.2 });
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
    if (quickViewRef.current) gsap.to(quickViewRef.current, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (wishlistBtnRef.current) gsap.to(wishlistBtnRef.current, { opacity: 0, pointerEvents: "none", duration: 0.2 });
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
    if (quickViewRef.current) gsap.to(quickViewRef.current, { opacity: 0, y: 20, pointerEvents: "none", duration: 0.3, ease: "power2.in" });
  };
  const wishlistIcon = '/like.png'

  return (
    <div className="product-card-container col_" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="flexcol">
        <div className="image-holder image-container">
          {product.onSale && <span className="sale-tag sale-label">Sale</span>}

          <div className="product-image-wrapper" style={{ overflow: 'hidden', position: 'relative' }}>
            {/* CRITICAL FIX: 
               We only render the <img> tag if currentImage is a valid, non-empty string.
               This prevents the "Empty String passed to src" error.
            */}
            {currentImage && currentImage !== "" ? (
              <img
                ref={imgRef}
                src={currentImage}
                alt={product.name || "Product"}
                className="product-main-img"
                onError={(e) => { e.target.src = FALLBACK_SRC; }}
              />
            ) : (
              <div className="image-placeholder" />
            )}
          </div>

          <div ref={overlayRef} className="card-overlay image-overlay" />
          <div ref={quickViewRef} className="quick-view-btn quick-view">
            <button>Quick View</button>
          </div>
        </div>

        <div className="product-info product-details">
          <h4 className="product-title">{product.name}</h4>
          <div className="price-row price">
            {product.salePrice && <span className="old-price">${product.price}</span>}
            <span className="new-price">${product.salePrice || product.price}</span>
          </div>
        </div>

        <div className="buttons flexbox">
          <button className="buy-btn btn">Buy Now</button>
          
          <div
            ref={wishlistBtnRef}
             className={`product-wishlist ${isWishlisted ? "active" : ""}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            {/* CRITICAL FIX: 
               Only render Next.js Image if the icon path exists. 
            */}
           
             
          
               <div className="wishlist-dot" />
            <Image 
                 src={wishlistIcon} 
                 alt="Wishlist" 
                 width={24} 
                 height={24} 
               />
          </div>
        </div>
      </div>
    </div>
  );
}
