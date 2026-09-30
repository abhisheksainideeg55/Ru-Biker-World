import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    },
    type: {
      type: String,
      enum: ['percentage', 'flat', 'bundle', 'seasonal', 'flash_sale'],
      default: 'percentage',
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    discountText: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
    applicableCategories: [{
      type: String,
      trim: true,
    }],
    applicableBrands: [{
      type: String,
      trim: true,
    }],
    applicableBikes: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

offerSchema.index({ isActive: 1, startDate: 1, expiryDate: 1 });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
