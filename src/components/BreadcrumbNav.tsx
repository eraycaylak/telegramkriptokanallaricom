import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  schemaBaseUrl?: string
}

export default function BreadcrumbNav({ items, schemaBaseUrl = 'https://www.telegramkriptokanallari.com' }: BreadcrumbNavProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${schemaBaseUrl}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-medium mb-6 overflow-x-auto scrollbar-hide">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1 whitespace-nowrap">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--text-secondary)] font-semibold">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
