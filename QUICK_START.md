# Szybki Przewodnik - Uruchamianie Testów

## Podstawowe komendy

```powershell
# Wszystkie testy
npm test

# Testy w trybie headed (widoczne okno)
npm run test:headed

# Interaktywny UI
npm run test:ui

# Raport z ostatniego uruchomienia
npm run test:report
```

## Uruchamianie testów z tagami

```powershell
# Wszystkie testy SLS
npx playwright test --grep "@SLS"

# Tylko testy logowania
npx playwright test --grep "@SLS_LOGIN"

# Tylko testy zgłaszania szkód
npx playwright test --grep "@SLS_CLAIM_REPORT"

# Konkretny scenariusz
npx playwright test --grep "@SLS_CLAIM_REPORT_2.1"

# Wykluczenie testów z określonym tagiem
npx playwright test --grep-invert "@SLS_LOGIN"
```

## Uruchamianie konkretnych plików

```powershell
# Tylko testy logowania
npx playwright test e2e/tests/login.spec.ts

# Tylko testy zgłaszania szkód
npx playwright test e2e/tests/claim-report.spec.ts

# Konkretny test po nazwie
npx playwright test -g "Poprawne logowanie"
```

## Uruchamianie na konkretnej przeglądarce

```powershell
# Tylko Chromium
npx playwright test --project=chromium

# Tylko Firefox
npx playwright test --project=firefox

# Tylko WebKit
npx playwright test --project=webkit
```

## Debugowanie

```powershell
# Tryb debug z Playwright Inspector
npm run test:debug

# Debug konkretnego testu
npx playwright test e2e/tests/login.spec.ts --debug

# Debug z konkretnym tagiem
npx playwright test --grep "@SLS_CLAIM_REPORT_2.1" --debug
```

## Konfiguracja środowiska

```powershell
# Ustaw BASE_URL przed uruchomieniem
$env:BASE_URL="https://test.example.com"; npm test

# Tryb CI (z retry)
$env:CI="true"; npm test
```

## Przydatne opcje

```powershell
# Headed mode z wolniejszym wykonaniem
npx playwright test --headed --slow-mo=1000

# Tylko niepowodzenia z ostatniego uruchomienia
npx playwright test --last-failed

# Maksymalnie 5 workerów równoległych
npx playwright test --workers=5

# Trace dla wszystkich testów
npx playwright test --trace=on

# Screenshot dla wszystkich testów
npx playwright test --screenshot=on
```

## Przykłady użycia

```powershell
# Scenariusz 1: Uruchom wszystkie testy claim report na Chromium w trybie headed
npx playwright test --grep "@SLS_CLAIM_REPORT" --project=chromium --headed

# Scenariusz 2: Debug konkretnego testu z trace
npx playwright test --grep "@SLS_LOGIN_1.1" --debug --trace=on

# Scenariusz 3: Uruchom testy na środowisku testowym
$env:BASE_URL="https://test.example.com"; npx playwright test

# Scenariusz 4: Tylko testy login bez WebKit
npx playwright test --grep "@SLS_LOGIN" --project=chromium --project=firefox
```
