"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import "./success.scss";

export default function SuccessPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  useEffect(() => {
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="success-page">
      <CheckCircle size={80} color="#d32f2f" />
      <h1>Order Forged Successfully!</h1>
      <p>Your order ID is <strong>#{orderId?.slice(-6).toUpperCase()}</strong></p>
      <Link href="/" className="btn-back">Continue Shopping</Link>
    </div>
  );
}