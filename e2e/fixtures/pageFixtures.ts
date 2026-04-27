import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ClaimReportPage } from '../pages/ClaimReportPage';

/**
 * Rozszerzony fixture z Page Objects
 */
type PageFixtures = {
    loginPage: LoginPage;
    claimReportPage: ClaimReportPage;
};

/**
 * Fixture udostępniający wszystkie Page Objects
 */
export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    claimReportPage: async ({ page }, use) => {
        const claimReportPage = new ClaimReportPage(page);
        await use(claimReportPage);
    },
});

export { expect } from '@playwright/test';
