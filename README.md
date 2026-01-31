# Swift Translator - Automated Testing Suite

## 📋 Project Overview

This project contains an automated end-to-end testing suite for the [Swift Translator](https://www.swifttranslator.com/) web application using Playwright. The application translates Singlish (romanized Sinhala) text to Sinhala Unicode characters.

**Student ID:** IT23195516  
**Assignment:** ITPM Assignment 01

## 🎯 Test Coverage

The test suite includes **45 test cases** covering:

### ✅ Positive Test Cases (35 tests)

Testing expected functionality across multiple scenarios:

- **Daily Conversations** (13 tests): Greetings, questions, commands, feelings
- **Grammar & Robustness** (9 tests): Past/present/future tenses, negations, repetitions
- **Data & Numeric** (7 tests): Technology terms, locations, dates, measurements
- **Complex Scenarios** (5 tests): Long paragraphs, mixed data, multi-sentence translations
- **UI Testing** (1 test): User interface validation

### ❌ Negative Test Cases (10 tests)

Testing known limitations and edge cases (expected to fail):

- Email username preservation
- Password special character handling
- Capital letter edge cases
- Country name preservation
- Common English word preservation
- SQL code preservation
- Temperature unit preservation
- Utility term handling
- Code syntax preservation
- URL parameter preservation

## 🏗️ Project Structure

```
IT23195516_Assignment01_ITPM-main/
├── tests/
│   └── example.spec.ts          # Main test suite (45 test cases)
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies
├── test-results/                 # Test execution results
├── playwright-report/            # HTML test reports
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   cd IT23195516_Assignment01_ITPM-main
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Specific Test Groups

```bash
# Run only positive tests
npx playwright test --grep "Pos_Fun"

# Run only negative tests
npx playwright test --grep "Neg_Fun"

# Run only UI tests
npx playwright test --grep "Pos_UI"
```

### Run Tests on Specific Browsers

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit
```

## 📊 Test Results

After running tests, view results:

### HTML Report

```bash
npx playwright show-report
```

### View Test Results

- Results are saved in `test-results/` directory
- HTML report is generated in `playwright-report/` directory

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

Key settings:

- **Browsers:** Chromium, Firefox, WebKit
- **Timeout:** 60 seconds per test
- **Retries:** 0 (disabled for clean pass/fail results)
- **Workers:** Parallel execution (configurable)
- **Reporter:** HTML report generation

### Test Strategy

The test suite uses a custom wait mechanism to handle:

- Slow translation API responses
- Network delays
- Dynamic content loading

## 📈 Expected Test Results

When running the complete test suite (135 total executions = 45 tests × 3 browsers):

✅ **Passing Tests:** 105 (35 positive tests across 3 browsers)  
❌ **Failing Tests:** 30 (10 negative tests across 3 browsers - expected behavior)

### Why Negative Tests Fail

Negative tests are **designed to fail** to document known limitations of the Swift Translator:

- The translator converts email usernames to Sinhala (should preserve English)
- Password values get transliterated (should remain as-is)
- SQL code keywords are partially translated (should preserve entirely)
- URLs are partially translated (should preserve entirely)
- etc.

These failures serve as documentation of areas for potential improvement.

## 🐛 Known Issues

### Intermittent Test Failures

Some tests may occasionally fail due to:

- **Network timeouts:** The external website (swifttranslator.com) can be slow
- **Translation delays:** Some translations take longer than expected
- **Server load:** The website performance varies

**Solution:** Re-run failed tests - they should pass on retry if it was a network issue.

### Flaky Tests

Most commonly affected tests:

- Long text translations (Pos_Fun_0034)
- Tests running on slower browsers (WebKit)
- Tests during high network latency

## 📝 Test Case Naming Convention

Format: `[Type]_[Category]_[Number]: [Description]`

- **Type:** `Pos` (Positive) or `Neg` (Negative)
- **Category:** `Fun` (Functional) or `UI` (User Interface)
- **Number:** 4-digit sequential number (e.g., 0001, 0002)
- **Description:** Brief test case description

**Examples:**

- `Pos_Fun_0001: Interrogative - Health check`
- `Neg_Fun_0001: Privacy/Robustness - Email Handling`
- `Pos_UI_0001: Activity - Dancing at home`

## 🔍 Test Implementation Details

### Custom Helper Function

`fillAndWaitForTranslation()` handles:

- Input field clearing and filling
- Waiting for translation processing (up to 30 seconds)
- Polling for output content with retry logic
- Stable content verification

### Browser Support

Tests run on:

- **Chromium** (Google Chrome, Edge)
- **Firefox** (Mozilla Firefox)
- **WebKit** (Safari)

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Swift Translator Website](https://www.swifttranslator.com/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

This is an academic assignment project. For any issues or improvements:

1. Document the issue in `IT23195516_Assignment01.xlsx`
2. Update test cases in `tests/example.spec.ts`
3. Update this README with any changes

## 📄 License

This project is created for educational purposes as part of ITPM coursework.

## 👨‍💻 Author

**Student ID:** IT23195516  
**Course:** ITPM (IT Project Management)  
**Assignment:** Assignment 01 - Automated Testing

---

**Last Updated:** January 31, 2026
