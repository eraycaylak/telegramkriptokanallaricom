import fs from 'fs';

const channels = [
  {"id":"7d8da533-9578-4b21-800a-dcbd2d5d8876","telegram_url":"https://t.me/MEXC_ZH"},
  {"id":"995bf331-5a6a-40da-a10e-65687a9fc55b","telegram_url":"https://t.me/binance_announcements"},
  {"id":"0b75342d-b036-4711-bfde-d5ec01863d2a","telegram_url":"https://t.me/coingecko"},
  {"id":"8c8e0351-b801-4b21-98bf-dc7da78501f1","telegram_url":"https://t.me/InvestingTR"},
  {"id":"19fb1277-faa3-49b4-8cd4-2e53aee44631","telegram_url":"https://t.me/birikoinmidedi"},
  {"id":"a0ef0218-9e32-49cc-8ef9-a1b6c080e60a","telegram_url":"https://t.me/Bybit_Turkiye"},
  {"id":"56cae0c7-fc4e-4952-bf00-ee86ad4a1091","telegram_url":"https://t.me/binanceexchange"},
  {"id":"946e8753-cd73-4cf2-b7e7-f0c37a303ca7","telegram_url":"https://t.me/deepwebkripto"},
  {"id":"d2e12996-26b2-45ec-bf54-4e5418c54b02","telegram_url":"https://t.me/bitgetturkiye"},
  {"id":"762a70a9-ac77-4ae6-812f-6ffc25405872","telegram_url":"https://t.me/OKXTR"},
  {"id":"99353944-7e5d-4309-baab-f54adabcb211","telegram_url":"https://t.me/Abdtemettuu"},
  {"id":"72e66729-f369-460a-829b-e74a3462ace8","telegram_url":"https://t.me/CoinMarketCap"},
  {"id":"5cb184dc-1897-4aac-9258-a1503585d462","telegram_url":"https://t.me/Kripto_Zenci"},
  {"id":"d3b10ab2-64c5-4709-aa96-7ab9aff432b7","telegram_url":"https://t.me/kucoinAR"},
  {"id":"178bd68c-c936-49a5-8396-3b96713c6414","telegram_url":"https://t.me/coinmuhendisihaber"},
  {"id":"2f4387b0-2aa5-4cb4-ac11-f94f7905f050","telegram_url":"https://t.me/BingXOfficial"},
  {"id":"0dc57642-ca1b-4287-8bdf-8debe2f449bd","telegram_url":"https://t.me/coinanalizegitimgrup"},
  {"id":"d3cec2a4-9d6b-4548-bc0a-70f617c812f1","telegram_url":"https://t.me/gorkeutrade"},
  {"id":"2ae8be50-8dcd-402b-ac0f-09ea45f51367","telegram_url":"https://t.me/teknikcitelegram"},
  {"id":"ef99f28e-74bc-42d4-870d-9aa06b6f1081","telegram_url":"https://t.me/gateio"},
  {"id":"5dc19518-00ce-4334-8f3a-e168adc3efa5","telegram_url":"https://t.me/realyoyowduyuru"},
  {"id":"4de039e8-2a38-428f-a4ec-efe0bda15667","telegram_url":"https://t.me/sinyalbeyss"},
  {"id":"7d9538e5-e896-45f1-8a82-0c42c6b8c281","telegram_url":"https://t.me/MEXCTurkce"},
  {"id":"b62d75b7-74d3-4757-b71d-75cb4aae30fa","telegram_url":"https://t.me/Binance_Moonbix_Announcements"},
  {"id":"88c31bbb-d136-42e8-b98e-f1ea49b1ab4c","telegram_url":"https://t.me/HuobiTurkiyeDuyuru"},
  {"id":"6492681e-8f8d-4fd3-9121-877a70edc9be","telegram_url":"https://t.me/BinanceTurkish"},
  {"id":"2265c3f8-8971-434d-a5aa-f363da362cb1","telegram_url":"https://t.me/messi_kripto"},
  {"id":"747c9cfb-5ff5-417e-85d0-ba8e953596bd","telegram_url":"https://t.me/yoyodexhaber"},
  {"id":"425b45e7-56fa-4b9e-ae4c-5d4adbc71550","telegram_url":"https://t.me/turkoinimchat"},
  {"id":"0595fab9-96c7-428b-9b79-0bebe6548c1c","telegram_url":"https://t.me/borsahissegrafik"},
  {"id":"ccfa2d41-84dd-48b5-b868-44f9df8a739b","telegram_url":"https://t.me/onitrade"},
  {"id":"040dce50-ac54-484e-a043-2289267c13ba","telegram_url":"https://t.me/cryptowhalesignals2"},
  {"id":"a6c61d59-b151-470c-afbf-c1b3e8e0431b","telegram_url":"https://t.me/cryptomuskn"},
  {"id":"d62988d5-59e9-4dd4-82ab-7f5d27b0e2e5","telegram_url":"https://t.me/coinrapor"},
  {"id":"288cddd7-8a36-4b90-b58a-c195ba5e28c1","telegram_url":"https://t.me/vadelisihirbazlar"},
  {"id":"0080e111-2996-434f-80a1-2f93ed2b75aa","telegram_url":"https://t.me/bitcoin_meraklisi"},
  {"id":"16c3b1d5-fbff-4fe6-8175-0cf83f0afb9d","telegram_url":"https://t.me/kucointurkiye"},
  {"id":"8e5efa6e-bab9-4212-a023-4e00eac30072","telegram_url":"https://t.me/airdropkurdunet"},
  {"id":"c18f14ed-fa4a-4271-9849-ca3da56f322f","telegram_url":"https://t.me/XNXcrypto"},
  {"id":"bde81610-5ce4-47e9-a0ad-2b8faad576ca","telegram_url":"https://t.me/infinitytradenetwork"},
  {"id":"1074f2f2-5b94-46b3-97cc-ba74e4b10d4d","telegram_url":"https://t.me/coinmusty"},
  {"id":"178ce9d8-a427-46b9-8903-a593fa15f88d","telegram_url":"https://t.me/ghosttcryptoo"},
  {"id":"10e77182-b85e-4fe8-b525-b9943ebc857e","telegram_url":"https://t.me/MEXCEnglish"},
  {"id":"0172bb16-2e47-493d-966f-25ef366636b8","telegram_url":"https://t.me/barokuz"}
];

async function main() {
  const results = [];
  for (const channel of channels) {
    try {
      const resp = await fetch(channel.telegram_url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      const html = await resp.text();
      const imageMatch = html.match(/<meta property="og:image" content="(.*?)">/);
      const image = imageMatch ? imageMatch[1] : null;
      results.push({ id: channel.id, image });
      console.log(`Fetched ${channel.telegram_url}: ${image}`);
    } catch (e) {
      console.error(`Error fetching ${channel.telegram_url}`, e);
    }
  }
  
  fs.writeFileSync('fetch_results.json', JSON.stringify(results, null, 2));
}

main();
