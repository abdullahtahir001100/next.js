"use client"; // This directive allows us to use hooks like usePathname

import { usePathname } from "next/navigation";
import Header from "./components/header_main";
import Header_1 from "./components/header";
import Animate_slider from "./components/animate_slider";
import Footer from "./components/footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Check if the current URL starts with "/admin"
  // You can add other paths here if needed
  const isAdminRoute = pathname?.startsWith("/admin");

  // If we are in the admin panel, ONLY render the children (no headers/footers)
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Otherwise, render the full public website layout
  return (
    <>
      <Animate_slider />
      <Header />
      <Header_1 />
      {children}
      <Footer />
    </>
  );
}