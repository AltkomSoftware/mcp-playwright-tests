import { type Page } from '@playwright/test';
import { ClaimRegistrationFactory } from './ClaimRegistrationFactory';
import { LoginPage } from '../pages/LoginPage';
import { ClaimRegistrationPage } from '../pages/ClaimRegistrationPage';

export async function registerClaim(
    loginPage: LoginPage,
    claimRegistrationPage: ClaimRegistrationPage
): Promise<string> {
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
    console.log(`Szkoda do testu opinii: ${claimNumber}`);
    return claimNumber;
}

export async function searchAndGoToDamageDetails(page: Page, claimNumber: string): Promise<void> {
    await page.goto('/damage/case-search');
    await page.getByRole('textbox', { name: 'Numer szkody' }).fill(claimNumber);
    await page.getByRole('button', { name: /Szukaj/ }).last().click();
    await page.getByRole('button', { name: ' Szczegóły' }).click();
    await page.waitForURL(/damage-details/);
}

export async function goToMedicalOpinionTab(page: Page): Promise<void> {
    await page.getByRole('tab', { name: 'Opinia medyczna' }).click();
    await page.waitForURL(/medical-opinion/);
}


