// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Rate limiting map (in-memory, resets on server restart)
const orderRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = orderRateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    orderRateLimitMap.set(ip, { count: 1, resetTime: now + 120000 }); // 2 minutes
    return false;
  }
  if (limit.count >= 3) return true;

  limit.count++;
  return false;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Get IP address safely
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many orders. Please wait before submitting another.' },
        { status: 429, headers: corsHeaders }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Extract and validate request body
    const {
      customer_name,
      customer_email,
      customer_phone,
      product_name,
      product_id,
      quantity,
      price,
      payment_status
    } = await request.json();

    if (!customer_name?.trim() || !customer_email?.trim() || !product_name?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and product name are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!validateEmail(customer_email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Sanitize and prepare data
    const sanitizedData = {
      customer_name: sanitizeInput(customer_name),
      customer_email: sanitizeInput(customer_email).toLowerCase(),
      customer_phone: customer_phone ? sanitizeInput(customer_phone) : null,
      product_name: sanitizeInput(product_name),
      product_id: product_id ? sanitizeInput(product_id) : null,
      quantity: quantity || 1,
      price: price || 0,
      payment_status: payment_status || 'pending',
      created_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { error } = await supabase.from('orders').insert([sanitizedData]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json(
      { message: 'Order submitted successfully' },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

