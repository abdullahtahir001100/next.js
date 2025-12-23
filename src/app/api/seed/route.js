import { connectDB } from "@/lib/db";
import SiteContent from "@/lib/models/SiteContent";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type) {
      // Find specific section (hero_slider, categories, etc.)
      const content = await SiteContent.findOne({ contentType: type });
      return NextResponse.json(content ? content.data : null);
    }

    // Fetch everything if no type is specified
    const allContent = await SiteContent.find({});
    return NextResponse.json(allContent);
  } catch (err) {
    console.error("Content GET Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { contentType, data } = await req.json();

    if (!contentType || data === undefined) {
      return NextResponse.json({ error: "Missing contentType or data" }, { status: 400 });
    }

    // This handles the Add/Edit/Remove logic because it replaces 
    // the old array/object with the new one sent from the dashboard.
    const updated = await SiteContent.findOneAndUpdate(
      { contentType },
      { data },
      { 
        upsert: true, 
        new: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    return NextResponse.json({ 
      message: `${contentType} updated successfully`, 
      updated 
    });
  } catch (err) {
    console.error("Content POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}