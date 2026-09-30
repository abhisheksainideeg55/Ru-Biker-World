import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useProduct } from '../../hooks/useProduct';
import { setPageMeta, generateProductSchema } from '../../utils/seo';
import {
  ProductGallery,
  ProductInfo,
  ProductSizeSelector,
  ProductDeliveryCheck,
  ProductQuantity,
  ProductActions,
  CompatibilityChecker,
  ProductHighlights,
  ProductTabs,
  ProductReviews,
  RelatedProducts,
  StickyMobilePurchaseBar,
  ProductDetailsSkeleton,
  ProductDetailsError,
  ProductNotFound,
} from '../../components/product';

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const {
    product,
    relatedProducts,
    frequentlyBoughtTogether,
    loading,
    error,
    notFound,
    refetch,
  } = useProduct(slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium (57-58 cm)');

  const isHelmetOrGear = Boolean(
    (product?.category && (product.category.toLowerCase().includes('helmet') || product.category.toLowerCase().includes('gear'))) ||
    (product?.subcategory && (product.subcategory.toLowerCase().includes('helmet') || product.subcategory.toLowerCase().includes('gear') || product.subcategory.toLowerCase().includes('glove') || product.subcategory.toLowerCase().includes('jacket'))) ||
    (product?.name && (product.name.toLowerCase().includes('helmet') || product.name.toLowerCase().includes('jacket') || product.name.toLowerCase().includes('gloves'))) ||
    (product?.sizes && product.sizes.length > 0)
  );

  const availableSizes = (product?.sizes && product.sizes.length > 0)
    ? product.sizes
    : isHelmetOrGear
      ? ['Small (55-56 cm)', 'Medium (57-58 cm)', 'Large (59-60 cm)', 'XL (61-62 cm)', 'XXL (63-64 cm)']
      : null;

  // Reset quantity and size and scroll to top on slug change
  useEffect(() => {
    setQuantity(1);
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else if (isHelmetOrGear) {
      setSelectedSize('Medium (57-58 cm)');
    } else {
      setSelectedSize('Medium');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, product, isHelmetOrGear]);

  // Unified SEO & JSON-LD schema update
  useEffect(() => {
    if (product) {
      setPageMeta({
        title: `${product.name} - ${product.brand}`,
        description:
          product.shortDescription ||
          `Buy 100% genuine ${product.name} for ${product.brand} motorcycles online at MotoZone. Best price, verified compatibility, fast dispatch across India.`,
        ogImage: product.image,
        ogType: 'product',
        jsonLd: generateProductSchema(product),
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen py-6">
        <Container>
          <ProductDetailsSkeleton />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen py-6">
        <Container>
          <ProductDetailsError onRetry={refetch} />
        </Container>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-slate-50 min-h-screen py-6">
        <Container>
          <ProductNotFound />
        </Container>
      </div>
    );
  }

  // Breadcrumb structure
  const catSlug = product.category.toLowerCase().replace(/\s+/g, '-');
  const breadcrumbItems = [
    { label: 'Shop', path: '/shop' },
    { label: product.category, path: `/shop?category=${catSlug}` },
  ];

  if (product.subcategory && product.subcategory !== product.category) {
    const subSlug = product.subcategory.toLowerCase().replace(/\s+/g, '-');
    breadcrumbItems.push({
      label: product.subcategory,
      path: `/shop?category=${subSlug}`,
    });
  }

  breadcrumbItems.push({ label: product.name, path: null });

  return (
    <div className="bg-white min-h-screen pb-20">
      <Container className="py-4 sm:py-6">
        {/* Breadcrumbs Navigation */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Product Image Gallery (4-5 Multi-Angle Views) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Product Overview, Size Selector & Purchase Actions */}
          <div className="lg:col-span-6 space-y-4">
            {/* Header & Pricing */}
            <ProductInfo product={product} />

            {/* RU BIKER world Assured, Share & Pincode Delivery Check */}
            <ProductDeliveryCheck product={product} />

            {/* Helmet & Accessory Size Selector */}
            {availableSizes && availableSizes.length > 0 && (
              <ProductSizeSelector
                sizes={availableSizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                isHelmet={isHelmetOrGear}
              />
            )}

            {/* Bike Compatibility Checker */}
            <CompatibilityChecker product={product} />

            {/* Quantity & Add to Cart / Buy Now Actions Area */}
            <div
              id="main-product-actions-area"
              className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4"
            >
              <ProductQuantity
                quantity={quantity}
                maxStock={product.stockCount || 10}
                disabled={!product.stock || product.stockCount === 0}
                onChange={setQuantity}
              />

              <ProductActions
                product={product}
                quantity={quantity}
                selectedSize={selectedSize}
              />
            </div>

            {/* Product Highlights */}
            <ProductHighlights highlights={product.highlights} />
          </div>
        </div>

        {/* Product Information Tabs (Accordion on mobile) */}
        <ProductTabs product={product} />

        {/* Customer Reviews Section */}
        <ProductReviews product={product} />

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </Container>

      {/* Sticky Mobile Purchase Bar on Scroll */}
      <StickyMobilePurchaseBar
        product={product}
        quantity={quantity}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />
    </div>
  );
};

export default ProductDetailsPage;
