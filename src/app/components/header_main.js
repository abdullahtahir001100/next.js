"use client";
import { useRef, useCallback, useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

// --- CONSTANTS ---
const FALLBACK_IMG = "https://placehold.co/100x100?text=No+Image";
const LOGO_URL = "https://vikingarmoryblades.com/cdn/shop/files/Viking_Armory_Blades_Logo.webp?v=1755453192&width=300";

const ICONS = {
    search: '/search.png', 
    wishlist: '/like.png', 
    profile: '/profile (1).png',
    cart: '/shopping-cart.png', 
    burger: '/burger-bar.png', 
    mobileSearch: '/search-interface-symbol.png'
};

// --- MENU DATA ---
const MENU_DATA = [
    { label: 'Home', href: '/' },
    { 
        label: 'Swords', 
        href: '#', 
        children: [
            { label: 'Fantasy Sword', href: '#' },
            { label: 'Katana', href: '#' },
            { label: 'Claymore', href: '#' },
        ] 
    },
    { label: 'Axes', href: '#' },
    { label: 'Knives & Daggers', href: '#' },
    { 
        label: 'Spears & Polearms', 
        href: '#',
        children: [
            { label: 'Pocket Knives', href: '#' },
            { label: 'Dagger Knives', href: '#' },
            { label: 'Hunting Knives', href: '#' },
        ]
    },
    { label: 'Chef Set', href: '#' },
    { label: 'Hammers & Maces', href: '#' },
    { label: 'Shields & Armor', href: '#' },
    { label: 'Display & Accessories', href: '#' },
    { label: 'About Us', href: '/pages/about' },
    { label: 'Contact', href: '/ContactUs' },
];


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

// --- MAIN COMPONENT ---

export default function Header() {
    // Data State
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    
    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('menu'); 
    const [showDesktopSearch, setShowDesktopSearch] = useState(false);

    // Cart & Wishlist States
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Refs
    const headerRef = useRef(null); // Ref for the main header
    const inputRef = useRef(null);
    const searchContainerRef = useRef(null); 
    const desktopPopupRef = useRef(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // --- Helper to handle inconsistent API data formats ---
    const safeExtract = (data) => {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.products)) return data.products;
        return [];
    };

    // 1. FETCH DATA
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const data = await res.json();
                    const items = safeExtract(data);
                    setProducts(items);
                }
            } catch (error) { console.error("Error fetching products:", error); }
        };
        fetchProducts();
    }, []);

    // --- DYNAMIC COUNTS LOGIC ---
    useEffect(() => {
        const updateCounts = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            
            // Calculate total quantity in cart (sum of .quantity fields)
            const totalQty = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
            setCartCount(totalQty);
            setWishlistCount(wishlist.length);
        };

        updateCounts(); // Initial load

        // Listen for changes in other tabs
        window.addEventListener('storage', updateCounts);
        
        // Poll every 1 second to catch changes in the current tab
        const interval = setInterval(updateCounts, 1000);

        return () => {
            window.removeEventListener('storage', updateCounts);
            clearInterval(interval);
        };
    }, []);

    // 2. SCROLL LOGIC (Hide Down / Show Up)
    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isAtTop = currentScrollY < 50; // Always show if at top

            // If scrolling, close search to prevent UI glitches
            if (Math.abs(currentScrollY - lastScrollY) > 10 && showDesktopSearch) {
                setShowDesktopSearch(false);
                if(inputRef.current) inputRef.current.blur();
            }

            if (isScrollingDown && !isAtTop) {
                // Hide Header (Move Up)
                gsap.to(headerRef.current, { yPercent: -100, duration: 0.3, ease: 'power3.out' });
            } else {
                // Show Header (Move Down)
                gsap.to(headerRef.current, { yPercent: 0, duration: 0.3, ease: 'power3.out' });
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showDesktopSearch]);

    // 3. SEARCH LOGIC
    useEffect(() => {
        if (debouncedSearchTerm.trim().length > 0) {
            const term = debouncedSearchTerm.toLowerCase();
            const results = products.filter(item => 
                (item.name || "").toLowerCase().includes(term) ||
                (item.productType || "").toLowerCase().includes(term)
            );
            setFilteredProducts(results);
            setShowDesktopSearch(true);
        } else {
            setFilteredProducts([]);
            setShowDesktopSearch(false);
        }
    }, [debouncedSearchTerm, products]);

    // 4. DESKTOP ANIMATION & EVENTS
    useClickOutside(searchContainerRef, () => setShowDesktopSearch(false));

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            if (showDesktopSearch && desktopPopupRef.current) {
                gsap.to(desktopPopupRef.current, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" });
            } else if (desktopPopupRef.current) {
                gsap.to(desktopPopupRef.current, { autoAlpha: 0, y: -10, duration: 0.2, ease: "power2.in" });
            }
        }, searchContainerRef);
        return () => ctx.revert();
    }, [showDesktopSearch]);

    const handleFocus = useCallback(() => {
        if (!inputRef.current) return;
        if (!inputRef.current.dataset.placeholder) inputRef.current.dataset.placeholder = inputRef.current.placeholder;
        gsap.to(inputRef.current, { duration: 0.2, ease: "power2.out", onStart: () => { inputRef.current.placeholder = ""; } });
        if(searchTerm.length > 0) setShowDesktopSearch(true);
    }, [searchTerm]);

    const handleBlur = useCallback(() => {
        if (!inputRef.current) return;
        if (inputRef.current.value === "") inputRef.current.placeholder = inputRef.current.dataset.placeholder || "Search the store";
    }, []);

    // Sidebar Handlers
    const openMenu = () => { setSidebarMode('menu'); setIsSidebarOpen(true); };
    const openMobileSearch = () => { setSidebarMode('search'); setIsSidebarOpen(true); };
    const closeSidebar = () => { setIsSidebarOpen(false); };

    return (
        <>
        <div className="header_bg">
            <header 
                ref={headerRef} 
                role="banner" 
                className='main_header' 
                
            >
                <div className="contain">
                    <div className="flexbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        
                        {/* Mobile Triggers */}
                        <div className="mobile_triggers flex desktop_hide">
                            <button className="burger_btn" onClick={openMenu}><Image src={ICONS.burger} alt="Menu" width={24} height={24} /></button>
                            <button className="mobile_search_btn" onClick={openMobileSearch}><Image src={ICONS.mobileSearch} alt="Search" width={24} height={24} /></button>
                        </div>

                        {/* Logo */}
                        <div className="logo">
                            <Link href="/"><Image src={LOGO_URL} alt="Logo" width={80} height={80} priority className="logo_img"/></Link>
                        </div>

                        {/* Desktop Search */}
                        <div className="field desktop_only" ref={searchContainerRef} style={{position: 'relative'}}>
                            <form className="fill_field" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex" style={{ display: 'flex', position: 'relative' }}>
                                    <input 
                                        ref={inputRef} type="search" placeholder='Search the store' value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                    <button type="submit"><Image src={ICONS.search} alt="Search" width={20} height={20} /></button>
                                </div>
                            </form>

                            {/* Popup */}
                            <div 
                                ref={desktopPopupRef}
                                style={{
                                    position: 'absolute', top: '120%', left: 0, width: '100%', minWidth: '350px',
                                    background: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
                                    padding: '0', borderRadius: '4px', zIndex: 99999999,
                                    opacity: 0, visibility: 'hidden', transform: 'translateY(-10px)', overflow: 'hidden'
                                }}
                            >
                                {filteredProducts.length > 0 ? (
                                    <div className="flexwrap wrap" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                        {filteredProducts.map(p => (
                                            <ProductResultItem key={p._id} product={p} onClick={() => setShowDesktopSearch(false)} />
                                        ))}
                                    </div>
                                ) : (
                                    searchTerm.length > 0 && <div style={{padding:'15px', textAlign:'center', color:'#888'}}>No products found</div>
                                )}
                            </div>
                        </div>

                        {/* Icons */}
                        <nav className="links">
                            <div className="icons">
                                <div className="flex" style={{ display: 'flex', gap: '20px' }}>
                                    <IconLink href="/wishlist" icon={ICONS.wishlist} label="Wish List" count={wishlistCount > 0 ? wishlistCount : undefined} />
                                    <IconLink href="/account" icon={ICONS.profile} label="Sign In" />
                                    <IconLink href="/cart" icon={ICONS.cart} label="Cart" count={cartCount > 0 ? cartCount : undefined} />
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* --- MOBILE SIDEBAR --- */}
            <MobileSidebar 
                isOpen={isSidebarOpen} 
                mode={sidebarMode} 
                onClose={closeSidebar}
                allProducts={products} 
            />
            </div>
        </>
    );
}

