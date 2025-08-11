import { db } from './firebase';

/**
 * Test Firebase connection and Firestore access
 * This function can be called to verify your Firebase setup is working
 */
export async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test reading from contacts collection
    const contactsRef = collection(db, 'contacts');
    const contactsSnapshot = await getDocs(contactsRef);
    console.log('✅ Contacts collection accessible');
    console.log(`📊 Found ${contactsSnapshot.size} contact documents`);
    
    // Test reading from orders collection
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    console.log('✅ Orders collection accessible');
    console.log(`📊 Found ${ordersSnapshot.size} order documents`);
    
    return {
      success: true,
      contacts: contactsSnapshot.size,
      orders: ordersSnapshot.size,
      message: 'Firebase connection successful!'
    };
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Firebase connection failed. Check your configuration.'
    };
  }
}

/**
 * Get a quick summary of your Firestore data
 */
export async function getFirestoreSummary() {
  try {
    const contactsRef = collection(db, 'contacts');
    const ordersRef = collection(db, 'orders');
    
    const [contactsSnapshot, ordersSnapshot] = await Promise.all([
      getDocs(contactsRef),
      getDocs(ordersRef)
    ]);
    
    return {
      contacts: {
        count: contactsSnapshot.size,
        latest: contactsSnapshot.docs[0]?.data() || null
      },
      orders: {
        count: ordersSnapshot.size,
        latest: ordersSnapshot.docs[0]?.data() || null
      }
    };
  } catch (error) {
    console.error('Error getting Firestore summary:', error);
    throw error;
  }
} 
