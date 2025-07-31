import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelectorBuilder } from '../utils/TestHelper';

export class CartPage extends BasePage {
  private selectors = {
    checkout: 'checkout',
    inventoryItem: 'inventory-item',
    inventoryItemName: 'inventory-item-name'
  } as const;

  constructor(page: Page) {
    super(page);
  }

  async clickCheckoutButton(): Promise<void> {
    await this.click(SelectorBuilder.test(this.selectors.checkout));
  }

  async getCartItemCount(): Promise<number> {
    const cartItems = this.getElement(SelectorBuilder.test(this.selectors.inventoryItem));
    return await cartItems.count();
  }

  async assertCartItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartItemCount();
    expect(actualCount).toBe(expectedCount);
  }

  async removeItemFromCart(productName: string): Promise<void> {
    const cartItems = this.getElement(SelectorBuilder.test(this.selectors.inventoryItem));
    
    for (let i = 0; i < await cartItems.count(); i++) {
      const item = cartItems.nth(i);
      const name = await item.locator(SelectorBuilder.test(this.selectors.inventoryItemName)).textContent();
      
      if (name === productName) {
        const normalizedName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const removeSelector = SelectorBuilder.test(`remove-${normalizedName}`);
        await this.click(removeSelector);
        return;
      }
    }
    
    throw new Error(`Product "${productName}" not found in cart`);
  }


}