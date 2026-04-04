export const dynamic = 'force-dynamic'
export const revalidate = 0

import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.telegramkriptokanallari.com'),
  title: {
    default: 'Telegram Kripto Kanalları | En İyi Kripto Para Kanalları 2026',
    template: '%s | Telegram Kripto Kanalları',
  },
  description: 'Türkiye\'nin en kapsamlı Telegram kripto kanalları dizini. En iyi Bitcoin, Ethereum sinyal kanalları, ücretsiz kripto haberler ve DeFi kanallarını keşfet.',
  keywords: ['telegram kripto kanalları', 'kripto telegram grupları', 'telegram kripto sohbet', 'en iyi telegram kripto kanalları', 'telegram sinyal kanalları', 'ücretsiz telegram kripto', 'türk telegram kripto', 'bitcoin sinyal kanalı', 'kripto para telegram', 'telegram kripto sinyalleri', 'kripto kanal önerileri', 'kripto telegram', 'telegram bitcoin grupları', 'bitcoin telegram kanalı'],
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
    <html lang="tr" className={`scroll-smooth overflow-x-hidden ${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0B1120" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F0F4F8" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${inter.className} bg-[var(--bg-body)] text-[var(--text-primary)] antialiased overflow-x-hidden w-full max-w-[100vw]`}>

        {/* Dark mode apply instantly to prevent flash */}
        <Script id="dark-mode-init" strategy="beforeInteractive">
          {`(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&d))document.documentElement.classList.add('dark');}catch(e){}})();`}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P3WLQ8ZM');`}
        </Script>

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
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BottomNav />

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

        {/* Google AdSense (inactive — update client ID when ready) */}
        {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous" strategy="afterInteractive" /> */}

      </body>
    </html>
  )
}
