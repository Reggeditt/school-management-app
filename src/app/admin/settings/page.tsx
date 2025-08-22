'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "@/contexts/store-context";
import { School } from "@/lib/database-services";
import { validateSchoolSettingsForm, validateUserPreferencesForm, SchoolSettingsFormData, UserPreferencesFormData } from "@/lib/form-utils";
import { SubscriptionStatusCard, UsageOverview } from "@/components/subscription-status";

export default function SettingsPage() {
  const { state, loadSchool, updateSchool, updateUserPreferences } = useStore();
  const { toast } = useToast();
  
  // Form states
  const [schoolForm, setSchoolForm] = useState<SchoolSettingsFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    establishedYear: new Date().getFullYear(),
    principalName: ''
  });
  
  const [preferencesForm, setPreferencesForm] = useState<UserPreferencesFormData>({
    emailNotifications: {
      attendance: true,
      exams: true,
      fees: true,
      events: true
    },
    smsNotifications: {
      emergency: true,
      attendance: false,
      fees: false
    },
    academicSettings: {
      currentYear: '2023-2024',
      gradeRanges: {
        A: '90-100',
        B: '80-89',
        C: '70-79',
        D: '60-69',
        F: '0-59'
      }
    },
    securitySettings: {
      passwordExpiry: true,
      passwordExpiryDays: 90,
      twoFactorAuth: {
        admin: true,
        teachers: false,
        parents: false
      }
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load school data on component mount
  useEffect(() => {
    loadSchool();
  }, [loadSchool]);

  // Update form when school data loads
  useEffect(() => {
    if (state.school) {
      setSchoolForm({
        name: state.school.name || '',
        address: state.school.address || '',
        phone: state.school.phone || '',
        email: state.school.email || '',
        website: state.school.website || '',
        establishedYear: state.school.establishedYear || new Date().getFullYear(),
        principalName: state.school.principalName || ''
      });
    }
  }, [state.school]);

  const handleSchoolFormChange = (field: keyof SchoolSettingsFormData, value: string | number) => {
    setSchoolForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveSchoolSettings = async () => {
    const validation = validateSchoolSettingsForm(schoolForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateSchool(schoolForm);
      toast({
        title: "Success",
        description: "School settings updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update school settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    const validation = validateUserPreferencesForm(preferencesForm);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast({
        title: "Validation Error", 
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await updateUserPreferences(preferencesForm);
      toast({
        title: "Success",
        description: "Preferences updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Update your school&apos;s basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input 
                    id="schoolName" 
                    value={schoolForm.name}
                    onChange={(e) => handleSchoolFormChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input 
                    id="establishedYear" 
                    type="number" 
                    value={schoolForm.establishedYear}
                    onChange={(e) => handleSchoolFormChange('establishedYear', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={schoolForm.email}
                    onChange={(e) => handleSchoolFormChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={schoolForm.phone}
                    onChange={(e) => handleSchoolFormChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={schoolForm.website}
                    onChange={(e) => handleSchoolFormChange('website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name</Label>
                  <Input 
                    id="principalName" 
                    value={schoolForm.principalName}
                    onChange={(e) => handleSchoolFormChange('principalName', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={schoolForm.address}
                    onChange={(e) => handleSchoolFormChange('address', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveSchoolSettings}
                  disabled={saving || state.loading.school}
                >
                  {saving || state.loading.school ? 'Saving...' : 'Save School Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionStatusCard />
            <UsageOverview />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and billing details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Advanced billing management features coming soon!</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full max-w-md">
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full max-w-md">
                    Update Payment Method
                  </Button>
                  <Button variant="outline" className="w-full max-w-md">
                    Change Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Year</CardTitle>
              <CardDescription>
                Configure the current academic year and grading system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentYear">Current Academic Year</Label>
                  <Input 
                    id="currentYear" 
                    value={preferencesForm.academicSettings.currentYear}
                    onChange={(e) => setPreferencesForm(prev => ({
                      ...prev,
                      academicSettings: {
                        ...prev.academicSettings,
                        currentYear: e.target.value
                      }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Grade Ranges</Label>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(preferencesForm.academicSettings.gradeRanges).map(([grade, range]) => (
                      <div key={grade} className="space-y-2">
                        <Label htmlFor={`grade${grade}`}>{grade} Grade</Label>
                        <Input 
                          id={`grade${grade}`} 
                          value={range}
                          onChange={(e) => setPreferencesForm(prev => ({
                            ...prev,
                            academicSettings: {
                              ...prev.academicSettings,
                              gradeRanges: {
                                ...prev.academicSettings.gradeRanges,
                                [grade]: e.target.value
                              }
                            }
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSavePreferences}
                  disabled={saving || state.loading.preferences}
                >
                  {saving || state.loading.preferences ? 'Saving...' : 'Save Academic Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(preferencesForm.emailNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for {key}
                      </p>
                    </div>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setPreferencesForm(prev => ({
                        ...prev,
                        emailNotifications: {
                          ...prev.emailNotifications,
                          [key]: checked
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Configure SMS notification settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(preferencesForm.smsNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <p className="text-sm text-muted-foreground">
                        Send SMS notifications for {key}
                      </p>
                    </div>
                    <Switch 
                      checked={value}
                      onCheckedChange={(checked) => setPreferencesForm(prev => ({
                        ...prev,
                        smsNotifications: {
                          ...prev.smsNotifications,
                          [key]: checked
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSavePreferences}
                  disabled={saving || state.loading.preferences}
                >
                  {saving || state.loading.preferences ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme for the application</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Compact Layout</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Configure password requirements and policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Password Expiry</Label>
                    <p className="text-sm text-muted-foreground">Require password change after a certain period</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={preferencesForm.securitySettings.passwordExpiry}
                      onCheckedChange={(checked) => setPreferencesForm(prev => ({
                        ...prev,
                        securitySettings: {
                          ...prev.securitySettings,
                          passwordExpiry: checked
                        }
                      }))}
                    />
                    <Input 
                      type="number" 
                      className="w-20" 
                      value={preferencesForm.securitySettings.passwordExpiryDays}
                      onChange={(e) => setPreferencesForm(prev => ({
                        ...prev,
                        securitySettings: {
                          ...prev.securitySettings,
                          passwordExpiryDays: parseInt(e.target.value)
                        }
                      }))}
                    />
                    <span className="text-sm">days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Configure two-factor authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(preferencesForm.securitySettings.twoFactorAuth).map(([role, enabled]) => (
                  <div key={role} className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable 2FA for {role.charAt(0).toUpperCase() + role.slice(1)}</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for {role} accounts
                      </p>
                    </div>
                    <Switch 
                      checked={enabled}
                      onCheckedChange={(checked) => setPreferencesForm(prev => ({
                        ...prev,
                        securitySettings: {
                          ...prev.securitySettings,
                          twoFactorAuth: {
                            ...prev.securitySettings.twoFactorAuth,
                            [role]: checked
                          }
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSavePreferences}
                  disabled={saving || state.loading.preferences}
                >
                  {saving || state.loading.preferences ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
