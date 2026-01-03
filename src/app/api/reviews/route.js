import { connectDB } from "@/lib/db";
import Review from "@/lib/models/Review";
import { NextResponse } from "next/server";

// GET: Fetch reviews for a specific product
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error("GET_REVIEWS_ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, userName, rating, comment } = body;

    // 1. Basic Validation
    if (!productId || !userName || !rating || !comment) {
      return NextResponse.json(
        { message: "All fields are required to forge a review." }, 
        { status: 400 }
      );
    }

    // 2. Prevent Duplicate Review (Same user, same product, same comment)
    // This stops the 500 error if you have unique constraints, or just saves DB space
    const existingReview = await Review.findOne({
      productId,
      userName: { $regex: new RegExp(`^${userName}$`, "i") }, // Case-insensitive
      comment: { $regex: new RegExp(`^${comment}$`, "i") }
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already forged this exact review for this blade." }, 
        { status: 409 } // Conflict
      );
    }

    // 3. Create the review
    const newReview = await Review.create({
      productId,
      userName,
      rating: Number(rating), // Ensure rating is a number to prevent schema errors
      comment
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (err) {
    console.error("POST_REVIEW_ERROR:", err);
    // Returning the specific error message helps you debug in the console
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}