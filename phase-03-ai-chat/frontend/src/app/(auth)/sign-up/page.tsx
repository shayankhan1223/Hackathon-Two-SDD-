'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { setAuthToken } from '@/lib/auth';
import { api } from '@/lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getEmailHint = () => {
    if (!formData.email) return undefined;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.auth.register(formData.email, formData.password);

      setAuthToken(
        response.token,
        response.user.id,
        response.user.email
      );

      setShowSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('exists')) {
        setErrors({
          email: 'This email is already registered.',
        });
      } else {
        setErrors({
          email: message || 'An error occurred. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <p className="text-lg font-medium text-green-600 dark:text-green-400">
          Account created successfully!
        </p>
      </div>
    );
  }

  return (
    <div>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4">
          <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Create your account
        </CardTitle>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Get started with AI-powered task management
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email address"
              floatingLabel
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              hint={getEmailHint()}
              disabled={isLoading}
            />
            {errors.email?.includes('already registered') && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                <Link
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Sign in instead
                </Link>
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              floatingLabel
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <PasswordStrengthMeter password={formData.password} />
          </div>

          <Input
            label="Confirm Password"
            floatingLabel
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
            disabled={isLoading}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </div>
  );
}
