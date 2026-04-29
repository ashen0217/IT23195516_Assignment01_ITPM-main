const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });
  const inputField = page.getByPlaceholder('Input Your Singlish Text Here.');
  const outputDiv = page.locator('div.bg-slate-50').first();

  const inputs = [
    'Oyaa saniipen innavaadha?',
    'Mama school yanavaa , oyaa adha enavadha?',
    'Eyaa avoth, mama enne naehae.',
    'vaessa naethi unoth api enavaa.',
    'SuBha upandhinayak veevaa…!',
    'Eyaata aaraDhanaa karanna puluvandha?',
    'karuNaakaralaa eliyata yanna.',
    'hari, mama eka gannam.',
    'samaavenna, mata eeka kiyanna baeri unaa.',
    'eeyii , eliyata palayan.',
    'mata badagini.',
    'vathura bonna.',
    'api bath kanavaa.',
    'apibathkanavaa',
    'bath tika tika kanna.',
    'api iiyee pansal giyaa.',
    'api dhaen school yanavaa.',
    'api heta udhee campus enavaa.',
    'mata bath kanna baehae.',
    'api heta udhee kaema gannavaa',
    'api palli yamu.',
    'karunaakarala kaamaree suddha karanna.',
    'WhatsApp eken kathaa karanna baehae.',
    'api adha colombo yanavaa.',
    'oyaagee NIC no. eka kiyanna.',
    'sthuuthi !',
    'mata Rs.2500/= k oone.',
    'Mage upandhinee December 13.',
    'eyaagee bara 55kg .',
    'Mama heta film ekak balanna yanavaa . Oyath enavadha maath ekka yanna',
    'appatasirii gedharata kathaa karanna baeri unaa',
    'Heta udhee 10a.m. pera   Oyaagee ID  aQQkaya mata SMS  karanna',
    'machan adha havasa zoom meeting ekata kalin mata rs.5000 k dhaanna . iita passe mama oyaata WHATSAPP eken meeting link eka dhaannam. havasa 6 p.m. ta meeting ekata join venna',
    'looka baeQQkuva visin prakaashayata pathkarana ladha "Cyclone DITWA 2025: SRI LANAKA" vaarthaavata anuva dhitvaa suLikuNaatuvee sRUju aarThika pirivaeya ae.dolar biliyana 4.1k pamaNa vee.',
    'mama gedhara enavaa.'
  ];

  const results = {};
  for (const input of inputs) {
    await inputField.clear();
    await inputField.fill(input);
    let ok = false;
    for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(200);
        let text = await outputDiv.textContent();
        if (text && text.trim().length > 0 && text !== results[inputs[inputs.length-1]]) {
            ok = true;
        }
    }
    let text = await outputDiv.textContent();
    results[input] = text;
  }

  fs.writeFileSync('actual_translations.json', JSON.stringify(results, null, 2));
  await browser.close();
}
run();