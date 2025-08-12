'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function OrderForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    product_name: '',
    product_id: '',
    quantity: 1,
    price: '',
    message: '',  // optional extra info
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const originalData = { ...formData };

    // Validate price and quantity before submission
    if (Number.isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      alert('Please enter a valid price.');
      setIsSubmitting(false);
      return;
    }
    if (Number.isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      alert('Quantity must be at least 1.');
      setIsSubmitting(false);
      return;
    }

    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      product_name: '',
      product_id: '',
      quantity: 1,
      price: '',
      message: '',
    });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitStatus('error');
      setFormData(originalData);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-brown-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        Place Your Tracksuit Order
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-brown-700 mb-1">
              Full Name *
            </label>
            <Input
              id="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="customer_email" className="block text-sm font-medium text-brown-700 mb-1">
              Email *
            </label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="customer_phone" className="block text-sm font-medium text-brown-700 mb-1">
              Phone / WhatsApp
            </label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              placeholder="Optional"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-brown-700 mb-1">
              Product Name *
            </label>
            <Input
              id="product_name"
              type="text"
              value={formData.product_name}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              placeholder="Enter product name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-brown-700 mb-1">
              Product ID
            </label>
            <Input
              id="product_id"
              type="text"
              value={formData.product_id}
              onChange={(e) => handleInputChange('product_id', e.target.value)}
              placeholder="Optional"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-brown-700 mb-1">
              Quantity *
            </label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
              min={1}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-brown-700 mb-1">
              Price (per unit) *
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Enter price per item"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-brown-700 mb-1">
              Additional Message
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any special requests or questions?"
              className="min-h-[100px] sm:min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.customer_name ||
              !formData.customer_email ||
              !formData.product_name ||
              !formData.price ||
              formData.quantity < 1
            }
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Order'
            )}
          </Button>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm sm:text-base animate-in">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Order submitted successfully! We&apos;ll contact you soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm sm:text-base animate-in">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Error submitting order. Please try again.</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
