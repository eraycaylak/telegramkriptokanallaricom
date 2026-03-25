import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Blog } from '@/lib/types'
import Link from 'next/link'
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">📝 Kripto Blog</h1>
          <p className="text-slate-500 text-sm">Rehberler, incelemeler ve kripto dünyasından haberler</p>
        </div>
      </div>

      {blogs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="glass-card p-5 group flex flex-col">
              {blog.cover_image && (
                <img src={blog.cover_image} alt={blog.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              {!blog.cover_image && (
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-violet-900/40 to-blue-900/40 flex items-center justify-center mb-4 text-4xl">
                  {blog.tags?.[0] === 'bitcoin' ? '₿' : blog.tags?.[0] === 'defi' ? '⚡' : '📰'}
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-bold text-slate-800 group-hover:text-violet-400 transition-colors text-sm leading-snug mb-2">
                  {blog.title}
                </h2>
                {blog.excerpt && <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{blog.excerpt}</p>}
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-600 border-t border-white/5 pt-3">
                {blog.published_at && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.published_at).toLocaleDateString('tr-TR')}</span>
                )}
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{blog.views}</span>
                <span className="ml-auto flex items-center gap-1 text-violet-400 group-hover:translate-x-1 transition-transform">
                  Oku <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-500 text-sm">Blog yazıları yakında yayınlanacak.</p>
        </div>
      )}
    </div>
  )
}
