import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import EmptyState from '../../components/common/EmptyState';
import { FiSearch } from 'react-icons/fi';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="py-6 space-y-6">
      <Container size="wide">
        <Breadcrumb items={[{ label: 'Search' }]} />
        <SectionTitle
          title={query ? `Search results for "${query}"` : 'Search Parts & Accessories'}
          subtitle="Real-time motorcycle spare parts lookup."
          badge="Search"
        />

        <EmptyState
          icon={FiSearch}
          title="Search Architecture Initialized"
          description={query ? `Searched for "${query}". Full search indexing will connect to backend product APIs in Phase 2.` : 'Enter a motorcycle part name or OEM code in the search bar above.'}
          actionLabel="Browse Catalog"
          onAction={() => window.location.href = '/shop'}
        />
      </Container>
    </div>
  );
};

export default SearchPage;
