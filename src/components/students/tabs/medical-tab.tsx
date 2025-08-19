'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getStudentMedicalConditions, getStudentVaccinations, getStudentMedicalHistory } from '../data/student-mock-data';
import { formatDate } from '../utils/student-utils';

interface MedicalTabProps {
  student: Student;
}

export function MedicalTab({ student }: MedicalTabProps) {
  const medicalConditions = getStudentMedicalConditions();
  const vaccinations = getStudentVaccinations();
  const medicalHistory = getStudentMedicalHistory();

  return (
    <div className="space-y-6">
      {/* Medical Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Medical Records & Health Information</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            {getNavigationIcon('plus')}
            Add Medical Record
          </Button>
          <Button variant="outline">
            {getNavigationIcon('download')}
            Export Records
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Health Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('heart')}
              Basic Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Blood Group</span>
                <p>{student.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Height</span>
                <p>5'4" (162 cm)</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Weight</span>
                <p>120 lbs (54 kg)</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">BMI</span>
                <p>20.6 (Normal)</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Vision</span>
                <p>20/20 (Normal)</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Hearing</span>
                <p>Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('alert-triangle')}
              Medical Conditions & Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medicalConditions.length > 0 ? (
              <div className="space-y-3">
                {medicalConditions.map((condition, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{condition.condition}</p>
                        <Badge 
                          variant={condition.severity === 'Severe' ? 'destructive' : 
                                   condition.severity === 'Moderate' ? 'default' : 'secondary'}
                          className="text-xs mt-1"
                        >
                          {condition.severity}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Medication:</span> {condition.medication}</p>
                      <p><span className="font-medium">Notes:</span> {condition.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <div className="text-4xl mb-2">{getNavigationIcon('check-circle')}</div>
                <p>No known medical conditions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vaccination Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('shield-check')}
            Vaccination Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaccinations.map((vaccine, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium text-sm">{vaccine.vaccine}</p>
                  <p className="text-xs text-muted-foreground">
                    {vaccine.date ? formatDate(vaccine.date) : 'Not completed'}
                  </p>
                  {vaccine.dueDate && (
                    <p className="text-xs text-muted-foreground">
                      Due: {formatDate(vaccine.dueDate)}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={vaccine.status === 'completed' ? 'default' : 
                          vaccine.status === 'overdue' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {vaccine.status === 'completed' ? 'Complete' : 
                   vaccine.status === 'overdue' ? 'Overdue' : vaccine.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('file-text')}
            Recent Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medicalHistory.map((record, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{record.type}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(record.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.provider}</p>
                  <p className="text-sm mt-1">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Medical Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('alert-circle')}
            Emergency Medical Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              Critical Information for Staff
            </h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>• Student carries an EpiPen for severe nut allergies</li>
              <li>• In case of asthma attack, provide inhaler immediately</li>
              <li>• Contact emergency services if student becomes unconscious</li>
              <li>• Notify parents immediately for any medical incident</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
