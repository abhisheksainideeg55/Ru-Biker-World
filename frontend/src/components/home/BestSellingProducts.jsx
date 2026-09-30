import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import HomeSectionHeader from './HomeSectionHeader';
import HomeProductCard from './HomeProductCard';
import { productService } from '../../services/productService';
import { bestSellingProducts as fallbackBestSellers } from '../../data/homeProducts';

export const BestSellingProducts = () => {
  const [products, setProducts] = useState(fallbackBestSellers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadBestSellers = async () => {
      try {
        const data = await productService.getBestSellingProducts(8);
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.warn('Failed to load best selling products:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBestSellers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-surface-50 border-b border-slate-200/80">
      <Container size="wide">
        <HomeSectionHeader
          badge="Top Rated"
          title="Best Sellers"
          subtitle="Rider-favourite products trusted for everyday reliability, track performance, and touring endurance."
          actionLabel="View All Best Sellers"
          actionHref="/shop?sort=best-selling"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <HomeProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BestSellingProducts;
