import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, UserType, items } from '../utils/test-data';

test.describe('Inventory Tests - User Specific Behaviors', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.describe('Standard User', () => {
    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      await loginPage.goto();
      await loginPage.login(users.standard.username, users.standard.password);
    });

    test('should display all product images correctly', async () => {
      const images = await inventoryPage.page.locator('.inventory_item_img img').all();
      for (const image of images) {
        const src = await image.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).not.toContain('sl-404');
      }
    });

    test('should add multiple items to cart', async () => {
      await inventoryPage.addItemToCart(items.backpack);
      await inventoryPage.addItemToCart(items.bikeLight);
      await inventoryPage.addItemToCart(items.boltTShirt);
      
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    test('should add and remove items from cart', async () => {
      // Add item
      await inventoryPage.addItemToCart(items.backpack);
      let cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      // Remove item
      await inventoryPage.removeItemFromCart(items.backpack);
      cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(0);
    });
  });

  test.describe('Problem User', () => {
    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      await loginPage.goto();
      await loginPage.login(users.problem.username, users.problem.password);
    });

    test('should have image loading issues', async () => {
      // Problem user may experience image loading issues
      const images = await inventoryPage.page.locator('.inventory_item_img img').all();
      
      for (const image of images) {
        const src = await image.getAttribute('src');
        // Problem user's images may all be the same or incorrect
        console.log(`Image src: ${src}`);
      }
      
      // Verify that images might be broken or duplicated
      const firstImageSrc = await images[0].getAttribute('src');
      let allSame = true;
      for (const image of images) {
        const src = await image.getAttribute('src');
        if (src !== firstImageSrc) {
          allSame = false;
          break;
        }
      }
      
      if (allSame && images.length > 1) {
        console.log('Problem user has all identical images - this is expected behavior');
      }
    });

    test('should still be able to add items to cart', async () => {
      await inventoryPage.addItemToCart(items.backpack);
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    test('should NOT be able to remove items from inventory page', async () => {
      // Add item first
      await inventoryPage.addItemToCart(items.backpack);
      let cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      // Try to remove - for problem user, the button text doesn't change to "Remove"
      // So the removeItemFromCart method won't find the button with text "Remove"
      await inventoryPage.removeItemFromCart(items.backpack);
      cartCount = await inventoryPage.getCartItemCount();
      
      // Problem user cannot remove items from inventory page
      expect(cartCount).toBe(1);
    });

    test('should be able to remove items from cart page', async ({ page }) => {
      // Add items
      await inventoryPage.addItemToCart(items.backpack);
      await inventoryPage.addItemToCart(items.bikeLight);
      await inventoryPage.goToCart();
      
      // Remove from cart page - this should work even for problem user
      const cartPage = new (await import('../pages/CartPage')).CartPage(page);
      await cartPage.removeItem(items.backpack);
      
      const cartItemNames = await cartPage.getCartItemNames();
      expect(cartItemNames).not.toContain(items.backpack);
      expect(cartItemNames).toContain(items.bikeLight);
    });
  });

  test.describe('Performance Glitch User', () => {
    test('should handle slow responses', async ({ page }) => {
      loginPage = new LoginPage(page);
      inventoryPage = new InventoryPage(page);
      await loginPage.goto();
      
      // Set longer timeout for slow user
      const startTime = Date.now();
      await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);
      const endTime = Date.now();
      
      // Verify login success (slow but should succeed)
      await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
      
      // Log response time
      console.log(`Performance glitch user login took: ${endTime - startTime}ms`);
      
      // Verify page loaded
      await expect(inventoryPage.inventoryItems.first()).toBeVisible({ timeout: 10000 });
    });

    test('should eventually add and remove items', async () => {
      // Performance glitch user may have delays but should still work
      await inventoryPage.addItemToCart(items.backpack);
      let cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      // Wait a bit for the UI to update
      await inventoryPage.page.waitForTimeout(1000);
      
      await inventoryPage.removeItemFromCart(items.backpack);
      cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(0);
    });
  });
});