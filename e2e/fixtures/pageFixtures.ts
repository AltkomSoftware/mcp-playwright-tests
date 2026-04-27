import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClaimRegistrationPage } from '../pages/ClaimRegistrationPage';

/**
 * Rozszerzony fixture z Page Objects
 */
type PageFixtures = {
    loginPage: LoginPage;
    claimRegistrationPage: ClaimRegistrationPage;
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
});

export { expect } from '@playwright/test';
