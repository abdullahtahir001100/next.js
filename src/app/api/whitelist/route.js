import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from "@/lib/models/ShopProducts"; // Import your second model

export async function POST(req) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Use Promise.all to query both collections in parallel (much faster)
    const [productsA, productsB] = await Promise.all([
      Product.find({ _id: { $in: ids } }).lean(),
      ShopProducts.find({ _id: { $in: ids } }).lean()
    ]);

    // Merge the results from both collections into one array
    const combinedProducts = [...productsA, ...productsB];

    // Serialize data (convert ObjectIDs to strings)
    const serializedProducts = JSON.parse(JSON.stringify(combinedProducts));

    // Optional: Sort them back into the order of the 'ids' array provided by the client
    const sortedProducts = ids
      .map(id => serializedProducts.find(p => p._id === id))
      .filter(Boolean); // Remove any undefined entries if an ID wasn't found

    return NextResponse.json(sortedProducts);
  } catch (error) {
    console.error("Recently Viewed API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}