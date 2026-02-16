'use client';

import { useState } from 'react';
import { User, Mail, Lock, Bell, Globe, Moon, Sun, Save, CreditCard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    theme: 'system',
    language: 'English',
    timezone: 'GMT-08:00 America/Los Angeles',
  });

  const handleSave = () => {
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentKey = parent as keyof typeof prev;
        const parentValue = prev[parentKey];
        if (typeof parentValue === 'object' && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

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
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              leftIcon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              leftIcon={<Globe className="h-4 w-4" />}
            />
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
                <span>Email Notifications</span>
              </div>
              <Switch
                checked={formData.notifications.email}
                onCheckedChange={(checked) => handleInputChange('notifications.email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Push Notifications</span>
              </div>
              <Switch
                checked={formData.notifications.push}
                onCheckedChange={(checked) => handleInputChange('notifications.push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>SMS Notifications</span>
              </div>
              <Switch
                checked={formData.notifications.sms}
                onCheckedChange={(checked) => handleInputChange('notifications.sms', checked)}
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
                  variant={formData.theme === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('theme', 'light')}
                  leftIcon={<Sun className="h-4 w-4" />}
                >
                  Light
                </Button>
                <Button
                  variant={formData.theme === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('theme', 'dark')}
                  leftIcon={<Moon className="h-4 w-4" />}
                >
                  Dark
                </Button>
                <Button
                  variant={formData.theme === 'system' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleInputChange('theme', 'system')}
                  leftIcon={<Globe className="h-4 w-4" />}
                >
                  System
                </Button>
              </div>
            </div>
            <Input
              label="Language"
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              leftIcon={<Globe className="h-4 w-4" />}
            />
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
            <Button variant="outline" leftIcon={<Lock className="h-4 w-4" />}>
              Change Password
            </Button>
            <Button variant="outline" leftIcon={<CreditCard className="h-4 w-4" />}>
              Payment Methods
            </Button>
            <Button variant="outline" leftIcon={<Building2 className="h-4 w-4" />}>
              Billing Information
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
