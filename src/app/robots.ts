import { MetadataRoute } from 'next';

// robots.txt — generated at build/request time. The base URL comes from
// NEXT_PUBLIC_CLIENT_URL so prod, staging, and preview each advertise the
// correct sitemap.
const BASE_URL =
    process.env['NEXT_PUBLIC_CLIENT_URL']?.replace(/\/$/, '') ||
    'https://ginag-frontend.vercel.app';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/login',
                    '/register',
                    '/order-success',
                    '/cart',
                    '/checkout',
                    '/wishlist',
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
