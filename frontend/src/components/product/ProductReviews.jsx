import React from 'react';
import { ReviewSection } from '../review/ReviewSection';

export const ProductReviews = ({ product }) => {
  if (!product) return null;
  return <ReviewSection product={product} />;
};

export default ProductReviews;
