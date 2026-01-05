import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Stripe configuration missing" }, { status: 500 });
    }
    const stripe = new Stripe(stripeKey);

    await connectDB();
    
    const body = await req.json();
    const { items, customer, address, paymentMethod } = body;

    // 1. Calculate Total (Always required)
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    let subtotal = 0;
    const finalItems = items.map((item) => {
      const rawPrice = item.salePrice || item.price;
      const priceVal = typeof rawPrice === 'string' 
        ? parseFloat(rawPrice.replace(/[$,]/g, '')) 
        : parseFloat(rawPrice);
      subtotal += priceVal * item.quantity;

      return {
        productId: item._id || item.id,
        name: item.name,
        quantity: parseInt(item.quantity),
        price: priceVal,
        image: item.image || item.mainImage,
      };
    });

    const total = subtotal; // Add shipping logic here if needed
    const amountInCents = Math.round(total * 100);

    // ============================================================
    // MODE A: INITIALIZATION (Page Load)
    // We only want the Stripe Key. We don't have an address yet.
    // ============================================================
    if (!address || !customer?.firstName) {
        // Create a PaymentIntent for the cart amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        // Return ONLY the key. Do not save an Order to DB yet.
        return NextResponse.json({ 
            clientSecret: paymentIntent.client_secret, 
            total 
        });
    }

    // ============================================================
    // MODE B: FULL ORDER (User Clicked Submit)
    // Now we validate everything and save to MongoDB
    // ============================================================
    
    // 1. Create Order Object
    const orderData = {
      customer: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      shippingAddress: {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      items: finalItems,
      financials: {
        subtotal: subtotal,
        shipping: 0,
        discount: 0,
        total: total,
      },
      payment: {
        method: paymentMethod || 'card',
        status: 'pending',
      },
      status: 'Processing',
    };

    // 2. Save to Database
    const newOrder = await Order.create(orderData);

    // 3. Response
    return NextResponse.json({ 
        success: true, 
        orderId: newOrder._id, 
        method: paymentMethod 
    });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}