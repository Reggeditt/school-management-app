'use client';

import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { 
  SettingsService, 
  type TeacherSettings, 
  type TeacherProfile, 
  type NotificationSettings, 
  type PrivacySettings, 
  type SecuritySettings, 
  type AppearanceSettings,
  type PasswordChangeData 
} from '@/lib/services/settings.service';
import {
  SettingsHeader,
  SettingsTabs,
  ProfileTab,
  NotificationsTab,
  PrivacyTab,
  SecurityTab,
  AppearanceTab
} from '@/components/teacher/settings-components';

export default function TeacherSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<TeacherSettings | null>(null);

  // Load settings on component mount
  useEffect(() => {
    if (user?.uid) {
      loadSettings();
    }
  }, [user]);

  /**
   * Load all teacher settings
   */
  const loadSettings = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const teacherSettings = await SettingsService.getTeacherSettings(user.uid);
      setSettings(teacherSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update profile information
   */
  const handleProfileChange = (profile: TeacherProfile) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, profile } : null);
  };

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    if (!user?.uid || !settings) return;
    
    try {
      setSaving(true);
      
      // Validate profile data
      const validationErrors = SettingsService.validateProfile(settings.profile);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          });
        });
        return;
      }
      
      await SettingsService.updateProfile(user.uid, settings.profile);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Upload profile picture
   */
  const handleUploadPhoto = async (file: File) => {
    if (!user?.uid || !settings) return;
    
    try {
      setUploading(true);
      
      // Validate file
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      const imageUrl = await SettingsService.uploadProfilePicture(user.uid, file);
      
      // Update profile with new image URL
      const updatedProfile = { ...settings.profile, profilePicture: imageUrl };
      setSettings(prev => prev ? { ...prev, profile: updatedProfile } : null);
      
      // Save the updated profile
      await SettingsService.updateProfile(user.uid, updatedProfile);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  /**
   * Update notification settings
   */
  const handleNotificationsChange = (notifications: NotificationSettings) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, notifications } : null);
  };

  /**
   * Save notification settings
   */
  const handleSaveNotifications = async () => {
    if (!user?.uid || !settings) return;
    
    try {
      setSaving(true);
      await SettingsService.updateNotifications(user.uid, settings.notifications);
      
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Update privacy settings
   */
  const handlePrivacyChange = (privacy: PrivacySettings) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, privacy } : null);
  };

  /**
   * Save privacy settings
   */
  const handleSavePrivacy = async () => {
    if (!user?.uid || !settings) return;
    
    try {
      setSaving(true);
      await SettingsService.updatePrivacy(user.uid, settings.privacy);
      
      toast({
        title: "Success",
        description: "Privacy settings updated",
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Update security settings
   */
  const handleSecurityChange = (security: SecuritySettings) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, security } : null);
  };

  /**
   * Change password
   */
  const handlePasswordChange = async (passwordData: PasswordChangeData) => {
    if (!user?.uid) return;
    
    try {
      setSaving(true);
      await SettingsService.changePassword(user.uid, passwordData);
      
      // Update last password change date
      const updatedSecurity = {
        ...settings!.security,
        lastPasswordChange: new Date().toISOString().split('T')[0]
      };
      setSettings(prev => prev ? { ...prev, security: updatedSecurity } : null);
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle two-factor authentication
   */
  const handleToggle2FA = async (enable: boolean) => {
    if (!user?.uid || !settings) return;
    
    try {
      setSaving(true);
      const qrCode = await SettingsService.toggleTwoFactor(user.uid, enable);
      
      // Update security settings
      const updatedSecurity = { ...settings.security, twoFactorEnabled: enable };
      setSettings(prev => prev ? { ...prev, security: updatedSecurity } : null);
      
      if (enable && qrCode) {
        toast({
          title: "Two-Factor Authentication Enabled",
          description: "Scan the QR code with your authenticator app",
        });
        // Here you could show a modal with the QR code
      } else {
        toast({
          title: enable ? "2FA Enabled" : "2FA Disabled",
          description: enable 
            ? "Two-factor authentication has been enabled" 
            : "Two-factor authentication has been disabled",
        });
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Update appearance settings
   */
  const handleAppearanceChange = (appearance: AppearanceSettings) => {
    if (!settings) return;
    setSettings(prev => prev ? { ...prev, appearance } : null);
  };

  /**
   * Save appearance settings
   */
  const handleSaveAppearance = async () => {
    if (!user?.uid || !settings) return;
    
    try {
      setSaving(true);
      await SettingsService.updateAppearance(user.uid, settings.appearance);
      
      toast({
        title: "Success",
        description: "Appearance preferences updated",
      });
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast({
        title: "Error",
        description: "Failed to update appearance settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Export all settings
   */
  const handleExportSettings = async () => {
    if (!user?.uid) return;
    
    try {
      const exportData = await SettingsService.exportSettings(user.uid);
      
      // Create and download JSON file
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `teacher-settings-${user.uid}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Settings exported successfully",
      });
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast({
        title: "Error",
        description: "Failed to export settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">Settings not available</h3>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader onExport={handleExportSettings} />

      {/* Settings Tabs */}
      <SettingsTabs>
        <TabsContent value="profile">
          <ProfileTab
            profile={settings.profile}
            onProfileChange={handleProfileChange}
            onSave={handleSaveProfile}
            onUploadPhoto={handleUploadPhoto}
            saving={saving}
            uploading={uploading}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            notifications={settings.notifications}
            onNotificationsChange={handleNotificationsChange}
            onSave={handleSaveNotifications}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacyTab
            privacy={settings.privacy}
            onPrivacyChange={handlePrivacyChange}
            onSave={handleSavePrivacy}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            security={settings.security}
            onSecurityChange={handleSecurityChange}
            onPasswordChange={handlePasswordChange}
            onToggle2FA={handleToggle2FA}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab
            appearance={settings.appearance}
            onAppearanceChange={handleAppearanceChange}
            onSave={handleSaveAppearance}
            saving={saving}
          />
        </TabsContent>
      </SettingsTabs>
    </div>
  );
}
