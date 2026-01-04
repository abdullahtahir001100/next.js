import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  // The ID, e.g., "Swords" or "best-seller"
  sectionName: { 
    type: String, 
    required: true, 
    unique: true,
    enum: [
      'Swords', 'Axes', 'Knives & Daggers', 'Spears & Polearms', 
      'Chef Set', 'Hammers & Maces', 'Shields & Armor', 'Display & Accessories', 
      'best-seller', 'related'
    ]
  },
  
  // The Banner Content
  mainTitle: { type: String, default: "" },
  mainDescription: { type: String, default: "" },
  mainPic: { type: String, default: "" },
}, { 
  timestamps: true 
});

export default mongoose.models.Section || mongoose.model('Section', sectionSchema);