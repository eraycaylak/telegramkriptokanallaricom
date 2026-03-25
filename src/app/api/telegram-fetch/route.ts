import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

    // parse username
    let username = url.replace('https://t.me/', '').replace('http://t.me/', '').replace('@', '').split('/')[0]
    if (!username) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })

    // fetch public telegram preview
    const res = await fetch(`https://t.me/s/${username}`)
    const html = await res.text()

    if (!html.includes('tgme_page_title')) {
      return NextResponse.json({ error: 'Channel not found or private' }, { status: 404 })
    }

    // extract title
    const titleMatch = html.match(/<div class="tgme_page_title"[^>]*>([\s\S]*?)<\/div>/)
    let title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : ''

    // extract extra (subscribers)
    const extraMatch = html.match(/<div class="tgme_page_extra">([\s\S]*?)<\/div>/)
    let extra = extraMatch ? extraMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    
    // subscribers example: "24.5K subscribers" or "1000 members"
    let members = 0
    if (extra.includes('subscriber') || extra.includes('member')) {
      const numStr = extra.split(' ')[0].replace(/,/g, '')
      if (numStr.includes('K')) {
        members = parseFloat(numStr.replace('K', '')) * 1000
      } else if (numStr.includes('M')) {
        members = parseFloat(numStr.replace('M', '')) * 1000000
      } else {
        members = parseInt(numStr, 10)
      }
    }

    // extract description
    const descMatch = html.match(/<div class="tgme_page_description"[^>]*>([\s\S]*?)<\/div>/)
    let description = descMatch ? descMatch[1].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').trim() : ''

    // extract avatar (tgme_page_photo_image)
    const avatarMatch = html.match(/<img class="tgme_page_photo_image" src="([^"]+)"/)
    let avatar = avatarMatch ? avatarMatch[1] : ''

    return NextResponse.json({
      name: title,
      subscribers: isNaN(members) ? 0 : Math.floor(members),
      description: description,
      avatar: avatar
    })
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch telegram data' }, { status: 500 })
  }
}
