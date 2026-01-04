import mongoose from 'mongoose';

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.models.Promo || mongoose.model('Promo', PromoSchema);