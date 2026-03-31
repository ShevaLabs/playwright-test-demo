import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;
  readonly robotImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginLogo = page.locator('.login_logo');
    this.robotImage = page.locator('.bot_column');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    const errorElement = this.errorMessage;
    const isVisible = await errorElement.isVisible().catch(() => false);
    
    if (!isVisible) {
      return '';
    }
    
    return await errorElement.textContent() || '';
  }

  async getErrorMessageType(): Promise<string> {
    const errorText = await this.getErrorMessage();
    
    if (errorText.includes('locked out')) {
      return 'locked_out';
    } else if (errorText.includes('Username and password do not match')) {
      return 'invalid_credentials';
    } else if (errorText.includes('Username is required')) {
      return 'username_required';
    } else if (errorText.includes('Password is required')) {
      return 'password_required';
    }
    
    return 'unknown';
  }

  async isLoginPageVisible(): Promise<boolean> {
    return await this.loginLogo.isVisible();
  }

  async clearCredentials() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}