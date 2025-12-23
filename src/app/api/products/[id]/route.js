import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

// Handle EDIT (PUT)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    // Unwrapping params is required in Next.js 15+
    const { id } = await params; 
    
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Handle DELETE
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    // Unwrapping params is required in Next.js 15+
    const { id } = await params; 
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Product banished from armory" });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}