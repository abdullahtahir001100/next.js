import { SearchProvider } from "./components/search";
import ClientLayout from "./ClientLayout"; // Import the new component
import "./globals.css";
import "./styles/dashboards.scss";
import './styles/responsive.scss';

// --- 1. SEO & METADATA CONFIGURATION ---
export const metadata = {
  metadataBase: new URL('https://next-js-alpha-woad.vercel.app'), 

  title: {
    default: "Viking Armory Blades | Premium Swords, Axes & Knives",
    template: "%s | Viking Armory Blades"
  },
  description: "Discover high-quality handcrafted swords, katanas, axes, and knives. Your ultimate destination for historical and fantasy weaponry.",
  
  keywords: ["swords", "katanas", "axes", "knives", "viking armory", "hand forged", "fantasy weapons", "outdoor gear"],
  
  authors: [{ name: 'Viking Armory' }],
  creator: 'Viking Armory',

  icons: {
    icon: '/smz enterprises logo.png', 
  },

  openGraph: {
    title: "Viking Armory Blades",
    description: "Premium handcrafted swords, knives, and axes.",
    url: 'https://next-js-alpha-woad.vercel.app/',
    siteName: 'Viking Armory Blades',
    images: [
      {
        url: '/smz enterprises logo.png', 
        width: 800,
        height: 600,
        alt: 'Viking Armory Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: "Viking Armory Blades",
    description: "Premium handcrafted swords and outdoor gear.",
    images: ['/smz enterprises logo.png'],
  },
};

// --- 2. VIEWPORT SETTINGS ---
export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

// --- 3. ROOT LAYOUT ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          {/* We wrap children in ClientLayout to handle conditional headers */}
          <ClientLayout>
            {children}
          </ClientLayout>
        </SearchProvider>
      </body>
    </html>
  );
}