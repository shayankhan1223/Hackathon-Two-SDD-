'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Bell, Globe, Moon, Sun, Save, CreditCard, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsPage() {
  const { theme: currentTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    timezone: 'UTC',
    email_notifications: true,
    push_notifications: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        // Get user email from auth
        const user = getUser();
        if (!user) {
          router.push('/sign-in');
          return;
        }

        setFormData(prev => ({
          ...prev,
          email: user.email
        }));

        // Fetch preferences from API
        const preferences = await api.user.preferences.get();

        // Update theme in the hook based on user preference
        if (preferences.theme === 'light') {
          setLightTheme();
        } else if (preferences.theme === 'dark') {
          setDarkTheme();
        } else {
          setSystemTheme();
        }

        setFormData({
          display_name: preferences.display_name || '',
          email: user.email,
          timezone: preferences.timezone || 'UTC',
          email_notifications: preferences.email_notifications,
          push_notifications: preferences.push_notifications,
        });
      } catch (err) {
        console.error('Error fetching user preferences:', err);

        // Check if it's an authentication error
        if (err instanceof Error) {
          if (err.message.includes('401') || err.message.includes('Invalid token')) {
            // Redirect to sign in if unauthorized
            router.push('/sign-in');
          } else if (err.message.includes('Network error') || err.message.includes('Unable to reach')) {
            setError('Cannot connect to the server. Please ensure the backend is running on http://localhost:8000');
          } else {
            setError('Failed to load user preferences. Please check your connection and try again.');
          }
        } else {
          setError('Failed to load user preferences. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, [router]); // Removed theme functions from dependencies to prevent infinite loop

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      // Update user preferences via API
      const response = await api.user.preferences.update({
        display_name: formData.display_name,
        timezone: formData.timezone,
        theme: currentTheme, // Use current theme from hook
        email_notifications: formData.email_notifications,
        push_notifications: formData.push_notifications,
      });

      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);

      if (err instanceof Error) {
        if (err.message.includes('Network error') || err.message.includes('Unable to reach')) {
          setError('Cannot save settings. Please ensure the backend is running on http://localhost:8000');
          toast.error('Cannot save settings. Backend server is not reachable.');
        } else {
          setError('Failed to save settings. Please try again.');
          toast.error('Failed to save settings');
        }
      } else {
        setError('Failed to save settings. Please try again.');
        toast.error('Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    // Navigate to change password page
    router.push('/change-password'); // Redirect to change password page
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences and settings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              disabled
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los Angeles</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white">Email Notifications</span>
              </div>
              <Switch
                checked={formData.email_notifications}
                onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white">Push Notifications</span>
              </div>
              <Switch
                checked={formData.push_notifications}
                onCheckedChange={(checked) => handleInputChange('push_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                <Button
                  variant={currentTheme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setLightTheme()}
                  leftIcon={<Sun className="h-4 w-4" />}
                >
                  Light
                </Button>
                <Button
                  variant={currentTheme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setDarkTheme()}
                  leftIcon={<Moon className="h-4 w-4" />}
                >
                  Dark
                </Button>
                <Button
                  variant={currentTheme === 'system' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSystemTheme()}
                  leftIcon={<Globe className="h-4 w-4" />}
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              leftIcon={<Lock className="h-4 w-4" />}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
            <Button variant="outline" leftIcon={<CreditCard className="h-4 w-4" />} disabled>
              Payment Methods
            </Button>
            <Button variant="outline" leftIcon={<Building2 className="h-4 w-4" />} disabled>
              Billing Information
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          leftIcon={<Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
