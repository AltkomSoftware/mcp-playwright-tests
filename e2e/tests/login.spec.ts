import { test, expect } from '../fixtures/pageFixtures';
import { UserFactory } from '../helpers/UserFactory';

/**
 * Testy E2E dla procesu logowania
 */
test.describe('Logowanie użytkownika', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigate();
    });

    test('Poprawne logowanie z prawidłowymi danymi',
        { tag: ['@SLS', '@SLS_LOGIN', '@SLS_LOGIN_1.1'] },
        async ({ loginPage, page }) => {
            // Given - użytkownik z prawidłowymi danymi
            const user = UserFactory.validUser();

            // When - użytkownik wprowadza dane i klika "Zaloguj"
            await loginPage.login(user.email, user.password);

            // Then - użytkownik jest przekierowany na stronę główną
            await expect(page).toHaveURL(/\/dashboard|\/home/);
        }
    );

    test('Nieudane logowanie z nieprawidłowym hasłem',
        { tag: ['@SLS', '@SLS_LOGIN', '@SLS_LOGIN_1.2'] },
        async ({ loginPage }) => {
            // Given - użytkownik z nieprawidłowym hasłem
            const user = {
                email: 'test.user@example.com',
                password: 'WrongPassword123!',
            };

            // When - użytkownik wprowadza dane i klika "Zaloguj"
            await loginPage.login(user.email, user.password);

            // Then - wyświetlany jest komunikat o błędzie
            await loginPage.assertLoginError();
        }
    );

    test('Walidacja pustego formularza logowania',
        { tag: ['@SLS', '@SLS_LOGIN', '@SLS_LOGIN_1.3'] },
        async ({ loginPage }) => {
            // Given - puste pola formularza

            // When - użytkownik próbuje zalogować się bez wypełniania pól
            await loginPage.login('', '');

            // Then - formularz nie zostaje wysłany i widoczne są błędy walidacji
            await loginPage.assertEmailValidationError();
        }
    );

    test('Logowanie z opcją "Zapamiętaj mnie"',
        { tag: ['@SLS', '@SLS_LOGIN', '@SLS_LOGIN_1.4'] },
        async ({ loginPage, page }) => {
            // Given - użytkownik z prawidłowymi danymi
            const user = UserFactory.validUser();

            // When - użytkownik loguje się z zaznaczoną opcją "Zapamiętaj mnie"
            await loginPage.login(user.email, user.password, true);

            // Then - użytkownik jest zalogowany i sesja jest zachowana
            await expect(page).toHaveURL(/\/dashboard|\/home/);
            // Dodatkowa walidacja cookie lub localStorage może być tutaj
        }
    );
});
