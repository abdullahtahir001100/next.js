import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customer: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    firstName: String,
    lastName: String,
  },
  shippingAddress: {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  financials: {
    subtotal: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    currency: { type: String, default: 'usd' }
  },
  payment: {
    method: { type: String, enum: ['stripe', 'cod'], required: true },
    status: { type: String, default: 'pending' }, // pending, paid, failed
    intentId: String,
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);