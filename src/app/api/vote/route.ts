import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { channelId } = await request.json()
    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { error } = await supabase.rpc('increment_channel_votes', { p_channel_id: channelId })
    
    if (error) {
      console.error('Vote error:', error)
      return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
