import { NextRequest, NextResponse } from 'next/server';
import admin, { adminDb, adminAuth } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    // Test Firebase Admin initialization
    if (!admin.apps.length) {
      return NextResponse.json({
        error: 'Firebase Admin not initialized',
        apps: admin.apps.length
      }, { status: 500 });
    }

    // Test Firestore connection
    const testDoc = await adminDb.collection('test').doc('test').get();
    
    // Test Auth connection (just check if it's available)
    const authInstance = adminAuth;

    return NextResponse.json({
      success: true,
      message: 'Firebase Admin is working correctly',
      firestore: 'connected',
      auth: 'available',
      apps: admin.apps.length
    });
  } catch (error) {
    console.error('Firebase Admin test error:', error);
    return NextResponse.json({
      error: 'Firebase Admin test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 