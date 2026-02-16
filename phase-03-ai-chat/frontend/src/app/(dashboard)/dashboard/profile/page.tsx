'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    id: '',
    email: '',
    createdAt: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from auth
        const user = getUser();
        if (!user) {
          router.push('/sign-in');
          return;
        }

        setUserData({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100">{userData.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account ID
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm">{userData.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Created
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h2>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Change Password
              </button>

              <button
                onClick={() => router.push('/dashboard/settings')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                Manage Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}