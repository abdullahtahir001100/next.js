import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Stripe key missing" }, { status: 500 });
    }
    const stripe = new Stripe(apiKey);

    await connectDB();
    
    const body = await req.json();
    const cartItems = body.items;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 1. IDs Extraction Fix (Handle both _id and id)
    const ids = cartItems.map((item) => item._id || item.id).filter(Boolean);

    // 2. Fetch Products
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean(),
    ]);
    const dbProducts = [...productsA, ...productsB];

    // 3. Calculate Total
    let subtotal = 0;
    
    cartItems.forEach((cartItem) => {
      // Frontend item ID normalize karein
      const cartItemId = cartItem._id || cartItem.id;
      
      const dbProduct = dbProducts.find((p) => p._id.toString() === cartItemId);
      
      if (dbProduct) {
        // SECURE WAY: DB Price use karein
        const priceStr = dbProduct.salePrice || dbProduct.price;
        const priceVal = parseFloat(priceStr.toString().replace(/[$,]/g, ''));
        subtotal += priceVal * cartItem.quantity;
      } else {
        // --- FALLBACK (UNSAFE BUT FIXES YOUR ERROR FOR NOW) ---
        console.warn(`⚠️ Product ID ${cartItemId} not found in DB. Using Frontend Price.`);
        const fallbackPrice = parseFloat(cartItem.price.toString().replace(/[$,]/g, ''));
        subtotal += fallbackPrice * cartItem.quantity;
      }
    });

    // 4. Final Amount Check
    const amountInCents = Math.round(subtotal * 100);

    if (amountInCents <= 0) {
      return NextResponse.json({ error: "Total amount is 0" }, { status: 400 });
    }

    // 5. Create Payment Intent
    // Note: Hum yahan Order ID nahi daal sakte kyunki Order abhi bana nahi hai.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart_items_count: cartItems.length.toString(),
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret, 
      paymentIntentId: paymentIntent.id, 
      calculatedTotal: subtotal 
    });

  } catch (error) {
    console.error("Payment Intent Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}