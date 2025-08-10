import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      return NextResponse.json({
        error: 'Missing PayPal credentials',
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasSecret: !!process.env.PAYPAL_SECRET
      }, { status: 500 });
    }

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    // Test PayPal API by getting an access token
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    
    return NextResponse.json({
      tokenStatus: tokenRes.status,
      tokenResponse: tokenData,
      credentialsConfigured: true,
      clientIdLength: process.env.PAYPAL_CLIENT_ID?.length || 0,
      secretLength: process.env.PAYPAL_SECRET?.length || 0
    });
  } catch (error) {
    console.error('PayPal test error:', error);
    return NextResponse.json({
      error: 'PayPal test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
