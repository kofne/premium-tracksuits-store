import admin from 'firebase-admin';

const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;

if (!privateKeyBase64) {
  throw new Error('Missing FIREBASE_PRIVATE_KEY_BASE64 in environment');
}

const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export default admin;

// Export Firestore and Auth instances
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

/**
 * Get all tracksuit orders using Firebase Admin (for admin dashboard)
 * @returns Promise with array of order data
 */
export async function getAllTracksuitOrdersAdmin(): Promise<any[]> {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized');
    }

    const querySnapshot = await adminDb.collection('tracksuit_orders').get();
    const orders: any[] = [];
    
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
 * Get all referrals using Firebase Admin (for admin dashboard)
 * @returns Promise with array of referral data
 */
export async function getAllReferralsAdmin(): Promise<any[]> {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin not initialized');
    }

    const querySnapshot = await adminDb.collection('referrals').get();
    const referrals: any[] = [];
    
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