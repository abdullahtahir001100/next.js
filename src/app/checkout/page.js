"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm"; 
import axios from "axios"; 
import "./checkout.scss"; 
import { Loader2 } from "lucide-react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]); 
  const [isCodFallback, setIsCodFallback] = useState(false);

  useEffect(() => {
    const initCheckout = async () => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          console.error("Stripe Publishable Key missing!");
          setIsCodFallback(true);
          setLoading(false);
          return;
      }

      const localData = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localData.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const ids = localData.map(item => item.id);
        const { data: dbProducts } = await axios.post("/api/cart-details", { ids });

        const mergedCart = localData.map(localItem => {
            const productDetail = dbProducts.find(p => p._id === localItem.id);
            if (!productDetail) return null;
            const rawPrice = productDetail.price ? productDetail.price.toString().replace(/[$,]/g, '') : "0";
            return { ...productDetail, price: parseFloat(rawPrice), quantity: localItem.quantity };
        }).filter(Boolean);

        setCartItems(mergedCart);

        try {
            const res = await fetch("/api/payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: mergedCart }),
            });

            if (!res.ok) throw new Error("API Error");

            const paymentData = await res.json();
            if (paymentData.clientSecret) {
                setClientSecret(paymentData.clientSecret);
                setIsCodFallback(false);
            } else {
                setIsCodFallback(true);
            }
        } catch (stripeErr) {
            console.error("Stripe Setup Failed:", stripeErr);
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
        <p>Preparing Checkout...</p>
      </div>
    );
  }

  const options = { clientSecret, appearance: { theme: 'stripe', labels: 'floating' } };
  const showStripe = clientSecret && stripePromise && !isCodFallback;

  return (
    <div className="checkout-wrapper-main">
      {showStripe ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm 
             cartItems={cartItems} 
             isCodFallback={false} 
             piId={clientSecret} 
          />
        </Elements>
      ) : (
        <CheckoutForm cartItems={cartItems} isCodFallback={true} />
      )}
    </div>
  );
}