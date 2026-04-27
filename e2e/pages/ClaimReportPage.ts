import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object dla strony zgłoszenia szkody
 */
export class ClaimReportPage extends BasePage {
    // Selektory
    private readonly pageTitle: Locator;
    private readonly claimTypeSelect: Locator;
    private readonly dateInput: Locator;
    private readonly descriptionTextarea: Locator;
    private readonly submitButton: Locator;
    private readonly cancelButton: Locator;
    private readonly successMessage: Locator;
    private readonly validationError: Locator;

    constructor(page: Page) {
        super(page);

        this.pageTitle = page.getByRole('heading', { name: /zgłoszenie szkody|claim report/i });
        this.claimTypeSelect = page.getByRole('combobox', { name: /rodzaj szkody|claim type/i });
        this.dateInput = page.getByLabel(/data zdarzenia|event date/i);
        this.descriptionTextarea = page.getByRole('textbox', { name: /opis|description/i });
        this.submitButton = page.getByRole('button', { name: /wyślij|submit/i });
        this.cancelButton = page.getByRole('button', { name: /anuluj|cancel/i });
        this.successMessage = page.getByTestId('claim-success-message');
        this.validationError = page.getByTestId('validation-error');
    }

    /**
     * Przejście do strony zgłoszenia szkody
     */
    async navigate(): Promise<void> {
        await this.goto('/claims/report');
        await this.waitForPageLoad();
    }

    /**
     * Sprawdzenie czy strona jest wyświetlona
     */
    async assertPageVisible(): Promise<void> {
        await this.assertVisible(this.pageTitle);
    }

    /**
     * Wybór typu szkody
     */
    async selectClaimType(claimType: string): Promise<void> {
        await this.claimTypeSelect.selectOption({ label: claimType });
    }

    /**
     * Wprowadzenie daty zdarzenia
     */
    async enterEventDate(date: string): Promise<void> {
        await this.fill(this.dateInput, date);
    }

    /**
     * Wprowadzenie opisu szkody
     */
    async enterDescription(description: string): Promise<void> {
        await this.fill(this.descriptionTextarea, description);
    }

    /**
     * Wypełnienie formularza zgłoszenia szkody
     */
    async fillClaimForm(claimType: string, eventDate: string, description: string): Promise<void> {
        await this.selectClaimType(claimType);
        await this.enterEventDate(eventDate);
        await this.enterDescription(description);
    }

    /**
     * Wysłanie formularza
     */
    async submitForm(): Promise<void> {
        await this.click(this.submitButton);
    }

    /**
     * Anulowanie formularza
     */
    async cancelForm(): Promise<void> {
        await this.click(this.cancelButton);
    }

    /**
     * Sprawdzenie komunikatu sukcesu
     */
    async assertSuccessMessage(expectedMessage?: string): Promise<void> {
        await this.assertVisible(this.successMessage);

        if (expectedMessage) {
            await this.assertText(this.successMessage, expectedMessage);
        }
    }

    /**
     * Sprawdzenie błędu walidacji
     */
    async assertValidationError(expectedError?: string): Promise<void> {
        await this.assertVisible(this.validationError);

        if (expectedError) {
            await this.assertText(this.validationError, expectedError);
        }
    }

    /**
     * Sprawdzenie czy przycisk submit jest disabled
     */
    async assertSubmitButtonDisabled(): Promise<void> {
        await this.assertDisabled(this.submitButton);
    }
}
