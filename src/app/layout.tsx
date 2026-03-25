import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.telegramkriptokanallari.com'),
  title: {
    default: 'Telegram Kripto Kanalları | En İyi Kripto Para Kanalları 2026',
    template: '%s | Telegram Kripto Kanalları',
  },
  description: 'Türkiye\'nin en kapsamlı Telegram kripto kanalları dizini. En iyi Bitcoin, Ethereum sinyal kanalları, ücretsiz kripto haberler ve DeFi kanallarını keşfet.',
  keywords: ['telegram kripto kanalları', 'en iyi telegram kripto kanalları', 'telegram sinyal kanalları', 'ücretsiz telegram kripto', 'türk telegram kripto', 'bitcoin sinyal kanalı', 'kripto para telegram'],
  authors: [{ name: 'Telegram Kripto Kanalları' }],
  creator: 'Telegram Kripto Kanalları',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.telegramkriptokanallari.com',
    siteName: 'Telegram Kripto Kanalları',
    title: 'Telegram Kripto Kanalları | En İyi Kripto Para Kanalları 2026',
    description: 'Türkiye\'nin en kapsamlı Telegram kripto kanalları dizini. Bitcoin, Ethereum sinyal kanalları ve daha fazlası.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Telegram Kripto Kanalları' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telegram Kripto Kanalları',
    description: 'En iyi Telegram kripto sinyal kanallarını keşfet.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' } },
  alternates: { 
    canonical: 'https://www.telegramkriptokanallari.com',
    languages: {
      'tr-TR': 'https://www.telegramkriptokanallari.com',
    }
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f8fafc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Telegram Kripto Kanalları',
              url: 'https://www.telegramkriptokanallari.com',
              description: 'Türkiye\'nin en kapsamlı Telegram kripto kanalları dizini',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://www.telegramkriptokanallari.com/kanallar?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Telegram Kripto Kanalları',
                url: 'https://www.telegramkriptokanallari.com',
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
