'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { testFirebaseConnection, getFirestoreSummary } from '@/lib/firebase-test';
import { saveContactForm, saveOrderAfterPayment } from '@/lib/firestore';
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export function FirebaseTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [status, setStatus] = useState<string>('Checking Firebase...');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
      
      if (result.success) {
        const summaryData = await getFirestoreSummary();
        setSummary(summaryData);
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestContactSave = async () => {
    setIsTesting(true);
    try {
      const testContact = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test contact form submission'
      };
      
      const result = await saveContactForm(testContact);
      setTestResult({
        success: true,
        message: `Contact saved successfully with ID: ${result.id}`,
        type: 'contact'
      });
      
      // Refresh summary
      const summaryData = await getFirestoreSummary();
      setSummary(summaryData);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'contact'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestOrderSave = async () => {
    setIsTesting(true);
    try {
      const testOrder = {
        name: 'Test Customer',
        email: 'customer@example.com',
        message: 'This is a test order',
        grade: '12th Grade',
        subjects: ['Mathematics', 'Science']
      };
      
      const result = await saveOrderAfterPayment(testOrder);
      setTestResult({
        success: true,
        message: `Order saved successfully with ID: ${result.id}`,
        type: 'order'
      });
      
      // Refresh summary
      const summaryData = await getFirestoreSummary();
      setSummary(summaryData);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'order'
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      setStatus('❌ Firebase Auth is not available');
      return;
    }

    setStatus('✅ Firebase Auth is available');

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setStatus(`✅ Signed in as: ${user.email}`);
      } else {
        setUser(null);
        setStatus('✅ Not signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTestLogin = async () => {
    if (!email || !password) {
      setStatus('❌ Please enter email and password');
      return;
    }

    setStatus('🔄 Attempting login...');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus('✅ Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      setStatus(`❌ Login failed: ${error.code} - ${error.message}`);
    }
  };

  const handleCreateUser = async () => {
    if (!email || !password) {
      setStatus('❌ Please enter email and password');
      return;
    }

    if (password.length < 6) {
      setStatus('❌ Password must be at least 6 characters');
      return;
    }

    setIsCreatingUser(true);
    setStatus('🔄 Creating user account...');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStatus('✅ User account created and signed in!');
    } catch (error: any) {
      console.error('Create user error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setStatus('❌ User already exists. Try logging in instead.');
      } else {
        setStatus(`❌ Create user failed: ${error.code} - ${error.message}`);
      }
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-brown-200 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brown-800">
          <Database className="w-5 h-5" />
          Firebase Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            variant="outline"
            className="flex-1 min-w-[150px]"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
          
          <Button
            onClick={handleTestContactSave}
            disabled={isTesting}
            variant="outline"
            className="flex-1 min-w-[150px]"
          >
            Test Contact Save
          </Button>
          
          <Button
            onClick={handleTestOrderSave}
            disabled={isTesting}
            variant="outline"
            className="flex-1 min-w-[150px]"
          >
            Test Order Save
          </Button>
        </div>

        {testResult && (
          <div className={`p-3 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">
                {testResult.success ? 'Success' : 'Error'}
              </span>
            </div>
            <p className="mt-1 text-sm">
              {testResult.message || testResult.error}
            </p>
          </div>
        )}

        {summary && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Firestore Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Contacts:</span> {summary.contacts.count}
              </div>
              <div>
                <span className="text-blue-600">Orders:</span> {summary.orders.count}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• Click "Test Connection" to verify Firebase connectivity</li>
            <li>• Click "Test Contact Save" to test saving contact form data</li>
            <li>• Click "Test Order Save" to test saving order data</li>
            <li>• Check your Firebase Console to see the saved data</li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">Firebase Auth Test</h2>
          
          <div className="mb-4">
            <p className="text-sm font-medium">Status:</p>
            <p className="text-sm">{status}</p>
          </div>

          {user && (
            <div className="mb-4 p-3 bg-green-50 rounded">
              <p className="text-sm font-medium text-green-800">Signed in as:</p>
              <p className="text-sm text-green-700">{user.email}</p>
              <p className="text-xs text-green-600">UID: {user.uid}</p>
              <p className="text-xs text-green-600">Admin Email: {process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
              <p className="text-xs text-green-600">Is Admin: {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'Yes' : 'No'}</p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="solkim1985@gmail.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                placeholder="password (min 6 chars)"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleTestLogin}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
              >
                Test Login
              </button>
              
              <button
                onClick={handleCreateUser}
                disabled={isCreatingUser}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm disabled:opacity-50"
              >
                {isCreatingUser ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
            <p className="font-medium mb-1">Firebase Config:</p>
            <p>Auth Available: {auth ? 'Yes' : 'No'}</p>
            <p>Auth Domain: {auth?.config?.authDomain || 'Not set'}</p>
            <p>Project ID: {auth?.config?.projectId || 'Not set'}</p>
            <p className="mt-2 font-medium">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>First, enable Authentication in Firebase Console</li>
              <li>Use "Create User" to make your first account</li>
              <li>Use "Test Login" to sign in with existing account</li>
              <li>Admin link will show if email matches NEXT_PUBLIC_ADMIN_EMAIL</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 