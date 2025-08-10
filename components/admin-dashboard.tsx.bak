'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingCart, 
  Mail, 
  Calendar, 
  Loader2, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { ContactFormData, OrderFormData } from '@/lib/firestore';
import { auth } from '@/lib/firebase';

interface DashboardData {
  contacts: (ContactFormData & { id: string; createdAt: any })[];
  orders: (OrderFormData & { id: string; createdAt: any; status: string })[];
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({ contacts: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError(null);
      
      // Get the current user's ID token
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      const idToken = await currentUser.getIdToken();
      
      const response = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please make sure you are logged in as an admin.');
        }
        throw new Error('Failed to fetch dashboard data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-brown-600">Loading dashboard data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brown-800 mb-2">Error Loading Data</h3>
            <p className="text-brown-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brown-600">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-800">{data.contacts.length}</div>
            <p className="text-xs text-brown-500">
              Contact form submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brown-600">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-800">{data.orders.length}</div>
            <p className="text-xs text-brown-500">
              Completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Tabs */}
      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contacts ({data.contacts.length})
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Orders ({data.orders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-6">
          <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-brown-800">Contact Form Submissions</CardTitle>
                <Button 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  size="sm"
                  variant="outline"
                >
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.contacts.length === 0 ? (
                <div className="text-center py-8 text-brown-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contact submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="border border-brown-200 rounded-lg p-4 bg-white/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-brown-800">{contact.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(contact.createdAt)}
                        </Badge>
                      </div>
                      <p className="text-brown-600 mb-2">
                        <a href={`mailto:${contact.email}`} className="text-red-600 hover:underline">
                          {contact.email}
                        </a>
                      </p>
                      <p className="text-brown-700 text-sm whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card className="bg-white/80 backdrop-blur-sm border-brown-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-brown-800">Order Submissions</CardTitle>
                <Button 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                  size="sm"
                  variant="outline"
                >
                  {refreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {data.orders.length === 0 ? (
                <div className="text-center py-8 text-brown-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-brown-200 rounded-lg p-4 bg-white/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-brown-800">{order.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {order.grade}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(order.createdAt)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-brown-600 mb-2">
                        <a href={`mailto:${order.email}`} className="text-red-600 hover:underline">
                          {order.email}
                        </a>
                      </p>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-brown-700">Subjects: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {order.message && (
                        <p className="text-brown-700 text-sm whitespace-pre-wrap">
                          <span className="font-medium">Message: </span>
                          {order.message}
                        </p>
                      )}
                      <div className="mt-2">
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 