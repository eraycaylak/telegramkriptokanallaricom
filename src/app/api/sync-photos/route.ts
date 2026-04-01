import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'sync-photos-secret-key'

export async function POST(request: Request) {
  try {
    // Simple admin auth check
    const { secret } = await request.json()
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Fetch all channels
    const { data: channels, error: fetchError } = await supabase
      .from('channels')
      .select('id, name, slug, telegram_url, logo_url')
      .eq('is_approved', true)

    if (fetchError || !channels) {
      return NextResponse.json({ error: 'Failed to fetch channels' }, { status: 500 })
    }

    const results: { id: string; name: string; status: string; newUrl?: string }[] = []
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    for (const channel of channels) {
      try {
        // Skip if already has a Supabase Storage URL
        if (channel.logo_url?.includes('supabase.co/storage')) {
          results.push({ id: channel.id, name: channel.name, status: 'skipped (already in storage)' })
          continue
        }

        // Fetch Telegram page to get og:image
        let imageUrl = channel.logo_url
        
        if (!imageUrl || imageUrl.includes('telesco.pe')) {
          const resp = await fetch(channel.telegram_url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
            }
          })
          const html = await resp.text()
          const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/)
          if (imageMatch && imageMatch[1]) {
            imageUrl = imageMatch[1]
          }
        }

        if (!imageUrl) {
          results.push({ id: channel.id, name: channel.name, status: 'no image found' })
          continue
        }

        // Download the image
        const imgResp = await fetch(imageUrl)
        if (!imgResp.ok) {
          results.push({ id: channel.id, name: channel.name, status: 'image download failed' })
          continue
        }

        const contentType = imgResp.headers.get('content-type') || 'image/jpeg'
        const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
        const arrayBuffer = await imgResp.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // Upload to Supabase Storage
        const filePath = `${channel.slug}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('channel-logos')
          .upload(filePath, buffer, {
            contentType,
            upsert: true,
          })

        if (uploadError) {
          results.push({ id: channel.id, name: channel.name, status: `upload error: ${uploadError.message}` })
          continue
        }

        // Build public URL
        const newUrl = `${supabaseUrl}/storage/v1/object/public/channel-logos/${filePath}`

        // Update channel logo_url
        const { error: updateError } = await supabase
          .from('channels')
          .update({ logo_url: newUrl })
          .eq('id', channel.id)

        if (updateError) {
          results.push({ id: channel.id, name: channel.name, status: `db update error: ${updateError.message}` })
          continue
        }

        results.push({ id: channel.id, name: channel.name, status: 'success', newUrl })
      } catch (err: any) {
        results.push({ id: channel.id, name: channel.name, status: `error: ${err.message}` })
      }
    }

    const successCount = results.filter(r => r.status === 'success').length
    const skippedCount = results.filter(r => r.status.startsWith('skipped')).length

    return NextResponse.json({
      message: `${successCount} fotoğraf yüklendi, ${skippedCount} zaten yüklü.`,
      total: channels.length,
      successCount,
      skippedCount,
      results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
