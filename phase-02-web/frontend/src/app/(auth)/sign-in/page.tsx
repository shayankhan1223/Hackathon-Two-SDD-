'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api-client';
import { setAuthToken } from '@/lib/auth';
import { signInSchema, type SignInFormData } from '@/lib/validation';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<SignInFormData>>({});
  const [apiError, setApiError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    // Validate form
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<SignInFormData> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof SignInFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const userId = response.user.id;
      const email = response.user.email || formData.email;
      setAuthToken(response.token, userId, email);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string }; status?: number } };
        if (axiosError.response?.status === 401) {
          setApiError('Invalid email or password. Please try again.');
        } else if (axiosError.response?.data?.detail) {
          setApiError(axiosError.response.data.detail);
        } else {
          setApiError('Failed to sign in. Please try again.');
        }
      } else {
        setApiError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-error-light border border-error text-error px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={errors.email ? 'input-error' : 'input'}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={errors.password ? 'input-error' : 'input'}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-primary hover:text-primary-hover font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
