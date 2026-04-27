import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MedicalOpinionPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // -------------------------------------------------------------------------
    // Nawigacja
    // -------------------------------------------------------------------------

    async navigateToMedicalOpinionTab(damageId: number): Promise<void> {
        await this.page.goto(`/damage/damage-details/${damageId}/medical-opinion`);
    }

    async openClaimFromSearch(claimNumber: string): Promise<void> {
        await this.page.goto('/damage/case-search');
        await this.page.getByRole('textbox', { name: 'Numer szkody' }).fill(claimNumber);
        await this.page.getByRole('button', { name: ' Szukaj' }).click();
        await this.page.getByRole('button', { name: ' Szczegóły' }).click();
        await this.page.waitForURL(/damage-details/);
    }

    async clickMedicalOpinionTab(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Opinia medyczna' }).click();
        await this.page.waitForURL(/medical-opinion/);
    }

    // -------------------------------------------------------------------------
    // Asercje zakładki
    // -------------------------------------------------------------------------

    async assertMedicalOpinionTabVisible(): Promise<void> {
        await expect(this.page.getByRole('tab', { name: 'Opinia medyczna' })).toBeVisible();
    }

    async assertCurrentOpinionSectionVisible(): Promise<void> {
        await expect(this.page.getByText('Aktualna opinia medyczna')).toBeVisible();
    }

    async assertArchiveSectionVisible(): Promise<void> {
        await expect(this.page.getByText('Archiwalne opinie medyczne')).toBeVisible();
    }

    async assertNoCurrentOpinion(): Promise<void> {
        await expect(this.page.getByText('Brak wydanej opinii medycznej')).toBeVisible();
    }

    async assertAskForOpinionButtonVisible(): Promise<void> {
        await expect(this.page.getByRole('button', { name: 'Poproś o wydanie opinii medycznej' })).toBeVisible();
    }

    async assertIssueOpinionButtonVisible(): Promise<void> {
        await expect(this.page.getByRole('button', { name: 'Wydaj opinię medyczną' })).toBeVisible();
    }

    // -------------------------------------------------------------------------
    // Akcja: Poproś o wydanie opinii medycznej
    // -------------------------------------------------------------------------

    async clickAskForOpinion(): Promise<void> {
        await this.page.getByRole('button', { name: 'Poproś o wydanie opinii medycznej' }).click();
    }

    async assertAskForOpinionConfirmDialog(): Promise<void> {
        await expect(this.page.getByRole('alertdialog', { name: 'Potwierdź' })
            .or(this.page.locator('[role="alertdialog"]').filter({ hasText: 'Potwierdź' })))
            .toBeVisible();
        await expect(this.page.getByText('Zamierzasz poprosić o wydanie opinii medycznej')).toBeVisible();
    }

    async confirmAskForOpinion(): Promise<void> {
        await this.page.getByRole('button', { name: 'Tak', exact: true }).click();
        await this.page.waitForURL(/damage-task-create/);
    }

    async cancelAskForOpinionDialog(): Promise<void> {
        await this.page.getByRole('button', { name: 'Nie', exact: true }).click();
    }

    async assertTaskCreatePageForMedicalOpinion(claimNumber: string): Promise<void> {
        await expect(this.page).toHaveURL(/damage-task-create.*MEDICAL_OPINION_REQUIRED/);
        await expect(this.page.getByText('Nowe zadanie')).toBeVisible();
        await expect(this.page.getByRole('combobox', { name: 'Wymagana opinia medyczna' })).toBeVisible();
        await expect(this.page.getByRole('textbox', { name: 'Numer powiązanego obiektu' })).toHaveValue(claimNumber);
        await expect(this.page.getByRole('textbox', { name: 'Numer powiązanego obiektu' })).toBeDisabled();
    }

    async assertOperationalStatusChanged(expectedStatus: string): Promise<void> {
        await expect(this.page.getByText(expectedStatus)).toBeVisible();
    }

    // -------------------------------------------------------------------------
    // Akcja: Wydaj opinię medyczną
    // -------------------------------------------------------------------------

    async clickIssueOpinion(): Promise<void> {
        await this.page.getByRole('button', { name: 'Wydaj opinię medyczną' }).click();
    }

    async assertIssueOpinionDialogVisible(): Promise<void> {
        await expect(this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' })).toBeVisible();
        await expect(this.page.getByText('Opinia medyczna *')).toBeVisible();
        await expect(this.page.getByRole('textbox', { name: 'Szczegóły/uzasadnienie opinii' })).toBeVisible();
    }

    async selectOpinionValue(value: 'Zasadna' | 'Niezasadna' | 'Zasadna w części' | 'Brak możliwości wydania opinii'): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' });
        await dialog.getByRole('button', { name: 'dropdown trigger' }).click();
        await this.page.getByRole('option', { name: value, exact: true }).click();
    }

    async fillOpinionDetails(details: string): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' });
        await dialog.getByRole('textbox', { name: 'Szczegóły/uzasadnienie opinii' }).fill(details);
    }

    async saveOpinion(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' });
        await dialog.getByRole('button', { name: ' Zapisz opinię medyczną' }).click();
        await this.page.getByRole('button', { name: 'Tak', exact: true }).click();
    }

    async clickSaveOpinionButton(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' });
        await dialog.getByRole('button', { name: ' Zapisz opinię medyczną' }).click();
    }

    async assertSaveConfirmDialogContains(claimNumber: string): Promise<void> {
        const confirmDialog = this.page.getByRole('alertdialog', { name: 'Potwierdź' });
        await expect(confirmDialog).toBeVisible();
        await expect(confirmDialog).toContainText(`w sprawie ${claimNumber}`);
        await expect(confirmDialog).toContainText('Ta operacja jest nieodwracalna');
    }

    async cancelSaveConfirmDialog(): Promise<void> {
        await this.page.getByRole('alertdialog', { name: 'Potwierdź' })
            .getByRole('button', { name: 'Nie' }).click();
    }

    async closeIssueOpinionDialog(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' });
        await dialog.getByRole('button', { name: ' Zamknij', exact: true }).click();
    }

    async assertIssueOpinionDialogClosed(): Promise<void> {
        await expect(this.page.getByRole('dialog', { name: 'Wydanie opinii medycznej' })).toBeHidden();
    }

    /**
     * Pełny przepływ wydania opinii medycznej: otwiera dialog, wybiera wartość,
     * opcjonalnie wypełnia uzasadnienie i zapisuje z potwierdzeniem.
     */
    async issueOpinionViaDialog(
        value: 'Zasadna' | 'Niezasadna' | 'Zasadna w części' | 'Brak możliwości wydania opinii',
        details?: string
    ): Promise<void> {
        await this.clickIssueOpinion();
        await this.assertIssueOpinionDialogVisible();
        await this.selectOpinionValue(value);
        if (details) {
            await this.fillOpinionDetails(details);
        }
        await this.saveOpinion();
        await this.assertIssueOpinionDialogClosed();
    }

    async assertValidationRequiredError(): Promise<void> {
        await expect(this.page.getByText('Pole jest wymagane.')).toBeVisible();
    }

    async assertOperationalStatus(status: string): Promise<void> {
        await expect(this.page.getByText(status)).toBeVisible();
    }

    async assertCurrentOpinionValue(value: string): Promise<void> {
        // Wartość aktualnej opinii jest widoczna solo; w archiwum format to "data admin.auto - Wartość"
        await expect(this.page.getByText(value, { exact: true })).toBeVisible();
    }

    async assertArchivedOpinionExists(value: string): Promise<void> {
        // Wiersze archiwum mają format: "data admin.auto - Wartość"
        await expect(this.page.getByText(new RegExp(`- ${value}$`))).toBeVisible();
    }

    async assertNoArchivedOpinions(): Promise<void> {
        await expect(this.page.getByText(/- Zasadna$|Niezasadna$|Brak możliwości/)).not.toBeVisible();
    }
}
