'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

interface TimetableSettings {
  schoolStartTime: string;
  schoolEndTime: string;
  classDuration: number;
  recessDuration: number;
  lunchDuration: number;
  numberOfRecess: number;
  workingDays: string[];
  maxPeriodsPerDay: number;
  minBreakBetweenClasses: number;
}

interface TimetableSettingsProps {
  settings: TimetableSettings;
  onSettingsChange: (settings: TimetableSettings) => void;
  onClose: () => void;
}

export function TimetableSettings({ settings, onSettingsChange, onClose }: TimetableSettingsProps) {
  const updateSetting = (key: keyof TimetableSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const toggleWorkingDay = (day: string) => {
    const updatedDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter(d => d !== day)
      : [...settings.workingDays, day];
    updateSetting('workingDays', updatedDays);
  };

  const workingDaysOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  return (
    <div className="space-y-6">
      {/* School Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('clock')}
            School Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">School Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={settings.schoolStartTime}
                onChange={(e) => updateSetting('schoolStartTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endTime">School End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={settings.schoolEndTime}
                onChange={(e) => updateSetting('schoolEndTime', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('calendar')}
            Period Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="classDuration">Class Duration (minutes)</Label>
              <Input
                id="classDuration"
                type="number"
                value={settings.classDuration}
                onChange={(e) => updateSetting('classDuration', parseInt(e.target.value))}
                min="30"
                max="90"
              />
            </div>
            <div>
              <Label htmlFor="maxPeriodsPerDay">Max Periods Per Day</Label>
              <Input
                id="maxPeriodsPerDay"
                type="number"
                value={settings.maxPeriodsPerDay}
                onChange={(e) => updateSetting('maxPeriodsPerDay', parseInt(e.target.value))}
                min="4"
                max="12"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="minBreak">Min Break Between Classes (minutes)</Label>
            <Input
              id="minBreak"
              type="number"
              value={settings.minBreakBetweenClasses}
              onChange={(e) => updateSetting('minBreakBetweenClasses', parseInt(e.target.value))}
              min="0"
              max="15"
            />
          </div>
        </CardContent>
      </Card>

      {/* Break Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('coffee')}
            Break Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numberOfRecess">Number of Recess</Label>
              <Select
                value={settings.numberOfRecess.toString()}
                onValueChange={(value) => updateSetting('numberOfRecess', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Recess</SelectItem>
                  <SelectItem value="2">2 Recess</SelectItem>
                  <SelectItem value="3">3 Recess</SelectItem>
                  <SelectItem value="4">4 Recess</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recessDuration">Recess Duration (minutes)</Label>
              <Input
                id="recessDuration"
                type="number"
                value={settings.recessDuration}
                onChange={(e) => updateSetting('recessDuration', parseInt(e.target.value))}
                min="10"
                max="30"
              />
            </div>
            <div>
              <Label htmlFor="lunchDuration">Lunch Duration (minutes)</Label>
              <Input
                id="lunchDuration"
                type="number"
                value={settings.lunchDuration}
                onChange={(e) => updateSetting('lunchDuration', parseInt(e.target.value))}
                min="20"
                max="60"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Days */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('calendar-days')}
            Working Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {workingDaysOptions.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={day.value}
                  checked={settings.workingDays.includes(day.value)}
                  onCheckedChange={() => toggleWorkingDay(day.value)}
                />
                <Label htmlFor={day.value}>{day.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onClose}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
