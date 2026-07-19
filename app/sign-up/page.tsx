'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, Sparkles, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { GoogleIcon, GitHubIcon } from '@/components/icons';

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Enter your name'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Use at least 8 characters'),
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { toast } = useToast();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onEmailSignUp(values: SignUpValues) {
    setLoadingProvider('email');
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });
    setLoadingProvider(null);
    if (error) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    if (data?.session) {
      toast({ title: 'Account created', description: 'Welcome aboard!' });
      window.location.href = '/dashboard';
    } else {
      toast({
        title: 'Check your email',
        description: 'We sent a confirmation link to complete sign up.',
      });
    }
  }

  async function onOAuth(provider: 'google' | 'github') {
    setLoadingProvider(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setLoadingProvider(null);
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-sm space-y-8 animate-in">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-muted-foreground">
              Start running your agency on autopilot in minutes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => onOAuth('google')}
              disabled={loadingProvider !== null}
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => onOAuth('github')}
              disabled={loadingProvider !== null}
            >
              {loadingProvider === 'github' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GitHubIcon className="h-4 w-4" />
              )}
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-background px-2 text-muted-foreground">
                or sign up with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onEmailSignUp)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane Doe"
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@agency.com"
                        className="h-11 rounded-xl"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="At least 8 characters"
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 rounded-xl"
                disabled={loadingProvider !== null}
              >
                {loadingProvider === 'email' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-background order-1 lg:order-2">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />

        <div className="relative z-10 flex items-center justify-end gap-2">
          <span className="text-lg font-semibold tracking-tight">
            AI Agency OS
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Everything you need to{' '}
            <span className="gradient-text">scale your agency</span>
          </h1>
          <ul className="space-y-3 text-muted-foreground">
            {[
              'Client & project management in one place',
              'Revenue tracking with real-time analytics',
              'Team collaboration and role-based access',
              'Automated workflows powered by AI',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          No credit card required · 14-day full-access trial
        </div>
      </div>
    </div>
  );
}
