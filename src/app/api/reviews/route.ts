import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { channel_id, user_name, rating, comment } = await request.json()

    if (!channel_id || !user_name || !rating || !comment) {
      return NextResponse.json(
        { error: 'channel_id, user_name, rating ve comment alanları zorunludur.' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Puan 1-5 arasında olmalı.' }, { status: 400 })
    }

    if (user_name.trim().length < 2 || user_name.trim().length > 30) {
      return NextResponse.json({ error: 'İsim 2-30 karakter arası olmalıdır.' }, { status: 400 })
    }

    if (comment.trim().length < 10 || comment.trim().length > 500) {
      return NextResponse.json({ error: 'Yorum 10-500 karakter arası olmalıdır.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('reviews').insert({
      channel_id,
      user_name: user_name.trim(),
      rating: Math.round(rating),
      comment: comment.trim(),
      is_approved: true,
    })

    if (error) {
      console.error('Review insert error:', error)
      return NextResponse.json({ error: 'Yorum kaydedilemedi.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Yorumunuz başarıyla eklendi.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Bir hata oluştu.' }, { status: 500 })
  }
}
