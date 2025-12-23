import mongoose from 'mongoose';

const SiteContentSchema = new mongoose.Schema({
  // Identifiers: 'hero_slider', 'info_bar', 'categories', 'about_section'
  contentType: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Faster lookups
  }, 
  
  // Mixed type allows for:
  // 1. Arrays: [ {id, src, alt}, ... ] for hero_slider
  // 2. Objects: { col_1: [], col_2: [] } for categories
  data: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }
}, { 
  timestamps: true,
  minimize: false, // Ensures empty objects {} are still saved in DB
  strict: false    // Allows for flexible nested data structures
});

export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);