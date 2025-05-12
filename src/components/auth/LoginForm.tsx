// src/components/auth/LoginForm.tsx
'use client';

import React from 'react';
// Removed imports: useState, useForm, zodResolver, z, firebase/auth, auth, useRouter, Button, Input, Label, Form components, Separator, useToast, GoogleIcon

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Removed formSchema and FormValues

export function LoginForm() {
  // Removed state, form hooks, router, toast, and submit handlers

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Bypassed</CardTitle>
        <CardDescription>
          Login is currently bypassed for development. You are logged in as admin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          No action required. Navigate the application as the admin user.
        </p>
      </CardContent>
      {/* Removed CardFooter containing buttons and links */}
    </Card>
  );
}
