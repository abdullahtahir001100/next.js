import { connectDB } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { NextResponse } from 'next/server';

// FIX: Added POST method to handle new inquiries from the contact form
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const newInquiry = await Inquiry.create(body);
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const data = await Inquiry.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function DELETE(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await Inquiry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  await connectDB();
  const body = await request.json();
  const { _id, ...updateData } = body;
  const updated = await Inquiry.findByIdAndUpdate(_id, updateData, { new: true });
  return NextResponse.json(updated);
}