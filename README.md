# SauceDemo Playwright Test Framework

A comprehensive test automation framework for [SauceDemo](https://www.saucedemo.com) using Playwright and TypeScript.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [User Types](#user-types)
- [Writing Tests](#writing-tests)
- [Debugging](#debugging)
- [Test Reports](#test-reports)
- [CI/CD Integration](#cicd-integration)
- [Common Issues](#common-issues)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✅ **Page Object Model** - Clean separation of test logic from page interactions
- ✅ **TypeScript** - Full type safety and better IDE support
- ✅ **Cross-browser testing** - Chrome, Firefox, and WebKit support
- ✅ **Multiple user types** - Tests for all 6 user types including problem users
- ✅ **Parallel execution** - Faster test runs with parallel test execution
- ✅ **Comprehensive reporting** - HTML, JSON, and list reporters
- ✅ **Environment configuration** - Easy switching between environments
- ✅ **Debugging tools** - Headed mode, debug mode, and Playwright Inspector
- ✅ **CI/CD ready** - Configured for continuous integration pipelines
- ✅ **Video recording** - Automatic video capture for failed tests
- ✅ **Screenshot capture** - Screenshots on test failure

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git (optional)

## Installation

### 1. Clone or create the project

```bash
# Create project directory
mkdir playwright-swag-labs
cd playwright-swag-labs

# Or clone from repository
git clone git@github.com:ShevaLabs/playwright-test-demo.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Verify installation

```bash
npm test
```

## Project Structure

```text
playwright-swag-labs/
├── config/
│   └── playwright.config.ts    # Playwright configuration
├── pages/                       # Page Object Models
│   ├── LoginPage.ts            # Login page interactions
│   ├── InventoryPage.ts        # Inventory/product page
│   ├── CartPage.ts             # Shopping cart page
│   └── CheckoutPage.ts         # Checkout flow pages
├── tests/                       # Test specifications
│   ├── login.spec.ts           # Login functionality tests
│   ├── login-user-types.spec.ts # Tests for all user types
│   ├── inventory.spec.ts       # Inventory/product tests
│   ├── inventory-user-specific.spec.ts # User-specific inventory tests
│   ├── cart.spec.ts            # Cart functionality tests
│   ├── cart-multi-user.spec.ts # Cart tests for multiple users
│   ├── checkout.spec.ts        # Checkout flow tests
│   ├── problem-user-specific.spec.ts # Problem user edge cases
│   ├── problem-user-checkout.spec.ts # Problem user checkout issues
│   ├── performance-comparison.spec.ts # Performance comparison tests
│   └── error-handling.spec.ts  # Error scenario tests
├── utils/
│   └── test-data.ts            # Test data and utilities
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── package.json                 # NPM dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Configuration

### Environment Variables

Create a .env file in the root directory:

```env
BASE_URL=https://www.saucedemo.com
```

### Playwright Configuration

The framework uses `config/playwright.config.ts` for Playwright settings:

```typescript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests in headless mode
npm test

# Run all tests in headed mode (with browser UI)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests with specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Generate and view test report
npm run report
```

### User-Specific Test Commands

```bash
# Run tests for specific user types
npm run test:standard      # Standard user tests
npm run test:problem       # Problem user tests
npm run test:performance   # Performance glitch user tests
npm run test:locked        # Locked out user tests

# Run all user type tests
npm run test:all-users

# Run inventory tests
npm run test:inventory

# Run cart tests
npm run test:cart
```

### Filtering Tests

```bash
# Run tests by title pattern
npx playwright test --grep "login"

# Run tests by file pattern
npx playwright test login

# Run tests with tags
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"

# Run tests in parallel (default: 4 workers)
npx playwright test --workers=2

# Run tests with retries
npx playwright test --retries=2
```

## Test Coverage

### Login Tests

- Valid login with all user types (standard, problem, performance, error, visual)

- Invalid login with wrong credentials

- Locked out user error handling

- Empty username/password validation

- Login page UI verification

### Inventory Tests

- Product listing display (6 items)

- Add/remove items to cart

- Sorting functionality (A-Z, Z-A, low-to-high, high-to-low)

- Product image validation

- Cart badge count verification

### Cart Tests

- Add multiple items to cart

- Remove items from cart

- Cart persistence across navigation

- Continue shopping functionality

- Cart page UI verification

### Checkout Tests

- Checkout information form

- Order summary verification

- Complete purchase flow

- Order confirmation message

- Cancel checkout functionality

### User-Specific Tests

- Standard User: Full functionality

- Locked Out User: Login error handling

- Problem User: Image issues, button text issues, checkout form limitations

- Performance Glitch User: Slow response handling

- Error User: Various error scenarios

- Visual User: Visual regression testing

### Edge Cases

- Empty cart handling

- Network errors

- Timeout handling

- Form validation

- Session management

## User Types

| User Type | Username | Password | Characteristics |
|-----------|----------|----------|-----------------|
| Standard User | standard_user | secret_sauce | Full functionality, no issues |
| Locked Out User | locked_out_user | secret_sauce | Cannot login, shows error |
| Problem User | problem_user | secret_sauce | Image issues, button issues, checkout problems |
| Performance Glitch User | performance_glitch_user | secret_sauce | Slow response times |
| Error User | error_user | secret_sauce | Various error scenarios |

## Known Issues by User Type

### Problem User Limitations

- ❌ Cannot remove items from inventory page

- ❌ Last name field in checkout doesn't accept input

- ❌ Cannot "Remove" item from cart page.

- ❌ Sorting may not work correctly

- ❌ Product images may be broken or duplicated

### Performance Glitch User

- ⚠️ Slow response times (2-5 seconds delay)

- ⚠️ Login takes significantly longer

- ⚠️ Page transitions are delayed

## Writing Tests

### Page Object Example

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Test Example

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, items } from '../utils/test-data';

test.describe('Inventory Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('should add item to cart', async () => {
    await inventoryPage.addItemToCart(items.backpack);
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });
});
```

### Data-Driven Tests

```typescript
const testUsers = [
  { name: 'Standard User', user: users.standard },
  { name: 'Problem User', user: users.problem }
];

for (const testUser of testUsers) {
  test(`Login test for ${testUser.name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser.user.username, testUser.user.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });
}
```

## Debugging

### Headed Mode

Run tests with visible browser UI:

```bash
npm run test:headed
```

### Debug Mode

Run tests with Playwright Inspector:

```bash
npm run test:debug
```

### VSCode Debugging

Create .vscode/launch.json:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "name": "Debug Playwright Tests",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--headed"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Console Logging

```typescript
test('test with logging', async ({ page }) => {
  console.log('Starting test...');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  console.log('Navigated to login page');
});
```

### Screenshots and Videos

Tests automatically capture:

- Screenshots on failure

- Video recordings on failure

- Trace files for debugging

View traces:

```bash
npx playwright show-trace trace.zip
```

## Test Reports

### Generate HTML Report

```bash
npm run report
```

### Report Locations

- HTML Report: `playwright-report/index.html`

- JSON Report: `test-results.json`

- Test Artifacts: `test-results/`

### View Reports in CI

Reports are automatically generated and can be published as artifacts.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Report') {
            steps {
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report'
                ])
            }
        }
    }
}
```

## Contributing

Fork the repository

- Create a feature branch (git checkout -b feature/amazing-feature)

- Commit changes (git commit -m 'Add amazing feature')

- Push to branch (git push origin feature/amazing-feature)

- Open a Pull Request

## Code Style

- Use TypeScript strict mode

- Follow Page Object Model pattern

- Write descriptive test names

- Add comments for complex logic

- Use meaningful variable names

## License

MIT License - feel free to use this framework for your testing needs.

## Support

For issues, questions, or contributions:

- Check the [Playwright Documentation](https://playwright.dev/)

- Review existing [GitHub Issues](https://github.com/microsoft/playwright/issues)

- Contact the maintainers

## Acknowledgments

[Playwright](https://playwright.dev/) - Testing framework

[SauceDemo](https://www.saucedemo.com/) - Demo application

[TypeScript](https://www.typescriptlang.org/) - Type safety

---

### Happy Testing! 🚀

