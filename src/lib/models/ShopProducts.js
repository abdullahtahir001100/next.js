import mongoose from 'mongoose';

const shopProductSchema = new mongoose.Schema({
  // 1. ID & Basic Info
  productId: { type: String, required: [true, "Product ID is required"], unique: true, trim: true },
  name: { type: String, required: [true, "Product Name is required"], trim: true },
  productType: { type: String, required: [true, "Category is required"] },
  vendor: { type: String, default: "Viking Armory Blades" },

  // 2. Pricing & Stock
  price: { type: String, required: [true, "Price is required"] },
  salePrice: { type: String },
  onSale: { type: Boolean, default: false },
  stock: { type: Number, default: 1, min: 0 },

  // 3. Images (URLs from Cloudinary)
  mainImage: { type: String, required: [true, "Main Image is required"] },
  hoverImage: { type: String },
  smallImages: { type: [String], default: [] }, // Array of strings

  // 4. Section & Banner Logic
  // Matches your requested list
  sectionPath: { 
    type: String, 
    enum: [
      'Swords', 'Axes', 'Knives & Daggers', 'Spears & Polearms', 
      'Chef Set', 'Hammers & Maces', 'Shields & Armor', 'Display & Accessories', 
      'best-seller', 'related', 'none'
    ], 
    default: 'none' 
  },

  // 5. Descriptions & Specs
  description: { type: String, required: [true, "Description is required"] },
  bladeMaterial: { type: String, default: "Damascus Steel" },
  handleMaterial: { type: String, default: "Walnut Wood & Brass" },
  overallLength: { type: String, default: '12"' },
  bladeLength: { type: String, default: '7"' },
  weight: { type: String, default: "450g" },

  // 6. Internal Data
  recentSales: { type: String, default: "No Sales" },
  click_count: { type: Number, default: 0 }
}, { 
  timestamps: true,
  strict: false 
});

export default mongoose.models.shopProductSchema || mongoose.model('shopProductSchema', shopProductSchema);