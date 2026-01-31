import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to the translator application with longer timeout for network issues
  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  // Wait for input field to be ready
  await page.getByPlaceholder('Input Your Singlish Text Here.').waitFor({ state: 'visible', timeout: 15000 });
  // Add a small delay for any lazy-loaded scripts
  await page.waitForTimeout(1000);
});

// Helper function to wait for translation to complete
async function fillAndWaitForTranslation(page: any, input: string) {
  const inputField = page.getByPlaceholder('Input Your Singlish Text Here.');
  const outputDiv = page.locator('div.bg-slate-50').first();
  
  // Clear any previous content
  await inputField.clear();
  
  // Fill the input
  await inputField.fill(input);
  
  // Wait a bit for the translation to start processing
  await page.waitForTimeout(800);
  
  // Wait for output to have visible content - use a more robust check
  let attempts = 0;
  const maxAttempts = 60; // ~30 seconds with 500ms intervals
  
  while (attempts < maxAttempts) {
    try {
      const text = await outputDiv.textContent({ timeout: 2000 });
      if (text && text.trim().length > 0) {
        // Double-check the content is stable (wait a moment for final updates)
        await page.waitForTimeout(500);
        return outputDiv;
      }
    } catch (e) {
      // Continue polling on errors
    }
    await page.waitForTimeout(500);
    attempts++;
  }
  
  // Fallback to original expect if polling times out
  await expect(outputDiv).not.toHaveText('', { timeout: 10000 });
  return outputDiv;
}

// ==========================================
// 1. POSITIVE FUNCTIONAL SCENARIOS (Daily Conversation)
// ==========================================

test('Pos_Fun_0001: Interrogative - Health check', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'Oyaa saniipen innavaadha?');
  await expect(outputDiv).toHaveText('ඔයා සනීපෙන් ඉන්නවාද?');
});

test('Pos_Fun_0002: Compound Sentence - School and Coming', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'Mama school yanavaa , oyaa adha enavadha?');
  await expect(outputDiv).toHaveText('මම school යනවා , ඔයා අද එනවද?');
});

test('Pos_Fun_0003: Conditional - If he comes', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'Eyaa avoth, mama enne naehae.');
  await expect(outputDiv).toHaveText('එයා අවොත්, මම එන්නෙ නැහැ.');
});

test('Pos_Fun_0004: Conditional - Rain', async ({ page }) => {
  // Fixed: 'vaessa' (Rain) instead of 'vaessee' (In the rain)
  const outputDiv = await fillAndWaitForTranslation(page, 'vaessa naethi unoth api enavaa.');
  await expect(outputDiv).toHaveText('වැස්ස නැති උනොත් අපි එනවා.');
});
test('Pos_Fun_0005: Greeting - Birthday', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'SuBha upandhinayak veevaa…!');
  await expect(outputDiv).toHaveText('සුභ උපන්දිනයක් වේවා…!');
});

test('Pos_Fun_0006: Request - Invitation', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'Eyaata aaraDhanaa karanna puluvandha?');
  await expect(outputDiv).toHaveText('එයාට ආරධනා කරන්න පුලුවන්ද?');
});

test('Pos_Fun_0007: Imperative - Go outside', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'karuNaakaralaa eliyata yanna.');
  await expect(outputDiv).toHaveText('කරුණාකරලා එලියට යන්න.');
});

test('Pos_Fun_0008: Confirmation - I will take it', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'hari, mama eka gannam.');
  await expect(outputDiv).toHaveText('හරි, මම එක ගන්නම්.');
});

test('Pos_Fun_0009: Apology - Unable to tell', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'samaavenna, mata eeka kiyanna baeri unaa.');
  await expect(outputDiv).toHaveText('සමාවෙන්න, මට ඒක කියන්න බැරි උනා.');
});

test('Pos_Fun_0010: Slang/Command - Get out', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'eeyii , eliyata palayan.');
  await expect(outputDiv).toHaveText('ඒයී , එලියට පලයන්.');
});

test('Pos_Fun_0011: Feeling - Hungry', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mata badagini.');
  await expect(outputDiv).toHaveText('මට බඩගිනි.');
});

test('Pos_Fun_0012: Command - Drink water', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'vathura bonna.');
  await expect(outputDiv).toHaveText('වතුර බොන්න.');
});

test('Pos_Fun_0013: Simple - Eating rice', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'api bath kanavaa.');
  await expect(outputDiv).toHaveText('අපි බත් කනවා.');
});

// ==========================================
// 2. POSITIVE FUNCTIONAL SCENARIOS (Robustness & Grammar)
// ==========================================

test('Pos_Fun_0014: Robustness - No Spaces', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'apibathkanavaa');
  await expect(outputDiv).toHaveText('අපිබත්කනවා');
});

test('Pos_Fun_0015: Repetition - Little by little', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'bath tika tika kanna.');
  await expect(outputDiv).toHaveText('බත් ටික ටික කන්න.');
});

