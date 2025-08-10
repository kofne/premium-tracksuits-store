import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sendContactNotification, sendOrderNotification } from './email';
import { TracksuitOrderData, ReferralData, OrderData, CartItem } from '@/types/form';
import { MIN_ORDER_QUANTITY, MIN_ORDER_AMOUNT } from './tracksuit-data';

// Types for our data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface OrderFormData {
  name: string;
  email: string;
  whatsapp: string;
  deliveryAddress: string;
  cartItems: CartItem[];
  totalPrice: number;
  totalQuantity: number;
  paymentId?: string;
  referralCode?: string;
  referredBy?: string;
}

// Validation functions
function validateContactData(data: ContactFormData): void {
  if (!data.name?.trim()) throw new Error('Name is required');
  if (!data.email?.trim()) throw new Error('Email is required');
  if (!data.message?.trim()) throw new Error('Message is required');
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) throw new Error('Invalid email format');
}

function validateOrderData(data: OrderFormData): void {
  if (!data.name?.trim()) throw new Error('Name is required');
  if (!data.email?.trim()) throw new Error('Email is required');
  if (!data.whatsapp?.trim()) throw new Error('WhatsApp number is required');
  if (!data.deliveryAddress?.trim()) throw new Error('Delivery address is required');
  if (!Array.isArray(data.cartItems) || data.cartItems.length === 0) {
    throw new Error('At least one item must be selected');
  }
  if (data.totalQuantity < MIN_ORDER_QUANTITY) {
    throw new Error(`Minimum order quantity is ${MIN_ORDER_QUANTITY} items`);
  }
  if (data.totalPrice < MIN_ORDER_AMOUNT) {
    throw new Error(`Minimum order amount is $${MIN_ORDER_AMOUNT}`);
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) throw new Error('Invalid email format');
}

/**
 * Save contact form submission to Firestore
 * @param contactData - The contact form data
 * @returns Promise with the document ID of the saved contact
 */
export async function saveContactForm(contactData: ContactFormData) {
  try {
    // Validate input data
    validateContactData(contactData);
    
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...contactData,
      name: contactData.name.trim(),
      email: contactData.email.trim().toLowerCase(),
      message: contactData.message.trim(),
      createdAt: serverTimestamp(),
    });
    
    console.log('Contact form saved with ID:', docRef.id);
    
    // Send email notification (fire and forget)
    try {
      await sendContactNotification(contactData);
      console.log('Contact notification email sent');
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Don't fail the form submission if email fails
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact form:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save contact form: ${error.message}`);
    }
    throw new Error('Failed to save contact form');
  }
}

/**
 * Save tracksuit order data to Firestore after successful payment
 * @param orderData - The order data including customer info and cart items
 * @returns Promise with the document ID of the saved order
 */
export async function saveTracksuitOrder(orderData: OrderFormData) {
  try {
    // Validate input data
    validateOrderData(orderData);
    
    // Prepare order data, only including referral fields if they have values
    const orderDoc: any = {
      name: orderData.name.trim(),
      email: orderData.email.trim().toLowerCase(),
      whatsapp: orderData.whatsapp.trim(),
      deliveryAddress: orderData.deliveryAddress.trim(),
      cartItems: orderData.cartItems,
      totalPrice: orderData.totalPrice,
      totalQuantity: orderData.totalQuantity,
      paymentId: orderData.paymentId,
      status: 'paid',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add referral fields if they have values
    if (orderData.referralCode) {
      orderDoc.referralCode = orderData.referralCode;
    }
    if (orderData.referredBy) {
      orderDoc.referredBy = orderData.referredBy;
    }
    
    const docRef = await addDoc(collection(db, 'tracksuit_orders'), orderDoc);
    
    console.log('Tracksuit order saved with ID:', docRef.id);
    
    // Handle referral if present
    if (orderData.referralCode) {
      await handleReferral(orderData.referralCode, orderData.email, docRef.id);
    }
    
    // Send email notification (fire and forget)
    try {
      await sendTracksuitOrderNotification(orderData);
      console.log('Tracksuit order notification email sent');
    } catch (emailError) {
      console.error('Failed to send tracksuit order notification email:', emailError);
      // Don't fail the order submission if email fails
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving tracksuit order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save tracksuit order: ${error.message}`);
    }
    throw new Error('Failed to save tracksuit order');
  }
}

/**
 * Handle referral tracking and earnings
 * @param referralCode - The referral code used
 * @param customerEmail - The email of the customer who used the referral
 * @param orderId - The order ID of the completed order
 */
