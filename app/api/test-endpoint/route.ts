import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'API endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'POST endpoint is working',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to parse request body',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
} 
