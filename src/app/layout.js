import { SearchProvider } from "./components/search";
import ClientLayout from "./ClientLayout"; 
import "./globals.css";
import "./styles/dashboards.scss";
import './styles/responsive.scss';

// --- 1. SEO & METADATA CONFIGURATION ---
export const metadata = {
  metadataBase: new URL('https://next-js-alpha-woad.vercel.app'), 

  title: {
    // Is title mein main brand aur variations dono hain
    default: "SMZ Enterprises | SMZ Store | Premium Blades & Swords",
    template: "%s | SMZ Enterprises"
  },
  
  description: "Official SMZ Enterprises (SMZ Store). We provide premium handcrafted katanas, knives, and axes. Also known as SM Enterprise or SMZ Blades. Quality weaponry for collectors.",
  
  // Is list mein wo sab variations hain jo aapne mangi hain
  keywords: [
    "SMZ Enterprises", "SMZ Enterprise", "Enterprises SMZ", "SM Enterprises", 
    "SMZ Store", "SMZ Shop", "SMZ.com", "SMZ.pk", "SMZ.store", "SMZ.in", "SMZ.io",
    "SM Enterprise", "S.M.Z Enterprises", "smzenterprises", "smz blades",
    "swords", "katanas", "viking armory",
    // Misspellings (Ghalt spelling)
    "smz enterprizes", "smz enterprais", "sm enterpise", "smz sotre"
  ],
  
  authors: [{ name: 'SMZ Enterprises' }],
  creator: 'SMZ Enterprises',

  icons: {
    // Yaad se file ka naam public folder mein 'favicon.png' rakhein
    icon: '/favicon.ico', 
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  openGraph: {
    title: "SMZ Enterprises - Official Store",
    description: "Shop at SMZ Enterprises for the best handcrafted swords and axes. Global shipping available.",
    url: 'https://next-js-alpha-woad.vercel.app/',
    siteName: 'SMZ Enterprises',
    images: [
      {
        url: '/favicon.ico', 
        width: 800,
        height: 600,
        alt: 'SMZ Enterprises Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: "SMZ Enterprises | SMZ Store",
    description: "Handcrafted blades and outdoor gear from SMZ Enterprises.",
    images: ['/favicon.png'],
  },
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Isse search engine ko mazeed help milti hai variations samajhne mein */}
        <meta name="application-name" content="SMZ Enterprises" />
        <meta name="apple-mobile-web-app-title" content="SMZ Store" />
      </head>
      <body>
        <SearchProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SearchProvider>
      </body>
    </html>
  );
}