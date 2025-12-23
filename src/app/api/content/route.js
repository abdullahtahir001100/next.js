import { connectDB } from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";
import { NextResponse } from "next/server";

// --- THIS WAS LIKELY MISSING ---
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (!type) {
      return NextResponse.json({ error: "Content type is required" }, { status: 400 });
    }

    const content = await SiteContent.findOne({ contentType: type });
    
    // Return empty data structure if not found so frontend doesn't crash
    if (!content) {
      const fallback = type === 'categories' ? { col_1: [], col_2: [], col_3: [] } : [];
      return NextResponse.json(fallback);
    }

    return NextResponse.json(content.data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- YOUR EXISTING POST FUNCTION ---
export async function POST(req) {
  try {
    await connectDB();
    const { contentType, data } = await req.json();
    const updated = await SiteContent.findOneAndUpdate(
      { contentType },
      { data },
      { upsert: true, new: true }
    );
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}