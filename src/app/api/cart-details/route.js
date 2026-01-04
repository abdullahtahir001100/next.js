import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts";

export async function POST(req) {
  try {
    await connectDB();
    const { ids } = await req.json(); // IDs array from frontend

    if (!ids || ids.length === 0) {
      return NextResponse.json([]);
    }

    // 1. Dono Collections mein dhundein (Promise.all for speed)
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).select("name price salePrice mainImage images").lean(),
      ShopProducts.find({ _id: { $in: ids } }).select("name price salePrice mainImage images").lean()
    ]);

    // 2. Dono results ko mix karein
    const allProducts = [...productsA, ...productsB];

    // 3. Price formatting (agar string hai to number mein convert logic frontend pe bhi ho sakta hai, par yahan clean data bhejein)
    const cleanedProducts = allProducts.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        // Image logic: agar mainImage nahi hai to images array ka pehla item lelo
        image: p.mainImage || (p.images && p.images[0]) || "/placeholder.jpg",
        // Price logic: salePrice use karein agar ho, warna normal price
        price: p.salePrice || p.price
    }));

    return NextResponse.json(cleanedProducts);

  } catch (error) {
    console.error("Cart Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}