export interface UserCredentials {
  username: string;
  password: string;
}

export interface Product {
  name: string;
  price: string;
  description: string;
  addToCartSelector: string;
  removeFromCartSelector: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}
