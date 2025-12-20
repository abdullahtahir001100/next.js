"use client";
import { useState, useRef } from 'react';
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

  // Helper function to add hover property to products
  const addHoverToProducts = (products) => {
    return products.map(product => ({
      ...product,
      hover: product.hover || product.image
    }));
  };
  const imageData = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces.jpg?v=1755453589&width=1880", alt: "Hammers" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Axes.jpg?v=1755453418&width=1880", alt: "Axes" },
    { id: 3, src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor.jpg?v=1755453696&width=1880", alt: "Shields" },
    { id: 4, src: "https://vikingarmoryblades.com/cdn/shop/files/Swords.jpg?v=1755453830&width=1880", alt: "Swords" },
    { id: 5, src: "https://vikingarmoryblades.com/cdn/shop/files/Chef_set.jpg?v=1755453524&width=1880", alt: "Chef Sets" },
    { id: 6, src: "https://vikingarmoryblades.com/cdn/shop/files/Knives_Daggers.jpg?v=1755453627&width=1880", alt: "Daggers" },
  ];

  // 2. Info Bar Data
  const textData = [
    { id: 1, src: '/world.png', text: 'Safe and Secure Shipping' },
    { id: 2, src: '/world.png', text: 'Premium Quality Materials' },
    { id: 3, src: '/world.png', text: '24/7 Customer Support' },
  ];

  // 3. Product Slider Data (Using Image for Wishlist)
  const bestproductData = [
    {
      id: 1,
      name: "Custom Design Copperkhjhkjh Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      hover: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      id: 1,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png",  // Ensure this image is nessery to add 
      onSale: true, //also this 
      vendor: "Viking Armory Blades",
      stock: 6, // according to orders 
      productType: "Viking Sword", // catagory
      recentSales: "3 sold in last 16 hours", // according to data
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade...",
      smallimages:[]

    },
    {
      id: 2,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      id: 1,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
      onSale: true,
      vendor: "Viking Armory Blades",
      stock: 6,
      productType: "Viking Sword",
      recentSales: "3 sold in last 16 hours",
      description: "Hand-Forged 34” Damascus Viking Claymore Sword – Battle-Ready, Collector Grade..."

    },
    {
      id: 2,
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "/9gAAeSwpLFoi3Pz_1570x.webp",
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
      wishlistIcon: "/heart (3).png", // Ensure this image exists in your public folder
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
  ]
  const col_3 = [
    { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces_81c27014-cb95-4eaf-80c2-27b558e49409_523x.jpg?v=1755454344" },
    { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Spear_polearms_7689e6ac-351e-4067-9fde-6584f6519337_523x.jpg?v=1755454401" },
    { id: 3, src: "https://vikingarmoryblades.com/cdn/shop/files/Spear_polearms_7689e6ac-351e-4067-9fde-6584f6519337_523x.jpg?v=1755454401" },
  ]
const aboutImg = 'https://vikingarmoryblades.com/cdn/shop/files/about_1_940x.jpg?v=1755454731'
const aboutText = 'Welcome to Viking Armory Blades – Where History Lives On Welcome to Viking Armory Blades — where history, craftsmanship, and strength unite. Our mission is to bring the spirit of the Vikings and medieval warriors to life through authentic swords, axes, knives, and armory collectibles. Whether you’re a collector, reenactor, or simply someone who appreciates fine craftsmanship, our blades are built to inspire and endure. Each piece is forged with precision and passion, using premium materials and traditional techniques blended with modern durability. At Viking Armory Blades, we serve those who value authenticity, heritage, and timeless design — delivering weapons and collectibles that are not only powerful to hold but meaningful to own.'
  return (
    <>
      <Animate_slider />
      <Header />
      <Header_1 />

      {/* Main Hero Slider */}
      <section className="swiper-container-wrapper">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
        >
          {imageData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="images">
                <div className="img1">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1880}
                    height={750}
                    style={{ width: '100%', height: 'auto' }}
                    priority={item.id === 1}
                  />
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

      {/* Info/Features Slider */}
      <section className="info-slider">
        <div className="container">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}

            navigation
            breakpoints={{
              320: { slidesPerView: 1 },
              708: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {textData.map((obj) => (
              <SwiperSlide key={obj.id}>
                <div className="flex">
                  <div className="image">
                    <Image src={obj.src} alt={obj.text} width={40} height={40} />
                  </div>
                  <div className="text">
                    <p>{obj.text}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Best Seller Section with Product Swiper */}
      <section className="products linebar">
        <div className="container">
          <div className="flexbox">
            <h1>Best Seller</h1>
            <Link href='/'>Shop All</Link>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            slidesPerGroup={4}
            loop={true}
            watchSlidesProgress={true}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 15 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="product-swiper"
          >
            {addHoverToProducts(bestproductData).map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className="products">
        <div className="container">
          <div className="flexbox">
            <h1>Sword</h1>
            <Link href='/'>Shop All</Link>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            slidesPerGroup={4}
            loop={true}
            watchSlidesProgress={true}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="product-swiper"
          >
            {addHoverToProducts(swordproductData).map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
     

      {/* NEW: Grid Image Section (Instagram Style) */}
      <section className="image-grid-section">
        <div className="container">
          <h1>Our Categories</h1>
          <div className="flex">
            {col_1.map((item) => (
              <div className="col_" key={item.id}>
                <div className="image">
                  <Image
                    src={item.src}
                    alt={`Gallery ${item.id}`}
                   width={300}
                   height={300}
                    className="img"
                  />
                </div>
              </div>
            ))}

          </div>
            <div className="flex">
            {col_2.map((item) => (
              <div className="col_" key={item.id}>
                <div className="image">
                  <Image
                    src={item.src}
                    alt={`Gallery ${item.id}`}
                   width={300}
                   height={300}
                    className="img"
                  />
                </div>
              </div>
            ))}

          </div>
            <div className="flex">
            {col_3.map((item) => (
              <div className="col_" key={item.id}>
                <div className="image">
                  <Image
                    src={item.src}
                    alt={`Gallery ${item.id}`}
                   width={600}
                   height={600}
                    className="img"
                  />
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>
<section className='about'>
  <div className="container">
    <div className="flex">
      <div className="col_"><div className="image">
        <Image
        src={aboutImg}
        width={300}
        height={300}
        alt='io'
        ></Image>
      </div></div>
      <div className="col_">
        <div className="content">
        <div className="headings">
          <h2>Manufacturer & Exporter</h2>
         <Link href=''> <h1>About Us</h1></Link>
        </div>
        <div className="graph">
          <p>
            {aboutText}
          </p>
          
        </div>
        <div className="btn">
          <Link href='/'>Read More</Link>
        </div>
      </div>
      </div>
    </div>
  </div>
</section>
<section className="products arrow">
        <div className="container">
          <div className="flexbox">
            <h1>Featured Products</h1>
            <Link href='/'>Shop All</Link>
          </div>

          <Swiper
            modules={[Pagination,Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            slidesPerGroup={4}
            loop={true}
            watchSlidesProgress={true}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 15 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="product-swiper"
          >
            {addHoverToProducts(relatedproductData).map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className='h'>

      </section>
      <Footer/>
    </>
  );
}