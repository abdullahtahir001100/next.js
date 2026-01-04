import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import Product from '@/lib/models/ShopProducts';

// --- 1. GET: Fetch All Products OR Single Product ---
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Check if an ID is provided for a single product fetch
    const id = searchParams.get('id');
    if (id) {
      const product = await Product.findById(id);
      if (!product) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: product });
    }

    // Filter Logic
    const category = searchParams.get('category'); 
    const section = searchParams.get('section');
    const sort = searchParams.get('sort') || 'featured';
    const limit = parseInt(searchParams.get('limit')) || 100;

    let query = {};
    if (category && category !== 'All') {
      query.productType = { $regex: category, $options: 'i' };
    }
    if (section && section !== 'none') {
      query.sectionPath = section;
    }

    let sortOption = { createdAt: -1 }; 
    if (sort === 'price-ascending') sortOption = { price: 1 };
    if (sort === 'price-descending') sortOption = { price: -1 };
    if (sort === 'title-ascending') sortOption = { name: 1 };
    if (sort === 'best-selling') sortOption = { click_count: -1 };

    const products = await Product.find(query).sort(sortOption).limit(limit);

    return NextResponse.json({ success: true, count: products.length, data: products });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// --- 2. POST: Create New Product ---
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Required Field Validation
    if (!body.productId || !body.name || !body.price || !body.mainImage) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });

  } catch (error) {
    if (error.code === 11000) {
        return NextResponse.json({ success: false, error: "Product ID must be unique." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// --- 3. PUT: Edit / Update Product ---
export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Get ID from URL query
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required for update" }, { status: 400 });
    }

    // Find by database _id and update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true } // returns the modified document
    );

    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProduct });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// --- 4. DELETE: Remove Product ---
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required for deletion" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blade entry deleted successfully" });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}