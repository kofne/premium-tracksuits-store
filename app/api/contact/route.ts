import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Rate limiting (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (limit.count >= 5) return true;

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
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    const { name, email, phone, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address' }), {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      });
    }

    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      phone_number: phone ? sanitizeInput(phone) : null,
      message: sanitizeInput(message)
    };

    const { error } = await supabase.from('contacts').insert([sanitizedData]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ message: 'Message sent successfully' }), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API /api/contact error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
