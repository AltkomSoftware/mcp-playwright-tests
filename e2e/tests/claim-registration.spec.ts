import { test, expect } from '@playwright/test';

test.describe('Rejestracja szkody zdrowotnej', () => {

    test(
        'Rejestracja szkody - pełny przepływ 6 ekranów (Refundacja cennikowa)',
        { tag: ['@SLS', '@SLS_CLAIM_REGISTER', '@SLS_CLAIM_REGISTER_4.1'] },
        async ({ page }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;
            const baseUrl = process.env.BASE_URL!;

            // --- LOGOWANIE ---
            await page.goto(baseUrl);
            await page.locator('input[type="text"]').fill(login);
            await page.locator('input[type="password"]').fill(password);
            await page.getByRole('button', { name: 'Zaloguj' }).click();
            await expect(page).toHaveURL(/\/dashboard/);

            // --- MENU SZKODY -> Zgłoś szkodę ---
            await page.getByRole('button', { name: 'Szkody' }).click();
            await page.getByRole('link', { name: 'Zgłoś szkodę' }).click();
            await expect(page).toHaveURL(/report-damage-search/);

            // --- WYSZUKAJ KLIENTA PO PESEL ---
            await page.getByRole('textbox', { name: 'PESEL/REGON' }).fill('88082704076');
            await page.getByRole('button', { name: ' Szukaj' }).click();

            // Poczekaj na wyniki
            await page.waitForSelector('text=Anna Nowak');

            // Rozwiń wiersz klienta (kliknij expand button - pusty button bez tekstu)
            await page.getByRole('row', { name: /Anna Nowak/ }).getByRole('button').filter({ hasText: /^$/ }).click();

            // Kliknij "Zgłoś szkodę" dla pierwszej dostępnej polisy
            await page.getByRole('button', { name: ' Zgłoś szkodę' }).first().click();

            // --- EKRAN 1: ZGŁOSZENIE ---
            await expect(page).toHaveURL(/registration/);

            // Typ zgłoszenia: Refundacja (dropdown PrimeNG)
            await page.locator('p-select').filter({ hasText: 'Typ zgłoszenia' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Refundacja' }).click();

            // Typ zgłaszającego: Ubezpieczony (dropdown)
            await page.locator('p-select').filter({ hasText: 'Typ zgłaszającego' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Ubezpieczony' }).click();

            // Kanał zgłoszenia: E-mail (dropdown)
            await page.locator('p-select').filter({ hasText: 'Kanał zgłoszenia' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'E-mail' }).click();

            // Zgoda na korespondencję: TAK (dropdown)
            await page.locator('p-select').filter({ hasText: 'Zgoda na korespondencję' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Tak' }).click();

            // Data zgłoszenia - wybierz z kalendarza (dzień 27)
            await page.locator('span').filter({ hasText: 'Data zgłoszenia *' }).getByRole('button', { name: 'Wybierz datę' }).click();
            await page.getByText('27', { exact: true }).first().click();

            // Dalej
            await page.getByRole('button', { name: ' Dalej' }).click();

            // --- EKRAN 2: ZDARZENIE ---
            await expect(page).toHaveURL(/incident/);

            // Ochrona: Refundacja cennikowa (dropdown)
            await page.locator('p-select').filter({ hasText: 'Ochrona' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Refundacja cennikowa' }).click();

            // Przyczyna zdarzenia szkodowego
            await page.locator('p-select').filter({ hasText: 'Przyczyna zdarzenia' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Zgodnie z usługą medyczną' }).click();

            // Data zdarzenia - wybierz z kalendarza (dzień 20)
            await page.getByRole('button', { name: 'Wybierz datę' }).click();
            await page.getByText('20', { exact: true }).first().click();

            // Dodaj usługę medyczną
            await page.getByRole('button', { name: ' Dodaj pozycję' }).click();

            // Popup "Dodaj usługę medyczną"
            // Nazwa usługi (p-select) - wybierz z listy
            await page.getByRole('dialog').locator('p-select').filter({ hasText: 'Nazwa usługi' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Wizyta domowa - internisty on-call (dzień)' }).click();

            // Kwota z faktury
            await page.getByRole('spinbutton', { name: 'Kwota z faktury' }).fill('150');

            // Numer faktury
            await page.getByRole('textbox', { name: 'Numer faktury *' }).fill('FV/2026/001');

            // Nazwa placówki
            await page.getByRole('textbox', { name: 'Nazwa placówki' }).fill('Centrum Medyczne Warszawa');

            // Powód skorzystania: Uraz
            await page.getByRole('dialog').locator('p-select').filter({ hasText: 'Powód skorzystania' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'Uraz' }).click();

            // Opis okoliczności wypadku
            await page.getByRole('textbox', { name: 'Opis okoliczności wypadku' }).fill('Uraz podczas aktywności fizycznej');

            // Zapisz usługę
            await page.getByRole('button', { name: ' Zapisz' }).click();

            // Potwierdź że usługa została dodana
            await expect(page.getByRole('cell', { name: 'Wizyta domowa - internisty on-call (dzień)' })).toBeVisible();

            // Dalej
            await page.getByRole('button', { name: ' Dalej' }).click();

            // --- EKRAN 3: SZKODA ---
            await expect(page).toHaveURL(/damage-configurator\/damage/);

            // Nr rachunku bankowego
            await page.getByRole('textbox', { name: 'Nr rachunku bankowego' }).fill('12345678901234567890123456');

            // Dalej
            await page.getByRole('button', { name: ' Dalej' }).click();

            // --- EKRAN 4: SZKODY POWIĄZANE ---
            await expect(page).toHaveURL(/related-damages/);

            // Dodaj powiązaną sprawę obcą
            await page.getByRole('button', { name: ' Dodaj powiązaną sprawę obcą' }).click();

            // Numer referencyjny
            await page.getByRole('textbox', { name: 'Numer referencyjny sprawy' }).fill('REF/2026/001');

            // Typ sprawy obcej (dropdown)
            await page.locator('p-select').filter({ hasText: 'Typ sprawy obcej' }).getByRole('button', { name: 'dropdown trigger' }).click();
            await page.getByRole('option', { name: 'reklamacja' }).click();

            // Uwagi
            await page.getByRole('textbox', { name: 'Uwagi' }).fill('Uwagi do sprawy obcej');

            // Zatwierdź
            await page.getByRole('button', { name: ' Zatwierdź' }).click();

            // Dalej
            await page.getByRole('button', { name: ' Dalej' }).click();

            // --- EKRAN 5: ZGŁOŚ SZKODĘ (Ankieta) ---
            await expect(page).toHaveURL(/register-damage/);

            // Odpowiedz "Tak" na wszystkie pytania (5 dropdownów PrimeNG)
            const dropdownTriggers = page.getByRole('button', { name: 'dropdown trigger' });
            const count = await dropdownTriggers.count();
            for (let i = 0; i < count; i++) {
                await dropdownTriggers.nth(i).click();
                await page.getByRole('option', { name: 'Tak' }).click();
            }

            // Zapisz i przejdź do dodawania dokumentów
            await page.getByRole('button', { name: 'Zapisz i przejdź do dodawania dokumentów' }).click();

            // --- EKRAN 6: ZAŁĄCZ DOKUMENTY ---
            await expect(page).toHaveURL(/attachment-documents/);

            // Pomiń dodawanie dokumentów
            await page.getByRole('button', { name: 'Pomiń' }).click();

            // --- WERYFIKACJA: Szkoda zarejestrowana ---
            await expect(page).toHaveURL(/damage-details/);
            await expect(page.getByText(/Nr szkody:/)).toBeVisible();
        }
    );
});
