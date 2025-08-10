import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Validate environment variables
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      console.error('❌ Missing PayPal credentials:', {
        hasClientId: !!process.env.PAYPAL_CLIENT_ID,
        hasSecret: !!process.env.PAYPAL_SECRET,
        clientIdLength: process.env.PAYPAL_CLIENT_ID?.length || 0,
        secretLength: process.env.PAYPAL_SECRET?.length || 0
      });
      
      return NextResponse.json({
        error: 'PayPal credentials not configured',
        code: 'MISSING_CREDENTIALS'
      }, { status: 500 });
    }

    // 2. Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      }, { status: 400 });
    }

    const { amount } = requestBody;

    // 3. Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('❌ Invalid amount:', { amount, type: typeof amount });
      return NextResponse.json({
        error: 'Invalid amount. Must be a positive number.',
        code: 'INVALID_AMOUNT',
        received: amount
      }, { status: 400 });
    }

    console.log('✅ Creating PayPal order:', {
      amount,
      currency: 'USD',
      timestamp: new Date().toISOString()
    });

    // 4. Prepare PayPal request
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    const paypalRequestBody = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        }
      }]
    };

    console.log('📤 PayPal request body:', paypalRequestBody);

    // 5. Make PayPal API call
    const paypalResponse = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paypalRequestBody)
    });

    const responseTime = Date.now() - startTime;
    console.log('📡 PayPal API response:', {
      status: paypalResponse.status,
      statusText: paypalResponse.statusText,
      responseTime: `${responseTime}ms`,
      headers: Object.fromEntries(paypalResponse.headers.entries())
    });

    // 6. Parse PayPal response
    let paypalData;
    const responseText = await paypalResponse.text();
    
    try {
      paypalData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error('❌ Failed to parse PayPal response:', {
        error: parseError,
        responseText,
        status: paypalResponse.status
      });
      
      return NextResponse.json({
        error: 'Invalid PayPal response format',
        code: 'INVALID_PAYPAL_RESPONSE',
        paypalStatus: paypalResponse.status,
        responseText: responseText.substring(0, 500) // Truncate for logging
      }, { status: 500 });
    }

    console.log('📥 PayPal response data:', paypalData);

    // 7. Handle PayPal errors
    if (!paypalResponse.ok) {
      console.error('❌ PayPal API error:', {
        status: paypalResponse.status,
        data: paypalData,
        responseTime
      });
      
      return NextResponse.json({
        error: 'PayPal order creation failed',
        code: 'PAYPAL_API_ERROR',
        paypalError: paypalData,
        paypalStatus: paypalResponse.status
      }, { status: paypalResponse.status });
    }

    // 8. Validate successful response
    if (!paypalData.id) {
      console.error('❌ PayPal response missing order ID:', paypalData);
      return NextResponse.json({
        error: 'PayPal response missing order ID',
        code: 'MISSING_ORDER_ID',
        paypalResponse: paypalData
      }, { status: 500 });
    }

    // 9. Success response
    console.log('✅ PayPal order created successfully:', {
      orderId: paypalData.id,
      status: paypalData.status,
      responseTime: `${responseTime}ms`
    });

    return NextResponse.json({
      id: paypalData.id,
      status: paypalData.status,
      intent: paypalData.intent,
      create_time: paypalData.create_time
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('❌ Unexpected error in create-order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      responseTime: `${responseTime}ms`
    });

    return NextResponse.json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
