import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

// GET Single Order
export async function GET(req, { params }) {
  try {
    // FIX: Await params before accessing id
    const { id } = await params; 
    
    await connectDB();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Error fetching order" }, { status: 500 });
  }
}

// UPDATE Order Status
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // FIX
    await connectDB();
    
    const body = await req.json();
    const { status } = body;

    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE Order
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // FIX
    await connectDB();
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}