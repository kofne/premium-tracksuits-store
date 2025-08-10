'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, RefreshCw, Calendar, AtSign, LogOut, DollarSign, Share2 } from 'lucide-react';
import { ReferralData } from '@/types/form';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    fetchReferrals();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/referrals');
      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }
      
      const data = await response.json();
      setReferrals(data.referrals || []);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading referrals...</span>
          </div>
        </div>
      </div>
    );
  }

  const totalEarnings = referrals.reduce((sum, referral) => sum + referral.totalEarnings, 0);
  const totalReferrals = referrals.length;
  const totalReferredCustomers = referrals.reduce((sum, referral) => sum + referral.referredCustomers.length, 0);
  const totalCompletedOrders = referrals.reduce((sum, referral) => sum + referral.completedOrders.length, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Referral System</h1>
          <Badge variant="secondary">{referrals.length} referrals</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchReferrals} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Referrers</p>
                <p className="text-2xl font-bold">{totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Referred Customers</p>
                <p className="text-2xl font-bold">{totalReferredCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold">{totalCompletedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {referrals.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No referrals found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => (
            <Card key={referral.referralCode} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{referral.referrerName}</span>
                    <Badge variant="outline">{referral.referralCode}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(referral.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <AtSign className="w-4 h-4" />
                    <span>{referral.referrerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${referral.totalEarnings.toFixed(2)} earned</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Referred Customers</h4>
                    <p className="text-2xl font-bold text-blue-600">{referral.referredCustomers.length}</p>
                    {referral.referredCustomers.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {referral.referredCustomers.slice(0, 3).map((email, index) => (
                          <p key={index} className="text-sm text-gray-600 truncate">{email}</p>
                        ))}
                        {referral.referredCustomers.length > 3 && (
                          <p className="text-sm text-gray-500">+{referral.referredCustomers.length - 3} more</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Completed Orders</h4>
                    <p className="text-2xl font-bold text-green-600">{referral.completedOrders.length}</p>
                    <p className="text-sm text-gray-500">Each earns $100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Total Earnings</h4>
                    <p className="text-2xl font-bold text-purple-600">${referral.totalEarnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {referral.completedOrders.length} × $100
                    </p>
                  </div>
                </div>

                {referral.completedOrders.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Completed Order IDs</h4>
                    <div className="flex flex-wrap gap-2">
                      {referral.completedOrders.map((orderId, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {orderId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
