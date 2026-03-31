import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItems.all();
    if (items.length === 0) {
      return [];
    }
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(itemName: string) {
    const item = this.cartItems.filter({ hasText: itemName });
    await item.locator('button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getCartItemCount(): Promise<number> {
    // Return the number of items in cart
    return await this.cartItems.count();
  }
}