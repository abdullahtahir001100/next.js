import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., index.html
  language: { type: String, required: true }, // html, css, or javascript
  value: { type: String, default: '' }
});

const PageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g., 'about'
  files: [FileSchema]
});

export default mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);