import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClaimRegistrationPage } from '../pages/ClaimRegistrationPage';
import { MedicalOpinionPage } from '../pages/MedicalOpinionPage';
import { DamageDataPage } from '../pages/DamageDataPage';

/**
 * Rozszerzony fixture z Page Objects
 */
type PageFixtures = {
    loginPage: LoginPage;
    claimRegistrationPage: ClaimRegistrationPage;
    medicalOpinionPage: MedicalOpinionPage;
    damageDataPage: DamageDataPage;
};

/**
 * Fixture udostępniający wszystkie Page Objects
 */
export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    claimRegistrationPage: async ({ page }, use) => {
        const claimRegistrationPage = new ClaimRegistrationPage(page);
        await use(claimRegistrationPage);
    },

    medicalOpinionPage: async ({ page }, use) => {
        const medicalOpinionPage = new MedicalOpinionPage(page);
        await use(medicalOpinionPage);
    },

    damageDataPage: async ({ page }, use) => {
        const damageDataPage = new DamageDataPage(page);
        await use(damageDataPage);
    },
});

export { expect } from '@playwright/test';
