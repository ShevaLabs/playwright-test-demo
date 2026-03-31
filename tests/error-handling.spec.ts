import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../utils/test-data';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Error Handling Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should handle locked out user gracefully', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
    
    // Verify retry login is possible
    await loginPage.clearCredentials();
    await loginPage.login(users.standard.username, users.standard.password);
    
    // Should successfully login
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
  });

  test('should handle problem user image loading issues', async ({ page }) => {
    await loginPage.login(users.problem.username, users.problem.password);
    
    // Verify page loaded (even if images may have issues)
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Check for image issues
    const images = await page.locator('.inventory_item_img img').all();
    let brokenImages = 0;
    
    for (const image of images) {
      const src = await image.getAttribute('src');
      if (!src || src.includes('404') || src.includes('sl-404')) {
        brokenImages++;
      }
    }
    
    console.log(`Problem user has ${brokenImages} broken images out of ${images.length}`);
    
    // Even with image issues, page functionality should work
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });
});