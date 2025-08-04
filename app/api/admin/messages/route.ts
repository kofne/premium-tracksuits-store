import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  console.log('Admin messages API called');
  
  try {
    console.log('Creating Firestore query...');
    
    console.log('Executing Firestore query...');
    
    // Get the documents using Firebase Admin
    const querySnapshot = await adminDb.collection('contacts')
      .orderBy('createdAt', 'desc')
      .get();
    
    console.log(`Found ${querySnapshot.docs.length} messages`);
    
    // Extract the data from each document
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt || null,
    }));

    console.log('Returning messages:', messages.length);
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: 'Failed to fetch messages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 