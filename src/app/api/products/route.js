import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const sort = searchParams.get("sort");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    let query = {};
    if (section && section !== 'all') query.sectionPath = section;

    let sortOptions = { createdAt: -1 }; 
    if (sort === 'clicks' || sort === 'click_count') sortOptions = { click_count: -1 };
    else if (sort === 'price_low') sortOptions = { price: 1 };
    else if (sort === 'price_high') sortOptions = { price: -1 };

    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(query);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    // Fixed: We pass the WHOLE body. Mongoose will use the Schema to validate.
    // Removed the Number() conversion because your schema expects Strings for prices.
    const newProduct = await Product.create(body);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}