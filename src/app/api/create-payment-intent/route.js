import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";
import Stripe from "stripe";

// Initialize Stripe server-side with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectDB();
    const { items: cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const ids = cartItems.map((item) => item.id);

    // 1. Fetch real products from DB to get secure pricing (don't trust client price)
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean(),
    ]);
    const dbProducts = [...productsA, ...productsB];

    // 2. Calculate total securely
    let subtotal = 0;
    cartItems.forEach((cartItem) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === cartItem.id);
      if (dbProduct) {
        // Use sale price if it exists, otherwise regular price. Ensure it's a number.
        const priceStr = dbProduct.salePrice || dbProduct.price;
        // Remove '$' or ',' if present and convert to float
        const priceVal = parseFloat(priceStr.toString().replace(/[$,]/g, ''));
        subtotal += priceVal * cartItem.quantity;
      }
    });

    // Hardcoded shipping for now based on the image, you can make this dynamic later
    const shippingCost = 0; 
    const total = subtotal + shippingCost;

    // IMPORTANT: Stripe expects amounts in CENTS (e.g., $10.00 = 1000 cents)
    const amountInCents = Math.round(total * 100);

    if (amountInCents === 0) {
       return NextResponse.json({ error: "Total amount is zero" }, { status: 400 });
    }

    // 3. Create a PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      // You can add metadata here to link to an order ID later
      metadata: { integration_check: 'accept_a_payment' },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the frontend
    return NextResponse.json({ clientSecret: paymentIntent.client_secret, calculatedTotal: total });

  } catch (error) {
    console.error("Payment Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}