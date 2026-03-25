export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          channel_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      channels: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          telegram_url: string
          telegram_username: string | null
          category_id: string | null
          language: string
          is_premium: boolean
          is_featured: boolean
          is_approved: boolean
          votes: number
          views: number
          member_count: number | null
          logo_url: string | null
          tags: string[] | null
          website_url: string | null
          submitted_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['channels']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['channels']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          bio: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      votes: {
        Row: { id: string; channel_id: string; user_id: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['votes']['Row'], 'id' | 'created_at'>
        Update: never
      }
      reviews: {
        Row: {
          id: string; channel_id: string; user_id: string; rating: number
          comment: string | null; is_approved: boolean; created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      favorites: {
        Row: { id: string; channel_id: string; user_id: string; created_at: string }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: never
      }
      blogs: {
        Row: {
          id: string; title: string; slug: string; excerpt: string | null
          content: string; cover_image: string | null; author_id: string | null
          is_published: boolean; tags: string[] | null; seo_title: string | null
          seo_description: string | null; views: number; published_at: string | null
          created_at: string; updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>
      }
    }
    Views: {}
    Functions: {
      increment_channel_votes: { Args: { p_channel_id: string; p_user_id: string }; Returns: void }
      decrement_channel_votes: { Args: { p_channel_id: string; p_user_id: string }; Returns: void }
      increment_channel_views: { Args: { p_channel_id: string }; Returns: void }
    }
    Enums: {}
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Channel = Database['public']['Tables']['channels']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Blog = Database['public']['Tables']['blogs']['Row']

export type ChannelWithCategory = Channel & { categories: Category | null }
