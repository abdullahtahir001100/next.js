import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { items, customer, address, paymentMethod, paymentIntentId } = body;

    // 1. Calculate Total
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

    const total = subtotal; 

    // 2. Create Order Object
    // Initial Status depends on method. If Stripe, it's "Pending Payment" until Webhook fires.
    const initialStatus = paymentMethod === 'stripe' ? 'Pending Payment' : 'Processing';
    const paymentStatus = paymentMethod === 'stripe' ? 'pending' : 'pending'; // COD is also pending initially

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
        status: paymentStatus,
        intentId: paymentIntentId, // YEH BAHUT ZAROORI HAI WEBHOOK KE LIYE
      },
      status: initialStatus,
    };

    // 3. Save to Database
    const newOrder = await Order.create(orderData);

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