import { MetadataRoute } from 'next';
import { PROPERTIES_DATA, SOCIETIES_DATA } from '@/lib/website-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://asadlandholdings.com';

  const staticRoutes = [
    '',
    '/properties',
    '/societies',
    '/investment',
    '/calculators',
    '/videos',
    '/insights',
    '/about',
    '/contact',
    '/find-property',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const propertyRoutes = PROPERTIES_DATA.map((p) => ({
    url: `${baseUrl}/properties/${p.slug}`,
    lastModified: new Date(p.createdDate),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const societyRoutes = SOCIETIES_DATA.map((s) => ({
    url: `${baseUrl}/societies/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes, ...societyRoutes];
}
