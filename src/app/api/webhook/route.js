import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  let event;

  try {
    if (!signature || !webhookSecret) {
      return new NextResponse("Webhook Secret or Signature missing", { status: 400 });
    }
    // Verify signature to ensure request is from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await connectDB();

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);

      // Find order by Intent ID and update to Paid
      const order = await Order.findOneAndUpdate(
        { "payment.intentId": paymentIntent.id },
        {
          $set: {
            status: "Processing", // Ab order confirm hua hai
            "payment.status": "paid",
            "payment.transactionId": paymentIntent.id
          }
        },
        { new: true }
      );

      if (order) {
        console.log(`✅ Order ${order._id} marked as Paid via Webhook.`);
      } else {
        console.error(`❌ Order not found for Intent ID: ${paymentIntent.id}`);
      }
      break;

    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object;
      console.log(`❌ Payment failed: ${paymentIntentFailed.last_payment_error?.message}`);
      
      await Order.findOneAndUpdate(
        { "payment.intentId": paymentIntentFailed.id },
        {
          $set: {
            status: "Payment Failed",
            "payment.status": "failed"
          }
        }
      );
      break;

    default:
      // console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse("Received", { status: 200 });
}