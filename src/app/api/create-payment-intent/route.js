import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";
import Stripe from "stripe";

// Force Next.js to treat this as a dynamic route and skip static build-time checks
export const dynamic = 'force-dynamic';

// Initialize Stripe with a fallback string to prevent "missing key" errors during 'npm run build'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req) {
  try {
    // 1. Runtime check for the API key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing from environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    await connectDB();
    const { items: cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const ids = cartItems.map((item) => item.id);

    // 2. Fetch real products from DB to get secure pricing
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean(),
    ]);
    const dbProducts = [...productsA, ...productsB];

    // 3. Calculate total securely
    let subtotal = 0;
    cartItems.forEach((cartItem) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === cartItem.id);
      if (dbProduct) {
        // Use sale price if it exists, otherwise regular price. 
        const priceStr = dbProduct.salePrice || dbProduct.price;
        // Remove '$' or ',' and convert to float
        const priceVal = parseFloat(priceStr.toString().replace(/[$,]/g, ''));
        subtotal += priceVal * cartItem.quantity;
      }
    });

    const shippingCost = 0; 
    const total = subtotal + shippingCost;

    // Stripe expects amounts in CENTS (e.g., $10.00 = 1000 cents)
    const amountInCents = Math.round(total * 100);

    if (amountInCents <= 0) {
       return NextResponse.json({ error: "Total amount must be greater than zero" }, { status: 400 });
    }

    // 4. Create a PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { integration_check: 'accept_a_payment' },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the frontend
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret, 
      calculatedTotal: total 
    });

  } catch (error) {
    console.error("Payment Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}