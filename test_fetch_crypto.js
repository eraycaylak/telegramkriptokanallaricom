async function test() {
  const urlParam = 'https://t.me/Crypto_Dayi_iletisim'; // Or the channel URL
  // let's just search Binance_Turkish? No, the description has "Ekmeğini"
  const response = await fetch('https://t.me/cryptodayi', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
  })
  const html = await response.text();
  const descMatch = html.match(/<meta property="og:description" content="(.*?)">/)
  let description = descMatch ? descMatch[1] : '';

  function decodeHTMLEntities(text) {
      return text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                 .replace(/&quot;/g, '"')
                 .replace(/&amp;/g, '&')
                 .replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>')
                 .replace(/&#39;/g, "'");
  }

  console.log("RAW DESC:", description);
  console.log("DECODED DESC:", decodeHTMLEntities(description));

  // The old buggy way:
  const oldWay = Buffer.from(description, 'latin1').toString('utf8');
  console.log("OLD BUGGY LATIN1 WAY:", oldWay);
}
test();
