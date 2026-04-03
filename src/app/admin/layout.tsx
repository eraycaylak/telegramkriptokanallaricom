// Force all admin pages to be dynamic (never SSG)
// This prevents build errors from Supabase client initialization
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
