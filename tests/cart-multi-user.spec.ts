import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users, items } from '../utils/test-data';

test.describe('Cart Tests - Multiple User Types', () => {
  
  const testUsers = [
    { name: 'Standard User', user: users.standard },
    { name: 'Problem User', user: users.problem },
    { name: 'Performance Glitch User', user: users.performanceGlitch }
  ];

  for (const testUser of testUsers) {
    test.describe(`${testUser.name}`, () => {
      let loginPage: LoginPage;
      let inventoryPage: InventoryPage;
      let cartPage: CartPage;

      test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        
        await loginPage.goto();
        await loginPage.login(testUser.user.username, testUser.user.password);
      });

      test('should add and remove items from cart', async () => {
        // Add item to cart
        await inventoryPage.addItemToCart(items.backpack);
        let cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1);
        
        // Remove item from cart
        await inventoryPage.removeItemFromCart(items.backpack);
        cartCount = await inventoryPage.getCartItemCount();
        if(testUser.name === 'Problem User') {
          // Problem user may have issues with cart functionality, so we check if item is still in cart
          expect(cartCount).toBe(1);
        } else {
          expect(cartCount).toBe(0);
        }
      });

      test('should persist cart items across pages', async () => {
        await inventoryPage.addItemToCart(items.backpack);
        await inventoryPage.addItemToCart(items.bikeLight);
        
        await inventoryPage.goToCart();
        
        const cartItemNames = await cartPage.getCartItemNames();
        expect(cartItemNames).toContain(items.backpack);
        expect(cartItemNames).toContain(items.bikeLight);
        expect(await cartPage.getCartItemCount()).toBe(2);
      });
    });
  }
});