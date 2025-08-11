'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { saveOrderAfterPayment, OrderFormData } from '@/lib/firestore';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function AfterPaymentForm() {
  const [formData, setFormData] = useState<Omit<OrderFormData, 'subjects' | 'grade'>>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Add empty grade and subjects for compatibility with original OrderFormData
      await saveOrderAfterPayment({ ...formData, grade: '', subjects: [] });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Order form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
      <CardHeader>
        <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
        Complete Your Order
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Full Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              className="border-brown-300 focus:border-red-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              className="border-brown-300 focus:border-red-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Additional Message</label>
            <Textarea
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="unknown additional information or special requests"
              className="border-brown-300 focus:border-red-500 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-2 sm:py-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Order'
            )}
          </Button>

          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Order submitted successfully! We&apos;ll process it soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm sm:text-base">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Error submitting order. Please try again.</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
