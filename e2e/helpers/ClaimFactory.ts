/**
 * Factory dla danych zgłoszenia szkody
 */
export class ClaimFactory {
    /**
     * Generuje podstawowe zgłoszenie szkody
     */
    static basicClaim() {
        return {
            type: 'Uszkodzenie mienia',
            eventDate: '2026-04-20',
            description: 'Opis szkody - uszkodzenie w wyniku zdarzenia losowego.',
        };
    }

    /**
     * Generuje zgłoszenie z minimalną ilością danych
     */
    static minimalClaim() {
        return {
            type: 'Kradzież',
            eventDate: '2026-04-26',
            description: 'Krótki opis.',
        };
    }

    /**
     * Generuje zgłoszenie z długim opisem
     */
    static claimWithLongDescription() {
        const longDescription = 'To jest bardzo długi opis szkody. '.repeat(50);

        return {
            type: 'Uszkodzenie pojazdu',
            eventDate: '2026-04-15',
            description: longDescription,
        };
    }

    /**
     * Generuje zgłoszenie z przyszłą datą (nieprawidłowe)
     */
    static claimWithFutureDate() {
        return {
            type: 'Uszkodzenie mienia',
            eventDate: '2027-01-01',
            description: 'Opis szkody z przyszłą datą.',
        };
    }

    /**
     * Generuje losowe zgłoszenie szkody
     */
    static randomClaim() {
        const types = ['Uszkodzenie mienia', 'Kradzież', 'Uszkodzenie pojazdu', 'Pożar'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const timestamp = Date.now();

        return {
            type: randomType,
            eventDate: '2026-04-20',
            description: `Automatyczne zgłoszenie testowe ${timestamp}`,
        };
    }
}
