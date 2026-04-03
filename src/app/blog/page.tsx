import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Blog } from '@/lib/types'
import Link from 'next/link'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import { BookOpen, Calendar, Eye, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog | Telegram Kripto Rehberleri',
  description: 'Telegram kripto kanalları rehberleri, sinyal kanalı incelemeleri ve kripto para yatırım ipuçları. En kapsamlı kripto blog içerikleri.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('blogs').select('*').eq('is_published', true).order('published_at', { ascending: false })
  const blogs = (data ?? []) as Blog[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreadcrumbNav items={[
        { label: 'Ana Sayfa', href: '/' },
        { label: 'Blog' },
      ]} />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">📝 Kripto Blog</h1>
          <p className="text-[var(--text-muted)] text-sm font-medium">Rehberler, incelemeler ve kripto dünyasından haberler</p>
        </div>
      </div>

      {blogs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="premium-card p-5 group flex flex-col">
              {blog.cover_image ? (
                <img src={blog.cover_image} alt={blog.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              ) : (
                <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-accent)]/10 flex items-center justify-center mb-4 text-4xl border border-[var(--border-default)]">
                  {blog.tags?.[0] === 'bitcoin' ? '₿' : blog.tags?.[0] === 'defi' ? '⚡' : '📰'}
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors text-sm leading-snug mb-2">
                  {blog.title}
                </h2>
                {blog.excerpt && <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">{blog.excerpt}</p>}
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-muted)] border-t border-[var(--border-default)] pt-3 font-medium">
                {blog.published_at && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                <span className="ml-auto flex items-center gap-1 text-[var(--brand-primary)] group-hover:translate-x-1 transition-transform font-semibold">
                  Oku <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="premium-card p-12 text-center">
          <p className="text-[var(--text-muted)] text-sm font-medium">Blog yazıları yakında yayınlanacak.</p>
        </div>
      )}
    </div>
  )
}
