"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import gsap from 'gsap';
import { useSearch } from './components/search'; 

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import VikingLoader from "./components/VikingLoader";
import ProductCard from "./components/product_card";
import QuickViewModal from "./components/QuickViewModal";

// --- CONSTANTS ---
const FALLBACK_IMG = "https://placehold.co/600x400?text=No+Image";

export default function Home() {
  const { searchTerm } = useSearch();
  const popupRef = useRef(null);

  // --- STATES ---
  const [heroImages, setHeroImages] = useState([]);
  const [infoBar, setInfoBar] = useState([]);
  const [categories, setCategories] = useState({ col_1: [], col_2: [], col_3: [] });
  const [about, setAbout] = useState(null); 
  
  const [bestSellers, setBestSellers] = useState([]);
  const [swords, setSwords] = useState([]);
  const [related, setRelated] = useState([]);
  
  // Search States
  const [allProducts, setAllProducts] = useState([]); // Will hold FULL inventory
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // --- MODAL STATES ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- MODAL HANDLERS ---
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Optional delay to clear data after animation closes
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // --- HELPER: CLEAN DATA ---
  const cleanSrc = (src) => {
    if (!src) return FALLBACK_IMG;
    if (src === "") return FALLBACK_IMG;
    if (src.startsWith("blob:")) return FALLBACK_IMG; 
    return src;
  };

  const cleanProduct = (p) => ({
    ...p,
    mainImage: cleanSrc(p.mainImage)
  });

  // --- CLICK TRACKING ---
  const trackProductClick = (productId) => {
    if (!productId) return;
    try {
      fetch(`/api/products/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      }).catch(err => console.log("Tracking skipped"));
    } catch (e) { /* ignore */ }
  };

  // --- FETCH DATA ---
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch CMS Content
        const [heroRes, infoRes, catRes, aboutRes] = await Promise.all([
          fetch('/api/content?type=hero_slider').then(r => r.json()).catch(() => []),
          fetch('/api/content?type=info_bar').then(r => r.json()).catch(() => []),
          fetch('/api/content?type=categories').then(r => r.json()).catch(() => ({})),
          fetch('/api/content?type=about_section').then(r => r.json()).catch(() => null),
        ]);

        // 2. Fetch Homepage Sections (FIXED URL: /api/products)
        const [bestRes, swordRes, relatedRes, allRes] = await Promise.all([
          fetch('/api/products?section=best-seller&sort=clicks').then(r => r.json()).catch(() => ({ products: [] })),
          fetch('/api/products?section=sword').then(r => r.json()).catch(() => ({ products: [] })),
          fetch('/api/products?section=related').then(r => r.json()).catch(() => ({ products: [] })),
          fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] })),
        ]);

        // Helper to extract product array regardless of API format
        const extract = (data) => {
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.products)) return data.products;
            return [];
        };

        // --- PROCESS & SET STATES ---
        
        // Hero
        const cleanHero = Array.isArray(heroRes) ? heroRes.map(h => ({ ...h, src: cleanSrc(h.src) })) : [];
        setHeroImages(cleanHero);

        // Info
        const cleanInfo = Array.isArray(infoRes) ? infoRes.map(i => ({ ...i, src: cleanSrc(i.src) })) : [];
        setInfoBar(cleanInfo);
        
        // Categories
        setCategories({
          col_1: Array.isArray(catRes?.col_1) ? catRes.col_1.map(i => ({...i, src: cleanSrc(i.src)})) : [],
          col_2: Array.isArray(catRes?.col_2) ? catRes.col_2.map(i => ({...i, src: cleanSrc(i.src)})) : [],
          col_3: Array.isArray(catRes?.col_3) ? catRes.col_3.map(i => ({...i, src: cleanSrc(i.src)})) : [],
        });

        // About
        setAbout({
            text: aboutRes?.text || "",
            src: cleanSrc(aboutRes?.src)
        });

        // Product Sections (Using extraction helper to prevent empty UI)
        setBestSellers(extract(bestRes).map(cleanProduct));
        setSwords(extract(swordRes).map(cleanProduct));
        setRelated(extract(relatedRes).map(cleanProduct));
        setAllProducts(extract(allRes).map(cleanProduct));

      } catch (error) {
        console.error("Critical Data Load Error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- SEARCH ANIMATION & LOGIC ---
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) return;

    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.toLowerCase();
      // Filter the FULL product list
      const filtered = allProducts.filter(item => 
        item.name && item.name.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);

      if (popupRef.current) {
        gsap.to(popupRef.current, { display: "block", opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
    } else {
      if (popupRef.current) {
        gsap.to(popupRef.current, { 
            opacity: 0, 
            y: -20, 
            duration: 0.3, 
            onComplete: () => gsap.set(popupRef.current, { display: "none" }) 
        });
      }
    }
  }, [searchTerm, allProducts]);

  if (loading) return <div><VikingLoader /></div>;

  return (
  <main>
      <>
      {/* QUICK VIEW POPUP MODAL */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />

      {/* Hero Slider */}
      <section className="swiper-container-wrapper">
        <Swiper modules={[Pagination, Autoplay]} 
        slidesPerView={1} 
        pagination={{ clickable: true }}
         autoplay={{ delay: 5000 }}
         loop={true}
         >
          {heroImages.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="images">
                <div className="img1">
                   <img 
                      src={item.src} 
                      alt={item.alt || "Hero Banner"} 
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                      onError={(e) => e.target.src = FALLBACK_IMG}
                   />
                </div>
              </div>
            </SwiperSlide>
          ))}
          {heroImages.length === 0 && (
             <SwiperSlide 
               loop={true}
             >
                 <img src={FALLBACK_IMG} alt="Fallback" style={{ width: '100%', height: 'auto' }} />
             </SwiperSlide>
          )}
        </Swiper>
      </section>

      {/* Promo Banner */}
      <section className='banner_ad'>
        <div className="container">
          <div className="flex">
            <h4>SALE 5% OFF FOR SUBSCRIBE TO OUR NEWSLETTER</h4>
            <button>Shop Now</button>
          </div>
        </div>
      </section>

      {/* Info Slider */}
      <section className="info-slider">
        <div className="container">
          {infoBar.length > 0 && (
            <Swiper modules={[Navigation, Autoplay]} spaceBetween={20} slidesPerView={3}    loop={true} navigation
               breakpoints={{ 320: { slidesPerView: 1 }, 708: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } }>
                {infoBar.map((obj, index) => (
                <SwiperSlide key={index}>
                    <div className="flex">
                    <div className="image">
                        <img 
                            src={obj.src} 
                            alt="icon" 
                            width={40} height={40} 
                            onError={(e) => e.target.src = FALLBACK_IMG}
                        />
                    </div>
                    <div className="text"><p>{obj.text || "Info"}</p></div>
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="products linebar">
        <div className="container">
          <div className="flexbox"><h1>Best Seller</h1><Link href='/'>Shop All</Link></div>
          {bestSellers.length > 0 ? (
            <Swiper modules={[Pagination, Autoplay]} spaceBetween={10} slidesPerView={4}   loop={true} navigation pagination={{ clickable: true }}
               breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
                {bestSellers.map((product) => (
                <SwiperSlide key={product._id}>
                    <div onClick={() => trackProductClick(product._id)} style={{ cursor: 'pointer' }}>
                        <ProductCard product={product} onQuickView={handleQuickView} />
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
          ) : <div style={{textAlign:'center', padding:20}}>No Products Found</div>}
        </div>
      </section>

      {/* Sword Section */}
      <section className="products">
        <div className="container">
          <div className="flexbox"><h1>Sword</h1><Link href='/'>Shop All</Link></div>
          {swords.length > 0 && (
            <Swiper modules={[Pagination, Autoplay]}   loop={true} spaceBetween={10} slidesPerView={4} navigation pagination={{ clickable: true }}
               breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
                {swords.map((product) => (
                <SwiperSlide key={product._id}>
                    <div onClick={() => trackProductClick(product._id)} style={{ cursor: 'pointer' }}>
                        <ProductCard product={product} onQuickView={handleQuickView} />
                    </div>
                </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="image-grid-section">
        <div className="container">
          <h1>Our Categories</h1>
          <div className="flex">
            {categories.col_1.map((item, idx) => (
              <div className="col_" key={idx}>
                 <div className="image">
                    <img 
                        src={item.src} 
                        alt="Cat" 
                        style={{width:'100%', height:'auto', display:'block'}} 
                        onError={(e) => e.target.src = FALLBACK_IMG}
                    />
                 </div>
              </div>
            ))}
          </div>
          <div className="flex">
            {categories.col_2.map((item, idx) => (
              <div className="col_" key={idx}>
                 <div className="image">
                    <img src={item.src} alt="Cat" style={{width:'100%', height:'auto', display:'block'}} onError={(e) => e.target.src = FALLBACK_IMG} />
                 </div>
              </div>
            ))}
          </div>
          <div className="flex">
            {categories.col_3.map((item, idx) => (
              <div className="col_" key={idx}>
                 <div className="image">
                    <img src={item.src} alt="Cat" style={{width:'100%', height:'auto', display:'block'}} onError={(e) => e.target.src = FALLBACK_IMG} />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='about'>
        <div className="container">
          <div className="flex">
            <div className="col_">
              <div className="image">
                <img 
                    src={about?.src || FALLBACK_IMG} 
                    alt="About" 
                    style={{maxWidth:'100%', height:'auto'}} 
                    onError={(e) => e.target.src = FALLBACK_IMG}
                />
              </div>
            </div>
            <div className="col_">
              <div className="content">
                <div className="headings"><h2>Manufacturer & Exporter</h2><Link href='/about'><h1>About Us</h1></Link></div>
                <div className="graph"><p>{about?.text || "Welcome..."}</p></div>
                <div className="btn"><Link href='/about'>READ MORE</Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="products">
        <div className="container">
          <div className="flexbox"><h1>Related Products</h1><Link href='/'>Shop All</Link></div>
          {related.length > 0 && (
             <Swiper modules={[Pagination, Autoplay]}  loop={true} spaceBetween={10} slidesPerView={4} navigation pagination={{ clickable: true }}
             breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
             {related.map((product) => (
               <SwiperSlide key={product._id}>
                  <div onClick={() => trackProductClick(product._id)} style={{ cursor: 'pointer' }}>
                     <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
               </SwiperSlide>
             ))}
           </Swiper>
          )}
        </div>
      </section>

      {/* Search Popup */}
      <aside ref={popupRef} style={{ display: 'none', opacity: 0 }} className="pop_search">
          <div className="search_results">
            {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                <Link 
                    key={p._id} 
                    href={`/detailProduct/${p._id}`} 
                    className="search_item"
                    onClick={() => trackProductClick(p._id)} 
                    style={{display: 'flex', alignItems: 'center', padding: '10px', textDecoration: 'none', borderBottom: '1px solid #eee'}}
                >
                    <img 
                        src={p.mainImage || FALLBACK_IMG} 
                        width={50} height={50} 
                        alt={p.name}
                        style={{objectFit: 'cover', borderRadius: '4px', marginRight: '10px'}}
                        onError={(e) => e.target.src = FALLBACK_IMG} 
                    />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={{color: '#333', fontWeight: '500'}}>{p.name}</span>
                        <span style={{color: '#666', fontSize: '0.9em'}}>${p.price}</span>
                    </div>
                </Link>
                ))
            ) : (
                <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                    No products found matching "{searchTerm}"
                </div>
            )}
          </div>
      </aside>
    </>
  </main>
  );
}