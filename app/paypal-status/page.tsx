'use client';

import { useEffect, useState } from 'react';

export default function PayPalStatusPage() {
  const [status, setStatus] = useState({
    sdkLoaded: false,
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'NOT SET',
    windowPayPal: false,
    error: null as string | null
  });

  useEffect(() => {
    const checkPayPal = () => {
      const hasClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && 
                         process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'your_paypal_client_id_here';
      
      if (!hasClientId) {
        setStatus(prev => ({
          ...prev,
          error: 'PayPal Client ID not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in .env.local'
        }));
        return;
      }

      if (typeof window !== 'undefined') {
        const checkSDK = setInterval(() => {
          if (window.paypal) {
            setStatus(prev => ({
              ...prev,
              sdkLoaded: true,
              windowPayPal: true
            }));
            clearInterval(checkSDK);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkSDK);
          if (!window.paypal) {
            setStatus(prev => ({
              ...prev,
              error: 'PayPal SDK failed to load after 10 seconds'
            }));
          }
        }, 10000);
      }
    };

    checkPayPal();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">PayPal Integration Status</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Environment Variables</h2>
            <p><strong>Client ID:</strong> {status.clientId}</p>
            <p><strong>Client ID Valid:</strong> {status.clientId !== 'NOT SET' && status.clientId !== 'your_paypal_client_id_here' ? '✅ Yes' : '❌ No'}</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">PayPal SDK Status</h2>
            <p><strong>SDK Loaded:</strong> {status.sdkLoaded ? '✅ Yes' : '⏳ Loading...'}</p>
            <p><strong>Window.paypal:</strong> {status.windowPayPal ? '✅ Available' : '❌ Not Available'}</p>
          </div>

          {status.error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <h2 className="font-semibold text-red-800 mb-2">Error</h2>
              <p className="text-red-700">{status.error}</p>
            </div>
          )}

          {!status.error && status.sdkLoaded && (
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-green-800 mb-2">✅ PayPal Ready!</h2>
              <p className="text-green-700">PayPal integration is working correctly. You can now test payments.</p>
            </div>
          )}

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Next Steps</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Create a PayPal Developer account at <a href="https://developer.paypal.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener">developer.paypal.com</a></li>
              <li>Create a new app to get your Client ID and Secret</li>
              <li>Add your credentials to the <code>.env.local</code> file</li>
              <li>Restart your development server</li>
              <li>Test the integration at <a href="/test-paypal" className="text-blue-600 hover:underline">/test-paypal</a></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 
