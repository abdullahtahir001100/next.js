import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; 
import Product from '@/lib/models/ShopProducts';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: product });
    }

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

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    if (!body.productId || !body.name || !body.price || !body.mainImage) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ success: false, error: "Product ID already exists" }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Correct way to get ?id=...
    const body = await request.json();

    if (!id) return NextResponse.json({ success: false, error: "ID parameter is missing" }, { status: 400 });

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!updatedProduct) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Correct way to get ?id=...

    if (!id) return NextResponse.json({ success: false, error: "ID parameter is missing" }, { status: 400 });

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}