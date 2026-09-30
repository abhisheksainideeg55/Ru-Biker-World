import React, { useEffect } from 'react';
import HeroSection from '../../components/home/HeroSection';
import SnapmintBanner from '../../components/home/SnapmintBanner';
import TrendingHelmetPicks from '../../components/home/TrendingHelmetPicks';
import ComboOffers from '../../components/home/ComboOffers';
import AuxiliaryLightsOffers from '../../components/home/AuxiliaryLightsOffers';
import AdventureAwaits from '../../components/home/AdventureAwaits';
import PopularCategories from '../../components/home/PopularCategories';
import FeaturedBrands from '../../components/home/FeaturedBrands';
import ShopByBike from '../../components/home/ShopByBike';
import ShopByCategory from '../../components/home/ShopByCategory';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import BestSellingProducts from '../../components/home/BestSellingProducts';
import PromoBanner from '../../components/home/PromoBanner';
import BrandWeTrust from '../../components/home/BrandWeTrust';
import BuyingGuide from '../../components/home/BuyingGuide';
import CustomerReviews from '../../components/home/CustomerReviews';
import PopularSearches from '../../components/home/PopularSearches';
import NewsletterSection from '../../components/home/NewsletterSection';
import { setPageMeta, generateOrganizationSchema } from '../../utils/seo';

export const HomePage = () => {
  useEffect(() => {
    setPageMeta({
      title: 'Genuine Motorcycle Accessories & Performance Spares India',
      description:
        'RU BIKER world is India’s premier store for 100% authentic motorcycle spare parts, Brembo brake pads, Rolon chain kits, Motul synthetic oils, and safety riding gear.',
      jsonLd: generateOrganizationSchema(),
    });
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Banner Slider */}
      <HeroSection />

      {/* 2. Snapmint Pay in 3 Promo Banner */}
      <SnapmintBanner />

      {/* 3. What Are You Looking For Today? */}
      <PopularCategories />

      {/* 4. Featured Brands Slider */}
      <FeaturedBrands />

      {/* 5. Shop By Category */}
      <ShopByBike />

      {/* 6. Shop By Category */}
      <ShopByCategory />

      {/* 6.1 Featured Catalog Products */}
      <FeaturedProducts />

      {/* 7. Trending Helmet Picks Slider */}
      <TrendingHelmetPicks />

      {/* 8. Combo Offers Slider */}
      <ComboOffers />

      {/* 9. Auxiliary Lights On Offer Slider */}
      <AuxiliaryLightsOffers />

      {/* 10. Adventure Awaits Slider */}
      <AdventureAwaits />

      {/* 11. Brand We Trust */}
      <BrandWeTrust />

      {/* 12. Customer Reviews & Raving Experience */}
      <CustomerReviews />

      {/* 13. Popular Searches & SEO Authority Description */}
      <PopularSearches />
    </div>
  );
};

export default HomePage;
