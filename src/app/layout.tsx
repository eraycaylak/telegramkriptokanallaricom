import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
  verification: {
    google: 'Kr4w4oEeySH3q8X0a45RYM_8TU-KODKguUNnT38nF4o',
    other: {
      'msvalidate.01': '062E792B73C942650486F38F458EE22A',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="scroll-smooth overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f8fafc" />

        {/* Google Tag Manager - HEAD */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P3WLQ8ZM');`,
          }}
        />

        {/* JSON-LD Structured Data */}
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
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased overflow-x-hidden w-full max-w-[100vw]`}>

        {/* Google Tag Manager - BODY (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P3WLQ8ZM"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <Header />
        <main>{children}</main>
        <Footer />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3SNK924R1Y"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3SNK924R1Y');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w1hjcv6k4t");
          `}
        </Script>

      </body>
    </html>
  )
}