test('Pos_Fun_0016: Past Tense - Temple', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'api iiyee pansal giyaa.');
  await expect(outputDiv).toHaveText('අපි ඊයේ පන්සල් ගියා.');
});

test('Pos_Fun_0017: Present Tense - School', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'api dhaen school yanavaa.');
  await expect(outputDiv).toHaveText('අපි දැන් school යනවා.');
});

test('Pos_Fun_0018: Future Tense - Campus', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'api heta udhee campus enavaa.');
  await expect(outputDiv).toHaveText('අපි හෙට උදේ campus එනවා.');
});

test('Pos_Fun_0019: Negation - Cannot eat', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mata bath kanna baehae.');
  await expect(outputDiv).toHaveText('මට බත් කන්න බැහැ.');
});

test('Pos_Fun_0020: Intent - About to eat', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mama bath kanna hadhanne.');
  await expect(outputDiv).toHaveText('මම බත් කන්න හදන්නෙ.');
});

test('Pos_Fun_0021: Suggestion - Church', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'api palliyata yamudha?');
  await expect(outputDiv).toHaveText('අපි පල්ලියට යමුද?');
});

test('Pos_Fun_0022: Polite Request - Clean Room', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'karuNaakara kaamaraya pirisidhuva thiyaagannavadha?');
  await expect(outputDiv).toHaveText('කරුණාකර  කාමරය පිරිසිදුව තියාගන්නවද?');
});

// ==========================================
// 3. POSITIVE FUNCTIONAL SCENARIOS (Data & Numeric)
// ==========================================

test('Pos_Fun_0023: Technology - WhatsApp', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mata WHATSAPP paNividayak yomu karanna.');
  await expect(outputDiv).toHaveText('මට WHATSAPP පණිවිඩයක් යොමු කරන්න.');
});

test('Pos_Fun_0024: Location - Colombo', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mama colombo vaedata yanna hadhanne.');
  await expect(outputDiv).toHaveText('මම colombo වැඩට යන්න හදන්නෙ.');
});

test('Pos_Fun_0025: Abbreviation - NIC', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'oyaage NIC aQQkaya evanna puluvandha?');
  await expect(outputDiv).toHaveText('ඔයාගෙ NIC අංකය එවන්න පුලුවන්ද?');
});

test('Pos_Fun_0026: Greeting - Thank You', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'bohoma sthuthii…!');
  await expect(outputDiv).toHaveText('බොහොම ස්තුතී…!');
});

test('Pos_Fun_0027: Currency - Rs Transfer', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mata Rs. 500k transfer karanna puluvandha?');
  await expect(outputDiv).toHaveText('මට Rs. 500ක් transfer කරන්න පුලුවන්ද?');
});



test('Pos_Fun_0028: Date - December 13', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'Mage upandhinee December 13.');
  await expect(outputDiv).toHaveText('Mage උපන්දිනේ December 13.');
});

test('Pos_Fun_0029: Measurement - Weight', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'eyaagee bara 55kg .');
  await expect(outputDiv).toHaveText('එයාගේ බර 55kg .');
});


// ==========================================
// 4. POSITIVE FUNCTIONAL SCENARIOS (Complex & Paragraphs)
// ==========================================

test('Pos_Fun_0030: Complex - Movie Plan', async ({ page }) => {
  const input = 'Mama heta film ekak balanna yanavaa . Oyath enavadha maath ekka yanna';
  const expected = 'මම හෙට film එකක් බලන්න යනවා . ඔයත් එනවද මාත් එක්ක යන්න';
  const outputDiv = await fillAndWaitForTranslation(page, input);
  await expect(outputDiv).toHaveText(expected);
});

test('Pos_Fun_0031: Slang - Appatasirii (Surprise)', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'appatasirii gedharata kathaa karanna baeri unaa');
  await expect(outputDiv).toHaveText('අප්පටසිරී ගෙදරට කතා කරන්න බැරි උනා');
});

test('Pos_Fun_0032: Mixed Data - ID and Time', async ({ page }) => {
  const input = 'Heta udhee 10a.m. pera   Oyaagee ID  aQQkaya mata SMS  karanna';
  const expected = 'හෙට උදේ 10a.m. පෙර ඔයාගේ ID අංකය මට SMS කරන්න';
  const outputDiv = await fillAndWaitForTranslation(page, input);
  await expect(outputDiv).toHaveText(expected);
});

