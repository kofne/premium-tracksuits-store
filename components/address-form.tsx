'use client';

import { useActionState } from 'react'; // ✅ only works if Server Actions are enabled
import { submitAddress } from '../actions/address';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import type { ActionResponse } from '../types/address';
import { CheckCircle2 } from 'lucide-react';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function AddressForm() {
  const [state, action, isPending] = useActionState(submitAddress, initialState);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardDescription>Please enter your shipping address details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6" autoComplete="on">
          {/* ... form fields here ... */}

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success && <CheckCircle2 className="h-4 w-4" />}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save Address'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
