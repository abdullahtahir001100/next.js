"use client";
import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import "./success.scss";

// 1. Create a component to hold the logic that relies on browser parameters
function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  useEffect(() => {
    // Clear cart only after we successfully load the success page
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="success-page">
      <CheckCircle size={80} color="#d32f2f" />
      <h1>Order Forged Successfully!</h1>
      <p>
        Your order ID is{" "}
        <strong>#{orderId ? orderId.slice(-6).toUpperCase() : "PROCESSING"}</strong>
      </p>
      <Link href="/" className="btn-back">
        Continue Shopping
      </Link>
    </div>
  );
}

// 2. Export the main page wrapped in Suspense
// This tells Next.js: "Render a loading state while we figure out the URL parameters"
export default function SuccessPage() {
  return (
    // You can make the fallback look cleaner if you want, or just a simple div
    <Suspense fallback={<div className="success-page">Loading Order Details...</div>}>
      <SuccessContent />
    </Suspense>
  );
}