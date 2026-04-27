/**
 * Factory dla danych testowych użytkownika
 */
export class UserFactory {
    /**
     * Generuje prawidłowego użytkownika testowego
     */
    static validUser() {
        return {
            email: 'test.user@example.com',
            password: 'ValidPassword123!',
        };
    }

    /**
     * Generuje użytkownika z nieprawidłowym emailem
     */
    static invalidEmailUser() {
        return {
            email: 'invalid-email',
            password: 'ValidPassword123!',
        };
    }

    /**
     * Generuje użytkownika z nieprawidłowym hasłem
     */
    static invalidPasswordUser() {
        return {
            email: 'test.user@example.com',
            password: 'short',
        };
    }

    /**
     * Generuje losowego użytkownika
     */
    static randomUser() {
        const timestamp = Date.now();
        return {
            email: `user.${timestamp}@example.com`,
            password: `Password${timestamp}!`,
        };
    }
}
