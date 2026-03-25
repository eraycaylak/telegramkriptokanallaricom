import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/giris', '/kayit'],
      },
    ],
    sitemap: 'https://www.telegramkriptokanallari.com/sitemap.xml',
    host: 'https://www.telegramkriptokanallari.com',
  }
}
