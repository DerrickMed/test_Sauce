

export class SelectorBuilder {
  static test(selector: string): string {
    return `[data-test="${selector}"]`;
  }
}

export class TestHelper {
  static calculateExpectedTotal(prices: string[]): { subtotal: string; total: string } {
    const subtotal = prices.reduce((sum, price) => {
      return sum + parseFloat(price.replace('$', ''));
    }, 0);
    
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    return {
      subtotal: `$${subtotal.toFixed(2)}`,
      total: `$${total.toFixed(2)}`
    };
  }
}