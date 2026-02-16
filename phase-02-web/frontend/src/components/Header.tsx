'use client';

import { useRouter } from 'next/navigation';
import { clearAuth, getUserId } from '@/lib/auth';

export default function Header() {
  const router = useRouter();

  const handleSignOut = () => {
    clearAuth();
    router.push('/sign-in');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Todo App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
