'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  type TeacherProfile, 
  type NotificationSettings, 
  type PrivacySettings, 
  type SecuritySettings, 
  type AppearanceSettings,
  type PasswordChangeData,
  SettingsService 
} from '@/lib/services/settings.service';
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Book,
  Settings as SettingsIcon,
  Download,
  Camera,
  Lock,
  Smartphone,
  Globe
} from "lucide-react";

interface SettingsHeaderProps {
  onExport?: () => void;
}

export function SettingsHeader({ onExport }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
        )}
      </div>
    </div>
  );
}

interface ProfileTabProps {
  profile: TeacherProfile;
  onProfileChange: (profile: TeacherProfile) => void;
  onSave: () => void;
  onUploadPhoto: (file: File) => void;
  saving: boolean;
  uploading: boolean;
}

export function ProfileTab({ 
  profile, 
  onProfileChange, 
  onSave, 
  onUploadPhoto, 
  saving, 
  uploading 
}: ProfileTabProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and teaching details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.profilePicture} />
              <AvatarFallback className="text-lg">
                {SettingsService.getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('profile-picture')?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Change Photo'}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => onProfileChange({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => onProfileChange({ ...profile, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => onProfileChange({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => onProfileChange({ ...profile, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={profile.address}
            onChange={(e) => onProfileChange({ ...profile, address: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => onProfileChange({ ...profile, bio: e.target.value })}
            rows={4}
            placeholder="Tell us about yourself and your teaching experience..."
            maxLength={500}
          />
          <p className="text-sm text-muted-foreground mt-1">
            {profile.bio.length}/500 characters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subjects">Subjects</Label>
            <Input
              id="subjects"
              value={profile.subjects.join(', ')}
              onChange={(e) => onProfileChange({ 
                ...profile, 
                subjects: e.target.value.split(', ').filter(s => s.trim()) 
              })}
              placeholder="Mathematics, Physics, Chemistry"
            />
          </div>
          <div>
            <Label htmlFor="joiningDate">Joining Date</Label>
            <Input
              id="joiningDate"
              type="date"
              value={profile.joiningDate}
              onChange={(e) => onProfileChange({ ...profile, joiningDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="qualifications">Qualifications</Label>
          <Input
            id="qualifications"
            value={profile.qualifications.join(', ')}
            onChange={(e) => onProfileChange({ 
              ...profile, 
              qualifications: e.target.value.split(', ').filter(q => q.trim()) 
            })}
            placeholder="B.Sc Mathematics, M.Ed Education"
          />
        </div>

        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface NotificationsTabProps {
  notifications: NotificationSettings;
  onNotificationsChange: (notifications: NotificationSettings) => void;
  onSave: () => void;
  saving: boolean;
}

export function NotificationsTab({ 
  notifications, 
  onNotificationsChange, 
  onSave, 
  saving 
}: NotificationsTabProps) {
  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    onNotificationsChange({ ...notifications, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Delivery Methods
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
              </div>
              <Switch
                id="sms-notifications"
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => handleToggle('smsNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleToggle('pushNotifications', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Content Types
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
              </div>
              <Switch
                id="attendance-alerts"
                checked={notifications.attendanceAlerts}
                onCheckedChange={(checked) => handleToggle('attendanceAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="grade-reminders">Grade Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders to submit grades</p>
              </div>
              <Switch
                id="grade-reminders"
                checked={notifications.gradeReminders}
                onCheckedChange={(checked) => handleToggle('gradeReminders', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="assignment-deadlines">Assignment Deadlines</Label>
                <p className="text-sm text-muted-foreground">Notifications about upcoming deadlines</p>
              </div>
              <Switch
                id="assignment-deadlines"
                checked={notifications.assignmentDeadlines}
                onCheckedChange={(checked) => handleToggle('assignmentDeadlines', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="parent-messages">Parent Messages</Label>
                <p className="text-sm text-muted-foreground">Messages from parents</p>
              </div>
              <Switch
                id="parent-messages"
                checked={notifications.parentMessages}
                onCheckedChange={(checked) => handleToggle('parentMessages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergency-alerts">Emergency Alerts</Label>
                <p className="text-sm text-muted-foreground">Important emergency notifications</p>
              </div>
              <Switch
                id="emergency-alerts"
                checked={notifications.emergencyAlerts}
                onCheckedChange={(checked) => handleToggle('emergencyAlerts', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reports & Updates
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-reports">Daily Reports</Label>
                <p className="text-sm text-muted-foreground">Daily summary of activities</p>
              </div>
              <Switch
                id="daily-reports"
                checked={notifications.dailyReports}
                onCheckedChange={(checked) => handleToggle('dailyReports', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
              </div>
              <Switch
                id="weekly-reports"
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) => handleToggle('weeklyReports', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-updates">System Updates</Label>
                <p className="text-sm text-muted-foreground">Updates about system maintenance</p>
              </div>
              <Switch
                id="system-updates"
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => handleToggle('systemUpdates', checked)}
              />
            </div>
          </div>
        </div>

        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface PrivacyTabProps {
  privacy: PrivacySettings;
  onPrivacyChange: (privacy: PrivacySettings) => void;
  onSave: () => void;
  saving: boolean;
}

export function PrivacyTab({ privacy, onPrivacyChange, onSave, saving }: PrivacyTabProps) {
  const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
    onPrivacyChange({ ...privacy, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control who can see your information and contact you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="profile-visibility">Profile Visibility</Label>
          <select
            id="profile-visibility"
            value={privacy.profileVisibility}
            onChange={(e) => onPrivacyChange({ 
              ...privacy, 
              profileVisibility: e.target.value as 'public' | 'staff' | 'private' 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="public">🌍 Public - Visible to everyone</option>
            <option value="staff">👥 Staff Only - Visible to school staff</option>
            <option value="private">🔒 Private - Only visible to you</option>
          </select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Contact Information
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Show Email Address</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your email</p>
              </div>
              <Switch
                id="show-email"
                checked={privacy.showEmail}
                onCheckedChange={(checked) => handleToggle('showEmail', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-phone">Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your phone</p>
              </div>
              <Switch
                id="show-phone"
                checked={privacy.showPhone}
                onCheckedChange={(checked) => handleToggle('showPhone', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Communication
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-messages">Allow Messages</Label>
                <p className="text-sm text-muted-foreground">Allow parents to send you messages</p>
              </div>
              <Switch
                id="allow-messages"
                checked={privacy.allowMessages}
                onCheckedChange={(checked) => handleToggle('allowMessages', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-direct-messages">Allow Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Allow staff to message you directly</p>
              </div>
              <Switch
                id="allow-direct-messages"
                checked={privacy.allowDirectMessages}
                onCheckedChange={(checked) => handleToggle('allowDirectMessages', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sharing & Visibility
          </h4>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-schedule">Share Schedule</Label>
                <p className="text-sm text-muted-foreground">Share your schedule with other staff</p>
              </div>
              <Switch
                id="share-schedule"
                checked={privacy.shareSchedule}
                onCheckedChange={(checked) => handleToggle('shareSchedule', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-calendar">Show Calendar</Label>
                <p className="text-sm text-muted-foreground">Make your calendar visible to others</p>
              </div>
              <Switch
                id="show-calendar"
                checked={privacy.showCalendar}
                onCheckedChange={(checked) => handleToggle('showCalendar', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-resource-library">Share Resource Library</Label>
                <p className="text-sm text-muted-foreground">Share your teaching resources with colleagues</p>
              </div>
              <Switch
                id="share-resource-library"
                checked={privacy.shareResourceLibrary}
                onCheckedChange={(checked) => handleToggle('shareResourceLibrary', checked)}
              />
            </div>
          </div>
        </div>

        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Privacy Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface SecurityTabProps {
  security: SecuritySettings;
  onSecurityChange: (security: SecuritySettings) => void;
  onPasswordChange: (passwordData: PasswordChangeData) => void;
  onToggle2FA: (enable: boolean) => void;
  saving: boolean;
}

export function SecurityTab({ 
  security, 
  onSecurityChange, 
  onPasswordChange, 
  onToggle2FA, 
  saving 
}: SecurityTabProps) {
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const { toast } = useToast();

  const handlePasswordSubmit = () => {
    const validation = SettingsService.validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        toast({
          title: "Password Error",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    onPasswordChange(passwordData);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={security.twoFactorEnabled ? "default" : "secondary"}>
                  {security.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <Switch
                  id="two-factor"
                  checked={security.twoFactorEnabled}
                  onCheckedChange={onToggle2FA}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="login-notifications">Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified of new logins</p>
              </div>
              <Switch
                id="login-notifications"
                checked={security.loginNotifications}
                onCheckedChange={(checked) => 
                  onSecurityChange({ ...security, loginNotifications: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="suspicious-activity">Suspicious Activity Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for unusual account activity</p>
              </div>
              <Switch
                id="suspicious-activity"
                checked={security.suspiciousActivityAlerts}
                onCheckedChange={(checked) => 
                  onSecurityChange({ ...security, suspiciousActivityAlerts: checked })
                }
              />
            </div>
            
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                min="5"
                max="480"
                value={security.sessionTimeout}
                onChange={(e) => 
                  onSecurityChange({ 
                    ...security, 
                    sessionTimeout: parseInt(e.target.value) || 60 
                  })
                }
                className="mt-1 max-w-xs"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Automatically log out after this period of inactivity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ 
                  ...prev, 
                  currentPassword: e.target.value 
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ 
                  ...prev, 
                  current: !prev.current 
                }))}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ 
                  ...prev, 
                  newPassword: e.target.value 
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ 
                  ...prev, 
                  new: !prev.new 
                }))}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ 
                  ...prev, 
                  confirmPassword: e.target.value 
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPasswords(prev => ({ 
                  ...prev, 
                  confirm: !prev.confirm 
                }))}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-1">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>

          <Button onClick={handlePasswordSubmit} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changing...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface AppearanceTabProps {
  appearance: AppearanceSettings;
  onAppearanceChange: (appearance: AppearanceSettings) => void;
  onSave: () => void;
  saving: boolean;
}

export function AppearanceTab({ 
  appearance, 
  onAppearanceChange, 
  onSave, 
  saving 
}: AppearanceTabProps) {
  const timezones = SettingsService.getTimezones();
  const languages = SettingsService.getLanguages();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance & Preferences</CardTitle>
        <CardDescription>
          Customize your interface and regional preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={appearance.theme}
              onChange={(e) => onAppearanceChange({ 
                ...appearance, 
                theme: e.target.value as AppearanceSettings['theme'] 
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="system">💻 System</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={appearance.language}
              onChange={(e) => onAppearanceChange({ 
                ...appearance, 
                language: e.target.value 
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            value={appearance.timezone}
            onChange={(e) => onAppearanceChange({ 
              ...appearance, 
              timezone: e.target.value 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date-format">Date Format</Label>
            <select
              id="date-format"
              value={appearance.dateFormat}
              onChange={(e) => onAppearanceChange({ 
                ...appearance, 
                dateFormat: e.target.value as AppearanceSettings['dateFormat'] 
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="time-format">Time Format</Label>
            <select
              id="time-format"
              value={appearance.timeFormat}
              onChange={(e) => onAppearanceChange({ 
                ...appearance, 
                timeFormat: e.target.value as AppearanceSettings['timeFormat'] 
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="12h">12 Hour (AM/PM)</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="dashboard-layout">Dashboard Layout</Label>
          <select
            id="dashboard-layout"
            value={appearance.dashboardLayout}
            onChange={(e) => onAppearanceChange({ 
              ...appearance, 
              dashboardLayout: e.target.value as AppearanceSettings['dashboardLayout'] 
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="compact">Compact</option>
            <option value="spacious">Spacious</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-sidebar">Show Sidebar</Label>
              <p className="text-sm text-muted-foreground">Keep sidebar visible by default</p>
            </div>
            <Switch
              id="show-sidebar"
              checked={appearance.showSidebar}
              onCheckedChange={(checked) => 
                onAppearanceChange({ ...appearance, showSidebar: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enable-animations">Enable Animations</Label>
              <p className="text-sm text-muted-foreground">Use smooth transitions and animations</p>
            </div>
            <Switch
              id="enable-animations"
              checked={appearance.enableAnimations}
              onCheckedChange={(checked) => 
                onAppearanceChange({ ...appearance, enableAnimations: checked })
              }
            />
          </div>
        </div>

        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

interface SettingsTabsProps {
  children: React.ReactNode;
}

export function SettingsTabs({ children }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Privacy
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Appearance
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
