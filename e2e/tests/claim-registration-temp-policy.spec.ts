import { test } from '../fixtures/pageFixtures';

import { ClaimRegistrationFactory } from '../helpers';
// testy na bazie scenariusza manualnego xray
test.describe('Rejestracja szkody z polisy tymczasowej', () => {

    test(
        'Rejestracja szkody po dodaniu klienta i zgłoszeniu z polisy tymczasowej',
        { tag: ['@SLS', '@SLS_CLAIM_REGISTER_TEMP_POLICY', '@SLS_5.1'] },
        async ({ claimRegistrationPage, loginPage }) => {
            const login = process.env.TEST_USER_EMAIL!;
            const password = process.env.TEST_USER_PASSWORD!;
            const client = ClaimRegistrationFactory.createTempPolicyClientData();
            const currentDay = String(new Date().getDate());
            const scenario = ClaimRegistrationFactory.tempPolicyHealthClaim(client, currentDay);

            await loginPage.navigate();
            await loginPage.login(login, password);
            await loginPage.assertURL(/\/dashboard/);

            await claimRegistrationPage.openClaimRegistrationSearch();
            await claimRegistrationPage.addPrivateClient(client);
            await claimRegistrationPage.searchClientByPesel(scenario.search.pesel);
            await claimRegistrationPage.startClaimFromTemporaryPolicy(client, scenario.temporaryPolicy!);
            await claimRegistrationPage.completeRegistrationStep(scenario.registrationStep);
            await claimRegistrationPage.completeEventStep(scenario.eventStep);
            await claimRegistrationPage.completeDamageStep(scenario.damageStep.bankAccount);
            await claimRegistrationPage.completeRelatedDamagesStep(scenario.relatedCase);
            const claimNumber = await claimRegistrationPage.completeQuestionnaireAndSkipAttachments(scenario.questionnaire.answer);
            await claimRegistrationPage.assertClaimCreated(claimNumber);
        },
    );
});