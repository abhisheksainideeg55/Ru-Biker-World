import mongoose from 'mongoose';
import Offer from '../models/Offer.js';

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

export const defaultOffers = [
  {
    _id: 'off_001',
    title: 'Monsoon Riding Essentials: Flat 15% OFF',
    slug: 'monsoon-riding-essentials-2026',
    description: 'Protect your motorcycle and stay safe in wet weather. Flat 15% discount on all sintered brake pads, water-repellent chain lubes, and waterproof rider boots.',
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1200',
    type: 'percentage',
    couponCode: 'MONSOON15',
    discountText: 'FLAT 15% OFF',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 25 * 86400000).toISOString(),
    applicableCategories: ['Brakes', 'Chain & Sprockets', 'Riding Gear'],
    applicableBrands: ['Brembo', 'Motul', 'Rolon'],
    isActive: true,
  },
  {
    _id: 'off_002',
    title: 'New Rider Welcome Fest: ₹500 OFF On First Order',
    slug: 'first-order-welcome-bonus',
    description: 'Get an instant ₹500 discount when you spend ₹2,999 or more across any motorcycle spares, performance filters, or exhaust components.',
    bannerImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200',
    type: 'flat',
    couponCode: 'WELCOME500',
    discountText: 'FLAT ₹500 OFF',
    startDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    applicableCategories: ['All Parts', 'Accessories', 'Performance'],
    applicableBrands: ['All Brands'],
    isActive: true,
  },
  {
    _id: 'off_003',
    title: 'Track Weekend Pro Series: 20% OFF Synthetic Lubricants',
    slug: 'track-pro-synthetic-oil-sale',
    description: 'Stock up on Motul 300V Factory Line and 7100 4T 100% Synthetic engine oils with maximum thermal shear protection.',
    bannerImage: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200',
    type: 'percentage',
    couponCode: 'TRACK20',
    discountText: '20% OFF',
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    applicableCategories: ['Lubricants & Fluids', 'Engine Care'],
    applicableBrands: ['Motul', 'Liqui Moly'],
    isActive: true,
  },
];

/**
 * @desc    Get all active promotional offers valid within current date window
 * @route   GET /api/offers
 * @access  Public
 */
export const getActiveOffers = async (req, res, next) => {
  try {
    const now = new Date();

    if (isDbConnected()) {
      const offers = await Offer.find({
        isActive: true,
        startDate: { $lte: now },
        expiryDate: { $gte: now },
      }).sort({ createdAt: -1 });

      return res.status(200).json({ success: true, data: offers });
    } else {
      const active = defaultOffers.filter((o) => {
        const start = new Date(o.startDate);
        const exp = new Date(o.expiryDate);
        return o.isActive && start <= now && exp >= now;
      });

      return res.status(200).json({ success: true, data: active });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single offer by slug
 * @route   GET /api/offers/:slug
 * @access  Public
 */
export const getOfferBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const now = new Date();

    if (isDbConnected()) {
      const offer = await Offer.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
        startDate: { $lte: now },
        expiryDate: { $gte: now },
      });

      if (!offer) {
        return res.status(404).json({ success: false, message: 'Offer expired or not found.' });
      }

      return res.status(200).json({ success: true, data: offer });
    } else {
      const offer = defaultOffers.find((o) => {
        const start = new Date(o.startDate);
        const exp = new Date(o.expiryDate);
        return o.slug === slug.toLowerCase() && o.isActive && start <= now && exp >= now;
      });

      if (!offer) {
        return res.status(404).json({ success: false, message: 'Offer expired or not found.' });
      }

      return res.status(200).json({ success: true, data: offer });
    }
  } catch (error) {
    next(error);
  }
};
