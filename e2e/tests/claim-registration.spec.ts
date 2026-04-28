import { test } from '../fixtures/pageFixtures';

import { ClaimRegistrationFactory } from '../helpers';
// testy na bazie scenariusza manualnego xray
test.describe('Rejestracja szkody zdrowotnej', () => {

    test(
        'Rejestracja szkody - pełny przepływ 6 ekranów (Refundacja cennikowa)',
        { tag: ['@SLS', '@SLS_CLAIM_REGISTER', '@SLS_4.1'] },
        async ({ claimRegistrationPage, loginPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;
            const scenario = ClaimRegistrationFactory.standardHealthClaim();

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await claimRegistrationPage.openClaimRegistrationSearch();
            await claimRegistrationPage.searchClientByPesel(scenario.search.pesel);
            await claimRegistrationPage.startClaimFromFirstAvailablePolicy(scenario.search.clientName);
            await claimRegistrationPage.completeRegistrationStep(scenario.registrationStep);
            await claimRegistrationPage.completeEventStep(scenario.eventStep);
            await claimRegistrationPage.completeDamageStep(scenario.damageStep.bankAccount);
            await claimRegistrationPage.completeRelatedDamagesStep(scenario.relatedCase);
            const claimNumber = await claimRegistrationPage.completeQuestionnaireAndSkipAttachments(scenario.questionnaire.answer);
            await claimRegistrationPage.assertClaimCreated(claimNumber);
        }
    );
});
