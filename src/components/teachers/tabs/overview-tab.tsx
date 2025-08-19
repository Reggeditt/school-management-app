import { Teacher, Class } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/navigation/data-table';
import { calculateAge, formatCurrency } from '../hooks/utils';

interface OverviewTabProps {
  teacher: Teacher;
  classes: Class[];
}

export function OverviewTab({ teacher, classes }: OverviewTabProps) {
  const getTeacherClasses = () => {
    return classes.filter(c => teacher.classes.includes(c.id));
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.firstName} ${teacher.lastName}`} />
                <AvatarFallback>{teacher.firstName[0]}{teacher.lastName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{teacher.firstName} {teacher.lastName}</h2>
                <p className="text-muted-foreground">{teacher.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Teacher ID</Label>
                <p className="font-medium">{teacher.teacherId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <p className="font-medium">{teacher.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                <p className="font-medium">{teacher.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">
                  {teacher.dateOfBirth?.toLocaleDateString()} (Age: {calculateAge(teacher.dateOfBirth || new Date())})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Classes</span>
              <Badge variant="secondary">{teacher.classes.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subjects</span>
              <Badge variant="secondary">{teacher.subjects.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Salary</span>
              <Badge variant="default">{formatCurrency(teacher.salary)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status="active" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {getTeacherClasses().length > 0 ? (
              <div className="space-y-2">
                {getTeacherClasses().map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">Grade {cls.grade}</p>
                    </div>
                    <Badge variant="outline">{cls.students} students</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No classes assigned</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {teacher.subjects.length > 0 ? (
              <div className="space-y-2">
                {teacher.subjects.map((subject, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium">{subject}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No subjects assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
