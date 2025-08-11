'use client';

import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalPaymentData {
  paymentID: string;
  orderID: string;
  payerName: string;
  amount: number;
  status: string;
}

interface PayPalButtonProps {
  amount: number;
  onPaymentComplete: (paymentData: PayPalPaymentData) => void;
  disabled?: boolean;
}

export function PayPalButton({ amount, onPaymentComplete, disabled = false }: PayPalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = (data: unknown, actions: unknown) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toFixed(2),
            currency_code: "USD"
          },
          description: "Gucci Tracksuits Order"
        }
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = async (data: unknown, actions: unknown) => {
    setIsProcessing(true);
    
    try {
      const order = await actions.order.capture();
      
      const paymentData: PayPalPaymentData = {
        paymentID: order.id,
        orderID: order.id,
        payerName: order.payer.name?.given_name + ' ' + order.payer.name?.surname || 'Customer',
        amount: amount,
        status: order.status
      };
      
      onPaymentComplete(paymentData);
      setIsProcessing(false);
    } catch (error) {
      console.error('PayPal payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const onError = (err: unknown) => {
    console.error('PayPal error:', err);
    alert('Payment failed. Please try again.');
    setIsProcessing(false);
  };

  if (disabled) {
    return (
      <div className="w-full p-4 text-center text-gray-500 bg-gray-100 rounded-lg">
        Please fill in all required information before proceeding to payment
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay"
        }}
        disabled={isProcessing}
      />
      
      <p className="text-xs text-gray-500 mt-2 text-center">
        Secure payment processed by PayPal
      </p>
    </div>
  );
} 
