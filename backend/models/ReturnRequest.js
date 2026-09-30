import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema({
  orderItemId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  SKU: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  reason: {
    type: String,
    required: true,
  },
});

const returnRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [returnItemSchema],
    reason: {
      type: String,
      required: true,
      enum: [
        'Damaged in Transit',
        'Wrong Product Delivered',
        'Missing Parts or Hardware',
        'Product Not as Expected',
        'Defective or Malfunctioning',
        'Incompatible with Bike Model',
        'Other',
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: [
        'Requested',
        'Under Review',
        'Approved',
        'Rejected',
        'Pickup Scheduled',
        'Received',
        'Refund Processing',
        'Refunded',
        'Cancelled',
      ],
      default: 'Requested',
      index: true,
    },
    refundMethod: {
      type: String,
      enum: ['original_source', 'bank_transfer', 'store_credit', 'upi'],
      default: 'bank_transfer',
    },
    bankDetails: {
      accountHolderName: { type: String, trim: true, default: '' },
      accountNumber: { type: String, trim: true, default: '' },
      ifscCode: { type: String, trim: true, default: '' },
      bankName: { type: String, trim: true, default: '' },
      upiId: { type: String, trim: true, default: '' },
      refundPreference: { type: String, enum: ['bank_account', 'upi', 'original_source'], default: 'bank_account' },
    },
    refundAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    adminNote: {
      type: String,
      default: '',
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

returnRequestSchema.index({ user: 1, createdAt: -1 });
returnRequestSchema.index({ order: 1, createdAt: -1 });

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

export default ReturnRequest;
