import { test, expect } from '@playwright/test';

test.describe('Logowanie', () => {

    test('Logowanie użytkownika z danymi z pliku .env',
        { tag: ['@SLS', '@SLS_LOGIN', '@SLS_1.1'] },
        async ({ page }) => {
            // Given - dane użytkownika z pliku .env
            const baseUrl = process.env.BASE_URL!;
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;

            expect(baseUrl, 'BASE_URL musi być ustawiony w pliku .env').toBeTruthy();
            expect(login, 'TEST_USER_EMAIL musi być ustawiony w pliku .env').toBeTruthy();
            expect(password, 'TEST_USER_PASSWORD musi być ustawiony w pliku .env').toBeTruthy();

            // When - użytkownik przechodzi do BASE_URL
            await page.goto(baseUrl);

            // And - wypełnia pole Login i Hasło
            await page.locator('input[type="text"]').fill(login);
            await page.locator('input[type="password"]').fill(password);

            // And - klika przycisk "Zaloguj"
            await page.getByRole('button', { name: 'Zaloguj' }).click();

            // Then - użytkownik jest zalogowany i widzi dashboard
            await expect(page).toHaveURL(/\/dashboard/);
            await expect(page.getByRole('button', { name: new RegExp(login, 'i') })).toBeVisible();
        }
    );
});
