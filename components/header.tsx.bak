'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/contact-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Menu, X, LogIn, LogOut, User, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { user, isAdmin, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Check if Firebase auth is available
    if (!auth) {
      alert('Firebase authentication is not configured. Please check your Firebase setup.');
      return;
    }
    
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase authentication is not properly configured. Please contact support.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-cover bg-center bg-no-repeat border-b border-brown-200 sticky top-0 z-50 header-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8),_0_0_20px_rgba(255,255,255,0.6)]">
              🎯💎 Gucci Tracksuits
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Admin Dashboard Link - Only visible to admin */}
            {isAdmin && (
              <Link href="/admin" className="text-blue-600 font-medium hover:underline bg-white px-3 py-1 rounded-md">
                Admin Dashboard
              </Link>
            )}
            
            {/* User Authentication */}
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
            
            {/* WhatsApp Chat Button */}
            <a
              href="https://wa.me/26777746888?text=Hi! I'm interested in Gucci Tracksuits. Can you help me with my order?"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-bold shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Chat with us on WhatsApp</span>
            </a>
            
            {/* Contact Section */}
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

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            {/* Admin Dashboard Link - Mobile - Only visible to admin */}
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
            
            {/* User Authentication - Mobile */}
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
            
            {/* WhatsApp Chat Button - Mobile */}
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