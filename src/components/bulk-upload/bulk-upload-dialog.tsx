'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Student, Class } from '@/lib/database-services';
import { 
  parseExcelFile, 
  parseCSVFile, 
  validateBulkData, 
  exportStudentTemplate, 
  exportValidationErrors,
  BulkUploadResult,
  BulkUploadError
} from '@/lib/bulk-upload-service';

interface BulkUploadDialogProps {
  open: boolean;
  onClose: () => void;
  classes: Class[];
  existingStudents: Student[];
  onBulkImport: (students: Partial<Student>[]) => Promise<boolean>;
}

export function BulkUploadDialog({ 
  open, 
  onClose, 
  classes, 
  existingStudents, 
  onBulkImport 
}: BulkUploadDialogProps) {
  const [step, setStep] = useState<'upload' | 'validate' | 'preview' | 'import'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<BulkUploadResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid Excel (.xlsx, .xls) or CSV file');
        return;
      }
      
      setFile(selectedFile);
      setStep('validate');
    }
  };

  const handleValidate = async () => {
    if (!file) return;
    
    try {
      let rawData: any[];
      
      if (file.type === 'text/csv') {
        rawData = await parseCSVFile(file);
      } else {
        rawData = await parseExcelFile(file);
      }
      
      const result = validateBulkData(rawData, existingStudents, classes);
      setValidationResult(result);
      setStep('preview');
    } catch (error) {
      alert(`File parsing failed: ${error}`);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.validData) return;
    
    setImporting(true);
    setStep('import');
    
    try {
      const batchSize = 10;
      const totalBatches = Math.ceil(validationResult.validData.length / batchSize);
      
      for (let i = 0; i < totalBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, validationResult.validData.length);
        const batch = validationResult.validData.slice(start, end);
        
        // Process batch (you would implement batch processing in your onBulkImport)
        await onBulkImport(batch);
        
        setImportProgress(Math.round(((i + 1) / totalBatches) * 100));
        
        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      alert(`Successfully imported ${validationResult.validData.length} students!`);
      handleClose();
    } catch (error) {
      alert(`Import failed: ${error}`);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setValidationResult(null);
    setImporting(false);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDownloadTemplate = () => {
    exportStudentTemplate(classes);
  };

  const handleDownloadErrors = () => {
    if (validationResult?.errors) {
      exportValidationErrors(validationResult.errors);
    }
  };

  const ErrorSummary = ({ errors }: { errors: BulkUploadError[] }) => {
    const errorsByRow = errors.reduce((acc, error) => {
      if (!acc[error.row]) acc[error.row] = [];
      acc[error.row].push(error);
      return acc;
    }, {} as Record<number, BulkUploadError[]>);

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            {errors.filter(e => e.severity === 'error').length} Errors
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {errors.filter(e => e.severity === 'warning').length} Warnings
          </Badge>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Row</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.slice(0, 50).map((error, index) => (
                <TableRow key={index}>
                  <TableCell>{error.row}</TableCell>
                  <TableCell className="font-mono text-sm">{error.field}</TableCell>
                  <TableCell className="max-w-32 truncate">{error.value}</TableCell>
                  <TableCell>
                    <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'}>
                      {error.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{error.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {errors.length > 50 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Showing first 50 errors. Download full error report for complete details.
            </p>
          )}
        </div>
      </div>
    );
  };

  const PreviewData = ({ students }: { students: Partial<Student>[] }) => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Showing first 10 valid records. Total: {students.length}
      </div>
      <div className="max-h-60 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Guardians</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.slice(0, 10).map((student, index) => (
              <TableRow key={index}>
                <TableCell>{student.firstName} {student.lastName}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.guardians?.length || 0}</TableCell>
                <TableCell className="max-w-32 truncate">{student.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Students</DialogTitle>
          <DialogDescription>
            Import multiple students from Excel or CSV files
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            {['upload', 'validate', 'preview', 'import'].map((stepName, index) => (
              <div key={stepName} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName 
                    ? 'bg-primary text-primary-foreground' 
                    : index < ['upload', 'validate', 'preview', 'import'].indexOf(step)
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <span className="text-sm capitalize">{stepName}</span>
                {index < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download the Excel template with proper column headers and example data
                  </p>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Choose file to upload</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports Excel (.xlsx, .xls) and CSV files
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Select File
                  </Button>
                </div>

                {file && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      File selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {step === 'validate' && (
            <Card>
              <CardHeader>
                <CardTitle>Validate Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Ready to validate: {file?.name}
                  </AlertDescription>
                </Alert>
                <Button onClick={handleValidate} className="w-full">
                  Validate File
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'preview' && validationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{validationResult.processedCount}</div>
                    <div className="text-sm text-muted-foreground">Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{validationResult.validData.length}</div>
                    <div className="text-sm text-muted-foreground">Valid</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{validationResult.errorCount}</div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{validationResult.warningCount}</div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                </div>

                {validationResult.errors.length > 0 && (
                  <Tabs defaultValue="errors" className="w-full">
                    <TabsList>
                      <TabsTrigger value="errors">Issues</TabsTrigger>
                      <TabsTrigger value="preview">Valid Data Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="errors">
                      <ErrorSummary errors={validationResult.errors} />
                      {validationResult.errors.length > 0 && (
                        <Button
                          onClick={handleDownloadErrors}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Error Report
                        </Button>
                      )}
                    </TabsContent>
                    <TabsContent value="preview">
                      <PreviewData students={validationResult.validData} />
                    </TabsContent>
                  </Tabs>
                )}

                {validationResult.validData.length === 0 ? (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      No valid records found. Please fix the errors and try again.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setStep('upload')} variant="outline">
                      Back to Upload
                    </Button>
                    <Button 
                      onClick={handleImport}
                      disabled={validationResult.errorCount > 0}
                      className="flex-1"
                    >
                      Import {validationResult.validData.length} Students
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 'import' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Importing Students
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please don't close this dialog while import is in progress.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
