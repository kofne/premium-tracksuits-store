'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, RefreshCw, Calendar, User, AtSign, LogOut } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string | null;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
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
    fetchMessages();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleString();
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
            <span>Loading messages...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <Badge variant="secondary">{messages.length} messages</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchMessages} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No messages found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{message.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{message.email}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
