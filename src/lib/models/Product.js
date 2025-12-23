const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productType: { type: String, required: true }, // e.g., "Viking Sword"
  price: String,
  salePrice: String,
  mainImage: String, // Cloudinary URL
  hoverImage: String, // Cloudinary URL
  smallImages: [String], // Array of Cloudinary URLs
  onSale: { type: Boolean, default: false },
  vendor: { type: String, default: "Viking Armory Blades" },
  stock: { type: Number, default: 1 },
  sectionPath: { type: String, enum: ['best-seller', 'sword', 'related', 'none'], default: 'sword' },
  description: String,
  recentSales: String,
  click_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);