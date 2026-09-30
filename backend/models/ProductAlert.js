import mongoose from 'mongoose';

const productAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productId: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      enum: ['PRICE_DROP', 'BACK_IN_STOCK'],
      required: true,
    },
    targetPrice: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productAlertSchema.index({ user: 1, product: 1, type: 1 }, { unique: true });
productAlertSchema.index({ product: 1, type: 1, isActive: 1 });

const ProductAlert = mongoose.model('ProductAlert', productAlertSchema);

export default ProductAlert;
