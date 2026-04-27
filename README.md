# Projekt Testów E2E - Playwright + TypeScript

Projekt automatycznych testów akceptacyjnych wykorzystujący Playwright i TypeScript.

## 📁 Struktura Projektu

```
MCP/
├── e2e/
│   ├── fixtures/          # Fixture'y testowe (Page Objects, kontekst)
│   │   └── pageFixtures.ts
│   ├── helpers/           # Klasy pomocnicze i factory
│   │   ├── UserFactory.ts
│   │   └── ClaimFactory.ts
│   ├── pages/             # Page Objects (wzorzec Page Object)
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   └── ClaimReportPage.ts
│   └── tests/             # Specyfikacje testów
│       ├── login.spec.ts
│       └── claim-report.spec.ts
├── playwright.config.ts   # Konfiguracja Playwright
├── tsconfig.json         # Konfiguracja TypeScript
├── package.json
└── README.md
```

## 🚀 Instalacja

```powershell
# Instalacja zależności
npm install

# Instalacja przeglądarek Playwright
npx playwright install
```

## ▶️ Uruchamianie Testów

```powershell
# Uruchomienie wszystkich testów
npm test

# Uruchomienie testów w trybie headed (widoczne okno przeglądarki)
npm run test:headed

# Uruchomienie testów w trybie UI (interaktywny interfejs)
npm run test:ui

# Uruchomienie testów w trybie debugowania
npm run test:debug

# Uruchomienie konkretnego pliku testowego
npx playwright test e2e/tests/login.spec.ts

# Uruchomienie testów z określonym tagiem
npm run test:tag "@SLS_CLAIM_REPORT"

# Wyświetlenie raportu z ostatniego uruchomienia
npm run test:report
```

## 🏷️ Konwencje Tagowania (SLS)

Testy wykorzystują system tagów dla łatwego filtrowania i zarządzania:

- **@SLS** - globalny tag dla wszystkich testów SLS
- **@SLS_CLAIM_REPORT** - tag dla domeny zgłaszania szkód
- **@SLS_LOGIN** - tag dla domeny logowania
- **@SLS_CLAIM_REPORT_X.Y** - numeracja scenariuszy (np. @SLS_CLAIM_REPORT_2.1)

### Reguły numeracji:
- W tym samym pliku spec: 1.1, 1.2, 1.3...
- W kolejnym pliku spec: 2.1, 2.2, 2.3...

### Przykład użycia tagów:

```typescript
test('Pomyślne zgłoszenie szkody', 
  { tag: ['@SLS', '@SLS_CLAIM_REPORT', '@SLS_CLAIM_REPORT_2.1'] }, 
  async ({ claimReportPage }) => {
    // test implementation
  }
);
```

## 📝 Wzorzec Page Object

Projekt wykorzystuje wzorzec Page Object dla lepszej organizacji i reużywalności kodu:

### BasePage
Klasa bazowa zawierająca wspólne metody dla wszystkich Page Objects:
- Nawigacja
- Akcje UI (click, fill, etc.)
- Asercje (assertVisible, assertText, etc.)
- Oczekiwania (waitForElement, waitForURL, etc.)

### Konkretne Page Objects
Dziedziczą po BasePage i implementują specyficzne selektory i metody dla danej strony:
- `LoginPage` - strona logowania
- `ClaimReportPage` - strona zgłaszania szkody

## 🔧 Fixtures

Fixtures udostępniają gotowe instancje Page Objects w testach:

```typescript
import { test, expect } from '../fixtures/pageFixtures';

test('Mój test', async ({ loginPage, claimReportPage }) => {
  // Page Objects są już gotowe do użycia
});
```

## 🏭 Factories (Dane Testowe)

Factories generują dane testowe w sposób spójny i reużywalny:

### UserFactory
```typescript
UserFactory.validUser()           // Prawidłowy użytkownik
UserFactory.invalidEmailUser()    // Nieprawidłowy email
UserFactory.randomUser()          // Losowy użytkownik
```

### ClaimFactory
```typescript
ClaimFactory.basicClaim()         // Podstawowe zgłoszenie
ClaimFactory.minimalClaim()       // Minimalne dane
ClaimFactory.randomClaim()        // Losowe zgłoszenie
```

## 🎯 Dobre Praktyki

1. **Selektory**: Preferuj role-based selectors i test IDs zamiast CSS selectors
2. **Izolacja**: Każdy test powinien być niezależny i deterministyczny
3. **Uwierzytelnianie**: Preferuj uwierzytelnienie w beforeEach dla testów wymagających logowania
4. **Dane testowe**: Używaj factories zamiast twardych wartości
5. **Asercje**: Używaj metod z BasePage dla spójności
6. **Tagi**: Zawsze dodawaj odpowiednie tagi SLS do testów

## 🌍 Zmienne Środowiskowe

Utwórz plik `.env` w głównym katalogu (opcjonalnie):

```env
BASE_URL=http://localhost:3000
# Dodaj inne zmienne środowiskowe tutaj
```

## 📊 Raporty

Po uruchomieniu testów dostępne są raporty:
- HTML report: `npm run test:report`
- JUnit XML: `test-results/junit.xml`

## 🐛 Debugowanie

```powershell
# Tryb debugowania z Playwright Inspector
npm run test:debug

# Uruchomienie konkretnego testu w trybie debug
npx playwright test e2e/tests/login.spec.ts --debug
```

## 📚 Dokumentacja

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Page Object Pattern](https://playwright.dev/docs/pom)

## ✅ Checklist przed commitowaniem

- [ ] Wszystkie testy przechodzą lokalnie
- [ ] Dodano odpowiednie tagi SLS
- [ ] Użyto Page Objects zamiast bezpośrednich selektorów w testach
- [ ] Dane testowe wygenerowane przez factories
- [ ] Tytuły testów w języku polskim (bez tagów w tytule)
- [ ] Kod sformatowany i bez błędów TypeScript
