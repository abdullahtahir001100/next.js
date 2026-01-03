import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await req.json();

    // Use findByIdAndUpdate with the full body
    const updatedProduct = await Product.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedProduct) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Product removed", id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}