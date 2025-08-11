'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function ContactForm() {
  const [formData, setFormData] = useState({
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

    const originalData = { ...formData };
    setFormData({ name: '', email: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(originalData),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await res.json();
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setFormData(originalData);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-brown-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
        Contact Us
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Full Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="border-brown-300 focus:border-red-500 text-sm sm:text-base transition-colors duration-200"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="border-brown-300 focus:border-red-500 text-sm sm:text-base transition-colors duration-200"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Message *</label>
            <Textarea
              value={formData.message}
              onChange={e => handleInputChange('message', e.target.value)}
              placeholder="Enter your message"
              className="border-brown-300 focus:border-red-500 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base transition-colors duration-200 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-2 sm:py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
          
          {submitStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm sm:text-base animate-in slide-in-from-top-2 duration-300">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Message sent successfully! We&apos;ll get back to you soon.</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm sm:text-base animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Error sending message. Please try again.</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
