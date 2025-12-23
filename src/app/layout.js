"use client";

import { SearchProvider } from "./components/search";
import "./globals.css";
import "./styles/dashboards.scss";
import './styles/responsive.scss'

import Header from "./components/header_main";
import Header_1 from "./components/header";
import Footer from "./components/footer";
import Animate_slider from "./components/animate_slider";
import Menu from "./components/menues"; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          <Animate_slider />
          <Header />
          <Header_1 />
          
          {/* The Search Popup is now here so it works on all pages */}
          <Menu />

          {children}
          
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}