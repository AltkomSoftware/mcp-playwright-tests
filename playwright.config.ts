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

    /* Uruchamiaj testy sekwencyjnie */
    fullyParallel: false,

    /* Niepowodzenie CI jeśli przypadkowo zostawiono test.only */
    forbidOnly: !!process.env.CI,

    /* Liczba powtórzeń w CI */
    retries: process.env.CI ? 2 : 0,

    /* Ilość workerów - 1 wymusza wykonanie sekwencyjne */
    workers: 1,

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

        /* Maksymalizacja okna przeglądarki */
        viewport: null,
        launchOptions: {
            args: ['--start-maximized'],
        },

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
            use: {
                ...devices['Desktop Chrome'],
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: { args: ['--start-maximized'] },
            },
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: { args: ['--start-maximized'] },
            },
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: null,
                deviceScaleFactor: undefined,
                launchOptions: { args: ['--start-maximized'] },
            },
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
