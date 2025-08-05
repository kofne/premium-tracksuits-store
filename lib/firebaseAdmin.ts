import admin from 'firebase-admin';

// Simple initialization function
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  const privateKeyBase64 = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!privateKeyBase64 || !projectId || !clientEmail) {
    throw new Error('Firebase Admin environment variables not configured');
  }

  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// Initialize and export
const firebaseAdmin = initializeFirebaseAdmin();

export default firebaseAdmin;

// Export Firestore and Auth instances
export const adminDb = firebaseAdmin.firestore();
export const adminAuth = firebaseAdmin.auth();

/**
 * Get all tracksuit orders using Firebase Admin (for admin dashboard)
 * @returns Promise with array of order data
 */
export async function getAllTracksuitOrdersAdmin(): Promise<any[]> {
  try {
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