import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getSubmissionsData } from '../data/mock-data';
import { formatDate, getFileIcon, getStatusColor } from '../hooks/utils';

interface SubmissionsTabProps {
  selectedAcademicYear: string;
  setSelectedAcademicYear: (year: string) => void;
}

export function SubmissionsTab({ selectedAcademicYear, setSelectedAcademicYear }: SubmissionsTabProps) {
  const submissionsData = getSubmissionsData();

  return (
    <div className="space-y-6">
      {/* Submissions Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Document Submissions</h3>
          <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            {getNavigationIcon('filter')}
            Filter
          </Button>
          <Button variant="outline">
            {getNavigationIcon('download')}
            Export All
          </Button>
        </div>
      </div>

      {/* Submission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('file')}
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary">{submissionsData.stats.totalSubmissions}</div>
            <p className="text-sm text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('clock')}
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-orange-600">{submissionsData.stats.pendingReview}</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('check-circle')}
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600">{submissionsData.stats.approved}</div>
            <p className="text-sm text-muted-foreground">Accepted documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar')}
              On Time
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600">{submissionsData.stats.onTime}</div>
            <p className="text-sm text-muted-foreground">Submitted on time</p>
          </CardContent>
        </Card>
      </div>

      {/* Document Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('layers')}
            Document Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {submissionsData.categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  {getNavigationIcon(category.icon)}
                </div>
                <h4 className="font-medium text-sm text-center mb-1">{category.name}</h4>
                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('file-text')}
            Recent Document Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissionsData.documents.map((doc) => (
              <div key={doc.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mt-1">
                  {getNavigationIcon(getFileIcon(doc.format))}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-base">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                    <Badge variant={getStatusColor(doc.status)}>
                      {doc.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Subject:</span>
                      <p className="font-medium">{doc.subject}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Class:</span>
                      <p className="font-medium">{doc.class}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submitted:</span>
                      <p className="font-medium">{formatDate(doc.submittedDate)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <p className="font-medium">{formatDate(doc.dueDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{getNavigationIcon('file')} {doc.format}</span>
                      <span>{getNavigationIcon('hard-drive')} {doc.size}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {getNavigationIcon('eye')}
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        {getNavigationIcon('download')}
                        Download
                      </Button>
                      {doc.status === 'under-review' && (
                        <>
                          <Button size="sm" variant="default">
                            {getNavigationIcon('check')}
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            {getNavigationIcon('x')}
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {doc.status === 'rejected' && doc.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('list')}
            Submission Requirements & Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-medium mb-2">Weekly Lesson Plans</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Submit detailed lesson plans every Friday for the following week
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{getNavigationIcon('calendar')} Due: Every Friday 5:00 PM</span>
                <span>{getNavigationIcon('file')} Format: PDF/Word</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-medium mb-2">Student Progress Reports</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Monthly progress reports for all students in assigned classes
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{getNavigationIcon('calendar')} Due: Last day of month</span>
                <span>{getNavigationIcon('file')} Format: Excel/CSV</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <h4 className="font-medium mb-2">Professional Development</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Annual professional development certificates and training records
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{getNavigationIcon('calendar')} Due: End of academic year</span>
                <span>{getNavigationIcon('file')} Format: PDF</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
