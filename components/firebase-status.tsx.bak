'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export function FirebaseStatus() {
  const [status, setStatus] = useState<string>('Checking...');
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Check if auth object exists
        if (!auth) {
          setStatus('❌ Firebase Auth object is null');
          return;
        }

        // Check auth configuration
        const config = auth.config;
        if (!config) {
          setStatus('❌ Firebase Auth config is missing');
          return;
        }

        // Get the app instance to access the full config
        const app = auth.app;
        const appConfig = app.options;

        setDetails({
          authDomain: appConfig.authDomain,
          projectId: appConfig.projectId,
          apiKey: appConfig.apiKey ? 'Set' : 'Missing',
          authObject: !!auth,
          configObject: !!config,
          appConfig: !!appConfig
        });

        // Try to get current user (this will test if auth is working)
        const currentUser = auth.currentUser;
        
        if (appConfig.authDomain && appConfig.projectId) {
          setStatus('✅ Firebase Auth appears to be configured correctly');
        } else {
          setStatus('⚠️ Firebase Auth config incomplete');
        }

      } catch (error: any) {
        console.error('Firebase status check error:', error);
        setStatus(`❌ Error checking Firebase: ${error.message}`);
      }
    };

    checkFirebaseStatus();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto mt-4">
      <h3 className="font-bold text-yellow-800 mb-2">Firebase Authentication Status</h3>
      <p className="text-sm text-yellow-700 mb-3">{status}</p>
      
      <div className="text-xs space-y-1">
        <p><strong>Auth Domain:</strong> {details.authDomain || 'Not set'}</p>
        <p><strong>Project ID:</strong> {details.projectId || 'Not set'}</p>
        <p><strong>API Key:</strong> {details.apiKey || 'Not set'}</p>
        <p><strong>Auth Object:</strong> {details.authObject ? 'Available' : 'Missing'}</p>
        <p><strong>Config Object:</strong> {details.configObject ? 'Available' : 'Missing'}</p>
        <p><strong>App Config:</strong> {details.appConfig ? 'Available' : 'Missing'}</p>
      </div>

      <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
        <p className="font-medium text-yellow-800">If status shows ❌ or ⚠️:</p>
        <ol className="list-decimal list-inside space-y-1 text-yellow-700">
          <li>Go to Firebase Console</li>
          <li>Select your project</li>
          <li>Click "Authentication"</li>
          <li>Click "Get started"</li>
          <li>Enable "Email/Password"</li>
        </ol>
      </div>
    </div>
  );
} 