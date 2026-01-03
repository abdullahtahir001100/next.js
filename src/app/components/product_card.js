"use client";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Ye import zaroori hai
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import VikingLoader from "../components/VikingLoader";
const FALLBACK_SRC = "https://placehold.co/600x400?text=No+Image";

export default function ProductCard({ product, onQuickView }) {
  const wishlistBtnRef = useRef(null);
  const overlayRef = useRef(null);
  const quickViewRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // Hydration mismatch avoid karne ke liye

  useEffect(() => {
    setMounted(true);
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (storedWishlist.includes(product?._id)) {
      setIsWishlisted(true);
    }
  }, [product?._id]);

  if (!product) return null;

  const mainImg = product.mainImage || FALLBACK_SRC;
  const hoverImg = product.hoverImage || mainImg;
  const currentImage = isHovered ? hoverImg : mainImg;

  // Animation Handlers (Same as before)
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

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      storedWishlist = storedWishlist.filter((id) => id !== product._id);
      setIsWishlisted(false);
    } else {
      storedWishlist.push(product._id);
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(storedWishlist));
    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  return (
    <>
      {/* 2. PORTAL: Ye code card ke andar likha hai par render BODY tag me hoga.
        Ye kisi bhi transform/animation se affect nahi hoga.
      */}
      {mounted && isLoading && createPortal(
        <div>
         <VikingLoader />
        </div>,
        document.body
      )}

      <div 
        className="product-card-container col_" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          href={`/detailProduct/${product._id}`} 
          className="product-card-link-wrapper"
          onClick={() => setIsLoading(true)}
        >
          <div className="flexcol">
            
            <div className="image-holder image-container" style={{ position: 'relative' }}>
              {product.onSale && <span className="sale-tag sale-label">Sale</span>}

              <div className="product-image-wrapper" style={{ overflow: 'hidden', position: 'relative', width:'100%', height:'300px' }}>
                <Image
                  src={currentImage}
                  alt={product.name || "Product"}
                  fill
                  style={{ objectFit: 'cover' }}
                  className={`transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div 
                ref={overlayRef} 
                className="card-overlay image-overlay" 
                style={{ 
                  opacity: 0, 
                  pointerEvents: 'none', 
                  position: 'absolute', 
                  inset: 0, 
                  backgroundColor: 'rgba(0,0,0,0.05)' 
                }} 
              />
              
              <div 
                ref={quickViewRef} 
                className="quick-view-btn quick-view" 
                style={{ 
                  opacity: 0, 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '50%', 
                  transform: 'translateX(-50%)' 
                }}
              >
                <button 
                  className="fff"
                  onClick={(e) => { 
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product); 
                  }}
                >
                  Quick View
                </button>
              </div>
            </div>

            <div className="product-info product-details">
              <h4 className="product-title">{product.name}</h4>
              <div className="price-row price">
                {product.onSale && (
                  <span className="old-price" style={{ textDecoration: 'line-through', marginRight: '8px', color: '#999' }}>
                    ${product.price}
                  </span>
                )}
                <span className="new-price">
                  ${product.onSale ? product.salePrice : product.price}
                </span>
              </div>
            </div>

            <div className="buttons flexbox">
              <button className="buy-btn btn">Buy Now</button>
              
              <div
                ref={wishlistBtnRef}
                className={`product-wishlist ${isWishlisted ? "active" : ""}`}
                onClick={handleWishlistToggle}
                style={{ opacity: 0, cursor: 'pointer' }}
              >
                <Image 
                  src={isWishlisted ? "/like.png" : "/like.png"} 
                  alt="Like" 
                  width={24} 
                  height={24} 
                />
              </div>
            </div>

          </div>
        </Link>
      </div>
    </>
  );
}