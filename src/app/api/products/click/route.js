import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Increment click_count by 1
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { click_count: 1 } },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Click tracked", 
      click_count: updatedProduct.click_count 
    });
  } catch (err) {
    console.error("Tracking Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}