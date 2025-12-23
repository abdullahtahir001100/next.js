// src/app/api/upload/route.js
import { uploadToCloudinary } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fileUri, folder } = await req.json();

    if (!fileUri) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(fileUri, folder || "viking_armory");

    // IMPORTANT: Return an object with a "url" property
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}