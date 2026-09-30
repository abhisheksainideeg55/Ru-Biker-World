import React from 'react';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import EmptyState from '../../components/common/EmptyState';
import { OfferCard, OfferSkeleton } from '../../components/offer';
import { useOffers } from '../../hooks/useOffers';
import { FiPercent } from 'react-icons/fi';

export const OffersPage = () => {
  const { offers, isLoading, error, refetch } = useOffers();

  return (
    <div className="py-8 space-y-8 bg-slate-50 min-h-screen">
      <Container size="wide">
        <Breadcrumb items={[{ label: 'Exclusive Deals & Offers' }]} />

        <SectionTitle
          title="Exclusive Rider Deals & Seasonal Discounts"
          subtitle="Explore active discount coupons, manufacturer bundle savings, and seasonal promotion campaigns."
          badge="Promotions"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <OfferSkeleton key={i} />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <EmptyState
              icon={FiPercent}
              title="No Active Offers Right Now"
              description="New promotional discounts and seasonal festival campaigns are added regularly. Check back soon or browse our catalog."
              actionLabel="Explore Shop Catalog"
              onAction={() => (window.location.href = '/shop')}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer._id || offer.slug} offer={offer} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default OffersPage;
