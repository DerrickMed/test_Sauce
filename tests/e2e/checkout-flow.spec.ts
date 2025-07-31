import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { SuccessPage } from '../../src/pages/SuccessPage';
import { SelectorBuilder } from '../../src/utils/TestHelper';
import { testData } from '../../src/data/testData';
import { TestHelper } from '../../src/utils/TestHelper';
import { Product } from '../../src/types';

let loginPage: LoginPage;
let inventoryPage: InventoryPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;
let successPage: SuccessPage;
let selectedProducts: Product[];

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  cartPage = new CartPage(page);
  checkoutPage = new CheckoutPage(page);
  successPage = new SuccessPage(page);
});

test('Complete checkout flow with 3 random items', async ({ page }) => {
  const startTime = Date.now();

  await test.step('Login and add items to cart', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(testData.validUsers[0]);
    await loginPage.assertSuccessfulLogin();
    
    selectedProducts = await inventoryPage.addRandomProductsToCart(3);
    await inventoryPage.assertCartBadgeCount(3);
  });

  await test.step('Complete checkout process', async () => {
    await inventoryPage.clickShoppingCart();
    await cartPage.assertCartItemCount(3);
    await cartPage.clickCheckoutButton();
    
    const customerInfo = testData.customerInfo;
    await checkoutPage.fillCustomerInfo(customerInfo);
    await expect(page.locator(SelectorBuilder.test('firstName'))).toHaveValue(customerInfo.firstName);
    await expect(page.locator(SelectorBuilder.test('lastName'))).toHaveValue(customerInfo.lastName);
    await expect(page.locator(SelectorBuilder.test('postalCode'))).toHaveValue(customerInfo.postalCode);
    
    await checkoutPage.clickContinueButton();
    
    const selectedProductNames = selectedProducts.map(p => p.name);
    await checkoutPage.assertOrderItems(selectedProductNames);
    
    const selectedProductPrices = selectedProducts.map(p => p.price);
    const expectedTotals = TestHelper.calculateExpectedTotal(selectedProductPrices);
    await checkoutPage.assertSubtotal(expectedTotals.subtotal);
    await checkoutPage.assertTotal(expectedTotals.total);
    
    await checkoutPage.clickFinishButton();
    await successPage.assertCompleteHeader('Thank you for your order!');
  });

  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`Checkout flow completed successfully in ${duration}ms`);
  console.log(`Selected products: ${selectedProducts.map(p => p.name).join(', ')}`);
});

test('Cart functionality with add and remove items', async ({ page }) => {
  await test.step('Add items to cart', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(testData.validUsers[0]);

    const allProducts = await inventoryPage.getAllProducts();
    const firstProduct = allProducts[0];
    const secondProduct = allProducts[1];

    await inventoryPage.addProductToCart(firstProduct.name);
    await inventoryPage.addProductToCart(secondProduct.name);
    await inventoryPage.assertCartBadgeCount(2);
  });

  await test.step('Remove items from cart', async () => {
    await inventoryPage.clickShoppingCart();
    await cartPage.assertCartItemCount(2);
    
    const allProducts = await inventoryPage.getAllProducts();
    const firstProduct = allProducts[0];
    const secondProduct = allProducts[1];
    
    await cartPage.removeItemFromCart(firstProduct.name);
    await cartPage.assertCartItemCount(1);
    
    await cartPage.removeItemFromCart(secondProduct.name);
    await cartPage.assertCartItemCount(0);
  });
});

test('Cart persistence after logout and login', async ({ page }) => {
  await test.step('Add items and logout', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(testData.validUsers[0]);
    await loginPage.assertSuccessfulLogin();

    const allProducts = await inventoryPage.getAllProducts();
    const firstProduct = allProducts[0];
    const secondProduct = allProducts[1];

    await inventoryPage.addProductToCart(firstProduct.name);
    await inventoryPage.addProductToCart(secondProduct.name);
    await inventoryPage.assertCartBadgeCount(2);
    
    await page.goto('/');
  });

  await test.step('Verify cart persists after logout and login', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(testData.validUsers[0]);
    await loginPage.assertSuccessfulLogin();
    
    await inventoryPage.assertCartBadgeCount(2);
  });
});

test('Product sorting functionality', async ({ page }) => {
  await test.step('Test product sorting', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(testData.validUsers[0]);
    await loginPage.assertSuccessfulLogin();

    await inventoryPage.sortProducts('az');
    await inventoryPage.assertProductsSorted('az');
    
    await inventoryPage.sortProducts('za');
    await inventoryPage.assertProductsSorted('za');
    
    await inventoryPage.sortProducts('lohi');
    await inventoryPage.assertProductsSorted('lohi');
    
    await inventoryPage.sortProducts('hilo');
    await inventoryPage.assertProductsSorted('hilo');
  });
}); 