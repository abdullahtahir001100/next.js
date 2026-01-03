import { connectDB } from '@/lib/db';
import { SiteData } from '@/lib/models/SiteData';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    let data = await SiteData.findOne({ pageId: "collections_main" });
    if (!data) {
      data = await SiteData.create({
        pageId: "collections_main",
        hero: { title: "Collections", description: "Default...", breadcrumb: "Home > Collections" },
        collections: []
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // THE FIX: We use $set to ensure the DB updates the exact fields passed
    const updated = await SiteData.findOneAndUpdate(
      { pageId: "collections_main" },
      { $set: { hero: body.hero, collections: body.collections } },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}