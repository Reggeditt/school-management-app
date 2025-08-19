'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Download,
  User,
  Lock,
  Smartphone
} from 'lucide-react';

export default function StudentSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    grades: true,
    attendance: true,
    assignments: true,
    announcements: true,
    reminders: false
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC+1',
    dateFormat: 'dd/mm/yyyy',
    theme: 'system'
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Settings Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-3" />
                Profile Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Palette className="h-4 w-4 mr-3" />
                Appearance
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-3" />
                Privacy & Security
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Download className="h-4 w-4 mr-3" />
                Data & Export
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={user?.email?.split('@')[0] || ''}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
              <Button>Update Profile</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="grades-notifications">Grade Updates</Label>
                    <p className="text-sm text-gray-500">Get notified when new grades are posted</p>
                  </div>
                  <Switch
                    id="grades-notifications"
                    checked={notifications.grades}
                    onCheckedChange={(checked) => handleNotificationChange('grades', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="attendance-notifications">Attendance Alerts</Label>
                    <p className="text-sm text-gray-500">Receive attendance warnings and updates</p>
                  </div>
                  <Switch
                    id="attendance-notifications"
                    checked={notifications.attendance}
                    onCheckedChange={(checked) => handleNotificationChange('attendance', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="assignments-notifications">Assignment Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminders for upcoming assignments</p>
                  </div>
                  <Switch
                    id="assignments-notifications"
                    checked={notifications.assignments}
                    onCheckedChange={(checked) => handleNotificationChange('assignments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="announcements-notifications">School Announcements</Label>
                    <p className="text-sm text-gray-500">Receive important school announcements</p>
                  </div>
                  <Switch
                    id="announcements-notifications"
                    checked={notifications.announcements}
                    onCheckedChange={(checked) => handleNotificationChange('announcements', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reminders-notifications">Study Reminders</Label>
                    <p className="text-sm text-gray-500">Daily study and homework reminders</p>
                  </div>
                  <Switch
                    id="reminders-notifications"
                    checked={notifications.reminders}
                    onCheckedChange={(checked) => handleNotificationChange('reminders', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Browser notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">SMS notifications</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Language
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    value={preferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-gray-500">Control who can see your profile information</p>
                  </div>
                  <select className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                    <option>Teachers & Students</option>
                    <option>Teachers Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activity Status</Label>
                    <p className="text-sm text-gray-500">Show when you're online</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Grade Sharing</Label>
                    <p className="text-sm text-gray-500">Allow parents to view your grades</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password & Security
                </h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Login Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data & Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Academic Transcript</h4>
                    <p className="text-sm text-gray-500">Download your complete academic record</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Attendance Report</h4>
                    <p className="text-sm text-gray-500">Export your attendance records</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Grade Report</h4>
                    <p className="text-sm text-gray-500">Download all your grades and exam results</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Delete Account
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" size="sm">
                  Request Account Deletion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