// --- SUB COMPONENTS ---

function IconLink({ href, icon, label, count }) {
    return (
        <Link href={href} className="con_wrapper">
            <div className="con" style={{ textAlign: 'center', position: 'relative' }}>
                {count !== undefined && <samp className='num_order'>{count}</samp>}
                <div className="image"><Image src={icon} alt="" width={24} height={24} /></div>
                <span className="icon_text" style={{ fontSize: '12px', display: 'block' }}>{label}</span>
            </div>
        </Link>
    );
}

function ProductResultItem({ product, onClick }) {
    return (
        <Link href={`/product/${product._id}`} onClick={onClick}
            style={{display: 'flex', alignItems: 'center', padding: '10px 15px', borderBottom: '1px solid #f0f0f0', textDecoration:'none', transition: 'background 0.2s'}}
            className="search-result-item"
        >
            <div className='op_pic' style={{width:'50px', height:'50px', flexShrink:0, marginRight:'15px', background:'#f4f4f4', borderRadius:'4px', overflow:'hidden', position: 'relative'}}>
                <Image 
                    src={product.mainImage || FALLBACK_IMG} 
                    alt={product.name} 
                    fill 
                    sizes="50px"
                    style={{objectFit:'cover'}} 
                />
            </div>
            <div>
                <div style={{fontSize:'14px', fontWeight:'600', color:'#333', width:'100%', lineHeight:'1.2', marginBottom: '4px'}}>{product.name}</div>
                <div style={{fontSize:'13px', color:'#666'}}>${product.price}</div>
            </div>
        </Link>
    );
}

