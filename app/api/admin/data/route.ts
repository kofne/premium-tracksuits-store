import { NextRequest, NextResponse } from 'next/server';
import admin, { adminDb } from '@/lib/firebaseAdmin';

// Verify Firebase token and check admin status
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if the user's email matches the admin email
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return decodedToken.email === adminEmail;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Prepare queries using Firebase Admin
    const contactsSnapshot = await adminDb.collection('contacts')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    
    const ordersSnapshot = await adminDb.collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      contacts,
      orders,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin data API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
} 