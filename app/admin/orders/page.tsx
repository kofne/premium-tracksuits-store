'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Package,
  RefreshCw,
  Calendar,
  User,
  AtSign,
  LogOut,
  DollarSign,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// ✅ Define OrderData type inline so no external file is needed
interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp?: string;
  paymentId?: string;
  referralCode?: string;
  referredBy?: string;
  deliveryAddress: string;
  totalPrice: number;
  totalQuantity: number;
  createdAt: string | Date;
  status: string;
  cartItems: {
    itemName: string;
    image: string;
    selectedSize?: string;
    quantity: number;
    price: number;
  }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    setAuthenticated(true);
    fetchOrders();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusConfig = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      shipped: { color: 'bg-blue-100 text-blue-800', label: 'Shipped' },
      delivered: { color: 'bg-purple-100 text-purple-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

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
            <span>Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalItems = orders.reduce((sum, order) => sum + order.totalQuantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Tracksuit Orders</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchOrders} variant="outline" size="sm">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
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

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <AtSign className="w-4 h-4" />
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4" />
                      <span>{order.totalQuantity} items</span>
                    </div>
                    <div className={`${statusConfig.color} rounded-full px-2 py-1 font-semibold`}>
                      {statusConfig.label}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p>
                          <strong>WhatsApp:</strong> {order.customerWhatsapp}
                        </p>
                        <p>
                          <strong>Payment ID:</strong> {order.paymentId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        {order.referralCode && (
                          <p>
                            <strong>Referral Code:</strong> {order.referralCode}
                          </p>
                        )}
                        {order.referredBy && (
                          <p>
                            <strong>Referred By:</strong> {order.referredBy}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {order.deliveryAddress}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={`/images/${item.image}`}
                              alt={item.itemName}
                              width={32}
                              height={32}
                              className="object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{item.itemName}</p>
                              <p className="text-gray-500">
                                Size: {item.selectedSize} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
