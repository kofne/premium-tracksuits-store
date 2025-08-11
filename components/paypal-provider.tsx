'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalProviderProps {
  children: React.ReactNode;
  clientId: string;
}

export function PayPalProvider({ children, clientId }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider 
      options={{ 
        clientId: clientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
} 
