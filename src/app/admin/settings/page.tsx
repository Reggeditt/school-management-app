import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
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
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" defaultValue="SchoolSync Academy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code</Label>
                  <Input id="schoolCode" defaultValue="SSA-2023" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="info@schoolsync.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue="123 Education Street, Learning City, Knowledge State, 12345" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Administrator Information</CardTitle>
              <CardDescription>
                Update the school administrator&apos;s contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Administrator Name</Label>
                  <Input id="adminName" defaultValue="Dr. Jane Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminTitle">Title</Label>
                  <Input id="adminTitle" defaultValue="Principal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email Address</Label>
                  <Input id="adminEmail" type="email" defaultValue="principal@schoolsync.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Phone Number</Label>
                  <Input id="adminPhone" defaultValue="+1 (555) 123-4568" />
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
                Configure the current academic year and terms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Current Academic Year</Label>
                  <Input id="academicYear" defaultValue="2023-2024" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentTerm">Current Term</Label>
                  <select id="currentTerm" className="w-full border rounded px-3 py-2">
                    <option value="1">First Term</option>
                    <option value="2">Second Term</option>
                    <option value="3">Third Term</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" defaultValue="2023-09-01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" defaultValue="2024-06-30" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grading System</CardTitle>
              <CardDescription>
                Configure the grading system for the school.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradingScale">Grading Scale</Label>
                  <select id="gradingScale" className="w-full border rounded px-3 py-2">
                    <option value="percentage">Percentage (0-100)</option>
                    <option value="letter">Letter Grade (A-F)</option>
                    <option value="gpa">GPA (0.0-4.0)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingGrade">Passing Grade</Label>
                  <Input id="passingGrade" defaultValue="60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grade Boundaries</Label>
                <div className="rounded-md border p-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradeA">A Grade</Label>
                      <Input id="gradeA" defaultValue="90-100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeB">B Grade</Label>
                      <Input id="gradeB" defaultValue="80-89" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeC">C Grade</Label>
                      <Input id="gradeC" defaultValue="70-79" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeD">D Grade</Label>
                      <Input id="gradeD" defaultValue="60-69" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeF">F Grade</Label>
                      <Input id="gradeF" defaultValue="0-59" />
                    </div>
                  </div>
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Student Attendance</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for student absences</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Exam Results</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications when exam results are published</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Fee Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send email reminders for upcoming fee payments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">School Events</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for upcoming school events</p>
                  </div>
                  <Switch defaultChecked />
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send SMS notifications for emergency situations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Attendance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send SMS notifications for student absences</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Fee Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send SMS reminders for fee payments</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of the school management system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer border-2 border-primary"></div>
                      <span className="text-xs">Blue</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer"></div>
                      <span className="text-xs">Green</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer"></div>
                      <span className="text-xs">Purple</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
                      <span className="text-xs">Red</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer"></div>
                      <span className="text-xs">Orange</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolLogo">School Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                    <Button variant="outline">Upload New Logo</Button>
                  </div>
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
                Configure password requirements for user accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Minimum Password Length</Label>
                    <p className="text-sm text-muted-foreground">Require a minimum number of characters</p>
                  </div>
                  <Input type="number" className="w-20" defaultValue="8" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Uppercase Letters</Label>
                    <p className="text-sm text-muted-foreground">Require at least one uppercase letter</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Numbers</Label>
                    <p className="text-sm text-muted-foreground">Require at least one number</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Require Special Characters</Label>
                    <p className="text-sm text-muted-foreground">Require at least one special character</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Password Expiry</Label>
                    <p className="text-sm text-muted-foreground">Require password change after a certain period</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch defaultChecked />
                    <Input type="number" className="w-20" defaultValue="90" />
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable 2FA for Administrators</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication for admin accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable 2FA for Teachers</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication for teacher accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable 2FA for Parents</Label>
                    <p className="text-sm text-muted-foreground">Require two-factor authentication for parent accounts</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}