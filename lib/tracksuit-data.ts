import { CartItem as FormCartItem } from '@/types/form';

export interface TracksuitItem {
  id: string;
  name: string;
  category: 'kids' | 'ladies' | 'mens';
  image: string;
  description: string;
  price: number;
  sizes: string[];
}

// Generate tracksuit products with correct image paths
const generateTracksuitProducts = (): TracksuitItem[] => {
  const products: TracksuitItem[] = [];
  
  // Kids Tracksuits (Kid1.png to Kid34.png)
  for (let i = 1; i <= 34; i++) {
    products.push({
      id: `kids-${i}`,
      name: `Kids Tracksuit ${i}`,
      category: 'kids',
      image: `Kids/Kid${i}.png`,
      description: `High-quality kids tracksuit #${i}. Comfortable, stylish, and perfect for active children. Made with breathable, durable fabric.`,
      price: 10,
      sizes: ['XS', 'S', 'M', 'L']
    });
  }
  
  // Ladies Tracksuits (G1.png to G14.png, then G20.png to G46.png - excluding G15-G19)
  for (let i = 1; i <= 14; i++) {
    products.push({
      id: `ladies-${i}`,
      name: `Ladies Tracksuit ${i}`,
      category: 'ladies',
      image: `Ladies/G${i}.png`,
      description: `Elegant ladies tracksuit #${i}. Designed for comfort and style. Perfect for sports, casual wear, and fitness activities.`,
      price: 10,
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    });
  }
  
  // Ladies Tracksuits G20-G46 (continuing after G14, skipping G15-G19)
  for (let i = 20; i <= 46; i++) {
    products.push({
      id: `ladies-${i}`,
      name: `Ladies Tracksuit ${i}`,
      category: 'ladies',
      image: `Ladies/G${i}.png`,
      description: `Elegant ladies tracksuit #${i}. Designed for comfort and style. Perfect for sports, casual wear, and fitness activities.`,
      price: 10,
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    });
  }
  
  // Men's Tracksuits (M1.png to M36.png)
  for (let i = 1; i <= 36; i++) {
    products.push({
      id: `mens-${i}`,
      name: `Men's Tracksuit ${i}`,
      category: 'mens',
      image: `Mens/M${i}.png`,
      description: `Professional men's tracksuit #${i}. Durable, comfortable, and stylish. Ideal for sports, gym, and casual wear.`,
      price: 10,
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    });
  }
  
  return products;
};

// Tracksuit products data
export const tracksuitProducts: TracksuitItem[] = generateTracksuitProducts();

// Helper functions
export const getProductsByCategory = (category: 'kids' | 'ladies' | 'mens') => {
  return tracksuitProducts.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return tracksuitProducts.find(product => product.id === id);
};

export const calculateTotalPrice = (cartItems: FormCartItem[]) => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getTotalQuantity = (cartItems: FormCartItem[]) => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// Minimum order requirements
export const MIN_ORDER_QUANTITY = 3;
export const MIN_ORDER_AMOUNT = 30; // $10 * 3 items 
