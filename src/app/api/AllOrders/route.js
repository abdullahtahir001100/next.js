import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function PUT(req) {
  await connectDB();
  const { id, status, paymentStatus } = await req.json();
  const updated = await Order.findByIdAndUpdate(id, { 
    status, 
    'payment.status': paymentStatus 
  }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req) {
    await connectDB();
    const { id } = await req.json();
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}