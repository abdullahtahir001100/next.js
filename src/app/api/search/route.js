// full dashboard page do  image ki jese import { v2 as cloudinary } from 'cloudinary';



// // Configure Cloudinary with environment variables

// cloudinary.config({

//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,

//   api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY,

//   api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET,

// });



// /**

//  * Uploads a file to Cloudinary

//  * @param {string} fileUri - The data URI or file path

//  * @param {string} folder - The folder name in Cloudinary (e.g., 'products', 'hero')

//  */

// export const uploadToCloudinary = async (fileUri, folder = "viking_armory") => {

//   return new Promise((resolve, reject) => {

//     cloudinary.uploader.upload(

//       fileUri,

//       {

//         folder: folder,

//         resource_type: "auto",

//         // Transformations: Resize to 1000px max, auto-optimize quality/format

//         transformation: [

//           { width: 1000, crop: "limit" },

//           { quality: "auto", fetch_format: "auto" }

//         ]

//       },

//       (error, result) => {

//         if (error) {

//           console.error("Cloudinary Upload Error:", error);

//           reject(error);

//         } else {

//           resolve(result.secure_url);

//         }

//       }

//     );

//   });

// };import mongoose from 'mongoose';



// const SiteContentSchema = new mongoose.Schema({

//   // 'hero_slider', 'info_bar', 'categories', 'about_section'

//   contentType: { 

//     type: String, 

//     required: true, 

//     unique: true 

//   }, 

//   // This will store your arrays (info_bar) or objects (categories)

//   data: { 

//     type: mongoose.Schema.Types.Mixed, 

//     required: true 

//   }

// }, { timestamps: true });



// export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);const mongoose = require('mongoose');



// const productSchema = new mongoose.Schema({

//   name: { type: String, required: true },

//   productType: { type: String, required: true }, // e.g., "Viking Sword"

//   price: String,

//   salePrice: String,

//   mainImage: String, // Cloudinary URL

//   hoverImage: String, // Cloudinary URL

//   smallImages: [String], // Array of Cloudinary URLs

//   onSale: { type: Boolean, default: false },

//   vendor: { type: String, default: "Viking Armory Blades" },

//   stock: { type: Number, default: 0 },

//   sectionPath: { type: String, enum: ['best-seller', 'sword', 'related', 'none'], default: 'none' },

//   description: String,

//   recentSales: String,

//   click_count: { type: Number, default: 0 },

// }, { timestamps: true });



// module.exports = mongoose.model('Product', productSchema);import { connectDB } from "@/lib/db";

// import SiteContent from "@/lib/models/SiteContent";

// import { NextResponse } from "next/server";



// // --- THIS WAS LIKELY MISSING ---

// export async function GET(req) {

//   try {

//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const type = searchParams.get("type");



//     if (!type) {

//       return NextResponse.json({ error: "Content type is required" }, { status: 400 });

//     }



//     const content = await SiteContent.findOne({ contentType: type });

    

//     // Return empty data structure if not found so frontend doesn't crash

//     if (!content) {

//       const fallback = type === 'categories' ? { col_1: [], col_2: [], col_3: [] } : [];

//       return NextResponse.json(fallback);

//     }



//     return NextResponse.json(content.data);

//   } catch (err) {

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// }



// // --- YOUR EXISTING POST FUNCTION ---

// export async function POST(req) {

//   try {

//     await connectDB();

//     const { contentType, data } = await req.json();

//     const updated = await SiteContent.findOneAndUpdate(

//       { contentType },

//       { data },

//       { upsert: true, new: true }

//     );

//     return NextResponse.json(updated);

//   } catch (err) {

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// }import { connectDB } from "@/lib/db";

// import Product from "@/lib/models/Product";

// import { NextResponse } from "next/server";



// export async function PUT(req, { params }) {

//   try {

//     await connectDB();

//     const { id } = params;

//     const body = await req.json();

//     const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

//     return NextResponse.json(updatedProduct);

//   } catch (err) {

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// }



// export async function DELETE(req, { params }) {

//   try {

//     await connectDB();

//     const { id } = params;

//     await Product.findByIdAndDelete(id);

//     return NextResponse.json({ message: "Product banished from armory" });

//   } catch (err) {

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// }import { connectDB } from "@/lib/db";

// import Product from "@/lib/models/Product";

// import { NextResponse } from "next/server";



// // GET all products for the dashboard table

// export async function GET() {

//   try {

//     await connectDB();

//     const products = await Product.find({}).sort({ createdAt: -1 });

//     return NextResponse.json(products);

//   } catch (err) {

//     console.error("Dashboard Fetch Error:", err);

//     return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });

//   }

// }



// // POST a new product from the dashboard form

// export async function POST(req) {

//   try {

//     await connectDB();

//     const body = await req.json();

    

//     // Simple validation

//     if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });



//     const newProduct = await Product.create(body);

//     return NextResponse.json(newProduct);

//   } catch (err) {

//     console.error("Dashboard Create Error:", err);

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// }import { connectDB } from "@/lib/db";

// import SiteContent from "@/lib/models/SiteContent";

// import { NextResponse } from "next/server";



// export async function GET() {

//   try {

//     await connectDB();



//     const initialContent = [

//       {

//         contentType: 'hero_slider',

//         data: [

//           { id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces.jpg?v=1755453589&width=1880", alt: "Hammers" },

//           { id: 2, src: "https://vikingarmoryblades.com/cdn/shop/files/Axes.jpg?v=1755453418&width=1880", alt: "Axes" },

//           { id: 4, src: "https://vikingarmoryblades.com/cdn/shop/files/Swords.jpg?v=1755453830&width=1880", alt: "Swords" },

//         ]

//       },

//       {

//         contentType: 'info_bar',

//         data: [

//           { id: 1, src: '/world.png', text: 'Safe and Secure Shipping' },

//           { id: 2, src: '/world.png', text: 'Premium Quality Materials' },

//         ]

//       },

//       {

//         contentType: 'categories',

//         data: {

//           col_1: [{ id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Swords_abbe2de0-01ee-4e0f-bcd6-944b5202a3f5_523x.jpg" }],

//           col_2: [{ id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Shield_armor_d0abbb7f-b750-4222-9580-898e3b676292_785x.jpg" }],

//           col_3: [{ id: 1, src: "https://vikingarmoryblades.com/cdn/shop/files/Hammers_Maces_81c27014-cb95-4eaf-80c2-27b558e49409_523x.jpg" }]

//         }

//       },

//       {

//         contentType: 'about_section',

//         data: {

//           text: 'Welcome to Viking Armory Blades – Where History Lives On...',

//           src: 'https://vikingarmoryblades.com/cdn/shop/files/about_1_940x.jpg'

//         }

//       }

//     ];



//     // Loop through and update or create

//     for (const item of initialContent) {

//       await SiteContent.findOneAndUpdate(

//         { contentType: item.contentType },

//         { data: item.data },

//         { upsert: true }

//       );

//     }



//     return NextResponse.json({ message: "Armory Database Seeded Successfully!" });

//   } catch (err) {

//     return NextResponse.json({ error: err.message }, { status: 500 });

//   }

// } i added a demo products remove it also give me all code haning a name of file in comment also delete or edit function not works 