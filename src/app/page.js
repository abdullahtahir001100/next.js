"use client";
<<<<<<< HEAD
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
      hover: "https://vikingarmoryblades.com/cdn/shop/files/tVoAAeSw1iZoeKQF_1570x.jpg?v=1756831721",
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
      hover: "https://vikingarmoryblades.com/cdn/shop/files/tVoAAeSw1iZoeKQF_1570x.jpg?v=1756831721",
      name: "Custom Design Copper Damascus Folding Knife – Pocket Blade",
      price: "$145.00",
      salePrice: "$69.69",
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
      image: "https://vikingarmoryblades.com/cdn/shop/files/9gAAeSwpLFoi3Pz_1570x.jpg?v=1756831210",
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
=======
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function Home() {

  const [selectedDate, setSelectedDate] = useState(null);
  const formOneRef = useRef(null);
  const formTwoRef = useRef(null);
  const optionsRef = useRef(null);
  const optionRef = useRef(null);
  useLayoutEffect(() => {
    gsap.set(formTwoRef.current, {
      autoAlpha: 0,
      y: -90,
      scale: 0.95,
    });

    gsap.set(formOneRef.current, {
      autoAlpha: 1,
      y: 0,
    });

    gsap.set(optionsRef.current, {
      backgroundColor: "rgba(62, 65, 148, 0.04)",
      color: "#000",
    });
  }, []);

  /* ----------------------------------
     SHOW FORM 2
  ---------------------------------- */
  const hide_bar_1 = () => {
    gsap.timeline({ overwrite: true })

    .to(optionsRef.current, {
        backgroundColor: "transparent",
        color: "#000",
         duration:0
      })
      .to(optionRef.current, {
        backgroundColor: "rgba(62, 65, 148, 0.04)",
        color: "#000",
        borderRadius:'10px 10px 0 0',
         duration:0
      })
      .to(formOneRef.current, {
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.inOut",
      })
      
      
      .to(
        formTwoRef.current,
        {
          autoAlpha: 1,
          y: -86,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.1"
      );
  };

  /* ----------------------------------
     SHOW FORM 1
  ---------------------------------- */
  const hide_bar_2 = () => {
    gsap.timeline({ overwrite: true })
    .to(optionRef.current, {
        backgroundColor: "transparent",
        color: "#000",
        duration:0
      })
      .to(optionsRef.current, {
        backgroundColor: "rgba(62, 65, 148, 0.04)",
        color: "#000",
        borderRadius:'10px 10px 0 0',
         duration:0

      })
      .to(formTwoRef.current, {
        autoAlpha: 0,
        y: 100,
        scale: 0.95,
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(
        formOneRef.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.1"
      );
  };


  return (
    <>
      <section className="banner">
        <div className="contain">
          <div className="centerText">
            <h1>
              FastUK Couriers – Swift, Transparent Courier Services Across the UK
            </h1>
            <p>
              Book deliveries in minutes, track in real time, trusted riders on the road.
            </p>
          </div>

          <div className="full_bar">
            <div className="flexstart">
              <div className="options" ref={optionsRef} onClick={hide_bar_2}>
                <h5>Shipping</h5>
              </div>
              <div className="option" onClick={hide_bar_1} ref={optionRef}>
                <h5>Tracking</h5>
              </div>
            </div>
            <form action="" ref={formOneRef}>
              <div className="verti_bar flexbox">

                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">From:</label>
                    <input type="text" placeholder="Manchester" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">To:</label>

                    <input type="text" placeholder="Birmingham" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Enter date"
                      dateFormat="dd MMM yyyy"
                      className="soft-rounded-input"
                      calendarClassName="soft-rounded-calendar"
                    />
                  </div>

                </div>


                <div className="search">
                  <button type="submit" className="seatch_color">

                    <div className="image">
                      <img src="/images/MagnifyingGlass (1).png" alt="" />
                    </div>

                  </button>
                </div>
              </div>
            </form>
            <form action="" ref={formTwoRef}>
              <div className="verti_bar flexbox">

                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">From:</label>
                    <input type="text" placeholder="Manchester" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">To:</label>

                    <input type="text" placeholder="Birmingham" />
                  </div>
                  <div className="icon">
                    <div className="image">
                      <img src="images/MapPin.png" alt="" />
                    </div>
                  </div>
                </div>


                <div className="flexbox vertical_line">
                  <div className="headings">
                    <label htmlFor="">Date:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Select date"
                      dateFormat="dd MMM yyyy"
                      className="soft-rounded-input"
                      calendarClassName="soft-rounded-calendar"
                    />
                  </div>

                </div>


                <div className="search">
                  <button type="submit" className="seatch_color">

                    <div className="image">
                      <img src="/images/MagnifyingGlass (1).png" alt="" />
                    </div>

                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="stats">
        <div className="contain">
          <div className="flexwrap">
            <div className="boxes">
              <div className="image">
                <img src="/images/image 1.png" alt="" />
              </div>
              <div className="box">
                <div className="num">
                  5,300+
                </div>
                <p>Successful parcel deliveries completed</p>
              </div>
            </div>
            <div className="boxes">
              <div className="image">
                <img src="/images/Rectangle 2.svg" alt="" />
              </div>
            </div>
            <div className="boxes">
              <div className="image">
                <img src="/images/image 2.svg" alt="" />
              </div>
              <div className="box">
                <div className="num">
                  5,300+
                </div>
                <p>Successful parcel deliveries completed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="howitworks">
        <div className="contain">
          <div className="flex">
            <div className="col_ flexbox">
              <div className="texts">
                <h2>How FastUK Supports Every Type of Sender</h2>
              </div>
              <div className="image">
                <img src="/images/Rectangle 4.svg" alt="" />
              </div>
            </div>
            <div className="col_">
              <div className="content flexbox">
                <li className="col_1">
                  <h3>Grow Your Reach</h3>
                  <p>Expand your delivery network through our nationwide rider fleet. Whether you’re an individual sending a one-time parcel or a business shipping daily, we help you deliver faster and build trust with your customers.</p>
                </li>
                <li className="col_1">
                  <h3>Configured For Your Needs</h3>
                  <p>Our platform is built for both personal and business use. From quick sign-ups to customized delivery options, you get full control over how, when, and where your parcels are collected and dropped off.</p>
                </li>
                <li className="col_1">
                  <h3>Secure & Reliable at Every Step</h3>
                  <p>Every delivery is tracked in real time, with complete data security and transparent communication between users and riders — so you always know where your parcel is.</p>
                </li>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="tracker">
        <div className="contain">
          <div className="main_heading">
            <h2>A Smarter Way to Manage Deliveries</h2>
          </div>
          <div className="flex">
            <div className="col_1">
              <strong>01</strong>
              <h4>On-Demand Booking</h4>
              <p>Book a pickup in minutes through our web platform.</p>
            </div>
            <div className="col_1">
              <strong>02</strong>
              <h4>Transparent Pricing</h4>
              <p>Know your costs upfront based on distance.</p>
            </div>
            <div className="col_1">
              <strong>03</strong>
              <h4>Real-Time Tracking</h4>
              <p>Follow your parcel every step of the way.</p>
            </div>
            <div className="col_1">
              <strong>04</strong>
              <h4>Rider Network</h4>
              <p>Trusted riders assigned instantly within your area.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="Delivery">
        <div className="contain">
          <div className="flex">
            <div className="col_">
              <div className="content">
                <h2>One Platform for All Your Delivery Needs</h2>
                <p>FastUK connects senders and riders through a seamless system. From individual parcels to regular business shipments, we handle everything from booking to delivery — with clear pricing, reliable service, and live tracking to keep you in control.</p>
              </div>
              <div className="flexwrap">
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 4.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Fast Pickups — Riders available within minutes.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 7.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Business Tools — Special pricing and dashboards for business accounts.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 5.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>Distance-Based Pricing — Fair, transparent charges for every parcel.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="image">
                    <img src="/images/image 6.svg" alt="" />
                  </div>
                  <div className="text">
                    <p>End-to-End Visibility — Track every delivery in real time.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col_">
              <div className="image">
                <img src="/images/image 10.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="services">
        <div className="contain">
          <div className="main_heading">
            <h1>Explore Our Core Services</h1>
            <p>Our local moving services are quick, efficient, and hassle-free. We handle everything from packing to unpacking, ensuring a stress-free transition.</p>
          </div>
          <div className="flexwrap">
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 7.png" alt="" />
              </div>
            </div>
            <div className="col_ flex">
              <div className="icon">
                01
              </div>
              <h4>Local Parcel Delivery</h4>
              <p>Book local deliveries quickly and get your parcel picked up and dropped off the same day. Whether you’re sending important documents, urgent parcels, or bulk orders, FastUK Couriers ensures your items reach their destination on time, every time</p>
              <div className="btn">
                <a href="">Explore Now</a>
              </div>
            </div>
            <div className="col_ flex">
              <div className="icon">
                02
              </div>
              <h4>Business & Bulk Shipments</h4>
              <p>Our business delivery solution is perfect for e-commerce stores, offices, and organizations that rely on consistent, timely logistics. Through your dedicated business dashboard, you can manage multiple parcels, schedule daily or weekly pickups, and access exclusive business rates that help you save on costs.</p>
              <div className="btn">
                <a href="">Explore Now</a>
              </div>
            </div>
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 4.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='Testimonials'>
        <div className="contain">
          <div className="flexbox">
            <div className="col_">
              <h2>We Provide Complete Assistance for Your Deliveries</h2>
              <div className="btn">
                <a href="List of Our Services">List of Our Services</a>
              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/crane 1.png" alt="" />
                </div>

                <h4>Door to Door Servcie</h4>
                <p>We pick up and deliver to any UK address.</p>

              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/earth 1.png" alt="" />
                </div>

                <h4>Live Parcel Tracking</h4>
                <p>Freight Transport – Road, air, and sea shipping for seamless global logistics.</p>

              </div>
            </div>
            <div className="col_">
              <div className="flexbox">
                <div className="image">
                  <img src="/images/earth 1 (1).png" alt="" />
                </div>

                <h4>Secure Handling</h4>
                <p>Every parcel is handled <br /> with care and <br /> accountability.</p>

              </div>
            </div>

          </div>
        </div>
      </section>
      <section className='section_1'>
        <div className="contain">
          <div className="bgcolor">
            <div className="flex">
              <div className="col_ content">
                <h2>Ready to Book Your Delivery? Let’s Do It Today!</h2>
                <p>Whether it’s a single parcel or daily business deliveries, FastUK Couriers gives you the speed, transparency, and reliability you need — all in one platform.</p>
                <div className="buttons">
                  <div className="btn"><a href="">
                    <div className="image">
                      <img src="/images/Call.svg" alt="" />
                    </div>
                    Request A Free Call
                  </a>
                  </div>
                  <div className="btn"><a href="">Let’s Contact Us</a></div>
                </div>
              </div>
              <div className="col_">
                <div className="image">
                  <img src="/images/image 11.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='last_section'>
        <div className="contain">
          <div className="flexbox">
            <div className="col_">
              <div className="image">
                <img src="/images/Rectangle 2.svg" alt="" />
              </div>
            </div>
            <div className="col_">
              <div className="content">
                <div className="flexgap">
                  <div className="main_head">
                    <h2>Customer Review</h2>
                    <p>We take pride in being your trusted home shifting partner. Relocation made stress-free with personalized assistance.</p>
                  </div>
                  <div className="blue_text">
                    <div className="flexgap">
                      <div className="image">
                        <img src="/images/Group 18581.svg" alt="" />
                      </div>
                      <div className="text">
                        <span>Fast Uk</span>
                      </div>
                    </div>
                  </div>
                  <div className="pera">
                    <p>“Our experience with the home shifting service was absolutely flawless, as the team handled every aspect of our move with precision and care. From the initial packing to the final setup at our new home, everything was done on time and without any stress.  The attention to detail they exhibited throughout the move was truly commendable and made the entire experience seamless. The staff was friendly and provided excellent customer support.”</p>
                  </div>
                  <div className="flexbox">
                    <div className="col_1">
                      <h3>Ryan Hughes</h3>
                      <h5>CEO at FastUk</h5>
                    </div>
                    <div className="col_1">
                      <div className="arrow"><button><div className="image"><img src="/images/Vector (1).svg" alt="" /></div></button></div>
                      <div className="arrow"><button><div className="image"><img src="/images/Vector (1).svg" alt="" /></div></button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
>>>>>>> 9f7322267dc4f0f5eeff189603527f07cbc0ff55