test('Pos_Fun_0033: Long Paragraph - Zoom Meeting', async ({ page }) => {
  const input = 'machan adha havasa zoom meeting ekata kalin mata rs.5000 k dhaanna . iita passe mama oyaata WHATSAPP eken meeting link eka dhaannam. havasa 6 p.m. ta meeting ekata join venna';
  const expected = 'මචන් අද හවස zoom meeting එකට කලින් මට rs.5000 ක් දාන්න . ඊට පස්සෙ මම ඔයාට WHATSAPP එකෙන් meeting link එක දාන්නම්. හවස 6 p.m. ට meeting එකට join වෙන්න';
  const outputDiv = await fillAndWaitForTranslation(page, input);
  await expect(outputDiv).toHaveText(expected);
});
test('Pos_Fun_0034: Long Text - Cyclone Ditwah Report', async ({ page }) => {
  const input = `looka baeQQkuva visin prakaashayata pathkarana ladha "Cyclone DITWA 2025: SRI LANAKA" vaarthaavata anuva dhitvaa suLikuNaatuvee sRUju aarThika pirivaeya ae.dolar biliyana 4.1k pamaNa vee.`;
  const expectedStart = `ලෝක බැංකුව විසින් ප්‍රකාශයට පත්කරන ලද "Cyclone DITWA 2025:  SRI LANAKA" වාර්තාවට අනුව දිට්වා සුළිකුණාටුවේ සෘජු ආර්ථික පිරිවැය ඇ.ඩොලර් බිලියන 4.1ක් පමණ වේ.`;
  await page.getByPlaceholder('Input Your Singlish Text Here.').fill(input);

  // Wait for translation to complete (output div to have content)
  const outputDiv = page.locator('div.bg-slate-50').first();
  await expect(outputDiv).not.toHaveText('', { timeout: 20000 });

  // Then verify the content
  await expect(outputDiv).toContainText(expectedStart, { timeout: 20000 });
});

// ==========================================
// 5. POSITIVE UI SCENARIOS
// ==========================================


test('Pos_UI_0001: Activity - Dancing at home', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mama gedhara enavaa.');
  await expect(outputDiv).toHaveText('මම ගෙදර එනවා.');
});


// ==========================================
// 6. NEGATIVE FUNCTIONAL SCENARIOS (Handling Typos/Dialects)
// ==========================================
test('Neg_Fun_0001: Privacy/Robustness - Email Handling', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'magee Email eka Kasun@gmail.com');
  // Email usernames should be preserved in English
  await expect(outputDiv).toHaveText('මගේ Email එක Kasun@gmail.com');
});

test('Neg_Fun_0002: Privacy/Robustness - Password Special Chars', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'ohugee Facebook Password eka Jony@123');
  // Passwords should be preserved in English
  await expect(outputDiv).toHaveText('ඔහුගේ Facebook Password එක Jony@123');
});

test('Neg_Fun_0003: Robustness - Capital B (Mb) Handling', async ({ page }) => {
  const outputDiv = await fillAndWaitForTranslation(page, 'mama kuBAurata yanavaa');
  // Should handle capital B correctly (expected: කුබවුරට)
  await expect(outputDiv).toHaveText('මම කුබවුරට යනවා');
});

test('Neg_Fun_0004: Mixed Language - Country Name Preservation', async ({ page }) => {
  // Country names should be preserved in English
  const outputDiv = await fillAndWaitForTranslation(page, 'magee rata Sri lankava vee');
  await expect(outputDiv).toHaveText('මගේ රට Sri lankava වේ');
});

test('Neg_Fun_0005: Mixed Language - Common Usage (Meet)', async ({ page }) => {
  // Common English words should be preserved
  const outputDiv = await fillAndWaitForTranslation(page, 'api heta udhee meet vemu');
  await expect(outputDiv).toHaveText('අපි හෙට උදේ meet වෙමු');
});

test('Neg_Fun_0006: Security - SQL Code Preservation', async ({ page }) => {
  // SQL code should be preserved entirely
  const outputDiv = await fillAndWaitForTranslation(page, 'SELECT * FROM users WHERE id=1');
  await expect(outputDiv).toHaveText('SELECT * FROM users WHERE id=1');
});

test('Neg_Fun_0007: Robustness - Fahrenheit Symbol', async ({ page }) => {
  // Temperature units should be preserved
  const outputDiv = await fillAndWaitForTranslation(page, 'Room temp eka 100°F');
  await expect(outputDiv).toHaveText('Room temp එක 100°F');
});

test('Neg_Fun_0008: Mixed - Utility (Gas)', async ({ page }) => {
  // Common utility nouns should be preserved
  const outputDiv = await fillAndWaitForTranslation(page, 'Api adha gas ganna yanavaa.');
  await expect(outputDiv).toHaveText('අපි අද gas ගන්න යනවා.');
});

test('Neg_Fun_0009: Logic - Code Syntax Preservation', async ({ page }) => {
  // Code syntax should be preserved entirely
  const outputDiv = await fillAndWaitForTranslation(page, 'if ( A == B && C != D )');
  await expect(outputDiv).toHaveText('if ( A == B && C != D )');
});

test('Neg_Fun_0010: Technical - URL Preservation', async ({ page }) => {
  // URLs should be preserved entirely
  const outputDiv = await fillAndWaitForTranslation(page, 'site.com/search?q=sinhala&lang=en');
  await expect(outputDiv).toHaveText('site.com/search?q=sinhala&lang=en');
});