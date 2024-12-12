'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] mix-blend-overlay opacity-20" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="space-y-4 text-white">
            <h1 className="text-4xl font-bold">Inventory Management System</h1>
            <p className="text-lg opacity-90 max-w-lg">
              Streamline your inventory process with our powerful management system. Track, manage, and optimize your stock efficiently.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-sm space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
} 