export interface TempPolicyClientData {
    firstName: string;
    lastName: string;
    pesel: string;
}

export interface TemporaryPolicyData {
    lineOfProduct: string;
    product?: string;
    policyKind: string;
    insurer?: string;
}

export interface RegistrationStepData {
    submissionType: string;
    submissionDay: string;
    reporterType: string;
    channel: string;
    consent: string;
    phone?: string;
    email?: string;
    street?: string;
    buildingNumber?: string;
    postalCode?: string;
    city?: string;
}

export interface MedicalServiceData {
    serviceName?: string;
    invoiceAmount: string;
    invoiceNumber: string;
    facilityName: string;
    reason: string;
    accidentDescription?: string;
}

export interface EventStepData {
    cause: string;
    protection: string;
    eventDay: string;
    medicalService: MedicalServiceData;
}

export interface RelatedCaseData {
    referenceNumber: string;
    caseType: string;
    notes: string;
}

export interface ClaimRegistrationScenarioData {
    search: {
        pesel: string;
        clientName: string;
    };
    registrationStep: RegistrationStepData;
    eventStep: EventStepData;
    damageStep: {
        bankAccount: string;
    };
    relatedCase: RelatedCaseData;
    questionnaire: {
        answer: string;
    };
    temporaryPolicy?: TemporaryPolicyData;
}

function buildPesel(year: number, month: number, day: number, serial: number): string {
    const yearPart = String(year % 100).padStart(2, '0');
    const monthOffset = year >= 2000 && year < 2100 ? 20 : 0;
    const monthPart = String(month + monthOffset).padStart(2, '0');
    const dayPart = String(day).padStart(2, '0');
    const serialPart = String(serial).padStart(3, '0');
    const base = `${yearPart}${monthPart}${dayPart}${serialPart}1`;
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = base
        .split('')
        .slice(0, 10)
        .reduce((value, digit, index) => value + Number(digit) * weights[index], 0);
    const checksum = (10 - (sum % 10)) % 10;

    return `${base}${checksum}`;
}

export class ClaimRegistrationFactory {
    static standardHealthClaim(): ClaimRegistrationScenarioData {
        return {
            search: {
                pesel: '88082704076',
                clientName: 'Anna Nowak',
            },
            registrationStep: {
                submissionType: 'Refundacja',
                submissionDay: '27',
                reporterType: 'Ubezpieczony',
                channel: 'E-mail',
                consent: 'Tak',
            },
            eventStep: {
                cause: 'Zgodnie z usługą medyczną',
                protection: 'Refundacja cennikowa',
                eventDay: '20',
                medicalService: {
                    serviceName: 'Wizyta domowa - internisty on-call (dzień)',
                    invoiceAmount: '150',
                    invoiceNumber: 'FV/2026/001',
                    facilityName: 'Centrum Medyczne Warszawa',
                    reason: 'Uraz',
                    accidentDescription: 'Uraz podczas aktywności fizycznej',
                },
            },
            damageStep: {
                bankAccount: '12345678901234567890123456',
            },
            relatedCase: {
                referenceNumber: 'REF/2026/001',
                caseType: 'reklamacja',
                notes: 'Uwagi do sprawy obcej',
            },
            questionnaire: {
                answer: 'Tak',
            },
        };
    }

    static createTempPolicyClientData(): TempPolicyClientData {
        const serial = 100 + Math.floor(Math.random() * 899);

        return {
            firstName: 'Klient',
            lastName: 'Testowy',
            pesel: buildPesel(1994, 4, 27, serial),
        };
    }

    static tempPolicyHealthClaim(
        client: TempPolicyClientData,
        currentDay: string,
    ): ClaimRegistrationScenarioData {
        return {
            search: {
                pesel: client.pesel,
                clientName: `${client.firstName} ${client.lastName}`,
            },
            temporaryPolicy: {
                lineOfProduct: 'ZDROWIE',
                policyKind: 'Obca',
            },
            registrationStep: {
                submissionType: 'Refundacja',
                submissionDay: currentDay,
                reporterType: 'Ubezpieczony',
                channel: 'E-mail',
                consent: 'Tak',
                phone: '500600700',
                email: 'temp.policy@example.com',
                street: 'Testowa',
                buildingNumber: '10',
                postalCode: '00-001',
                city: 'Warszawa',
            },
            eventStep: {
                cause: 'Zgodnie z usługą medyczną',
                protection: 'Refundacja cennikowa',
                eventDay: currentDay,
                medicalService: {
                    invoiceAmount: '150',
                    invoiceNumber: 'FV/2026/001',
                    facilityName: 'Centrum Medyczne Warszawa',
                    reason: 'Uraz',
                    accidentDescription: 'Opis zdarzenia testowego dla polisy tymczasowej',
                },
            },
            damageStep: {
                bankAccount: '12345678901234567890123456',
            },
            relatedCase: {
                referenceNumber: 'REF/TMP/2026/001',
                caseType: 'reklamacja',
                notes: 'Powiązana sprawa obca dla polisy tymczasowej',
            },
            questionnaire: {
                answer: 'Tak',
            },
        };
    }
}