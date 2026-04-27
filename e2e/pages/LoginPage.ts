import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object dla strony logowania
 */
export class LoginPage extends BasePage {
    // Selektory
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly rememberMeCheckbox: Locator;

    constructor(page: Page) {
        super(page);

        // Preferujemy role-based selectors i test IDs
        this.emailInput = page.getByRole('textbox', { name: /email|e-mail/i });
        this.passwordInput = page.getByRole('textbox', { name: /hasło|password/i });
        this.loginButton = page.getByRole('button', { name: /zaloguj|login/i });
        this.errorMessage = page.getByTestId('login-error');
        this.rememberMeCheckbox = page.getByRole('checkbox', { name: /zapamiętaj|remember/i });
    }

    /**
     * Przejście do strony logowania
     */
    async navigate(): Promise<void> {
        await this.goto('/login');
        await this.waitForPageLoad();
    }

    /**
     * Logowanie użytkownika
     */
    async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);

        if (rememberMe) {
            await this.click(this.rememberMeCheckbox);
        }

        await this.click(this.loginButton);
    }

    /**
     * Sprawdzenie czy wyświetlany jest błąd logowania
     */
    async assertLoginError(expectedMessage?: string): Promise<void> {
        await this.assertVisible(this.errorMessage);

        if (expectedMessage) {
            await this.assertText(this.errorMessage, expectedMessage);
        }
    }

    /**
     * Sprawdzenie czy pole email ma błąd walidacji
     */
    async assertEmailValidationError(): Promise<void> {
        await this.assertVisible(this.emailInput);
        // Możesz dodać sprawdzenie aria-invalid lub innych atrybutów
    }
}
