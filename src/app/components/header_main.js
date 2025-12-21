"use client";
import { useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

export default function Header({ searchTerm, onSearchChange, onBurgerClick, isMenuOpen }) {
    const inputRef = useRef(null);
    
    // Using constants for cleaner JSX
    const LOGO_URL = "https://vikingarmoryblades.com/cdn/shop/files/Viking_Armory_Blades_Logo.webp?v=1755453192&width=300";
    const ICONS = {
        search: '/search.png',
        wishlist: '/like.png',
        profile: '/profile (1).png',
        cart: '/shopping-cart.png',
        burger: '/burger-bar.png',
        mobileSearch: '/search-interface-symbol.png'
    };

    // HIGH PRACTICE: Optimized GSAP with useCallback
    const handleFocus = useCallback(() => {
        if (!inputRef.current) return;
        
        // Save placeholder if not already saved
        if (!inputRef.current.dataset.placeholder) {
            inputRef.current.dataset.placeholder = inputRef.current.placeholder;
        }

        gsap.to(inputRef.current, {
            duration: 0.2,
            ease: "power2.out",
            onStart: () => {
                inputRef.current.placeholder = "";
            }
        });
    }, []);

    const handleBlur = useCallback(() => {
        if (!inputRef.current) return;
        
        if (inputRef.current.value === "") {
            inputRef.current.placeholder = inputRef.current.dataset.placeholder || "Search the store";
        }
    }, []);

    return (
        <header role="banner" className='main_header'>
            <div className="contain">
                <div className="flexbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* Mobile Controls */}
                    <div className="mobile_triggers flex desktop_hide">
                        <button 
                            className="burger_btn" 
                            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"} 
                            onClick={onBurgerClick}
                        >
                            {isMenuOpen ? <span>✕</span> : <Image src={ICONS.burger} alt="" width={24} height={24} />}
                        </button>
                        <button aria-label="Search">
                            <Image src={ICONS.mobileSearch} alt="" width={24} height={24} />
                        </button>
                    </div>

                    {/* Logo: Priority loading for LCP */}
                    <div className="logo">
                        <Link href="/" aria-label="Viking Armory Blades Home">
                            <Image 
                                src={LOGO_URL} 
                                alt="Viking Armory Blades Logo" 
                                width={80} 
                                height={80} 
                                priority 
                                className="logo_img"
                            />
                        </Link>
                    </div>

                    {/* Search Field: Accessible Form handling */}
                    <div className="field desktop_only">
                        <form className="fill_field" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex" style={{ display: 'flex', position: 'relative' }}>
                                <input 
                                    ref={inputRef}
                                    type="search" 
                                    name="q"
                                    placeholder='Search the store' 
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    aria-label="Search the store"
                                />
                                <button type="submit" aria-label="Submit Search">
                                    <Image src={ICONS.search} alt="" width={20} height={20} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Navigation Icons */}
                    <nav className="links" aria-label="User Navigation">
                        <div className="icons">
                            <div className="flex" style={{ display: 'flex', gap: '20px' }}>
                                <IconLink href="/wishlist" icon={ICONS.wishlist} label="Wish List" />
                                <IconLink href="/account" icon={ICONS.profile} label="Sign In" />
                                <IconLink href="/cart" icon={ICONS.cart} label="Cart" count={3} />
                            </div>
                        </div>
                    </nav>

                </div>
            </div>
        </header>
    );
}

// HIGH PRACTICE: Reusable Sub-component to keep code DRY (Don't Repeat Yourself)
function IconLink({ href, icon, label, count }) {
    return (
        <Link href={href} className="con_wrapper">
            <div className="con" style={{ textAlign: 'center', position: 'relative' }}>
                {count !== undefined && <samp className='num_order'>{count}</samp>}
                <div className="image">
                    <Image src={icon} alt="" width={24} height={24} />
                </div>
                <span className="icon_text" style={{ fontSize: '12px', display: 'block' }}>{label}</span>
            </div>
        </Link>
    );
}