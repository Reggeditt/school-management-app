'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class, Student } from '@/lib/database-services';
import { Users, Search, Eye, Mail, Phone, Calendar, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherStudentsPage() {
  const { user } = useAuth();
  const { state, loadClasses, loadStudents } = useStore();
  const router = useRouter();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [teacherStudents, setTeacherStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        
        // Load base data
        await Promise.all([loadClasses(), loadStudents()]);
        
        // Get teacher-specific data
        const [classes, students] = await Promise.all([
          teacherService.getTeacherClasses(teacherId),
          teacherService.getTeacherStudents(teacherId)
        ]);
        
        setTeacherClasses(classes);
        setTeacherStudents(students);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId, loadClasses, loadStudents, teacherService]);

  const filteredStudents = teacherStudents.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedClass === 'all') return matchesSearch;
    
    const studentClass = teacherClasses.find(cls => cls.students?.includes(student.id));
    return matchesSearch && studentClass?.id === selectedClass;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: Date | string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getStudentClass = (studentId: string) => {
    return teacherClasses.find(cls => cls.students?.includes(studentId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-muted-foreground">
            Students across all your assigned classes
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {teacherStudents.length} {teacherStudents.length === 1 ? 'Student' : 'Students'}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {teacherClasses.length} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">B+</div>
            <p className="text-xs text-muted-foreground">
              Overall grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStudents.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">All Classes</option>
          {teacherClasses.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => {
            const studentClass = getStudentClass(student.id);
            const age = calculateAge(student.dateOfBirth);
            
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {student.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{student.firstName} {student.lastName}</CardTitle>
                      <CardDescription>
                        {studentClass?.name} • Age {age}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={student.status === 'active' ? "default" : "secondary"}
                    >
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Student Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">ID:</span>
                      <span className="text-muted-foreground">{student.studentId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Grade:</span>
                      <span className="text-muted-foreground">{studentClass?.grade}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">DOB:</span>
                      <span className="text-muted-foreground">{formatDate(student.dateOfBirth)}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {student.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 mr-2" />
                        {student.email}
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-2" />
                        {student.phone}
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <div className="text-center">
                      <div className="font-medium">95%</div>
                      <div className="text-xs text-muted-foreground">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">B+</div>
                      <div className="text-xs text-muted-foreground">Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">5</div>
                      <div className="text-xs text-muted-foreground">Assignments</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Students Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No students match your search criteria.' : 'No students assigned to your classes yet.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
