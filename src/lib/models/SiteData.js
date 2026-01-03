import mongoose from 'mongoose';

const SiteDataSchema = new mongoose.Schema({
  pageId: { type: String, default: "collections_main" },
  hero: {
    title: { type: String, default: "Collections" },
    description: { type: String, default: "Crafting legends at Viking Armory Blades." },
    breadcrumb: { type: String, default: "Home > Collections" }
  },
  collections: [{
    title: String,
    count: String,
    desc: String,
    image: String,
    link: { type: String, default: "/shop" }, // Redirect link field
    btnText: { type: String, default: "SHOP NOW" }
  }]
}, { timestamps: true });

export const SiteData = mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);