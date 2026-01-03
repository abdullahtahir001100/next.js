import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import ProductPageClient from "../page";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  // Next.js 15+ requires awaiting params
  const { id } = await params;

  try {
    await connectDB();

    // Fetch product using .lean() for better performance
    const product = await Product.findById(id).lean();

    // If ID doesn't exist in MongoDB, show the 404 page
    if (!product) {
      return notFound();
    }

    // Serialize MongoDB Data (converts ObjectIDs/Dates to Strings)
    const serializedProduct = JSON.parse(JSON.stringify(product));

    return <ProductPageClient product={serializedProduct} />;
  } catch (error) {
    console.error("Database Fetch Error:", error);
    // If the ID format is totally wrong (e.g. '123'), show 404
    return notFound();
  }
}