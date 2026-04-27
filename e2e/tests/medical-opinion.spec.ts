import { test, expect } from '../fixtures/pageFixtures';
import { registerClaim, searchAndGoToDamageDetails, goToMedicalOpinionTab } from '../helpers/MedicalOpinionHelper';

const DAMAGE_ID = 581;

test.describe('Opinia medyczna — zakładka szczegółów szkody', () => {

    test(
        'Zakładka Opinia medyczna jest widoczna i zawiera wymagane sekcje',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.1'] },
        async ({ loginPage, medicalOpinionPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await medicalOpinionPage.navigateToMedicalOpinionTab(DAMAGE_ID);
            await medicalOpinionPage.assertMedicalOpinionTabVisible();
            await medicalOpinionPage.assertCurrentOpinionSectionVisible();
            await medicalOpinionPage.assertArchiveSectionVisible();
            await medicalOpinionPage.assertAskForOpinionButtonVisible();
            await medicalOpinionPage.assertIssueOpinionButtonVisible();
        }
    );

    test(
        'Kliknięcie "Poproś o wydanie opinii medycznej" wyświetla dialog potwierdzenia',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.2'] },
        async ({ loginPage, medicalOpinionPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await medicalOpinionPage.navigateToMedicalOpinionTab(DAMAGE_ID);
            await medicalOpinionPage.clickAskForOpinion();

            await expect(
                medicalOpinionPage.page.getByText('Zamierzasz poprosić o wydanie opinii medycznej')
            ).toBeVisible();
            await expect(
                medicalOpinionPage.page.getByRole('button', { name: 'Tak', exact: true })
            ).toBeVisible();
            await expect(
                medicalOpinionPage.page.getByRole('button', { name: 'Nie', exact: true })
            ).toBeVisible();

            await medicalOpinionPage.cancelAskForOpinionDialog();

            await expect(
                medicalOpinionPage.page.getByText('Zamierzasz poprosić o wydanie opinii medycznej')
            ).toBeHidden();
            await expect(medicalOpinionPage.page).toHaveURL(/medical-opinion/);
        }
    );

    test(
        'Potwierdzenie "Poproś o wydanie opinii" przekierowuje na ekran tworzenia zadania',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.3'] },
        async ({ loginPage, claimRegistrationPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(claimRegistrationPage.page, claimNumber);
            await goToMedicalOpinionTab(claimRegistrationPage.page);

            await claimRegistrationPage.page.getByRole('button', { name: 'Poproś o wydanie opinii medycznej' }).click();
            await expect(claimRegistrationPage.page.getByRole('button', { name: 'Tak', exact: true })).toBeVisible();
            await claimRegistrationPage.page.getByRole('button', { name: 'Tak', exact: true }).click();

            await claimRegistrationPage.page.waitForURL(/damage-task-create/);
            await expect(claimRegistrationPage.page).toHaveURL(/MEDICAL_OPINION_REQUIRED/);
            await expect(claimRegistrationPage.page.getByText('Nowe zadanie')).toBeVisible();
            await expect(claimRegistrationPage.page.getByRole('combobox', { name: 'Wymagana opinia medyczna' })).toBeVisible();
            await expect(claimRegistrationPage.page.getByRole('textbox', { name: 'Numer powiązanego obiektu' })).toHaveValue(claimNumber);
            await expect(claimRegistrationPage.page.getByRole('textbox', { name: 'Numer powiązanego obiektu' })).toBeDisabled();
        }
    );

    test(
        'Dialog "Wydaj opinię medyczną" zawiera wymagane pola i listę opcji',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.4'] },
        async ({ loginPage, medicalOpinionPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await medicalOpinionPage.navigateToMedicalOpinionTab(DAMAGE_ID);
            await medicalOpinionPage.clickIssueOpinion();

            await medicalOpinionPage.assertIssueOpinionDialogVisible();

            await medicalOpinionPage.page.getByRole('button', { name: 'dropdown trigger' }).click();

            await expect(medicalOpinionPage.page.getByRole('option', { name: 'Zasadna', exact: true })).toBeVisible();
            await expect(medicalOpinionPage.page.getByRole('option', { name: 'Niezasadna', exact: true })).toBeVisible();
            await expect(medicalOpinionPage.page.getByRole('option', { name: 'Zasadna w części', exact: true })).toBeVisible();
            await expect(medicalOpinionPage.page.getByRole('option', { name: 'Brak możliwości wydania opinii', exact: true })).toBeVisible();

            await medicalOpinionPage.page.keyboard.press('Escape');
            await medicalOpinionPage.closeIssueOpinionDialog();
            await medicalOpinionPage.assertIssueOpinionDialogClosed();
        }
    );

    test(
        'Wydanie opinii medycznej "Zasadna" zapisuje opinię w sekcji aktualnej',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.5'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Zasadna', 'Opinia wydana w ramach testu automatycznego');

            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();
            await expect(medicalOpinionPage.page.getByText('Zasadna')).toBeVisible();
        }
    );

    test(
        'Wydanie opinii medycznej "Niezasadna" zapisuje opinię w sekcji aktualnej',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.6'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Niezasadna', 'Opinia niezasadna — test automatyczny');

            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();
            await expect(medicalOpinionPage.page.getByText('Niezasadna', { exact: true })).toBeVisible();
        }
    );

    test(
        'Wydanie opinii medycznej "Zasadna w części" zapisuje opinię w sekcji aktualnej',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.7'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Zasadna w części', 'Opinia zasadna w części — test automatyczny');

            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();
            await expect(medicalOpinionPage.page.getByText('Zasadna w części', { exact: true })).toBeVisible();
        }
    );

    test(
        'Wydanie opinii medycznej "Brak możliwości wydania opinii" zapisuje opinię w sekcji aktualnej',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.8'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Brak możliwości wydania opinii', 'Brak możliwości — test automatyczny');

            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();
            await expect(medicalOpinionPage.page.getByText('Brak możliwości wydania opinii')).toBeVisible();
        }
    );

    test(
        'Wydanie drugiej opinii przenosi pierwszą do sekcji archiwalnych',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.9'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Zasadna', 'Pierwsza opinia — test archiwum');
            await expect(medicalOpinionPage.page.getByText('Zasadna')).toBeVisible();
            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();

            await medicalOpinionPage.issueOpinionViaDialog('Niezasadna', 'Druga opinia — test archiwum');

            await expect(medicalOpinionPage.page.getByText('Brak wydanej opinii medycznej')).toBeHidden();
            await medicalOpinionPage.assertArchivedOpinionExists('Zasadna');
            await medicalOpinionPage.assertCurrentOpinionValue('Niezasadna');
        }
    );

    test(
        'Nowa szkoda wyświetla komunikat o braku wydanej opinii',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.10'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.assertNoCurrentOpinion();
        }
    );

    test(
        'Potwierdzenie "Poproś" zmienia status operacyjny na "Przekazano do Lekarza T.U."',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.11'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.clickAskForOpinion();
            await medicalOpinionPage.page.getByRole('button', { name: 'Tak', exact: true }).click();
            await medicalOpinionPage.page.waitForURL(/damage-task-create/);

            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await medicalOpinionPage.assertOperationalStatus('Przekazano do Lekarza T.U.');
        }
    );

    test(
        'Dialog "Zapisz opinię" wyświetla numer szkody i wymaga potwierdzenia nieodwracalnej operacji',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.12'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.clickIssueOpinion();
            await medicalOpinionPage.selectOpinionValue('Zasadna');
            await medicalOpinionPage.clickSaveOpinionButton();

            await medicalOpinionPage.assertSaveConfirmDialogContains(claimNumber);
            await medicalOpinionPage.cancelSaveConfirmDialog();
        }
    );

    test(
        'Pole "Opinia medyczna" jest wymagane — brak wyboru blokuje zapis',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.13'] },
        async ({ loginPage, medicalOpinionPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await medicalOpinionPage.navigateToMedicalOpinionTab(DAMAGE_ID);
            await medicalOpinionPage.clickIssueOpinion();
            await medicalOpinionPage.clickSaveOpinionButton();
            await medicalOpinionPage.assertValidationRequiredError();
            await medicalOpinionPage.closeIssueOpinionDialog();
        }
    );

    test(
        'Po zapisaniu opinii status operacyjny zmienia się na "Wydano opinię medyczną"',
        { tag: ['@SLS', '@SLS_MEDICAL_OPINION', '@SLS_6.14'] },
        async ({ loginPage, claimRegistrationPage, medicalOpinionPage }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(medicalOpinionPage.page, claimNumber);
            await goToMedicalOpinionTab(medicalOpinionPage.page);

            await medicalOpinionPage.issueOpinionViaDialog('Zasadna', 'Opinia do testu statusu');

            await medicalOpinionPage.assertOperationalStatus('Wydano opinię medyczną');
        }
    );
});
