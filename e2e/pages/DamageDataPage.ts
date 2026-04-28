import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DamageDataPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToDamageData(damageId: number): Promise<void> {
        await this.page.goto(`/damage/damage-details/${damageId}/damage-data`);
        await this.assertURL(/damage-data/);
        await this.assertVisible(this.page.getByRole('button', { name: 'Edycja szkody' }));
    }

    async clickDamageDataTab(): Promise<void> {
        await this.page.getByRole('tab', { name: 'Dane szkody' }).click();
        await this.assertURL(/damage-data/);
        await this.assertVisible(this.page.getByRole('button', { name: 'Edycja szkody' }));
    }

    async assertPriorityDisplayed(priority: string): Promise<void> {
        // Find a row that contains both the 'Priorytet:' label and the expected priority value
        const priorityRow = this.page.locator('div').filter({
            has: this.page.getByText('Priorytet:', { exact: true }),
        }).filter({
            has: this.page.getByText(priority, { exact: true }),
        });
        await expect(priorityRow.first()).toBeVisible();
    }

    async clickEditDamage(): Promise<void> {
        await this.page.getByRole('button', { name: 'Edycja szkody' }).click();
        await this.assertVisible(this.page.getByRole('dialog', { name: 'Edycja danych szkody' }));
    }

    async assertEditDialogPriorityFieldVisible(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Edycja danych szkody' });
        await this.assertVisible(dialog.getByText('Priorytet:', { exact: true }));
        await this.assertVisible(dialog.getByRole('button', { name: 'dropdown trigger' }));
    }

    async assertEditDialogPriorityOptions(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Edycja danych szkody' });
        await dialog.getByRole('button', { name: 'dropdown trigger' }).click();
        await this.assertVisible(this.page.getByRole('option', { name: 'Zwykła', exact: true }));
        await this.assertVisible(this.page.getByRole('option', { name: 'VIP', exact: true }));
        await this.page.keyboard.press('Escape');
    }

    async selectPriorityInDialog(priority: 'Zwykła' | 'VIP'): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Edycja danych szkody' });
        await dialog.getByRole('button', { name: 'dropdown trigger' }).click();
        await this.page.getByRole('option', { name: priority, exact: true }).click();
    }

    async saveEditDialog(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Edycja danych szkody' });
        await dialog.getByRole('button', { name: 'Zapisz' }).click();
        await expect(dialog).toBeHidden({ timeout: 15000 });
    }

    async closeEditDialog(): Promise<void> {
        const dialog = this.page.getByRole('dialog', { name: 'Edycja danych szkody' });
        await dialog.getByRole('button', { name: 'Zamknij' }).last().click();
        await expect(dialog).toBeHidden();
    }

    async changePriorityViaDialog(priority: 'Zwykła' | 'VIP'): Promise<void> {
        await this.clickEditDamage();
        await this.selectPriorityInDialog(priority);
        await this.saveEditDialog();
    }
}
