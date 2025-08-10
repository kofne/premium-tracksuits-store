import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification, sendOrderNotification } from '@/lib/email';
import { ContactFormData, OrderFormData } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'contact':
        result = await sendContactNotification(data as ContactFormData);
        break;
      case 'order':
        result = await sendOrderNotification(data as OrderFormData);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
