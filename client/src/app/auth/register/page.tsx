'use client';


import { RegisterForm } from '@/components/Auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center">Create an account</h2>
      </div>
      <RegisterForm />
      <div className="text-sm text-center">
        <span>Already have an account? </span>
        <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
          Sign in here
        </Link>
      </div>
    </div>
  );
} 