"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/aditional.scss';

// --- ICONS ---
const Icons = {
  Menu: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Close: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Grid: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Sword: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Cart: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Users: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Chart: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Mail: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Cog: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Tag: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Support: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Phone: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Logout: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Links with specific icons and routes
  const links = [
    { title: "Dashboard", href: "/admin/Dashboard", icon: <Icons.Grid /> },
    { title: "Collections", href: "/admin/CollectionAdmin", icon: <Icons.Sword /> },
    { title: "Products", href: "/admin/ProductsAdmin", icon: <Icons.Tag /> },
    { title: "Orders", href: "/admin/Orders", icon: <Icons.Cart /> },
    { title: "Customers", href: "/admin/FeedBacksAdmin", icon: <Icons.Users /> },
    { title: "Analytics", href: "/admin/analytics", icon: <Icons.Chart /> },
    { title: "Marketing", href: "/admin/marketing", icon: <Icons.Mail /> },
    { title: "Settings", href: "/admin/IDE_Admin", icon: <Icons.Cog /> },
    { title: "All Support", href: "/admin/OfficeAdmin", icon: <Icons.Support /> },
    { title: "Contact Management", href: "/admin/ContactAdmin", icon: <Icons.Phone /> }
  ];

  return (
    <>
      {/* 1. HEADER (Visible on All Screens) */}
      <header className="vab-global-header">
        <div className="left-section">
          {/* Burger Button - Toggles Sidebar */}
          <button className="burger-btn" onClick={() => setIsOpen(true)}>
            <Icons.Menu />
          </button>
          <div className="brand-logo">VIKING<span>ARMORY</span></div>
        </div>
        
        <div className="right-section">
          <div className="user-avatar">A</div>
        </div>
      </header>

      {/* 2. OVERLAY (Click to close) */}
      <div 
        className={`vab-sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(false)} 
      />

      {/* 3. SIDEBAR (Slides in/out) */}
      <aside className={`vab-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header with Close Button */}
        <div className="sidebar-header">
          <h2>VIKING<span>ARMORY</span></h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <Icons.Close />
          </button>
        </div>

        {/* Links */}
        <nav className="nav-menu">
          <span className="menu-label">Main Menu</span>
          {links.slice(0, 5).map((link) => (
            <Link 
              key={link.title} 
              href={link.href} 
              // Active Logic: Checks if current path starts with the link's href
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}

          <span className="menu-label">Config & Support</span>
          {links.slice(5).map((link) => (
            <Link 
              key={link.title} 
              href={link.href} 
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="user-footer">
          <button className="logout-btn">
            <Icons.Logout /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}