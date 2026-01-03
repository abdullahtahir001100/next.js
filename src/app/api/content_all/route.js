import { connectDB } from '@/lib/db';
import PageContent from '@/lib/models/PageContent';
import { NextResponse } from 'next/server';

// GET: Fetch content
export async function GET(req) {
  try {
    await connectDB();
    
    // URL se slug nikalne ka sahi tarika
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Slug is missing in URL" }, { status: 400 });
    }

    const data = await PageContent.findOne({ slug });
    
    // Agar data nahi milta toh empty array bhejien, error nahi
    return NextResponse.json(data || { files: [] });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: Save/Update content
export async function POST(req) {
  try {
    await connectDB();
    const { slug, files } = await req.json();

    if (!slug || !files) {
      return NextResponse.json({ error: "Slug and Files are required" }, { status: 400 });
    }

    const updated = await PageContent.findOneAndUpdate(
      { slug },
      { files },
      { upsert: true, new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}

// DELETE: Content delete karne ke liye
export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  await PageContent.findOneAndDelete({ slug });
  return NextResponse.json({ message: "Deleted" });
}