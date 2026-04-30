import { MetadataRoute } from 'next';
import { getGlobalSettings } from '@/lib/getSettings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getGlobalSettings();
  
  const storeName = settings?.storeName || 'Dream Shop';
  const description = settings?.tagline || 'Premium E-commerce platform';
  const faviconUrl = settings?.favicon?.originalUrl || '/dreamecommerce.svg';

  return {
    name: storeName,
    short_name: storeName,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: faviconUrl,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: faviconUrl,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: faviconUrl,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
