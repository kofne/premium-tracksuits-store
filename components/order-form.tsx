'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, AlertCircle, Loader2, ShoppingCart } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English', 'History', 'Geography', 'Computer Science'
];

const GRADES = [
  'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export function OrderForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    grade: '',
    subjects: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Optimistic update
    const originalData = { ...formData };
    setFormData({ name: '', email: '', message: '', grade: '', subjects: [] });

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
      console.error("Order submission error:", error);
      setSubmitStatus('error');
      setFormData(originalData);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const toggleSubject = (subject: string) => {
    const newSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    handleInputChange('subjects', newSubjects);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-brown-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          Place Your Order
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Full Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className="form-input"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Grade Level *</label>
            <select
              value={formData.grade}
              onChange={(e) => handleInputChange('grade', e.target.value)}
              className="w-full p-2 border border-brown-300 rounded-md focus:border-red-500 focus:ring-red-500 transition-colors duration-200"
              required
              disabled={isSubmitting}
            >
              <option value="">Select your grade</option>
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Subjects *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUBJECTS.map(subject => (
                <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                    disabled={isSubmitting}
                  />
                  <span className="text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-700 mb-1">Additional Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="unknown specific requirements or questions?"
              className="form-input min-h-[100px] sm:min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            disabled={isSubmitting || formData.subjects.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white form-button"
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
