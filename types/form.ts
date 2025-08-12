// types/form.ts

export interface CartItem {
  itemId: string;
  itemName: string;
  category: string;
  image: string;
  quantity: number;
  selectedSize: string;
  price: number;
}

export interface TracksuitOrderData {
  name: string;
  email: string;
  whatsapp: string;
  deliveryAddress: string;
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  paymentId?: string;
  referralCode?: string;
}

export interface PayPalPaymentData {
  paymentID: string;
  // add more fields if needed
}
