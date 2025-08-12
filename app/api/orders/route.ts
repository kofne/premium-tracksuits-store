// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// --- CORS headers ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// --- Rate limiting (in-memory, resets on server restart) ---
const orderRateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = orderRateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    orderRateLimitMap.set(ip, { count: 1, resetTime: now + 120_000 }); // 2 minutes
    return false;
  }
  if (limit.count >= 3) return true;

  limit.count++;
  return false;
}

// --- Validation helpers ---
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeString(input: unknown): string {
  return typeof input === 'string' ? input.trim().replace(/[<>]/g, '') : '';
}

// --- Define the expected shape of the request body ---
interface OrderRequestBody {
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  product_name: string;
  product_id?: string | null;
  quantity?: number | string;
  price?: number | string;
  payment_status?: string;
}

export async function POST(request: NextRequest) {
  try {
    // --- Get IP address safely ---
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

    // --- Validate content type ---
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Parse request body ---
    let body: OrderRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      product_name,
      product_id,
      quantity,
      price,
      payment_status,
    } = body;

    // --- Field validation ---
    if (!sanitizeString(customer_name) || !sanitizeString(customer_email) || !sanitizeString(product_name)) {
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

    const qty = Number(quantity) || 1;
    const priceValue = Number(price) || 0;

    if (qty <= 0 || priceValue < 0) {
      return NextResponse.json(
        { error: 'Quantity must be positive and price must be non-negative' },
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Prepare sanitized data ---
    const sanitizedData = {
      customer_name: sanitizeString(customer_name),
      customer_email: sanitizeString(customer_email).toLowerCase(),
      customer_phone: sanitizeString(customer_phone) || null,
      product_name: sanitizeString(product_name),
      product_id: sanitizeString(product_id) || null,
      quantity: qty,
      price: priceValue,
      payment_status: sanitizeString(payment_status) || 'pending',
      created_at: new Date().toISOString(),
    };

    // --- Insert into Supabase ---
    const { error } = await supabase.from('orders').insert([sanitizedData]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Database error while saving order' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Order submitted successfully' },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('API /api/orders error:', err);
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// --- Handle CORS preflight ---
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
