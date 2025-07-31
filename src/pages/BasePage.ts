import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  async click(selector: string): Promise<void> {
    await this.getElement(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.getElement(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    return await this.getElement(selector).textContent() || '';
  }

  async assertElementVisible(selector: string): Promise<void> {
    await expect(this.getElement(selector)).toBeVisible();
  }

  async assertTextContent(selector: string, expectedText: string): Promise<void> {
    await expect(this.getElement(selector)).toHaveText(expectedText);
  }
}