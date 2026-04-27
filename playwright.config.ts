import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Załaduj zmienne środowiskowe z pliku .env
dotenv.config();

/**
 * Konfiguracja Playwright dla testów E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './e2e/tests',

    /* Uruchom testy równolegle */
    fullyParallel: true,

    /* Niepowodzenie CI jeśli przypadkowo zostawiono test.only */
    forbidOnly: !!process.env.CI,

    /* Liczba powtórzeń w CI */
    retries: process.env.CI ? 2 : 0,

    /* Ilość równoległych workerów */
    workers: process.env.CI ? 1 : undefined,

    /* Reporter */
    reporter: [
        ['html'],
        ['list'],
        ['junit', { outputFile: 'test-results/junit.xml' }]
    ],

    /* Wspólne ustawienia dla wszystkich projektów */
    use: {
        /* URL bazowy dla navigation */
        baseURL: process.env.BASE_URL || 'http://localhost:3000',

        /* Tryb headless - false = widoczne okno przeglądarki */
        headless: process.env.HEADLESS === 'true',

        /* Zbieraj trace przy pierwszym retry testu */
        trace: 'on-first-retry',

        /* Screenshot tylko przy niepowodzeniu */
        screenshot: 'only-on-failure',

        /* Timeout dla akcji */
        actionTimeout: 10000,

        /* Timeout dla nawigacji */
        navigationTimeout: 30000,
    },

    /* Konfiguracja różnych projektów/przeglądarek */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* Testy mobilne */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },
    ],

    /* Uruchom lokalny serwer deweloperski przed testami (opcjonalnie) */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
