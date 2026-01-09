"use client"; 

import { usePathname } from "next/navigation";
import Header from "./components/header_main";
import Header_1 from "./components/header";
import Animate_slider from "./components/animate_slider";
import Footer from "./components/footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  
  // Admin route check
  const isAdminRoute = pathname?.startsWith("/admin");

  // Admin route par Headers/Footers hide karo
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Baaki puri website par Headers dikhao
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