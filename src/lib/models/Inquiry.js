import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  // Custom ID field for easier reference in your dashboard
  inquiryId: { 
    type: String, 
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000).toString() // Generates a random 6-digit ID
  },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  comment: { type: String, required: true },
  status: { type: String, default: 'New' }, 
}, { timestamps: true });

// This ensures the model works across hot-reloads in Next.js
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);