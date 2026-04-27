/**
 * Skrypt eksploracyjny zakładki Opinia medyczna.
 * Uruchom: npx ts-node --project tsconfig.json e2e/scripts/explore-medical-opinion.ts
 */
import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL!;
const EMAIL = process.env.TEST_USER_EMAIL!;
const PASSWORD = process.env.TEST_USER_PASSWORD!;
const CLAIM_NUMBER = process.argv[2] ?? '1000000384REF';

(async () => {
    const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // Logowanie
    await page.goto(BASE_URL);
    await page.locator('input[type="text"]').first().fill(EMAIL);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.getByRole('button', { name: /zaloguj/i }).click();
    await page.waitForURL(/dashboard/);
    console.log('Zalogowano.');

    // Szkody > Wyszukaj szkodę
    await page.getByRole('button', { name: 'Szkody' }).click();
    await page.getByRole('link', { name: 'Wyszukaj szkodę' }).click();
    await page.waitForURL(/damage-search|search-damage|claims/);
    console.log('Strona wyszukiwania szkód:', page.url());

    // Wpisz numer szkody i szukaj
    const searchInput = page.getByRole('textbox').first();
    await searchInput.fill(CLAIM_NUMBER);
    await page.getByRole('button', { name: /szukaj/i }).click();

    // Kliknij w wynik — pierwszy link z numerem szkody
    await page.getByRole('link', { name: new RegExp(CLAIM_NUMBER) }).first().click();
    await page.waitForURL(/damage-details/);
    console.log('Strona szkody:', page.url());

    // Zakładka Opinia medyczna
    const tabLocator = page.getByRole('tab', { name: /opinia medyczna/i });
    if (await tabLocator.count()) {
        await tabLocator.click();
    } else {
        const moreTab = page.getByRole('button', { name: '>' });
        if (await moreTab.count()) {
            await moreTab.click();
            await page.getByRole('menuitem', { name: /opinia medyczna/i }).click();
        }
    }
    await page.waitForTimeout(1000);
    console.log('URL po kliknięciu zakładki:', page.url());

    // Snapshot struktury sekcji
    const sections = await page.locator('section, [class*="section"], h2, h3').allTextContents();
    console.log('Sekcje na stronie:', sections);

    // Zapis snapshot HTML zakładki
    const html = await page.locator('body').innerHTML();
    const fs = await import('fs');
    fs.writeFileSync('explore-output.html', html);
    console.log('HTML zapisany do explore-output.html');

    // Sprawdź widoczność przycisków
    const buttons = await page.getByRole('button').allTextContents();
    console.log('Przyciski na stronie:', buttons.filter(t => t.trim()));

    await browser.close();
})();
