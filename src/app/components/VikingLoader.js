"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
// import '../styles/loader.scss';

export default function VikingLoader() {
  const containerRef = useRef(null);
  const swordRef = useRef(null);
  const knifeRef = useRef(null);
  const shineRef = useRef(null);
  const sparksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // NO DELAY on start, NO DELAY between repeats
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

      // 1. INSTANT SETUP
      gsap.set(swordRef.current, { x: -120, y: -120, rotation: -45, opacity: 0 });
      gsap.set(knifeRef.current, { x: 120, y: 120, rotation: 45, opacity: 0 });
      gsap.set(shineRef.current, { x: -300, opacity: 0 }); 
      gsap.set(".spark", { scale: 0, opacity: 0 }); 

      // 2. THE STRIKE (Instant impact)
      tl.to([swordRef.current, knifeRef.current], {
        x: 0, y: 0, rotation: 0, opacity: 1,
        duration: 0.5,
        ease: "power4.in", // Heavy hit
      })

      // 3. IMPACT SHAKE & SPARKS
      .to(containerRef.current, {
        x: 6, duration: 0.04, repeat: 4, yoyo: true, clearProps: "x"
      })
      .to(".spark", {
        scale: (i) => Math.random() * 1.5 + 0.5,
        x: (i) => (Math.random() - 0.5) * 160,
        y: (i) => (Math.random() - 0.5) * 160,
        opacity: 1,
        duration: 0.05, // Fast flash
        ease: "power1.out"
      }, "<")
      .to(".spark", { opacity: 0, duration: 0.2 })

      // 4. THE SHINE
      .to(shineRef.current, {
        opacity: 0.9,
        x: 300,
        duration: 0.6,
        ease: "linear"
      }, "-=0.1")

      // 5. FADE OUT FAST
      .to([swordRef.current, knifeRef.current], {
        opacity: 0, scale: 0.95, duration: 0.2, delay: 0.3
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="viking-black-loader" ref={containerRef}>
      <div className="weapon-stage">
        <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* STEEL GRADIENT */}
            <linearGradient id="steelBlade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* GOLD HILT */}
            <linearGradient id="goldHilt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* LEATHER GRIP */}
            <linearGradient id="leatherGrip" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* SHINE EFFECT */}
            <linearGradient id="shineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* --- SWORD --- */}
          <g ref={swordRef} transformOrigin="center">
            <path d="M140 240 C130 230, 170 230, 160 240 C165 250, 135 250, 140 240" fill="url(#goldHilt)" stroke="#78350f" strokeWidth="1"/>
            <rect x="145" y="190" width="10" height="45" fill="url(#leatherGrip)" />
            <path d="M130 190 L170 190 L165 180 L135 180 Z" fill="url(#goldHilt)" stroke="#78350f" strokeWidth="1"/>
            <path d="M140 180 L140 40 L150 20 L160 40 L160 180 Z" fill="url(#steelBlade)" stroke="#1e293b" strokeWidth="1"/>
            <line x1="150" y1="175" x2="150" y2="50" stroke="#1e293b" strokeWidth="2" opacity="0.5"/>
          </g>

          {/* --- KNIFE --- */}
          <g ref={knifeRef} transformOrigin="center">
            <path d="M130 160 L100 190 C 90 200, 110 210, 120 200 L 140 180 Z" fill="url(#leatherGrip)" stroke="#451a03" strokeWidth="1"/>
            <path d="M130 160 L140 180 L145 175 L135 155 Z" fill="url(#goldHilt)" />
            <path d="M135 155 L145 175 L200 140 L210 110 L135 155 Z" fill="url(#steelBlade)" stroke="#1e293b" strokeWidth="1"/>
          </g>

          {/* --- SPARKS --- */}
          <g ref={sparksRef} transform="translate(150, 150)">
             {[...Array(8)].map((_, i) => (
                <circle key={i} className="spark" r="2" fill="#fbbf24" />
             ))}
          </g>

          {/* --- SHINE --- */}
          <rect ref={shineRef} x="0" y="0" width="300" height="300" fill="url(#shineGrad)" style={{mixBlendMode: 'overlay'}} pointerEvents="none" />
        </svg>
      </div>
      <h3 className="loading-text">ARMORY...</h3>
    </div>
  );
}