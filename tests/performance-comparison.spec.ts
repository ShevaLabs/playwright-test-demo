import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, UserType } from '../utils/test-data';

test.describe('Performance Comparison', () => {
  
  test('should compare login times between users', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    
    const usersToCompare = [
      { name: 'Standard', user: users.standard },
      { name: 'Performance Glitch', user: users.performanceGlitch }
    ];
    
    const results: Record<string, number> = {};
    
    for (const userToTest of usersToCompare) {
      await loginPage.goto();
      
      const startTime = Date.now();
      await loginPage.login(userToTest.user.username, userToTest.user.password);
      await inventoryPage.inventoryItems.first().waitFor({ state: 'visible', timeout: 10000 });
      const endTime = Date.now();
      
      results[userToTest.name] = endTime - startTime;
      
      // Cleanup - logout
      await inventoryPage.page.locator('#react-burger-menu-btn').click();
      await inventoryPage.page.locator('#logout_sidebar_link').click();
    }
    
    console.log('Login Performance Results:', results);
    
    // Performance glitch user should be slower than standard user
    expect(results['Performance Glitch']).toBeGreaterThan(results['Standard']);
  });
});