'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Student, Class } from '@/lib/database-services';
import { exportSelectedStudents, exportAllStudents, ExportOptions } from '@/lib/export-service';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudents?: Student[];
  classes: Class[];
  exportType: 'selected' | 'all';
}

export function ExportDialog({ 
  open, 
  onClose, 
  students, 
  selectedStudents = [], 
  classes, 
  exportType 
}: ExportDialogProps) {
  const [format, setFormat] = useState<'excel' | 'csv'>('excel');
  const [includeGuardians, setIncludeGuardians] = useState(true);
  const [includeStats, setIncludeStats] = useState(true);
  const [customFilename, setCustomFilename] = useState('');
  const [exporting, setExporting] = useState(false);

  const studentsToExport = exportType === 'selected' ? selectedStudents : students;
  const studentCount = studentsToExport.length;

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const options: ExportOptions = {
        format,
        includeGuardians,
        includeStats,
        filename: customFilename || undefined
      };

      if (exportType === 'selected') {
        exportSelectedStudents(selectedStudents, classes, options);
      } else {
        exportAllStudents(students, classes, format);
      }

      setTimeout(() => {
        setExporting(false);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Export failed:', error);
      setExporting(false);
    }
  };

  const generateDefaultFilename = () => {
    const date = new Date().toISOString().split('T')[0];
    const type = exportType === 'selected' ? 'selected' : 'all';
    return `students_${type}_${studentCount}_${date}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Students
          </DialogTitle>
          <DialogDescription>
            Configure export options for {studentCount} student{studentCount !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Export Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    format === 'excel' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormat('excel')}
                >
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">Excel (.xlsx)</h3>
                      <p className="text-sm text-muted-foreground">
                        Rich formatting with multiple sheets
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    format === 'csv' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setFormat('csv')}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">CSV (.csv)</h3>
                      <p className="text-sm text-muted-foreground">
                        Simple format for spreadsheet import
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-guardians"
                    checked={includeGuardians}
                    onCheckedChange={(checked) => setIncludeGuardians(!!checked)}
                  />
                  <Label htmlFor="include-guardians" className="text-sm">
                    Include guardian information
                  </Label>
                </div>

                {format === 'excel' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-stats"
                      checked={includeStats}
                      onCheckedChange={(checked) => setIncludeStats(!!checked)}
                    />
                    <Label htmlFor="include-stats" className="text-sm">
                      Include statistics and class summary sheets
                    </Label>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="filename">Custom Filename (optional)</Label>
                <Input
                  id="filename"
                  value={customFilename}
                  onChange={(e) => setCustomFilename(e.target.value)}
                  placeholder={generateDefaultFilename()}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default filename
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Students:</span> {studentCount}
                </div>
                <div>
                  <span className="font-medium">Format:</span> {format.toUpperCase()}
                </div>
                <div>
                  <span className="font-medium">Guardian Info:</span> {includeGuardians ? 'Yes' : 'No'}
                </div>
                {format === 'excel' && (
                  <div>
                    <span className="font-medium">Statistics:</span> {includeStats ? 'Yes' : 'No'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={exporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting || studentCount === 0}>
            {exporting ? 'Exporting...' : `Export ${studentCount} Student${studentCount !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
