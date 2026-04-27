import { Page, Locator, expect } from '@playwright/test';

/**
 * Klasa bazowa dla wszystkich Page Objects.
 * Zawiera wspólne metody i asercje używane w całym projekcie.
 */
export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Nawigacja do określonego URL
     */
    async goto(path: string): Promise<void> {
        await this.page.goto(path);
    }

    /**
     * Oczekiwanie na załadowanie strony
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Kliknięcie w element
     */
    async click(locator: Locator): Promise<void> {
        await locator.click();
    }

    /**
     * Wypełnienie pola tekstowego
     */
    async fill(locator: Locator, text: string): Promise<void> {
        await locator.fill(text);
    }

    /**
     * Sprawdzenie widoczności elementu
     */
    async assertVisible(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
    }

    /**
     * Sprawdzenie niewidoczności elementu
     */
    async assertHidden(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeHidden({ timeout });
    }

    /**
     * Sprawdzenie tekstu w elemencie
     */
    async assertText(locator: Locator, expectedText: string | RegExp): Promise<void> {
        await expect(locator).toHaveText(expectedText);
    }

    /**
     * Sprawdzenie wartości inputa
     */
    async assertValue(locator: Locator, expectedValue: string | RegExp): Promise<void> {
        await expect(locator).toHaveValue(expectedValue);
    }

    /**
     * Sprawdzenie czy element jest enabled
     */
    async assertEnabled(locator: Locator): Promise<void> {
        await expect(locator).toBeEnabled();
    }

    /**
     * Sprawdzenie czy element jest disabled
     */
    async assertDisabled(locator: Locator): Promise<void> {
        await expect(locator).toBeDisabled();
    }

    /**
     * Oczekiwanie na URL
     */
    async waitForURL(url: string | RegExp): Promise<void> {
        await this.page.waitForURL(url);
    }

    /**
     * Sprawdzenie obecnego URL
     */
    async assertURL(expectedURL: string | RegExp): Promise<void> {
        await expect(this.page).toHaveURL(expectedURL);
    }

    /**
     * Sprawdzenie tytułu strony
     */
    async assertTitle(expectedTitle: string | RegExp): Promise<void> {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    /**
     * Pobranie tekstu z elementu
     */
    async getText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    /**
     * Oczekiwanie na element
     */
    async waitForElement(locator: Locator, state: 'visible' | 'hidden' | 'attached' = 'visible'): Promise<void> {
        await locator.waitFor({ state });
    }

    /**
     * Screenshot strony
     */
    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
    }
}
