import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Destructure exactly what the frontend sends
    const { items, customer, address, paymentMethod } = body;

    // 1. Validation: Ensure required fields exist
    if (!items || !customer || !address) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // 2. Format Items for Schema (Ensure Numbers)
    let subtotal = 0;
    const finalItems = items.map(item => {
      const priceVal = parseFloat(item.salePrice || item.price);
      subtotal += priceVal * item.quantity;
      return {
        productId: item._id || item.id,
        name: item.name,
        quantity: parseInt(item.quantity),
        price: priceVal,
        image: item.image || item.mainImage
      };
    });

    const total = subtotal; // Add shipping logic here if needed

    // 3. Construct Order Object (Strictly matching Schema)
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
        method: paymentMethod,
        status: 'pending',
      },
      status: 'Processing'
    };

    // 4. COD Logic
    if (paymentMethod === 'cod') {
      const newOrder = await Order.create(orderData);
      return NextResponse.json({ success: true, orderId: newOrder._id, method: 'cod' });
    }

    // 5. Stripe Logic
    if (!stripe) {
        return NextResponse.json({ error: "Stripe not configured", fallback: true }, { status: 500 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { 
        email: customer.email,
        customerName: `${customer.firstName} ${customer.lastName}`
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret, 
      total, 
      method: 'stripe' 
    });

  } catch (error) {
    console.error("Checkout API Error:", error); // Check server console for this
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}