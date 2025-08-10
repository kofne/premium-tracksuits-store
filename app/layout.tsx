import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header';
import { PayPalProvider } from '@/components/paypal-provider';

export const metadata: Metadata = {
  title: 'Gucci Tracksuits - Premium Tracksuit Collection',
  description: 'Select from our premium collection of Gucci tracksuits. High-quality tracksuits for men, women, and kids.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Use a fallback client ID for testing if not configured
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';    
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
          <PayPalProvider clientId={paypalClientId}>
            <Header />
            {children}
          </PayPalProvider>
      </body>
    </html>
  )
}

