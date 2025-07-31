import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { urls } from '../data/testData';
import { UserCredentials } from '../types';
import { SelectorBuilder } from '../utils/TestHelper';

export class LoginPage extends BasePage {
  private selectors = {
    username: 'username',
    password: 'password',
    loginButton: 'login-button'
  } as const;

  constructor(page: Page) {
    super(page);
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo(urls.login);
    await this.waitForPageLoad();
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.fill(SelectorBuilder.test(this.selectors.username), credentials.username);
    await this.fill(SelectorBuilder.test(this.selectors.password), credentials.password);
    await this.click(SelectorBuilder.test(this.selectors.loginButton));
  }

  async assertSuccessfulLogin(): Promise<void> {
    await this.page.waitForURL('**/inventory.html');
    await this.assertElementVisible(SelectorBuilder.test('inventory-container'));
  }
}