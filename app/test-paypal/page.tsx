'use client';

import { PayPalButton } from '@/components/PayPalButton';
import { PayPalPaymentData } from '@/types/form';

export default function TestPayPalPage() {
  const handlePaymentComplete = (paymentData: PayPalPaymentData) => {
    console.log('Payment completed:', paymentData);
    alert('Payment completed! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">PayPal Test</h1>
        <p className="mb-4">Testing PayPal button integration...</p>
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Environment Check:</h2>
          <p>PayPal Client ID: {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'NOT SET'}</p>
          <p>Window PayPal: {typeof window !== 'undefined' && window.paypal ? 'Available' : 'Not Available'}</p>
        </div>

        <PayPalButton 
          amount={10.00}
          onPaymentComplete={handlePaymentComplete}
          disabled={false}
        />
      </div>
    </div>
  );
} 
