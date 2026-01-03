// REMOVED "use client" so that Metadata works!
// Ensure your SearchProvider and Menu components have "use client" inside them.

import { SearchProvider } from "./components/search";
import "./globals.css";
import "./styles/dashboards.scss";
import './styles/responsive.scss'
import Header from "./components/header_main";
import Header_1 from "./components/header";

import Animate_slider from "./components/animate_slider";
import Menu from "./components/menues"; 
import Footer from "./components/footer";
// import Header from "./components/header_main"; // Unused in your JSX
// import Header_1 from "./components/header";   // Unused in your JSX

// --- 1. SEO & METADATA CONFIGURATION ---
export const metadata = {
  // Base URL for resolving relative links (Change to your actual domain)
  metadataBase: new URL('https://next-js-alpha-woad.vercel.app'), 

  title: {
    default: "Viking Armory Blades | Premium Swords, Axes & Knives",
    template: "%s | Viking Armory Blades" // Example: "Contact | Viking Armory Blades"
  },
  description: "Discover high-quality handcrafted swords, katanas, axes, and knives. Your ultimate destination for historical and fantasy weaponry.",
  
  keywords: ["swords", "katanas", "axes", "knives", "viking armory", "hand forged", "fantasy weapons", "outdoor gear"],
  
  // Author & Creator info
  authors: [{ name: 'Viking Armory' }],
  creator: 'Viking Armory',

  // --- FAVICONS & ICONS ---
  // Ensure these files exist in your /public folder
  icons: {
    icon: '/favicon.ico', 
    // shortcut: '/favicon-16x16.png',
    // apple: '/apple-touch-icon.png',
  },

  // --- SOCIAL SHARE (Open Graph) ---
  openGraph: {
    title: "Viking Armory Blades",
    description: "Premium handcrafted swords, knives, and axes.",
    url: 'https://next-js-alpha-woad.vercel.app/',
    siteName: 'Viking Armory Blades',
    images: [
      {
        url: 'https://vikingarmoryblades.com/cdn/shop/files/Viking_Armory_Blades_Logo.webp?v=1755453192&width=300', 
        width: 800,
        height: 600,
        alt: 'Viking Armory Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // --- TWITTER CARD ---
  twitter: {
    card: 'summary_large_image',
    title: "Viking Armory Blades",
    description: "Premium handcrafted swords and outdoor gear.",
    images: ['https://vikingarmoryblades.com/cdn/shop/files/Viking_Armory_Blades_Logo.webp?v=1755453192&width=300'],
  },
};

// --- 2. VIEWPORT SETTINGS ---
export const viewport = {
  themeColor: '#ffffff', // Changes the browser bar color on mobile
  width: 'device-width',
  initialScale: 1,
};

// --- 3. ROOT LAYOUT ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body>
        {/* SearchProvider must be a Client Component (have "use client" inside it).
          Because RootLayout is now a Server Component, wrapping logic works perfectly.
        */}
          <SearchProvider>
        <Animate_slider />
          <Header />
          <Header_1 />
      
          
          {children}
          
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}