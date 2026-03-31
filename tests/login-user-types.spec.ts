import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, UserType, getUser } from '../utils/test-data';

test.describe('Login Tests - All User Types', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test.describe('Valid User Logins', () => {
    const validUsers = [
      { type: UserType.STANDARD, name: 'Standard User' },
      { type: UserType.PROBLEM, name: 'Problem User' },
      { type: UserType.PERFORMANCE_GLITCH, name: 'Performance Glitch User' },
      { type: UserType.ERROR, name: 'Error User' },
      { type: UserType.VISUAL, name: 'Visual User' }
    ];

    for (const user of validUsers) {
      test(`should login successfully with ${user.name}`, async ({ page }) => {
        const userCreds = getUser(user.type);
        
        await loginPage.login(userCreds.username, userCreds.password);
        
        // Verify successful login
        await expect(page).toHaveURL(/.*inventory.html/);
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
        
        // Verify page elements are visible
        await expect(inventoryPage.shoppingCart).toBeVisible();
        await expect(inventoryPage.sortDropdown).toBeVisible();
      });
    }
  });

  test.describe('Locked Out User', () => {
    test('should show locked out error message', async () => {
      const lockedOutUser = getUser(UserType.LOCKED_OUT);
      
      await loginPage.login(lockedOutUser.username, lockedOutUser.password);
      
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain('locked out');
      
      const errorType = await loginPage.getErrorMessageType();
      expect(errorType).toBe('locked_out');
      
      // Verify still on login page
      expect(await loginPage.isLoginPageVisible()).toBe(true);
    });
  });
});