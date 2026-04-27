import { expect, type Locator, type Page } from '@playwright/test';

import type {
    ClaimRegistrationScenarioData,
    MedicalServiceData,
    RegistrationStepData,
    RelatedCaseData,
    TempPolicyClientData,
    TemporaryPolicyData,
} from '../helpers/ClaimRegistrationFactory';
import { BasePage } from './BasePage';

export class ClaimRegistrationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async openClaimRegistrationSearch(): Promise<void> {
        await this.page.getByRole('button', { name: 'Szkody' }).click();
        await this.page.getByRole('link', { name: 'Zgłoś szkodę' }).click();
        await this.assertURL(/report-damage-search/);
    }

    async searchClientByPesel(pesel: string): Promise<void> {
        await this.page.getByRole('textbox', { name: 'PESEL/REGON' }).fill(pesel);
        await this.page.getByRole('button', { name: 'Szukaj' }).click();
    }

    async addPrivateClient(client: TempPolicyClientData): Promise<void> {
        await this.page.getByRole('button', { name: 'Dodaj klienta' }).click();

        const addClientDialog = this.page.getByRole('dialog', { name: 'Dodaj klienta' });
        await this.assertVisible(addClientDialog);
        await this.assertVisible(addClientDialog.getByRole('combobox', { name: 'Osoba fizyczna' }));

        await addClientDialog.getByRole('textbox', { name: 'PESEL *' }).fill(client.pesel);
        await addClientDialog.getByRole('textbox', { name: 'Nazwisko *' }).fill(client.lastName);
        await addClientDialog.getByRole('textbox', { name: 'Imię *' }).fill(client.firstName);
        await addClientDialog.getByRole('button', { name: 'Zapisz' }).click();

        await this.assertHidden(addClientDialog);
    }

    async assertClientSearchResult(clientName: string, pesel: string): Promise<Locator> {
        const clientRow = this.page.getByRole('row', { name: new RegExp(pesel) });
        await this.assertVisible(clientRow);
        await this.assertVisible(clientRow.getByText(clientName));
        return clientRow;
    }

    async startClaimFromFirstAvailablePolicy(clientName: string): Promise<void> {
        const clientRow = this.page.getByRole('row', { name: new RegExp(clientName) });
        await this.assertVisible(clientRow);
        await clientRow.getByRole('button').filter({ hasText: /^$/ }).click();
        await this.page.getByRole('button', { name: 'Zgłoś szkodę' }).first().click();
        await this.assertURL(/registration/);
    }

    async startClaimFromTemporaryPolicy(
        client: TempPolicyClientData,
        temporaryPolicy: TemporaryPolicyData,
    ): Promise<void> {
        const clientRow = await this.assertClientSearchResult(`${client.firstName} ${client.lastName}`, client.pesel);
        await clientRow.getByRole('button', { name: 'Zgłoś z polisy tymczasowej' }).click();

        const temporaryPolicyDialog = this.page.getByRole('dialog', {
            name: 'Podaj niezbędne dane do utworzenia polisy tymczasowej',
        });
        await this.assertVisible(temporaryPolicyDialog);

        await this.selectPrimeOption(temporaryPolicyDialog, 'Linia produktowa', temporaryPolicy.lineOfProduct);

        if (temporaryPolicy.product) {
            await this.selectPrimeOption(temporaryPolicyDialog, 'Produkt', temporaryPolicy.product);
        } else {
            await this.selectFirstPrimeOption(temporaryPolicyDialog, 'Produkt');
        }

        await this.selectPrimeOption(temporaryPolicyDialog, 'Rodzaj polisy tymczasowej', temporaryPolicy.policyKind);

        if (temporaryPolicy.insurer) {
            await this.selectPrimeOption(temporaryPolicyDialog, 'Inny ubezpieczyciel', temporaryPolicy.insurer);
        } else {
            await this.selectFirstPrimeOption(temporaryPolicyDialog, 'Inny ubezpieczyciel');
        }

        await temporaryPolicyDialog.getByRole('button', { name: 'Zgłoś szkodę' }).click();
        await this.assertURL(/registration/);
    }

    async completeRegistrationStep(step: RegistrationStepData): Promise<void> {
        await this.assertURL(/registration/);
        await this.selectPrimeOption(this.page, 'Typ zgłoszenia', step.submissionType);
        await this.selectPrimeOption(this.page, 'Typ zgłaszającego', step.reporterType);
        await this.selectPrimeOption(this.page, 'Kanał zgłoszenia', step.channel);
        await this.selectPrimeOption(this.page, 'Zgoda na korespondencję', step.consent);

        await this.fillIfProvided('Nr telefonu', step.phone);
        await this.fillIfProvided('Adres e-mail', step.email);
        await this.fillIfProvided('Ulica', step.street);
        await this.fillIfProvided('Nr budynku', step.buildingNumber);
        await this.fillIfProvided('Kod pocztowy', step.postalCode);
        await this.fillIfProvided('Miejscowość', step.city);

        await this.page
            .locator('span')
            .filter({ hasText: 'Data zgłoszenia *' })
            .getByRole('button', { name: 'Wybierz datę' })
            .click();
        await this.selectCalendarDay(step.submissionDay);
        await this.page.getByRole('button', { name: 'Dalej' }).click();
        await this.assertURL(/incident/);
    }

    async completeEventStep(step: ClaimRegistrationScenarioData['eventStep']): Promise<void> {
        await this.assertURL(/incident/);
        await this.selectPrimeOption(this.page, 'Przyczyna zdarzenia', step.cause);
        await this.selectPrimeOption(this.page, 'Ochrona', step.protection);

        await this.page.getByRole('button', { name: 'Wybierz datę' }).click();
        await this.selectCalendarDay(step.eventDay);

        await this.addMedicalService(step.medicalService);
        await this.page.getByRole('button', { name: 'Dalej' }).click();
        await this.assertURL(/damage-configurator\/damage/);
    }

    async completeDamageStep(bankAccount: string): Promise<void> {
        await this.assertURL(/damage-configurator\/damage/);
        await this.page.getByRole('textbox', { name: 'Nr rachunku bankowego' }).fill(bankAccount);
        await this.page.getByRole('button', { name: 'Dalej' }).click();
        await this.assertURL(/related-damages/);
    }

    async completeRelatedDamagesStep(relatedCase: RelatedCaseData): Promise<void> {
        await this.assertURL(/related-damages/);
        await this.page.getByRole('button', { name: 'Dodaj powiązaną sprawę obcą' }).click();
        await this.page.getByRole('textbox', { name: 'Numer referencyjny sprawy' }).fill(relatedCase.referenceNumber);
        await this.selectPrimeOption(this.page, 'Typ sprawy obcej', relatedCase.caseType);
        await this.page.getByRole('textbox', { name: 'Uwagi' }).fill(relatedCase.notes);
        await this.page.getByRole('button', { name: 'Zatwierdź' }).click();
        await this.page.getByRole('button', { name: 'Dalej' }).click();
        await this.assertURL(/register-damage/);
    }

    async completeQuestionnaireAndSkipAttachments(answer: string): Promise<void> {
        await this.assertURL(/register-damage/);

        const questionnaireTriggers = this.page.getByRole('button', { name: 'dropdown trigger' });
        const triggerCount = await questionnaireTriggers.count();
        for (let index = 0; index < triggerCount; index++) {
            await questionnaireTriggers.nth(index).click();
            await this.page.getByRole('option', { name: answer, exact: true }).click();
        }

        await this.page.getByRole('button', { name: 'Zapisz i przejdź do dodawania dokumentów' }).click();
        await this.assertURL(/attachment-documents/);
        await this.page.getByRole('button', { name: 'Pomiń' }).click();
    }

    async assertClaimCreated(): Promise<void> {
        await this.assertURL(/damage-details/);
        await this.assertVisible(this.page.getByText(/Nr szkody:/));
    }

    private async addMedicalService(service: MedicalServiceData): Promise<void> {
        await this.page.getByRole('button', { name: 'Dodaj pozycję' }).click();

        const dialog = this.page.getByRole('dialog', { name: 'Dodaj usługę medyczną' });
        let scope: Page | Locator = this.page;
        if (await dialog.count()) {
            try {
                await dialog.waitFor({ state: 'visible', timeout: 2000 });
                scope = dialog;
            } catch {
                scope = this.page;
            }
        }

        if (service.serviceName) {
            await this.selectPrimeOption(scope, 'Nazwa usługi', service.serviceName);
        } else {
            service.serviceName = await this.selectFirstPrimeOption(scope, 'Nazwa usługi');
        }

        await scope.getByRole('spinbutton', { name: 'Kwota z faktury' }).fill(service.invoiceAmount);
        await scope.getByRole('textbox', { name: 'Numer faktury *' }).fill(service.invoiceNumber);
        await scope.getByRole('textbox', { name: 'Nazwa placówki' }).fill(service.facilityName);
        await this.selectPrimeOption(scope, 'Powód skorzystania', service.reason);

        const accidentDescription = scope.getByRole('textbox', { name: /Opis okoliczności wypadku/ });
        if (service.accidentDescription && await accidentDescription.count()) {
            await accidentDescription.fill(service.accidentDescription);
        }

        await scope.getByRole('button', { name: 'Zapisz' }).click();
        await this.assertVisible(this.page.getByRole('cell', { name: new RegExp(this.escapeRegExp(service.serviceName)) }));
    }

    private async getPrimeSelectField(scope: Page | Locator, labelText: string): Promise<Locator> {
        const byPlaceholder = scope.locator(`p-select[placeholder="${labelText}"]`);
        if (await byPlaceholder.count()) {
            return byPlaceholder.first();
        }

        return scope.locator('p-select').filter({ hasText: labelText }).first();
    }

    private async selectPrimeOption(scope: Page | Locator, labelText: string, optionText: string): Promise<void> {
        const field = await this.getPrimeSelectField(scope, labelText);
        await field.getByRole('button', { name: 'dropdown trigger' }).click();
        await this.page.getByRole('option', { name: optionText, exact: true }).click();
    }

    private async selectFirstPrimeOption(scope: Page | Locator, labelText: string): Promise<string> {
        const field = await this.getPrimeSelectField(scope, labelText);
        await field.getByRole('button', { name: 'dropdown trigger' }).click();

        const options = this.page.getByRole('option');
        const optionCount = await options.count();
        for (let index = 0; index < optionCount; index++) {
            const option = options.nth(index);
            const optionText = (await option.textContent())?.trim();
            if (!optionText || optionText.endsWith(':')) {
                continue;
            }

            await expect(option).toBeVisible();
            await option.click();
            return optionText;
        }

        throw new Error(`Brak dostępnej opcji dla pola: ${labelText}`);
    }

    private async selectCalendarDay(day: string): Promise<void> {
        await this.page.getByText(day, { exact: true }).first().click();
    }

    private async fillIfProvided(fieldName: string, value?: string): Promise<void> {
        if (!value) {
            return;
        }

        await this.page.getByRole('textbox', { name: fieldName }).fill(value);
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}