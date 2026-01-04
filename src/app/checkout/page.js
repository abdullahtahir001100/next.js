"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm"; 
import axios from "axios"; // Ensure axios is installed
import "./checkout.scss"; 
import { Loader2 } from "lucide-react";

// Initialize Stripe outside component
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); // This will hold FULL product data
  const [isCodFallback, setIsCodFallback] = useState(false);

  useEffect(() => {
    const initCheckout = async () => {
      // 1. Local Storage se IDs aur Quantity uthao
      const localData = JSON.parse(localStorage.getItem("cart") || "[]");
      
      if (localData.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // 2. IDs nikal kar API ko bhejo details fetch karne ke liye
        const ids = localData.map(item => item.id);
        const { data: dbProducts } = await axios.post("/api/cart-details", { ids });

        // 3. DB ka data aur LocalStorage ki quantity MERGE karein
        const mergedCart = localData.map(localItem => {
            const productDetail = dbProducts.find(p => p._id === localItem.id);
            if (!productDetail) return null; // Agar product DB se delete ho gya ho

            // Price ko number mein convert karna zaroori hai calculation ke liye
            const rawPrice = productDetail.price ? productDetail.price.toString().replace(/[$,]/g, '') : "0";
            
            return {
                ...productDetail,
                price: parseFloat(rawPrice), // String "$100" -> Number 100
                quantity: localItem.quantity // Quantity localStorage wali
            };
        }).filter(Boolean); // Null items hata do

        setCartItems(mergedCart);

        // 4. Ab Stripe API call karo mergedCart ke sath
        // Note: Stripe API ko bhi ab full details milengi calculate karne ke liye
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  items: mergedCart, // Bhejein full data
                  customer: { email: "init@guest.com" }, 
                  paymentMethod: 'stripe' 
                }),
            });

            if (!res.ok) throw new Error("API Fail");
            
            const paymentData = await res.json();
            
            if (paymentData.clientSecret) {
                setClientSecret(paymentData.clientSecret);
            } else {
                setIsCodFallback(true);
            }
        } catch (stripeErr) {
            console.log("Stripe init failed, fallback to COD");
            setIsCodFallback(true);
        }

      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, []);

  if (loading) {
    return (
      <div className="checkout-loader-screen">
        <Loader2 className="animate-spin" size={48} color="#1773b0"/>
        <p style={{marginTop: '20px', fontWeight: 'bold'}}>Loading Cart Details...</p>
      </div>
    );
  }

  // Render Logic
  const options = {
    clientSecret,
    appearance: { theme: 'stripe', labels: 'floating' },
  };

  if (clientSecret && stripePromise && !isCodFallback) {
    return (
      <div className="checkout-wrapper-main">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm cartItems={cartItems} isCodFallback={false} />
        </Elements>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper-main">
      <CheckoutForm cartItems={cartItems} isCodFallback={true} />
    </div>
  );
}