import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const sort = searchParams.get("sort"); // New sort param

    // Build query object
    let query = {};
    if (section && section !== 'all') {
      query.sectionPath = section;
    }

    // Build sort object
    let sortOptions = { createdAt: -1 }; // Default sort
    if (sort === 'clicks' || sort === 'click_count') {
      sortOptions = { click_count: -1 }; // Highest clicks first
    }

    const products = await Product.find(query).sort(sortOptions);
    return NextResponse.json(products);
  } catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// Keep your existing POST function below this...
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const newProduct = await Product.create(body);
    return NextResponse.json(newProduct);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}