import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo } from '../types';
import { SelectorBuilder } from '../utils/TestHelper';

export class CheckoutPage extends BasePage {
  private selectors = {
    firstName: 'firstName',
    lastName: 'lastName',
    postalCode: 'postalCode',
    continue: 'continue',
    finish: 'finish',
    subtotalLabel: 'subtotal-label',
    totalLabel: 'total-label',
    itemQuantity: 'item-quantity',
    inventoryItem: 'inventory-item',
    inventoryItemName: 'inventory-item-name',
    inventoryItemPrice: 'inventory-item-price'
  } as const;

  constructor(page: Page) {
    super(page);
  }

  async fillCustomerInfo(customerInfo: CustomerInfo): Promise<void> {
    await this.fill(SelectorBuilder.test(this.selectors.firstName), customerInfo.firstName);
    await this.fill(SelectorBuilder.test(this.selectors.lastName), customerInfo.lastName);
    await this.fill(SelectorBuilder.test(this.selectors.postalCode), customerInfo.postalCode);
  }

  async clickContinueButton(): Promise<void> {
    await this.click(SelectorBuilder.test(this.selectors.continue));
  }

  async clickFinishButton(): Promise<void> {
    await this.click(SelectorBuilder.test(this.selectors.finish));
  }

  async getSubtotal(): Promise<string> {
    return await this.getText(SelectorBuilder.test(this.selectors.subtotalLabel));
  }

  async getTotal(): Promise<string> {
    return await this.getText(SelectorBuilder.test(this.selectors.totalLabel));
  }

  async assertSubtotal(expectedSubtotal: string): Promise<void> {
    const actualSubtotal = await this.getSubtotal();
    expect(actualSubtotal).toContain(expectedSubtotal);
  }

  async assertTotal(expectedTotal: string): Promise<void> {
    const actualTotal = await this.getTotal();
    expect(actualTotal).toContain(expectedTotal);
  }

  async getOrderItems(): Promise<Array<{ name: string; quantity: number; price: string }>> {
    const items: Array<{ name: string; quantity: number; price: string }> = [];
    const cartItems = this.getElement(SelectorBuilder.test(this.selectors.inventoryItem));
    
    for (let i = 0; i < await cartItems.count(); i++) {
      const item = cartItems.nth(i);
      const name = await item.locator(SelectorBuilder.test(this.selectors.inventoryItemName)).textContent() || '';
      const quantityText = await item.locator(SelectorBuilder.test(this.selectors.itemQuantity)).textContent() || '0';
      const price = await item.locator(SelectorBuilder.test(this.selectors.inventoryItemPrice)).textContent() || '';
      
      items.push({
        name,
        quantity: parseInt(quantityText),
        price
      });
    }
    
    return items;
  }

  async assertOrderItems(expectedItems: string[]): Promise<void> {
    const actualItems = await this.getOrderItems();
    const actualItemNames = actualItems.map(item => item.name);
    expect(actualItemNames).toEqual(expectedItems);
  }


}