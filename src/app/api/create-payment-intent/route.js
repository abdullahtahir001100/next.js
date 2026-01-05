import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";
import Stripe from "stripe";

// Prevents Next.js from trying to pre-render this route during 'npm run build'
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // 1. Check for the key FIRST before doing anything else
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      console.error("CRITICAL: STRIPE_SECRET_KEY is missing.");
      return NextResponse.json(
        { error: "Payment configuration is missing on the server." }, 
        { status: 500 }
      );
    }

    // 2. Initialize Stripe ONLY when a request actually happens
    const stripe = new Stripe(apiKey);

    await connectDB();
    const { items: cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const ids = cartItems.map((item) => item.id);

    // 3. Fetch real products from DB
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean(),
    ]);
    const dbProducts = [...productsA, ...productsB];

    // 4. Calculate total securely
    let subtotal = 0;
    cartItems.forEach((cartItem) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === cartItem.id);
      if (dbProduct) {
        const priceStr = dbProduct.salePrice || dbProduct.price;
        const priceVal = parseFloat(priceStr.toString().replace(/[$,]/g, ''));
        subtotal += priceVal * cartItem.quantity;
      }
    });

    const amountInCents = Math.round(subtotal * 100);

    if (amountInCents <= 0) {
       return NextResponse.json({ error: "Total amount must be greater than zero" }, { status: 400 });
    }

    // 5. Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret, 
      calculatedTotal: subtotal 
    });

  } catch (error) {
    // This catches Stripe initialization errors, DB errors, or JSON errors
    console.error("Payment Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}