import { test } from '../fixtures/pageFixtures';
import {
    navigateToRegistrationDamageStep,
    registerClaimWithPriority,
    goToDamageDataTab,
} from '../helpers/ClaimPriorityHelper';
import { registerClaim, searchAndGoToDamageDetails } from '../helpers/MedicalOpinionHelper';

const DAMAGE_ID = 581;

test.describe('Priorytet szkody', () => {
    test(
        'Pole Priorytet na kroku Szkoda w rejestracji jest domyślnie ustawione na Zwykła',
        { tag: ['@SLS', '@SLS_7.1', '@SLS_CLAIM_PRIORITY'] },
        async ({ loginPage, claimRegistrationPage }) => {
            await navigateToRegistrationDamageStep(loginPage, claimRegistrationPage);
            await claimRegistrationPage.assertDamageStepPriorityDefault();
        },
    );

    test(
        'Zmiana priorytetu na VIP podczas rejestracji szkody jest widoczna na zakładce Dane szkody',
        { tag: ['@SLS', '@SLS_7.2', '@SLS_CLAIM_PRIORITY'] },
        async ({ loginPage, claimRegistrationPage, damageDataPage, page }) => {
            const claimNumber = await registerClaimWithPriority(loginPage, claimRegistrationPage, 'VIP');
            await goToDamageDataTab(page, claimNumber);
            await damageDataPage.assertPriorityDisplayed('VIP');
        },
    );

    test(
        'Priorytet szkody jest widoczny na zakładce Dane szkody',
        { tag: ['@SLS', '@SLS_7.3', '@SLS_CLAIM_PRIORITY'] },
        async ({ loginPage, damageDataPage }) => {
            await loginPage.navigate();
            await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
            await loginPage.assertURL(/\/dashboard/);
            await damageDataPage.navigateToDamageData(DAMAGE_ID);
            await damageDataPage.assertPriorityDisplayed('Zwykła');
        },
    );

    test(
        'Dialog Edycja danych szkody zawiera pole Priorytet z opcjami Zwykła i VIP',
        { tag: ['@SLS', '@SLS_7.4', '@SLS_CLAIM_PRIORITY'] },
        async ({ loginPage, damageDataPage }) => {
            await loginPage.navigate();
            await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
            await loginPage.assertURL(/\/dashboard/);
            await damageDataPage.navigateToDamageData(DAMAGE_ID);
            await damageDataPage.clickEditDamage();
            await damageDataPage.assertEditDialogPriorityFieldVisible();
            await damageDataPage.assertEditDialogPriorityOptions();
            await damageDataPage.closeEditDialog();
        },
    );

    test(
        'Zmiana priorytetu przez dialog Edycja danych szkody aktualizuje wyświetlany priorytet',
        { tag: ['@SLS', '@SLS_7.5', '@SLS_CLAIM_PRIORITY'] },
        async ({ loginPage, claimRegistrationPage, damageDataPage, page }) => {
            const claimNumber = await registerClaim(loginPage, claimRegistrationPage);
            await searchAndGoToDamageDetails(page, claimNumber);
            await damageDataPage.clickDamageDataTab();
            await damageDataPage.assertPriorityDisplayed('Zwykła');
            await damageDataPage.changePriorityViaDialog('VIP');
            await damageDataPage.assertPriorityDisplayed('VIP');
        },
    );
});
