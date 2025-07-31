const TEST_USER = process.env.TEST_USER || 'standard_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'secret_sauce';

export const testData = {
  validUsers: [
    {
      username: TEST_USER,
      password: TEST_PASSWORD
    },
    {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  ],
  customerInfo: {
    firstName: 'Test',
    lastName: 'User',
    postalCode: '12345'
  }
};

export const urls = {
  login: `/`,
  inventory: `inventory.html`,
  cart: `/cart.html`,
  checkout: `/checkout-step-one.html`,
  checkoutOverview: `/checkout-step-two.html`,
  success: `/checkout-complete.html`
};