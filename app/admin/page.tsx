"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Loader2, Package, Users, Mail, LogOut, DollarSign, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    setAuthenticated(true);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Show loading while checking authentication
  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your tracksuit store</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/admin/orders')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View and manage all tracksuit orders, customer information, and order status.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span>Track revenue and sales</span>
            </div>
          </CardContent>
        </Card>

        {/* Referral System */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/admin/referrals')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Monitor referral performance, track earnings, and manage referral codes.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <DollarSign className="w-4 h-4" />
              <span>Track referral earnings</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Messages */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleNavigation('/admin/messages')}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View customer inquiries and contact form submissions.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>Customer support</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => handleNavigation('/admin/orders')}
          >
            <Package className="w-6 h-6 mb-2" />
            <span>View Orders</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => handleNavigation('/admin/referrals')}
          >
            <Users className="w-6 h-6 mb-2" />
            <span>Referrals</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => handleNavigation('/admin/messages')}
          >
            <Mail className="w-6 h-6 mb-2" />
            <span>Messages</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => window.open('/', '_blank')}
          >
            <ShoppingBag className="w-6 h-6 mb-2" />
            <span>View Store</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
