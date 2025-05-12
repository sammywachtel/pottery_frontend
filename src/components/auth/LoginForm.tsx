// src/components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust path as needed
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from '@/components/ui/separator'; // Import Separator
import { useToast } from '@/hooks/use-toast'; // Assuming useToast hook exists

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

// Google Icon SVG
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.001-0.001l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggle between Login and Sign Up
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleEmailPasswordSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setAuthError(null);
    const { email, password } = values;

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login Successful", description: "Welcome back!" });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Sign Up Successful", description: "Welcome! You are now logged in." });
      }
      // Redirect to home page upon successful login/signup
      router.push('/');
      router.refresh(); // Ensure layout re-renders with user context
    } catch (error: any) {
      console.error("Email/Password Auth error:", error);
      handleAuthError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
      setIsSubmitting(true);
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      try {
          await signInWithPopup(auth, provider);
          toast({ title: "Sign In Successful", description: "Welcome!" });
          router.push('/');
          router.refresh();
      } catch (error: any) {
          console.error("Google Sign-In error:", error);
          // Handle specific Google sign-in errors if needed
          if (error.code === 'auth/popup-closed-by-user') {
            handleAuthError({ code: error.code, message: "Sign-in cancelled." });
          } else if (error.code === 'auth/account-exists-with-different-credential') {
             handleAuthError({ code: error.code, message: "An account already exists with this email using a different sign-in method." });
          }
          else {
             handleAuthError(error);
          }
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleAuthError = (error: any) => {
      // Provide more user-friendly messages
      let message = "An error occurred. Please try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Try logging in or use a different email.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password is too weak. Please use a stronger password.";
      } else if (error.message) {
         message = error.message; // Use specific message if provided
      }
      setAuthError(message);
      toast({ title: "Authentication Failed", description: message, variant: "destructive" });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLoginMode ? 'Login' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {isLoginMode ? 'Enter your credentials or sign in with Google.' : 'Create an account or sign up with Google.'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEmailPasswordSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} type="email" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {authError && (
              <p className="text-sm font-medium text-destructive">{authError}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : (isLoginMode ? 'Login with Email' : 'Sign Up with Email')}
            </Button>

            {/* Separator and Google Button */}
            <div className="relative w-full my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>
            <Button variant="outline" type="button" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignIn} disabled={isSubmitting}>
              <GoogleIcon className="h-5 w-5" />
              Sign in with Google
            </Button>

             <Button
               type="button"
               variant="link"
               onClick={() => {
                 setIsLoginMode(!isLoginMode);
                 setAuthError(null); // Clear errors on mode switch
                 form.reset(); // Reset form fields
               }}
               disabled={isSubmitting}
               className="mt-2"
             >
               {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Login"}
             </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
