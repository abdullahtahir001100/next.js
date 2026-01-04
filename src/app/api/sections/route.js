import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // <--- FIXED
import Section from '@/lib/models/Section';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const section = await Section.findOne({ sectionName: name });
    return NextResponse.json({ success: true, data: section || {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { sectionName } = body;

    const section = await Section.findOneAndUpdate(
      { sectionName },
      body,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}