import { connectDB } from '@/lib/db'; // Ensure this matches your lib/db.js export name
import ContactSettings from '@/lib/models/ContactSettings';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const updated = await ContactSettings.findOneAndUpdate({}, body, { 
      new: true, 
      upsert: true 
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}