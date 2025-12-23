"use client";

import { SearchProvider } from "./components/search";
import "./globals.css";
import "./styles/dashboards.scss";
import './styles/responsive.scss'


import Menu from "./components/menues"; 
import Footer from "./components/footer";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
         
          
          {/* The Search Popup is now here so it works on all pages */}
          <Menu />

          {children}
          
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}