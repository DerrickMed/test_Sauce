import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SelectorBuilder } from '../utils/TestHelper';

export class SuccessPage extends BasePage {
  private selectors = {
    completeHeaderCss: '.complete-header'
  } as const;

  constructor(page: Page) {
    super(page);
  }

  async assertCompleteHeader(expectedHeader: string): Promise<void> {
    await this.assertTextContent(this.selectors.completeHeaderCss, expectedHeader);
  }
}