import { test, expect } from '../fixtures/pageFixtures';
import { ClaimFactory } from '../helpers/ClaimFactory';
import { UserFactory } from '../helpers/UserFactory';

/**
 * Testy E2E dla procesu zgłaszania szkody
 */
test.describe('Zgłaszanie szkody', () => {

    test.beforeEach(async ({ loginPage, claimReportPage }) => {
        // Uwierzytelnienie przed każdym testem
        const user = UserFactory.validUser();
        await loginPage.navigate();
        await loginPage.login(user.email, user.password);

        // Przejście do strony zgłoszenia szkody
        await claimReportPage.navigate();
        await claimReportPage.assertPageVisible();
    });

    test('Pomyślne zgłoszenie szkody z kompletnymi danymi',
        { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_2.1'] },
        async ({ claimReportPage }) => {
            // Given - użytkownik ma wszystkie wymagane dane do zgłoszenia
            const claim = ClaimFactory.basicClaim();

            // When - użytkownik wypełnia formularz i wysyła zgłoszenie
            await claimReportPage.fillClaimForm(claim.type, claim.eventDate, claim.description);
            await claimReportPage.submitForm();

            // Then - zgłoszenie zostaje zapisane i wyświetlany jest komunikat sukcesu
            await claimReportPage.assertSuccessMessage();
        }
    );

    test('Zgłoszenie szkody z minimalną ilością danych',
        { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_2.2'] },
        async ({ claimReportPage }) => {
            // Given - użytkownik ma minimalne wymagane dane
            const claim = ClaimFactory.minimalClaim();

            // When - użytkownik wypełnia formularz minimalnie i wysyła zgłoszenie
            await claimReportPage.fillClaimForm(claim.type, claim.eventDate, claim.description);
            await claimReportPage.submitForm();

            // Then - zgłoszenie zostaje zaakceptowane
            await claimReportPage.assertSuccessMessage();
        }
    );

    test('Walidacja zgłoszenia z przyszłą datą zdarzenia',
        { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_2.3'] },
        async ({ claimReportPage }) => {
            // Given - użytkownik próbuje zgłosić szkodę z przyszłą datą
            const claim = ClaimFactory.claimWithFutureDate();

            // When - użytkownik wypełnia formularz z przyszłą datą
            await claimReportPage.fillClaimForm(claim.type, claim.eventDate, claim.description);
            await claimReportPage.submitForm();

            // Then - wyświetlany jest błąd walidacji
            await claimReportPage.assertValidationError();
        }
    );

    test('Anulowanie zgłoszenia szkody',
        { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_2.4'] },
        async ({ claimReportPage, page }) => {
            // Given - użytkownik rozpoczął wypełnianie formularza
            const claim = ClaimFactory.basicClaim();
            await claimReportPage.fillClaimForm(claim.type, claim.eventDate, claim.description);

            // When - użytkownik klika przycisk "Anuluj"
            await claimReportPage.cancelForm();

            // Then - użytkownik jest przekierowany bez zapisania danych
            await expect(page).not.toHaveURL(/\/claims\/report/);
        }
    );

    test('Zgłoszenie szkody z długim opisem',
        { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_2.5'] },
        async ({ claimReportPage }) => {
            // Given - użytkownik ma bardzo długi opis szkody
            const claim = ClaimFactory.claimWithLongDescription();

            // When - użytkownik wypełnia formularz z długim opisem
            await claimReportPage.fillClaimForm(claim.type, claim.eventDate, claim.description);
            await claimReportPage.submitForm();

            // Then - zgłoszenie zostaje zaakceptowane pomimo długiego opisu
            await claimReportPage.assertSuccessMessage();
        }
    );
});
