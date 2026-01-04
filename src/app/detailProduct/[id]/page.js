import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ShopProducts from '@/lib/models/ShopProducts';
import ProductPageClient from "../page";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  // 1. Await params for Next.js 15 compatibility
  const { id } = await params;

  try {
    await connectDB();

    // 2. Attempt to find the product in the first model
    let productData = await Product.findById(id).lean();

    // 3. If not found in 'Product', try 'ShopProducts'
    if (!productData) {
      productData = await ShopProducts.findById(id).lean();
    }

    // 4. If it's not in either, trigger 404
    if (!productData) {
      return notFound();
    }

    // 5. Serialize MongoDB Data
    // This converts _id (ObjectId) to a string and dates to ISO strings
    const serializedProduct = JSON.parse(JSON.stringify(productData));

    // 6. Return the Client Component with the found product
    return <ProductPageClient product={serializedProduct} />;

  } catch (error) {
    console.error("Database Fetch Error:", error);
    // Handles invalid ObjectId formats or connection drops
    return notFound();
  }
}