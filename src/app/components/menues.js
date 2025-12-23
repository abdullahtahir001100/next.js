"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useSearch } from './search';

const FALLBACK_IMG = "https://placehold.co/100x100?text=No+Image";

export default function Menu() {
  const { searchTerm, setSearchTerm } = useSearch();
  
  const [allProducts, setAllProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const popupRef = useRef(null);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const allRes = await fetch('/api/products');
        const allData = await allRes.json();
        setAllProducts(Array.isArray(allData) ? allData : []);

        const popRes = await fetch('/api/products?section=best-seller&limit=3');
        const popData = await popRes.json();
        setPopularProducts(Array.isArray(popData) ? popData : []);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchSearchData();
  }, []);

  const handleCloseSearch = () => {
    setSearchTerm("");
  };

  // --- 2. ANIMATION ---
  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      const filtered = allProducts.filter(item =>
        (item.name || item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      gsap.to(popupRef.current, { display: "block", opacity: 1, y: 0, duration: 0.4 });
    } else {
      gsap.to(popupRef.current, { opacity: 0, y: -20, duration: 0.3, onComplete: () => gsap.set(popupRef.current, { display: "none" }) });
    }
  }, [searchTerm, allProducts]);

  // --- 3. CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchTerm && searchTerm.length > 0) {
        if (popupRef.current && !popupRef.current.contains(event.target) && !event.target.closest('.main_header')) {
          handleCloseSearch();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm]);

  return (
    <div
      ref={popupRef}
      className="pop_search" 
      style={{ 
        display: 'none', 
        opacity: 0, 
        transform: 'translateY(-20px)', 
        background: '#fff',
        position: 'absolute', 
        top: '100%',
        left: 0,
        width: '100%',
        zIndex: 9999,
        borderTop: '1px solid #eee',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}
    >
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <h2 style={{ color: '#000', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                {searchTerm && searchTerm.length > 0 ? `Results for "${searchTerm}"` : "Trending Now"}
            </h2>
            <button onClick={handleCloseSearch} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* RESULTS - FORCED LIST LAYOUT */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            
            {(searchTerm && searchTerm.length > 0 ? filteredProducts : popularProducts).map((item) => (
              <Link 
                href={`/product/${item._id}`} 
                key={item._id} 
                onClick={handleCloseSearch}
                // --- INLINE STYLES TO OVERRIDE EXTERNAL CSS ---
                style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '10px',
                    textDecoration: 'none',
                    borderBottom: '1px solid #f5f5f5'
                }}
              >
                {/* 1. IMAGE BOX (Fixed Small Size) */}
                <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    minWidth: '60px', /* Forces width */
                    marginRight: '15px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    background: '#f0f0f0'
                }}>
                  <img
                    src={item.mainImage || item.image || FALLBACK_IMG}
                    alt={item.name}
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block' 
                    }}
                    onError={(e) => e.target.src = FALLBACK_IMG}
                  />
                </div>
                
                {/* 2. TEXT CONTENT */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#000', fontWeight: '600', fontSize: '14px', lineHeight: '1.2' }}>
                        {item.name || item.title || "Unnamed Product"}
                    </span>
                    <span style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>
                        ${item.price || "0.00"}
                    </span>
                </div>
              </Link>
            ))}

            {searchTerm && searchTerm.length > 0 && filteredProducts.length === 0 && (
              <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}