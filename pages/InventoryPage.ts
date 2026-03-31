import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCart: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCart = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async addItemToCart(itemName: string) {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button').click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.inventoryItems.filter({ hasText: itemName });
    await item.locator('button', { hasText: 'Remove' }).click();
  }

  async getCartItemCount(): Promise<number> {
    // Check if cart badge element exists
    const badgeCount = await this.cartBadge.count();
    
    if (badgeCount === 0) {
      return 0;
    }
    
    const countText = await this.cartBadge.textContent();
    const count = countText ? parseInt(countText) : 0;
    
    // Ensure valid number is returned
    return isNaN(count) ? 0 : count;
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    const value = {
      'az': 'az',
      'za': 'za',
      'lohi': 'lohi',
      'hilo': 'hilo'
    }[option];
    await this.sortDropdown.selectOption(value);
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async goToCart() {
    await this.shoppingCart.click();
  }

  async isRemoveButtonVisible(itemName: string): Promise<boolean> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    const removeButton = item.locator('button', { hasText: 'Remove' });
    return await removeButton.isVisible().catch(() => false);
  }

  async getButtonText(itemName: string): Promise<string> {
    const item = this.inventoryItems.filter({ hasText: itemName });
    const button = item.locator('button');
    return await button.textContent() || '';
  }
}