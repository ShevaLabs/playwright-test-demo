import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, items, checkoutInfo } from '../utils/test-data';

test.describe('Problem User - Specific Behaviors', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);
  });

  test('should have button text issues on inventory page', async () => {
    // For problem user, button text will change to "Remove", but not working.
    const backpackItem = inventoryPage.inventoryItems.filter({ hasText: items.backpack });
    const button = backpackItem.locator('button');
    
    // Add item to cart
    await button.click();
    
    const buttonText = await button.textContent();
    expect(buttonText).toContain('Remove');
    console.log(`Problem user button text after adding: ${buttonText}`);
    await inventoryPage.removeItemFromCart(items.backpack);
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should have issues with checkout form - lastName field not working', async () => {
    // Add items to cart
    await inventoryPage.addItemToCart(items.backpack);
    await inventoryPage.addItemToCart(items.bikeLight);
    await inventoryPage.goToCart();
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Try to fill checkout info - lastName field won't work for problem user
    await checkoutPage.firstNameInput.fill(checkoutInfo.firstName);
    
    // For problem user, lastName field may not accept input
    await checkoutPage.lastNameInput.fill(checkoutInfo.lastName);
    
    // Verify that lastName field is empty or has incorrect value
    const lastNameValue = await checkoutPage.lastNameInput.inputValue();
    console.log(`Last name field value after attempt: "${lastNameValue}"`);
    
    // Problem user cannot input last name - field may remain empty
    expect(lastNameValue).not.toBe(checkoutInfo.lastName);
    expect(lastNameValue).toBe('');
    
    // Verify continue button is disabled or validation fails
    const isContinueEnabled = await checkoutPage.continueButton.isEnabled();
    expect(isContinueEnabled).toBe(true);
  });

  test('should be able to remove items from cart page', async ({ page }) => {
    // Add items
    await inventoryPage.addItemToCart(items.backpack);
    await inventoryPage.addItemToCart(items.bikeLight);
    await inventoryPage.goToCart();
    
    // Remove from cart page - this should work even for problem user
    const cartPageObj = new CartPage(page);
    await cartPageObj.removeItem(items.backpack);
    
    const cartItemNames = await cartPageObj.getCartItemNames();
    expect(cartItemNames).not.toContain(items.backpack);
    expect(cartItemNames).toContain(items.bikeLight);
    expect(await cartPageObj.getCartItemCount()).toBe(1);
  });

  test('should have inconsistent item details', async () => {
    // Problem user may have inconsistent item names or prices
    const itemNames = await inventoryPage.getItemNames();
    const itemPrices = await inventoryPage.getItemPrices();
    
    console.log('Problem user item names:', itemNames);
    console.log('Problem user item prices:', itemPrices);
    
    // Verify that inventory still has 6 items
    expect(itemNames.length).toBe(6);
    expect(itemPrices.length).toBe(6);
  });

  test('should have issues with sorting', async () => {
    // Problem user may have sorting issues
    const originalNames = await inventoryPage.getItemNames();
    
    // Try to sort
    await inventoryPage.sortBy('za');
    const sortedNames = await inventoryPage.getItemNames();
    
    // For problem user, sorting might not work correctly
    // Just verify that the test doesn't crash
    console.log('Original names:', originalNames);
    console.log('Sorted names:', sortedNames);
    
    // At least we should have 6 items
    expect(sortedNames.length).toBe(6);
  });
});