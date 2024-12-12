'use client';

import { LoginForm } from '@/components/Auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center">Sign in to your account</h2>
      </div>
      <LoginForm />
      <div className="text-sm text-center">
        <span>Don't have an account? </span>
        <Link href="/auth/register" className="text-blue-600 hover:text-blue-500">
          Register here
        </Link>
      </div>
    </div>
  );
} 