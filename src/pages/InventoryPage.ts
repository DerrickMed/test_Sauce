import { Page, expect, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelectorBuilder } from '../utils/TestHelper';
import { Product } from '../types';

export class InventoryPage extends BasePage {
  private selectors = {
    productSortContainer: 'product-sort-container',
    inventoryItemName: 'inventory-item-name',
    inventoryItemPrice: 'inventory-item-price',
    inventoryItem: 'inventory-item',
    shoppingCartBadge: '.shopping_cart_badge',
    shoppingCartLink: '.shopping_cart_link'
  } as const;

  private cachedProducts: Product[] | null = null;

  constructor(page: Page) {
    super(page);
  }

  async getCartBadgeCount(): Promise<number> {
    const badgeText = await this.getText(this.selectors.shoppingCartBadge);
    return badgeText ? parseInt(badgeText) : 0;
  }

  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCartBadgeCount();
    expect(actualCount).toBe(expectedCount);
  }

  async getAllProducts(): Promise<Product[]> {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }

    return await test.step('Getting all products from inventory', async () => {
      const products: Product[] = [];
      const productElements = this.getElement(SelectorBuilder.test(this.selectors.inventoryItem));
      
      for (let i = 0; i < await productElements.count(); i++) {
        const item = productElements.nth(i);
        const name = await item.locator(SelectorBuilder.test(this.selectors.inventoryItemName)).textContent() || '';
        const price = await item.locator(SelectorBuilder.test(this.selectors.inventoryItemPrice)).textContent() || '';
        const description = await item.locator('.inventory_item_desc').textContent() || '';
      
        let normalizedName = name.toLowerCase();
        if (name === "Test.allTheThings() T-Shirt (Red)") {
          normalizedName = "test.allthethings()-t-shirt-(red)";
        } else {
          normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        }
        const addToCartSelector = SelectorBuilder.test(`add-to-cart-${normalizedName}`);
        const removeFromCartSelector = SelectorBuilder.test(`remove-${normalizedName}`);
        
        products.push({
          name,
          price,
          description,
          addToCartSelector,
          removeFromCartSelector
        });
      }
      
      this.cachedProducts = products;
      return products;
    });
  }

  async addProductToCart(productName: string): Promise<void> {
    const products = await this.getAllProducts();
    const product = products.find(p => p.name === productName);
    if (!product) {
      throw new Error(`Product "${productName}" not found on the page`);
    }
    
    await this.click(product.addToCartSelector);
  }

  async addRandomProductsToCart(count: number): Promise<Product[]> {
    const allProducts = await this.getAllProducts();
    const selectedProducts: Product[] = [];
    const availableProducts = [...allProducts];
    
    for (let i = 0; i < count && availableProducts.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableProducts.length);
      const product = availableProducts.splice(randomIndex, 1)[0];
      
      await this.addProductToCart(product.name);
      selectedProducts.push(product);
      
      await this.page.waitForTimeout(500);
    }
    
    return selectedProducts;
  }

  async clickShoppingCart(): Promise<void> {
    await this.click(this.selectors.shoppingCartLink);
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.getElement(SelectorBuilder.test(this.selectors.productSortContainer)).selectOption(option);
    this.cachedProducts = null;
  }

  async getAllProductNames(): Promise<string[]> {
    const productElements = this.getElement(SelectorBuilder.test(this.selectors.inventoryItemName));
    const names: string[] = [];
    
    for (let i = 0; i < await productElements.count(); i++) {
      const name = await productElements.nth(i).textContent();
      if (name) {
        names.push(name);
      }
    }
    
    return names;
  }

  async assertProductsSorted(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    if (option === 'az' || option === 'za') {
      const productNames = await this.getAllProductNames();
      
      if (option === 'az') {
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
      } else if (option === 'za') {
        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
      }
    } else if (option === 'lohi' || option === 'hilo') {
      const products = await this.getAllProducts();
      const prices = products.map(p => parseFloat(p.price.replace('$', '')));
      
      if (option === 'lohi') {
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
      } else if (option === 'hilo') {
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
      }
    }
  }

  clearProductCache(): void {
    this.cachedProducts = null;
  }
}