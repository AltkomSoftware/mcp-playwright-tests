/**
 * Helper do obsługi czekania i timeout'ów
 */
export class WaitHelper {
    /**
     * Czekanie z retry logic
     */
    static async waitWithRetry<T>(
        fn: () => Promise<T>,
        maxRetries: number = 3,
        delayMs: number = 1000
    ): Promise<T> {
        let lastError: Error;

        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error as Error;
                if (i < maxRetries - 1) {
                    await this.delay(delayMs);
                }
            }
        }

        throw lastError!;
    }

    /**
     * Opóźnienie (używać tylko w wyjątkowych przypadkach)
     */
    static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Oczekiwanie na warunek z timeout'em
     */
    static async waitForCondition(
        condition: () => Promise<boolean>,
        timeoutMs: number = 5000,
        pollIntervalMs: number = 100
    ): Promise<void> {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            if (await condition()) {
                return;
            }
            await this.delay(pollIntervalMs);
        }

        throw new Error(`Timeout waiting for condition after ${timeoutMs}ms`);
    }
}
