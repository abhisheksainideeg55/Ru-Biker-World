import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 10, min: 0 },
    maxPurchaseQuantity: { type: Number, default: 5 },
    isActive: { type: Boolean, default: true },
    image: { type: String, default: '' },
    images: [{ type: String }],
    video: { type: String, default: '' },
    videoThumbnail: { type: String, default: '' },
    videoTitle: { type: String, default: '' },
    imageType: { type: String, default: 'part' },
    bikeBrands: [{ type: String }],
    bikeModels: [{ type: String }],
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    technicalSpecs: { type: String, default: '' },
    shippingCharge: { type: Number, default: 0 },
    weight: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    shippingTier: { type: String, default: 'standard' },
    isFreeShipping: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
    suppressReservedKeysWarning: true,
  }
);

productSchema.index({ name: 'text', brand: 'text', category: 'text', sku: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stockCount: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