// ---------------------------------------------------------
// GSAP MOBILE SIDEBAR (Fully Optimized)
// ---------------------------------------------------------
function MobileSidebar({ isOpen, mode, onClose, allProducts = [] }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    
    // Debounce mobile search
    const debouncedLocalTerm = useDebounce(localSearchTerm, 300);

    const overlayRef = useRef(null);
    const sidebarRef = useRef(null);
    const scopeRef = useRef(null); 
    const mainMenuRef = useRef(null);
    const subMenuRef = useRef(null);
    const ctxRef = useRef(null); 

    // 1. SETUP CONTEXT
    useLayoutEffect(() => {
        ctxRef.current = gsap.context(() => {}, scopeRef);
        return () => ctxRef.current.revert();
    }, []);

    // 2. ANIMATION LOGIC
    useEffect(() => {
        ctxRef.current.add(() => {
            if (isOpen) {
                gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
                gsap.to(sidebarRef.current, { x: '0%', duration: 0.4, ease: "power3.out" });
            } else {
                gsap.to(sidebarRef.current, { x: '-100%', duration: 0.3, ease: "power3.in" });
                gsap.to(overlayRef.current, { 
                    autoAlpha: 0, duration: 0.3, delay: 0.1, 
                    onComplete: () => {
                        setActiveMenu(null); 
                        setLocalSearchTerm("");
                        gsap.set(mainMenuRef.current, { x: 0, autoAlpha: 1 });
                        gsap.set(subMenuRef.current, { x: '100%', autoAlpha: 1 });
                    }
                });
            }
        });
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (debouncedLocalTerm.trim() === "") setFilteredItems([]);
        else {
            const results = allProducts.filter(item => (item.name || "").toLowerCase().includes(debouncedLocalTerm.toLowerCase()));
            setFilteredItems(results);
        }
    }, [debouncedLocalTerm, allProducts]);

    // Menu Drill Down
    const handleSubMenuOpen = (item) => {
        setActiveMenu(item);
        ctxRef.current.add(() => {
            gsap.to(mainMenuRef.current, { x: '-30%', autoAlpha: 0, duration: 0.4, ease: "power2.out" });
            gsap.fromTo(subMenuRef.current, { x: '100%', autoAlpha: 1 }, { x: '0%', autoAlpha: 1, duration: 0.4, ease: "power2.out" });
        });
    };

    const handleBack = () => {
        ctxRef.current.add(() => {
            gsap.to(subMenuRef.current, { x: '100%', duration: 0.3, ease: "power2.in", onComplete: () => setActiveMenu(null) });
            gsap.to(mainMenuRef.current, { x: '0%', autoAlpha: 1, duration: 0.3, delay: 0.1, ease: "power2.out" });
        });
    };

    return (
        <div ref={scopeRef}>
            {/* Overlay */}
            <div ref={overlayRef} className="sidebar-overlay" onClick={onClose} style={{opacity: 0, visibility: 'hidden'}}></div>
            
            {/* Sidebar Container */}
            <div ref={sidebarRef} className="mobile-sidebar" style={{transform: 'translateX(-100%)'}}>
                <div className="sidebar-header">
                    <span className="header-title">{mode === 'search' ? 'Search Store' : 'Menu'}</span>
                    <button onClick={onClose} className="close-btn">✕ Close</button>
                </div>
                
                <div className="sidebar-content-wrapper" style={{position:'relative', overflowX:'hidden', height: 'calc(100% - 60px)'}}>
                    {/* --- MENU MODE --- */}
                    {mode === 'menu' && (
                        <>
                            <div ref={mainMenuRef} className="menu-layer main-menu" style={{position: 'absolute', width: '100%', top:0, left:0}}>
                                <ul className="menu-list">
                                    {MENU_DATA.map((item, index) => (
                                        <li key={index}>
                                            {item.children ? (
                                                <button className="menu-link has-arrow" onClick={() => handleSubMenuOpen(item)}>
                                                    {item.label} <span className="arrow">›</span>
                                                </button>
                                            ) : (
                                                <Link href={item.href} className="menu-link" onClick={onClose}>{item.label}</Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div ref={subMenuRef} className="menu-layer sub-menu" style={{position: 'absolute', width: '100%', top:0, left:0, transform: 'translateX(100%)'}}>
                                {activeMenu && (
                                    <>
                                        <button className="back-btn" onClick={handleBack}><span className="back-arrow">‹</span></button>
                                        <div className="sub-menu-title">{activeMenu.label}</div>
                                        <ul className="menu-list">
                                            {activeMenu.children.map((sub, i) => (
                                                <li key={i}><Link href={sub.href} className="menu-link" onClick={onClose}>{sub.label}</Link></li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {/* --- SEARCH MODE --- */}
                    {mode === 'search' && (
                        <div className="sidebar-search-panel">
                            <div className="sidebar-search-input-box">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={localSearchTerm} 
                                    onChange={(e) => setLocalSearchTerm(e.target.value)} 
                                    autoFocus 
                                />
                                {localSearchTerm && (
                                    <button 
                                        onClick={() => setLocalSearchTerm("")}
                                        style={{ background:'none', border:'none', fontSize:'16px', cursor:'pointer'}}
                                    >✕</button>
                                )}
                            </div>
                            <div className="sidebar-results-container" style={{padding:0}}>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(product => (
                                        <ProductResultItem key={product._id} product={product} onClick={onClose} />
                                    ))
                                ) : (
                                    <p className="no-results" style={{padding:'20px', textAlign:'center', color:'#888'}}>
                                        {localSearchTerm ? "No products found." : "Start typing to search..."}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}