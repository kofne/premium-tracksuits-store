'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { tracksuitImages, tracksuitData } from '@/lib/size-data';
import { FormData, PayPalPaymentData } from '@/types/form';
import { CheckCircle, ShoppingBag, XCircle, Loader2, Plus } from 'lucide-react';
import { PayPalButton } from './PayPalButton';
import { saveOrderAfterPayment, OrderFormData } from '@/lib/firestore';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function HairForm() {
  const [formData, setFormData] = useState<Omit<FormData, 'selectedItems'>>({
    name: '',
    email: '',
    deliveryAddress: '',
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<PayPalPaymentData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const maxQuantity = 10;
  const totalPrice = tracksuitData.price;
  

  
  const handleImageSelect = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(prev => prev.filter(img => img !== image));
    } else if (selectedImages.length < maxQuantity) {
      setSelectedImages(prev => [...prev, image]);
    } else {
      alert(`You can select a maximum of ${maxQuantity} tracksuits.`);
    }
  };

  const handleAddToCart = (image: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the image selection
    handleImageSelect(image);
  };

  const handlePaymentComplete = (paymentData: PayPalPaymentData) => {
    setPaymentData(paymentData);
    setPaymentCompleted(true);
  };


  const handleSubmit = async () => {
    if (!paymentCompleted) return;
    setIsSubmitting(true);
    try {
      // Save to Firebase Firestore
      const orderData: OrderFormData = {
        name: formData.name,
        email: formData.email,
        deliveryAddress: formData.deliveryAddress,
        selectedItems: selectedImages.map(img => ({ image: img })),
        totalPrice: totalPrice,
        paymentId: paymentData?.paymentID,
      };
      
      await saveOrderAfterPayment(orderData);
      
      // Also send email notification (keeping existing functionality)
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: { ...formData, selectedItems: selectedImages.map(img => ({ image: img })) },
          paymentData,
        }),
      });
      
      if (!response.ok) {
        console.warn('Email notification failed, but order was saved to Firebase');
      }
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Order submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // No longer auto-submit after payment; user must click the button
  }, [paymentCompleted]);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-red-50 to-brown-50 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">🏃‍♂️ Gucci Tracksuits Collection</h1>
          <div className="bg-dark-maroon max-w-4xl mx-auto p-3 sm:p-5">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-semibold">
              Select up to 10 tracksuits from our collection for a fixed price of <span className="font-bold text-white">${totalPrice}</span>.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold mt-2 sm:mt-4">
              Delivers in Gaborone, Botswana in 4-7 days, <span className="font-bold text-white">Free Shipping!</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    Select Your Tracksuits
                  </div>
                  <span className="text-lg font-semibold text-red-600">{selectedImages.length} / {maxQuantity} selected</span>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {tracksuitImages.map((image, index) => {
                    const isSelected = selectedImages.includes(image);
                    const hairNumber = index + 1;
                    return (
                      <div
                        key={image}
                        onClick={() => handleImageSelect(image)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 group ${
                          isSelected
                            ? 'border-red-500 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-red-300 hover:scale-102'
                        }`}
                      >
                        <Image
                          src={`/images/${image}`}
                          alt={`Tracksuit ${hairNumber}`}
                          className="w-full h-32 sm:h-40 md:h-48 lg:h-52 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Tracksuit Number Label */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-md">
                          Tracksuit {hairNumber}
                        </div>
                        
                        {/* Add to Cart Button */}
                        <div className="absolute bottom-2 right-2">
                          <Button
                            size="sm"
                            onClick={(e) => handleAddToCart(image, e)}
                            className={`${
                              isSelected
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-white/90 hover:bg-white text-gray-800 hover:text-red-600'
                            } shadow-lg transition-all duration-200 min-w-0 px-2 py-1 text-xs font-medium`}
                          >
                            {isSelected ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-red-600 bg-white rounded-full shadow-lg" />
                          </div>
                        )}
                        {/* Hover effect for better UX */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200"></div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className={`border-brown-300 focus:border-red-500 ${
                      formData.name.trim() === '' ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className={`border-brown-300 focus:border-red-500 ${
                      formData.email.trim() === '' ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-1">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="Enter your complete delivery address"
                    className={`border-brown-300 focus:border-red-500 min-h-[80px] ${
                      formData.deliveryAddress.trim() === '' ? 'border-red-300' : ''
                    }`}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
              <CardHeader>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-brown-800">{selectedImages.length} tracksuits</span>
                  <span className="text-lg font-bold text-red-600">${totalPrice}</span>
                </div>
                <PayPalButton 
                  amount={totalPrice}
                  onPaymentComplete={handlePaymentComplete}
                  disabled={false}
                />
                {paymentCompleted && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Payment completed! You can now submit your order.</span>
                  </div>
                )}
                <button
                  className={`mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${!paymentCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={!paymentCompleted || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Order submitted successfully!</span>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <XCircle className="w-5 h-5" />
                    <span>Error submitting order. Please try again.</span>
                  </div>
                )}
                
                {isSubmitting && (
                  <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting order...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