async function handleReferral(referralCode: string, customerEmail: string, orderId: string) {
  try {
    // Find the referral document
    const referralQuery = query(
      collection(db, 'referrals'),
      where('referralCode', '==', referralCode)
    );
    
    const referralSnapshot = await getDocs(referralQuery);
    
    if (!referralSnapshot.empty) {
      const referralDoc = referralSnapshot.docs[0];
      const referralData = referralDoc.data() as ReferralData;
      
      // Update referral data
      const updatedReferredCustomers = [...referralData.referredCustomers, customerEmail];
      const updatedCompletedOrders = [...referralData.completedOrders, orderId];
      const updatedTotalEarnings = referralData.totalEarnings + 100; // $100 per referral
      
      await updateDoc(doc(db, 'referrals', referralDoc.id), {
        referredCustomers: updatedReferredCustomers,
        completedOrders: updatedCompletedOrders,
        totalEarnings: updatedTotalEarnings,
        updatedAt: serverTimestamp(),
      });
      
      console.log(`Referral processed: ${referralCode} earned $100`);
    }
  } catch (error) {
    console.error('Error handling referral:', error);
    // Don't fail the order if referral handling fails
  }
}

/**
 * Create a new referral code for a customer
 * @param referrerEmail - The email of the person creating the referral
 * @param referrerName - The name of the person creating the referral
 * @returns Promise with the generated referral code
 */
export async function createReferralCode(referrerEmail: string, referrerName: string) {
  try {
    // Generate a unique referral code
    const referralCode = generateReferralCode();
    
    const docRef = await addDoc(collection(db, 'referrals'), {
      referralCode,
      referrerEmail: referrerEmail.trim().toLowerCase(),
      referrerName: referrerName.trim(),
      referredCustomers: [],
      completedOrders: [],
      totalEarnings: 0,
      createdAt: serverTimestamp(),
    });
    
    console.log('Referral code created:', referralCode);
    return { success: true, referralCode, id: docRef.id };
  } catch (error) {
    console.error('Error creating referral code:', error);
    throw new Error('Failed to create referral code');
  }
}

/**
 * Generate a unique referral code
 * @returns A unique 8-character referral code
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get all tracksuit orders for admin dashboard
 * @returns Promise with array of order data
 */
export async function getAllTracksuitOrders(): Promise<OrderData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'tracksuit_orders'));
    const orders: OrderData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        customerName: data.name,
        customerEmail: data.email,
        customerWhatsapp: data.whatsapp,
        deliveryAddress: data.deliveryAddress,
        cartItems: data.cartItems,
        totalPrice: data.totalPrice,
        totalQuantity: data.totalQuantity,
        paymentId: data.paymentId,
        referralCode: data.referralCode,
        referredBy: data.referredBy,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching tracksuit orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

/**
 * Get all referrals for admin dashboard
 * @returns Promise with array of referral data
 */
export async function getAllReferrals(): Promise<ReferralData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'referrals'));
    const referrals: ReferralData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      referrals.push({
        referralCode: data.referralCode,
        referrerEmail: data.referrerEmail,
        referrerName: data.referrerName,
        referredCustomers: data.referredCustomers,
        completedOrders: data.completedOrders,
        totalEarnings: data.totalEarnings,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    
    return referrals.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error fetching referrals:', error);
    throw new Error('Failed to fetch referrals');
  }
}

/**
 * Save order data to Firestore after successful payment (legacy function)
 * @param orderData - The order data including customer info and selected items
 * @returns Promise with the document ID of the saved order
 */
export async function saveOrderAfterPayment(orderData: OrderFormData) {
  try {
    // Validate input data
    validateOrderData(orderData);
    
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      name: orderData.name.trim(),
      email: orderData.email.trim().toLowerCase(),
      whatsapp: orderData.whatsapp.trim(),
      deliveryAddress: orderData.deliveryAddress.trim(),
      cartItems: orderData.cartItems,
      totalPrice: orderData.totalPrice,
      totalQuantity: orderData.totalQuantity,
      paymentId: orderData.paymentId,
      referralCode: orderData.referralCode,
      referredBy: orderData.referredBy,
      status: 'paid',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Order saved with ID:', docRef.id);
    
    // Handle referral if present
    if (orderData.referralCode) {
      await handleReferral(orderData.referralCode, orderData.email, docRef.id);
    }
    
    // Send email notification (fire and forget)
    try {
      await sendTracksuitOrderNotification(orderData);
      console.log('Order notification email sent');
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order submission if email fails
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving order:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save order: ${error.message}`);
    }
    throw new Error('Failed to save order');
  }
}

/**
 * Placeholder function for payment success callback
 * This can be used in PayPal onApprove or other payment success handlers
 */
export function onPaymentSuccess(orderData: OrderFormData) {
  return saveTracksuitOrder(orderData);
} 