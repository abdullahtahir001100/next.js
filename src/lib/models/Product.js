import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide a product name"], trim: true },
  productType: { type: String, required: [true, "Please specify type (e.g. Knife, Axe)"] },
  price: { type: String, required: [true, "Price is required"] },
  salePrice: { type: String },
  mainImage: { type: String, required: [true, "Main image is required"] },
  hoverImage: { type: String },
  smallImages: { type: [String], default: [] },
  onSale: { type: Boolean, default: false },
  vendor: { type: String, default: "Viking Armory Blades" },
  stock: { type: Number, default: 1, min: 0 },
  sectionPath: { type: String, enum: ['best-seller', 'sword', 'related', 'none'], default: 'none' },
  description: { type: String, trim: true },
  
  // --- NEW DETAILED FIELDS ---
  bladeMaterial: { type: String, default: "Damascus Steel" },
  handleMaterial: { type: String, default: "Walnut Wood & Brass" },
  overallLength: { type: String, default: '12"' },
  bladeLength: { type: String, default: '7"' },
  weight: { type: String, default: "450g" },
  
  recentSales: { type: String, default: "No Sales" },
  click_count: { type: Number, default: 0 }
}, { 
  timestamps: true,
  strict: false // This ensures that even if Mongoose is confused, it WILL save the data
});

// IMPORTANT: Clear the model cache in Next.js development
export default mongoose.models.Product || mongoose.model('Product', productSchema);