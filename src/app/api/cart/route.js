import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";

export async function POST(req) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json([]);
    }

    // Query both collections
    const [resA, resB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean()
    ]);

    const combined = [...resA, ...resB];
    return NextResponse.json(JSON.parse(JSON.stringify(combined)));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}