import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
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
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  itemTotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: false,
      index: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    shippingMethod: {
      type: {
        type: String,
        enum: ['standard', 'express'],
        default: 'standard',
      },
      amount: {
        type: Number,
        default: 0,
      },
      estimatedDays: {
        type: String,
        default: '3–7 business days',
      },
    },
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod'],
      default: 'razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'],
      default: 'Pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Return Requested',
        'Returned',
        'Refunded',
      ],
      default: 'Pending',
      index: true,
    },
    payment: {
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: { type: String, index: true },
      razorpaySignature: { type: String },
    },
    statusHistory: [statusHistorySchema],
    tracking: {
      carrier: { type: String, default: 'Delhivery Express' },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      shippedAt: { type: Date },
      estimatedDelivery: { type: Date },
    },
    cancellation: {
      reason: { type: String },
      description: { type: String },
      cancelledAt: { type: Date },
    },
    refund: {
      status: {
        type: String,
        enum: ['Not Applicable', 'Pending', 'Processing', 'Completed', 'Failed'],
        default: 'Not Applicable',
      },
      amount: { type: Number, default: 0 },
      refundId: { type: String },
      requestedAt: { type: Date },
      processedAt: { type: Date },
      reason: { type: String },
    },
    isStockRestored: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ user: 1, orderStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
