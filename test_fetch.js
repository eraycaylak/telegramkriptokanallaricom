const url = 'https://t.me/Binance_Turkish'
fetch(url).then(r => r.text()).then(html => {
  const descMatch = html.match(/<meta property="og:description" content="(.*?)">/)
  if (descMatch) {
    console.log("DESC:", descMatch[1])
  } else {
    console.log("No description found")
  }
})
