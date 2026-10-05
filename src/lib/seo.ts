export const SITE_URL = 'https://asadlandholdings.com';
export const SITE_NAME = 'Asad Land Holdings';
export const SITE_TAGLINE = 'Real Estate on Real Rates';
export const DEFAULT_DESCRIPTION = 'Official platform of Asad Land Holdings. Premium real-estate investment, sales, transparent property valuation, and architectural construction in Wah Cantt, Taxila, and Islamabad.';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    slogan: SITE_TAGLINE,
    telephone: '+92-321-8004186',
    email: 'info@asadlandholdings.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop no 3, Hassan Heights, F Block',
      addressLocality: 'Wah Cantt',
      addressRegion: 'Punjab',
      postalCode: '47040',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 33.7946,
      longitude: 72.7661,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://facebook.com/asadlandholdings',
      'https://youtube.com/@asadlandholdings',
      'https://instagram.com/asadlandholdings',
      'https://linkedin.com/company/asadlandholdings',
    ],
  };
}

export function generatePropertySchema(property: {
  title: string;
  description: string;
  demandPrice: number;
  city: string;
  society: string;
  image: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: property.title,
    description: property.description,
    image: property.image,
    url: `${SITE_URL}/properties/${property.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    offers: {
      '@type': 'Offer',
      price: property.demandPrice,
      priceCurrency: 'PKR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-09-01',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
