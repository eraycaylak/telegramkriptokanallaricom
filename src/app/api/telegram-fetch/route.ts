import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const urlParam = searchParams.get('url')

  if (!urlParam) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(urlParam, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: response.status })
    }

    const html = await response.text()

    // Basit RegEx matcher'lar ile veriyi HTML'den ayıklamak (Cheerio bağımlılığı olmadan)
    const titleMatch = html.match(/<meta property="og:title" content="(.*?)">/)
    const descMatch = html.match(/<meta property="og:description" content="(.*?)">/)
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)">/)
    const extraMatch = html.match(/<div class="tgme_page_extra">(.*?)<\/div>/)

    const title = titleMatch ? titleMatch[1] : ''
    const description = descMatch ? descMatch[1] : ''
    const image = imageMatch ? imageMatch[1] : ''
    let memberCount = 0

    if (extraMatch) {
      const extraText = extraMatch[1].toLowerCase()
      // Örn: "1,520 subscribers", "1 520 members" -> Rakamları alalım
      if (extraText.includes('subscriber') || extraText.includes('member') || extraText.includes('abone') || extraText.includes('üye')) {
         const numericOnly = extraText.replace(/\D/g, '')
         if (numericOnly) {
           memberCount = parseInt(numericOnly, 10)
         }
      }
    }

    return NextResponse.json({
      title: title ? Buffer.from(title, 'latin1').toString('utf8') : '', // Bazı karakter kodlama tiplerini düzelt
      description: description ? Buffer.from(description, 'latin1').toString('utf8') : '',
      image,
      memberCount
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
