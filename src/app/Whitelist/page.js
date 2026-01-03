"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'; // [Step 1] Import Link
import { MdOutlineEmail } from "react-icons/md";

export default function WhitelistProductsPage() {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("list"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStoredProducts = async () => {
      try {
        const stored = localStorage.getItem("wishlist");
        if (!stored) {
          setLoading(false);
          return;
        }

        const wishlistObj = JSON.parse(stored);
        const allIds = Object.values(wishlistObj).flat();
        const uniqueIds = [...new Set(allIds)]; 

        if (uniqueIds.length > 0) {
          const res = await axios.post('/api/whitelist', { ids: uniqueIds });
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Axios Error - Check API Path:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStoredProducts();
  }, []);

  if (loading) return (
    <div className="wishlist-loading-state">
      <div className="forge-spinner"></div>
      <p>Searching Armory Database...</p>
    </div>
  );

  return (
    <div className="whitelist-main">
      <nav className="breadcrumbs">Home <span>&gt;</span> Wishlist</nav>
      <h1 className="title">Wishlist</h1>

      <div className="view-toolbar">
        <span className="view-as">VIEW AS</span>
        <div className="btn-group">
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            <svg viewBox="0 0 24 24" width="20"><path fill="currentColor" d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
          </button>
          <button className={viewMode === 'grid-2' ? 'active' : ''} onClick={() => setViewMode('grid-2')}>
            <svg viewBox="0 0 24 24" width="20"><path fill="currentColor" d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm8 8h8v-8h-8v8zm2-6h4v4h-4v-4z"/></svg>
          </button>
          <button className={viewMode === 'grid-3' ? 'active' : ''} onClick={() => setViewMode('grid-3')}>
            <svg viewBox="0 0 24 24" width="20"><path fill="currentColor" d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
          </button>
        </div>
      </div>

      <div className={`product-container view-${viewMode}`}>
        {products.length === 0 ? (
          <p className="no-items">Your armory wishlist is currently empty.</p>
        ) : (
          products.map((item) => (
            <div key={item._id} className={`item-card ${viewMode === 'list' ? 'horizontal' : ''}`}>
              <div className="image-side">
                {item.onSale && <span className="sale-tag">Sale</span>}
                
                {/* [Step 2] Wrap the Image in a Link */}
                <Link href={`/detailProduct/${item._id}`}>
                  <img 
                    src={item.mainImage} 
                    alt={item.name} 
                    style={{ cursor: 'pointer' }} // Visual hint that it's clickable
                  />
                </Link>
              </div>

              <div className="text-side">
                {/* [Step 3] Optional: Wrap the title in a Link as well */}
                <Link href={`/product/${item._id}`} className="product-link">
                  <h3>{item.name}</h3>
                </Link>

                {viewMode === 'list' && (
                  <div 
                    className="item-description" 
                    dangerouslySetInnerHTML={{ __html: item.description?.substring(0, 180) + '...' }} 
                  />
                )}
                <div className="price-display">
                  {item.onSale && <span className="old-price">${item.price}</span>}
                  <span className="sale-price">${item.onSale ? item.salePrice : item.price}</span>
                </div>

                <Link href={`/product/${item._id}`}>
                  <button className="buy-btn">Buy Now</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="footer-actions">
        <button className="share-btn">
          <MdOutlineEmail size={22} /> Share my wish list via email
        </button>
      </div>
    </div>
  );
}