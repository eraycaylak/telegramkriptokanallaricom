import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://www.telegramkriptokanallari.com'

  const [channelsRes, categoriesRes, blogsRes] = await Promise.all([
    supabase.from('channels').select('slug, updated_at').eq('is_approved', true),
    supabase.from('categories').select('slug, created_at'),
    supabase.from('blogs').select('slug, updated_at').eq('is_published', true),
  ])

  // Fixed date for static pages — update this when you make major content changes
  const SITE_LAST_UPDATED = new Date('2026-04-01')

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/kanallar`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/en-iyi-kanallar`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/trending`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/yeni-kanallar`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/trending-telegram-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/yeni-telegram-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/en-cok-kazanilan-kanallar`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/turk-telegram-kripto-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ucretsiz-telegram-kripto-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/premium-telegram-kripto-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/binance-telegram-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/bitcoin-telegram-kanallari`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/kanal-ekle`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/kategoriler`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.7 },
  ]


  const channelPages: MetadataRoute.Sitemap = (channelsRes.data ?? []).map((ch) => ({
    url: `${baseUrl}/kanal/${ch.slug}`,
    lastModified: new Date(ch.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = (categoriesRes.data ?? []).map((cat) => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: new Date(cat.created_at),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = (blogsRes.data ?? []).map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticPages, ...channelPages, ...categoryPages, ...blogPages]
}
