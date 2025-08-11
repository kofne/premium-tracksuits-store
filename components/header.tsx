'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Menu, X, LogIn, LogOut, User, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // You need to define your own admin logic here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Implement your admin check here if needed, for example by user metadata or role
      setIsAdmin(false);
      setLoading(false);
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      setIsLoginOpen(false);
      setEmail('');
      setPassword('');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <header className="bg-cover bg-center bg-no-repeat border-b border-brown-200 sticky top-0 z-50 header-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,255,255,0.6)]">
              ???? Gucci Tracksuits
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="text-blue-600 font-medium hover:underline bg-white px-3 py-1 rounded-md">
                Admin Dashboard
              </Link>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">Welcome, {user.email}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Login to Access Admin
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoggingIn}
                        >
                          {isLoggingIn ? 'Logging in...' : 'Login'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}

            <a
              href="https://wa.me/26777746888?text=Hi! I'm interested in Gucci Tracksuits. Can you help me with my order?"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-bold shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Chat with us on WhatsApp</span>
            </a>

            <div className="bg-contact-blue p-1 px-2 rounded-md inline-flex flex-col items-center w-auto">
              <h2 className="text-bright-blue text-lg font-bold mb-0 text-center leading-tight">Contact Us</h2>
              <div className="flex items-center gap-1 mb-0 mt-1">
                <p className="text-white text-xs leading-tight">Get in touch with us today!</p>

                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100 text-xs px-2 py-1 h-auto">
                      <Mail className="w-3 h-3 mr-1" />
                      Quick Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-brown-800">
                        <Mail className="w-6 h-6" />
                        Contact & Enquiries
                      </DialogTitle>
                    </DialogHeader>
                    <ContactForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {isAdmin && (
              <div className="mb-3">
                <Link
                  href="/admin"
                  className="block w-full text-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </div>
            )}

            {!loading && (
              <div className="mb-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-center text-white text-sm">Welcome, {user.email}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/20 text-white border-white/30 hover:bg-white/30"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogIn className="w-4 h-4 mr-1" />
                        Login
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Login to Access Admin
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoggingIn}
                        >
                          {isLoggingIn ? 'Logging in...' : 'Login'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}

            <div className="mb-3">
              <a
                href="https://wa.me/26777746888?text=Hi! I'm interested in Gucci Tracksuits. Can you help me with my order?"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md transition-colors shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Chat with us on WhatsApp
              </a>
            </div>

            <div className="bg-contact-blue p-3 rounded-md">
              <h2 className="text-bright-blue text-base font-bold mb-2 text-center">Contact Us</h2>
              <p className="text-white text-sm text-center mb-3">Get in touch with us today!</p>

              <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 text-sm py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Quick Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-brown-800">
                      <Mail className="w-6 h-6" />
                      Contact & Enquiries
                    </DialogTitle>
                  </DialogHeader>
                  <ContactForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
