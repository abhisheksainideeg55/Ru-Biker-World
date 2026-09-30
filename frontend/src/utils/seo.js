/**
 * MotoZone Unified SEO and Structured Data Utility
 */

const SITE_NAME = 'RU BIKER WORLD';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.RU BIKER world.co';
const DEFAULT_DESCRIPTION = 'Find the perfect bike accessories & performance parts online! Shop our wide selection for any bike brand. Upgrade your ride today. Fast shipping & easy returns.';

/**
 * Set Dynamic Page Metadata, OpenGraph tags, Canonical link and JSON-LD schema
 */
export const setPageMeta = ({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200',
  ogType = 'website',
  jsonLd = null,
} = {}) => {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  const formattedTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Genuine Motorcycle Spares & Accessories`;
  document.title = formattedTitle;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;

  // 3. Canonical URL
  const canonicalUrl = canonical || window.location.href.split('?')[0];
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.rel = 'canonical';
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.href = canonicalUrl;

  // 4. OpenGraph Tags
  const updateMetaTag = (property, content) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };

  updateMetaTag('og:site_name', SITE_NAME);
  updateMetaTag('og:title', formattedTitle);
  updateMetaTag('og:description', description);
  updateMetaTag('og:url', canonicalUrl);
  updateMetaTag('og:type', ogType);
  updateMetaTag('og:image', ogImage);

  // 5. JSON-LD Structured Data Schema
  let scriptSchema = document.getElementById('motozone-jsonld-schema');
  if (jsonLd) {
    if (!scriptSchema) {
      scriptSchema = document.createElement('script');
      scriptSchema.id = 'motozone-jsonld-schema';
      scriptSchema.type = 'application/ld+json';
      document.head.appendChild(scriptSchema);
    }
    scriptSchema.text = JSON.stringify(jsonLd);
  } else if (scriptSchema) {
    scriptSchema.remove();
  }
};

/**
 * Generate Product JSON-LD Schema
 */
export const generateProductSchema = (product) => {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image ? [product.image] : [],
    description: product.shortDescription || product.description || product.name,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'MotoZone',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.slug || product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock && product.stockCount > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'MotoZone India',
      },
    },
    ...(product.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 1,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };
};

/**
 * Generate Article JSON-LD Schema
 */
export const generateArticleSchema = (post) => {
  if (!post) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName || 'MotoZone Technical Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MotoZone',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    description: post.excerpt,
  };
};

/**
 * Generate BreadcrumbList JSON-LD Schema
 */
export const generateBreadcrumbSchema = (items = []) => {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${BASE_URL}${item.path}` : BASE_URL,
    })),
  };
};

/**
 * Generate Organization JSON-LD Schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MotoZone',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/motozone',
      'https://www.instagram.com/motozone',
      'https://www.youtube.com/motozone',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1800-MOTOZONE',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  };
};

export default {
  setPageMeta,
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
};
