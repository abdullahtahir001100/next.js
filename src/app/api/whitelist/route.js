import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function POST(req) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch products based on the IDs provided
    const products = await Product.find({ _id: { $in: ids } }).lean();
    
    // Serialize data (convert ObjectIDs to strings)
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}