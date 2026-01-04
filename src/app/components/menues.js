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
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '#' },
];

// --- CUSTOM HOOKS ---

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
    // Data State ( searchTerm moved locally because SearchProvider is removed )
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    
    // UI State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState('menu'); 
    const [showDesktopSearch, setShowDesktopSearch] = useState(false);

    // Refs
    const headerRef = useRef(null); 
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
                    setPopularProducts(items.slice(0, 3)); // Trending Items
                }
            } catch (error) { console.error("Error fetching products:", error); }
        };
        fetchProducts();
    }, []);

    // 2. SCROLL LOGIC (Hide Down / Show Up)
    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isAtTop = currentScrollY < 50;

            if (Math.abs(currentScrollY - lastScrollY) > 10 && showDesktopSearch) {
                setShowDesktopSearch(false);
                if(inputRef.current) inputRef.current.blur();
            }

            if (isScrollingDown && !isAtTop) {
                gsap.to(headerRef.current, { yPercent: -100, duration: 0.6, ease: 'power3.out' });
            } else {
                gsap.to(headerRef.current, { yPercent: 0, duration: 0.6, ease: 'power3.out' });
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [showDesktopSearch]);

    // 3. SEARCH LOGIC & ANIMATION
    useEffect(() => {
        const term = (debouncedSearchTerm || "").trim().toLowerCase();
        if (term.length > 0) {
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

    // 4. POPUP ANIMATION
    useClickOutside(searchContainerRef, () => setShowDesktopSearch(false));

    useLayoutEffect(() => {
        if (showDesktopSearch && desktopPopupRef.current) {
            gsap.to(desktopPopupRef.current, { display: "block", autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" });
        } else if (desktopPopupRef.current) {
            gsap.to(desktopPopupRef.current, { autoAlpha: 0, y: -10, duration: 0.2, ease: "power2.in", onComplete: () => gsap.set(desktopPopupRef.current, { display: "none" }) });
        }
    }, [showDesktopSearch]);

    const handleFocus = useCallback(() => {
        if (!inputRef.current) return;
        if (!inputRef.current.dataset.placeholder) inputRef.current.dataset.placeholder = inputRef.current.placeholder;
        inputRef.current.placeholder = "";
        if(searchTerm.length > 0) setShowDesktopSearch(true);
    }, [searchTerm]);

    const handleBlur = useCallback(() => {
        if (!inputRef.current) return;
        if (inputRef.current.value === "") {
            inputRef.current.placeholder = inputRef.current.dataset.placeholder || "Search the store";
        }
    }, []);

    // Sidebar Handlers
    const openMenu = () => { setSidebarMode('menu'); setIsSidebarOpen(true); };
    const openMobileSearch = () => { setSidebarMode('search'); setIsSidebarOpen(true); };
    const closeSidebar = () => { setIsSidebarOpen(false); };

    // Derived results for popup
    const itemsToShow = (searchTerm && searchTerm.trim().length > 0) ? filteredProducts : popularProducts;

    return (
        <>
        <div className="header_bg">
            <header 
                ref={headerRef} 
                role="banner" 
                className='main_header' 
                style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, background: '#fff', borderBottom: '1px solid #eee' }}
            >
                <div className="contain">
                    <div className="flexbox" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        
                        {/* Mobile Triggers */}
                        <div className="mobile_triggers flex desktop_hide">
                            <button className="burger_btn" onClick={openMenu} style={{background: 'none', border:'none'}}><Image src={ICONS.burger} alt="Menu" width={24} height={24} /></button>
                            <button className="mobile_search_btn" onClick={openMobileSearch} style={{background: 'none', border:'none'}}><Image src={ICONS.mobileSearch} alt="Search" width={24} height={24} /></button>
                        </div>

                        {/* Logo */}
                        <div className="logo">
                            <Link href="/"><Image src={LOGO_URL} alt="Logo" width={80} height={80} priority className="logo_img"/></Link>
                        </div>

                        {/* Desktop Search */}
                        <div className="field desktop_only" ref={searchContainerRef} style={{position: 'relative', flex: 1, margin: '0 40px', maxWidth: '600px'}}>
                            <form className="fill_field" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex" style={{ display: 'flex', position: 'relative', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                                    <input 
                                        ref={inputRef} 
                                        type="text" 
                                        placeholder='Search the store' 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        onFocus={handleFocus} 
                                        onBlur={handleBlur}
                                        style={{ flex: 1, padding: '10px', border: 'none', outline: 'none' }}
                                    />
                                    <button type="submit" style={{ padding: '0 15px', background: '#fff', border: 'none' }}><Image src={ICONS.search} alt="Search" width={20} height={20} /></button>
                                </div>
                            </form>

                            {/* Desktop Search Popup integrated here */}
                            <div 
                                ref={desktopPopupRef}
                                className="pop_search"
                                style={{
                                    position: 'absolute', top: '110%', left: 0, width: '100%', 
                                    background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
                                    padding: '15px', borderRadius: '4px', zIndex: 1001,
                                    opacity: 0, visibility: 'hidden', transform: 'translateY(-10px)', display: 'none'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{searchTerm ? `Results for "${searchTerm}"` : "Trending Now"}</span>
                                    <button onClick={() => setSearchTerm("")} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                                </div>
                                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                                    {itemsToShow.length > 0 ? (
                                        itemsToShow.map(p => (
                                            <ProductResultItem key={p._id} product={p} onClick={() => { setShowDesktopSearch(false); setSearchTerm(""); }} />
                                        ))
                                    ) : (
                                        <div style={{padding:'20px', textAlign:'center', color:'#888'}}>No products found</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Icons */}
                        <nav className="links">
                            <div className="icons">
                                <div className="flex" style={{ display: 'flex', gap: '20px' }}>
                                    <IconLink href="/Whitelist" icon={ICONS.wishlist} label="Wish List" />
                                    <IconLink href="/account" icon={ICONS.profile} label="Sign In" />
                                    <IconLink href="/Cart" icon={ICONS.cart} label="Cart" />
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
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />
            </div>
        </>
    );
}

// --- SUB COMPONENTS ---

function IconLink({ href, icon, label, count }) {
    return (
        <Link href={href} className="con_wrapper" style={{ textDecoration: 'none' }}>
            <div className="con" style={{ textAlign: 'center', position: 'relative' }}>
                {count !== undefined && <samp className='num_order' style={{position:'absolute', top:'-5px', right:'-5px', background:'#000', color:'#fff', borderRadius:'50%', width:'18px', height:'18px', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center'}}>{count}</samp>}
                <div className="image"><Image src={icon} alt={label} width={24} height={24} /></div>
                <span className="icon_text" style={{ fontSize: '11px', display: 'block', color: '#000', marginTop: '3px' }}>{label}</span>
            </div>
        </Link>
    );
}

function ProductResultItem({ product, onClick }) {
    return (
        <Link href={`/detailProduct/${product._id}`} onClick={onClick}
            style={{display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #f5f5f5', textDecoration:'none'}}
        >
            <div style={{width:'45px', height:'45px', flexShrink:0, marginRight:'15px', background:'#f4f4f4', borderRadius:'4px', overflow:'hidden', position: 'relative'}}>
                <Image src={product.mainImage || FALLBACK_IMG} alt={product.name} fill sizes="45px" style={{objectFit:'cover'}} />
            </div>
            <div>
                <div style={{fontSize:'13px', fontWeight:'600', color:'#000', lineHeight:'1.2'}}>{product.name}</div>
                <div style={{fontSize:'12px', color:'#e67e22', fontWeight: 'bold', marginTop: '2px'}}>${product.price}</div>
            </div>
        </Link>
    );
}

function MobileSidebar({ isOpen, mode, onClose, allProducts, searchTerm, setSearchTerm }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const debouncedTerm = useDebounce(searchTerm, 300);

    const overlayRef = useRef(null);
    const sidebarRef = useRef(null);
    const scopeRef = useRef(null); 
    const mainMenuRef = useRef(null);
    const subMenuRef = useRef(null);

    useLayoutEffect(() => {
        if (isOpen) {
            gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
            gsap.to(sidebarRef.current, { x: '0%', duration: 0.4, ease: "power3.out" });
        } else {
            gsap.to(sidebarRef.current, { x: '-100%', duration: 0.3, ease: "power3.in" });
            gsap.to(overlayRef.current, { 
                autoAlpha: 0, duration: 0.3, 
                onComplete: () => {
                    setActiveMenu(null); 
                    setSearchTerm("");
                    gsap.set(mainMenuRef.current, { x: 0, autoAlpha: 1 });
                    gsap.set(subMenuRef.current, { x: '100%', autoAlpha: 1 });
                }
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const term = (debouncedTerm || "").toLowerCase().trim();
        if (term === "") {
            setFilteredItems([]);
        } else {
            setFilteredItems(allProducts.filter(item => (item.name || "").toLowerCase().includes(term)));
        }
    }, [debouncedTerm, allProducts]);

    const handleSubMenuOpen = (item) => {
        setActiveMenu(item);
        gsap.to(mainMenuRef.current, { x: '-30%', autoAlpha: 0, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(subMenuRef.current, { x: '100%', autoAlpha: 1 }, { x: '0%', autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    };

    const handleBack = () => {
        gsap.to(subMenuRef.current, { x: '100%', duration: 0.3, ease: "power2.in", onComplete: () => setActiveMenu(null) });
        gsap.to(mainMenuRef.current, { x: '0%', autoAlpha: 1, duration: 0.3, ease: "power2.out" });
    };

    return (
        <div ref={scopeRef}>
            <div ref={overlayRef} style={{opacity: 0, visibility: 'hidden', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000}} onClick={onClose}></div>
            <div ref={sidebarRef} style={{transform: 'translateX(-100%)', position: 'fixed', left: 0, top: 0, height: '100%', width: '85%', background: '#fff', zIndex: 2001, padding: '20px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span style={{ fontWeight: 'bold' }}>{mode === 'search' ? 'Search Store' : 'Menu'}</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px' }}>✕</button>
                </div>
                <div style={{position:'relative', overflowX:'hidden', height: 'calc(100% - 60px)'}}>
                    {mode === 'menu' && (
                        <>
                            <div ref={mainMenuRef} style={{position: 'absolute', width: '100%'}}>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {MENU_DATA.map((item, index) => (
                                        <li key={index} style={{ borderBottom: '1px solid #eee' }}>
                                            {item.children ? (
                                                <button onClick={() => handleSubMenuOpen(item)} style={{ width: '100%', textAlign: 'left', padding: '15px 0', background: 'none', border: 'none', fontSize: '16px', display: 'flex', justifyContent: 'space-between' }}>{item.label} <span>›</span></button>
                                            ) : (
                                                <Link href={item.href} onClick={onClose} style={{ display: 'block', padding: '15px 0', textDecoration: 'none', color: '#000', fontSize: '16px' }}>{item.label}</Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div ref={subMenuRef} style={{position: 'absolute', width: '100%', transform: 'translateX(100%)'}}>
                                {activeMenu && (
                                    <>
                                        <button onClick={handleBack} style={{ background: 'none', border: 'none', padding: '10px 0', color: '#666' }}>‹ Back</button>
                                        <div style={{ fontWeight: 'bold', fontSize: '20px', margin: '10px 0 20px' }}>{activeMenu.label}</div>
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {activeMenu.children.map((sub, i) => (<li key={i} style={{ borderBottom: '1px solid #eee' }}><Link href={sub.href} onClick={onClose} style={{ display: 'block', padding: '15px 0', textDecoration: 'none', color: '#000' }}>{sub.label}</Link></li>))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    {mode === 'search' && (
                        <div>
                            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} autoFocus />
                            <div style={{ marginTop: '20px' }}>
                                {filteredItems.map(p => <ProductResultItem key={p._id} product={p} onClick={() => { onClose(); setSearchTerm(""); }} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}