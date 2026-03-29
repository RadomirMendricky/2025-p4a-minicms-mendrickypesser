import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // POZNÁMKA: Vercel při buildu nemusí mít přístup k DB. 
  // Pokud pád přetrvává, vrátíme jen základní URL.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://olympcms.vercel.app';
  
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/olympiady`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  try {
    if (!process.env.DATABASE_URL) {
       return staticRoutes;
    }

    const publishedOlympiads = await prisma.olympiad.findMany({
      where: { publishStatus: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }).catch(() => []); // Pokud selže dotaz, vrátíme prázdné pole

    const olympiadRoutes = publishedOlympiads.map((ol: any) => ({
      url: `${baseUrl}/olympiady/${ol.slug}`,
      lastModified: ol.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...olympiadRoutes];
  } catch (error) {
    console.error('Sitemap fallback triggered:', error);
    return staticRoutes;
  }
}
