import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Blog } from '@/lib/types'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blogs').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!data) return { title: 'Blog Yazısı Bulunamadı' }
  const blog = data as Blog
  return {
    title: blog.seo_title ?? blog.title,
    description: blog.seo_description ?? blog.excerpt ?? '',
    openGraph: { title: blog.title, description: blog.excerpt ?? '', type: 'article', publishedTime: blog.published_at ?? undefined },
    alternates: { canonical: `/blog/${blog.slug}` },
  }
}

export default async function BlogDetayPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('blogs').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!data) notFound()
  const blog = data as Blog

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.published_at,
    dateModified: blog.updated_at,
    author: { '@type': 'Person', name: 'TelegramKriptoKanallari.com', url: 'https://www.telegramkriptokanallari.com' },
    publisher: { '@type': 'Organization', name: 'Telegram Kripto Kanalları', url: 'https://www.telegramkriptokanallari.com' },
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

      <nav className="flex items-center gap-2 text-xs text-slate-600 mb-6">
        <Link href="/" className="hover:text-slate-400">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-slate-400">Blog</Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px]">{blog.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            {blog.published_at && (
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(blog.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            )}
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{blog.views} görüntülenme</span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {blog.tags.map((tag: string) => (
                <span key={tag} className="badge badge-category text-xs flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>
              ))}
            </div>
          )}
        </header>

        {blog.cover_image && (
          <img src={blog.cover_image} alt={blog.title} className="w-full rounded-xl mb-8 object-cover max-h-80" />
        )}

        <div
          className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed [&>h2]:text-slate-200 [&>h2]:font-bold [&>h3]:text-slate-300 [&>h3]:font-semibold [&>strong]:text-slate-300 [&>p]:mb-4 [&>ul]:pl-4 [&>ul>li]:text-slate-400 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:mt-4 [&>h3]:mb-2"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />
      </article>

      <div className="border-t border-white/5 mt-10 pt-6">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Blog&apos;a dön
        </Link>
      </div>
    </div>
  )
}
