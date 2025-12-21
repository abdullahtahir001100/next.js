"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import gsap from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Header from "./components/header_main";
import Header_1 from "./components/header";
import Footer from "./components/footer";
import Animate_slider from "./components/animate_slider";
import ProductCard from "./components/product_card";

export default function Home() {
  // --- SEARCH STATES & REFS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const popupRef = useRef(null);

  // Helper function to add hover property
  const addHoverToProducts = (products) => {
    return products.map(product => ({
      ...product,
      hover: product.hover || product.image
    }));
  };

  // --- NEW: CLOSE SEARCH LOGIC ---
  const handleCloseSearch = () => {
    setSearchTerm("");
  };

  // --- NEW: CLICK OUTSIDE LOGIC (DO NOT ERASE) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if search is active
      if (searchTerm.length > 0) {
        // Check if click is outside popup AND outside the header
        const isOutsidePopup = popupRef.current && !popupRef.current.contains(event.target);
        const isOutsideHeader = !event.target.closest('.main_header');

        if (isOutsidePopup && isOutsideHeader) {
          handleCloseSearch();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchTerm]);

  // --- DATA SETS ---
  const imageData = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces.jpg?v=1755453589&width=1880", alt: "Hammers" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Axes.jpg?v=1755453418&width=1880", alt: "Axes" },
    { id: 3, src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor.jpg?v=1755453696&width=1880", alt: "Shields" },
    { id: 4, src: "https://vikingarmoryblades.com/cdn/shop/files/Swords.jpg?v=1755453830&width=1880", alt: "Swords" },
    { id: 5, src: "https://vikingarmoryblades.com/cdn/shop/files/Chef_set.jpg?v=1755453524&width=1880", alt: "Chef Sets" },
    { id: 6, src: "https://vikingarmoryblades.com/cdn/shop/files/Knives_Daggers.jpg?v=1755453627&width=1880", alt: "Daggers" },
  ];

  const textData = [
    { id: 1, src: '/world.png', text: 'Safe and Secure Shipping' },
    { id: 2, src: '/world.png', text: 'Premium Quality Materials' },
    { id: 3, src: '/world.png', text: '24/7 Customer Support' },
  ];

  const bestproductData = [
    {
      id: 1,
      name: "Custom Design Copperkhjhkjh Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      hover: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: false,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34 Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 2,
      hover: "/9gAAeSwpLFoi3Pz_1570x.webp",
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 3,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 4,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 5,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
  ];

  const relatedproductData = [
    {
      id: 6,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade...",
      smallimages: []
    },
    {
      id: 7,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 8,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 9,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 10,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
  ];

  const swordproductData = [
    {
      id: 11,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 12,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 13,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 14,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
    {
      id: 15,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."
    },
  ];

  const col_1 = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Swords_abbe2de0-01ee-4e0f-bcd6-944b5202a3f5_523x.jpg?v=1755454036" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Axes_a9866a7b-9759-4f11-80c2-4c92de0288a9_523x.jpg?v=1755454075" },
    { id: 3, src: "https://vikingarmoryblades.com/cdn/shop/files/Knives_Daggers_27e67282-fbd5-4e4c-be79-8dd5a13bce95_523x.jpg?v=1755454130" },
  ];

  const col_2 = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor_d0abbb7f-b750-4222-9580-898e3b676292_785x.jpg?v=1755454449" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor_d0abbb7f-b750-4222-9580-898e3b676292_785x.jpg?v=1755454449" },
  ];

  const col_3 = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces_81c27014-cb95-4eaf-80c2-27b558e49409_523x.jpg?v=1755454344" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Spear_polearms_7689e6ac-351e-4067-9fde-6584f6519337_523x.jpg?v=1755454401" },
    { id: 3, src: "https://vikingarmoryblades.com/cdn/shop/files/Spear_polearms_7689e6ac-351e-4067-9fde-6584f6519337_523x.jpg?v=1755454401" },
  ];

  const aboutImg = 'https://vikingarmoryblades.com/cdn/shop/files/about_1_940x.jpg?v=1755454731';
  const aboutText = 'Welcome to Viking Armory Blades – Where History Lives On Welcome to Viking Armory Blades — where history, craftsmanship, and strength unite. Our mission is to bring the spirit of the Vikings and medieval warriors to life through authentic swords, axes, knives, and armory collectibles. Whether you’re a collector, reenactor, or simply someone who appreciates fine craftsmanship, our blades are built to inspire and endure. Each piece is forged with precision and passion, using premium materials and traditional techniques blended with modern durability. At Viking Armory Blades, we serve those who value authenticity, heritage, and timeless design — delivering weapons and collectibles that are not only powerful to hold but meaningful to own.';

  const popularProducts = [
    {
      id: 1,
      title: "Damascus Steel Axe",
      price: "$89.00",
      src: "https://vikingarmoryblades.com/cdn/shop/files/Axes.jpg?v=1755453418&width=1880"
    },
    {
      id: 2,
      title: "Viking Claymore Sword",
      price: "$199.00",
      src: "https://vikingarmoryblades.com/cdn/shop/files/Swords.jpg?v=1755453830&width=1880"
    },
    {
      id: 3,
      title: "Warrior Shield",
      price: "$120.00",
      src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor.jpg?v=1755453696&width=1880"
    }
  ];

  // --- SEARCH LOGIC & ANIMATION ---
  useEffect(() => {
    const allProducts = [...bestproductData, ...swordproductData, ...relatedproductData];

    if (searchTerm.trim().length > 0) {
      const filtered = allProducts.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);

      // GSAP Show Animation
      gsap.to(popupRef.current, {
        display: "block",
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    } else {
      // GSAP Hide Animation
      gsap.to(popupRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => gsap.set(popupRef.current, { display: "none" })
      });
    }
  }, [searchTerm]);

  return (
    <>
      <Animate_slider />
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Header_1 />

      {/* Hero Slider */}
      <section className="swiper-container-wrapper">
        <Swiper modules={[Pagination, Autoplay]} slidesPerView={1} pagination={{ clickable: true }} autoplay={{ delay: 5000 }}>
          {imageData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="images">
                <div className="img1">
                  <Image src={item.src} alt={item.alt} width={1880} height={750} priority={item.id === 1} />
                </div>
              </div>
            </SwiperSlide>
          ))}
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
          <Swiper modules={[Navigation, Autoplay]} spaceBetween={20} slidesPerView={3} navigation
            breakpoints={{ 320: { slidesPerView: 1 }, 708: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {textData.map((obj) => (
              <SwiperSlide key={obj.id}>
                <div className="flex">
                  <div className="image"><Image src={obj.src} alt={obj.text} width={40} height={40} /></div>
                  <div className="text"><p>{obj.text}</p></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="products linebar">
        <div className="container">
          <div className="flexbox"><h1>Best Seller</h1><Link href='/'>Shop All</Link></div>
          <Swiper modules={[Pagination, Autoplay]} spaceBetween={10} slidesPerView={4} navigation pagination={{ clickable: true }}
            breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
            {addHoverToProducts(bestproductData).map((product) => (
              <SwiperSlide key={product.id}><ProductCard product={product} /></SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
       <section className="products">
        <div className="container">
          <div className="flexbox"><h1>Sword</h1><Link href='/'>Shop All</Link></div>
          <Swiper modules={[Pagination, Autoplay]} spaceBetween={10} slidesPerView={4} navigation pagination={{ clickable: true }}
            breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
            {addHoverToProducts(swordproductData).map((product) => (
              <SwiperSlide key={product.id}><ProductCard product={product} /></SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* Image Grid Section */}
      <section className="image-grid-section">
        <div className="container">
          <h1>Our Categories</h1>
          <div className="flex">{col_1.map(item => <div className="col_" key={item.id}><div className="image"><Image src={item.src} alt="Gallery" width={300} height={300} className="img" /></div></div>)}</div>
          <div className="flex">{col_2.map(item => <div className="col_" key={item.id}><div className="image"><Image src={item.src} alt="Gallery" width={300} height={300} className="img" /></div></div>)}</div>
          <div className="flex">{col_3.map(item => <div className="col_" key={item.id}><div className="image"><Image src={item.src} alt="Gallery" width={600} height={600} className="img" /></div></div>)}</div>
        </div>
      </section>
  <section className="products">
        <div className="container">
          <div className="flexbox"><h1>Related Products</h1><Link href='/'>Shop All</Link></div>
          <Swiper modules={[Pagination, Autoplay]} spaceBetween={10} slidesPerView={4} navigation pagination={{ clickable: true }}
            breakpoints={{ 320: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}>
            {addHoverToProducts(relatedproductData).map((product) => (
              <SwiperSlide key={product.id}><ProductCard product={product} /></SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* About Section */}
      <section className='about'>
        <div className="container">
          <div className="flex">
            <div className="col_"><div className="image"><Image src={aboutImg} width={300} height={300} alt='about' /></div></div>
            <div className="col_">
              <div className="content">
                <div className="headings"><h2>Manufacturer & Exporter</h2><Link href=''><h1>About Us</h1></Link></div>
                <div className="graph"><p>{aboutText}</p></div>
                <div className="btn"><Link href='/'>READ MORE</Link></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* --- GLOBAL SEARCH POPUP (GSAP ANIMATED) --- */}
      <div
        ref={popupRef}
        className="pop_search"
        style={{ display: 'none', opacity: 0, transform: 'translateY(-20px)' }}
      >
        <div className="container">
          {/* Close Button UI */}
          <button
            className="close_x_btn"
            onClick={handleCloseSearch}
            aria-label="Close"
          >
            ✕
          </button>

          <h2>{searchTerm.length > 0 ? `Search Results for "${searchTerm}"` : "Popular Products"}</h2>

          <div className="search_scroll_wrapper">
            <div className="flex search_results_grid" style={{ flexWrap: 'wrap', gap: '20px' }}>
              {/* Show Filtered Results if searching, else show Popular Products */}
              {(searchTerm.length > 0 ? filteredProducts : popularProducts).map((item) => (
                <div className="col_" key={item.id || item.title} style={{ width: '180px' }}>
                  <div className="image search_full_img" >
                    <Image
                      src={item.image || item.src}
                      alt={item.name || item.title}
                      width={180}
                      height={180}
                      objectFit="cover"
                    />
                  </div>
                  <div className="title name_truncate" >
                    {item.name || item.title}
                  </div>
                  <div className="price">
                    {item.salePrice || item.price}
                  </div>
                </div>
              ))}
              {searchTerm.length > 0 && filteredProducts.length === 0 && (
                <p style={{ width: '100%', textAlign: 'center', padding: '20px' }}>No products found matching your search.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <aside></aside>
    </>
  );
}