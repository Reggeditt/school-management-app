'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  class: string;
  studentId: string;
  dateOfBirth: Date;
  bloodGroup: string;
  emergencyContact: string;
  address: string;
  photo?: string;
  allergies?: string[];
  medicalConditions?: string[];
}

interface Teacher {
  id: string;
  name: string;
  subject?: string;
  role: string;
  email: string;
  phone?: string;
}

interface ChildAcademics {
  childId: string;
  currentGPA: number;
  overallGrade: string;
  attendanceRate: number;
  subjects: Array<{
    name: string;
    teacher: string;
    grade: string;
    marks: number;
    totalMarks: number;
  }>;
  teachers: Teacher[];
}

export default function MyChildren() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [academics, setAcademics] = useState<ChildAcademics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          section: 'A',
          class: 'Grade 9A',
          studentId: 'STU001',
          dateOfBirth: new Date(2009, 5, 15),
          bloodGroup: 'A+',
          emergencyContact: '+1-555-0123',
          address: '123 Oak Street, Springfield, IL 62701',
          allergies: ['Peanuts', 'Shellfish'],
          medicalConditions: []
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          section: 'B',
          class: 'Grade 6B',
          studentId: 'STU002',
          dateOfBirth: new Date(2012, 8, 22),
          bloodGroup: 'O+',
          emergencyContact: '+1-555-0123',
          address: '123 Oak Street, Springfield, IL 62701',
          allergies: [],
          medicalConditions: ['Asthma']
        }
      ];

      const mockAcademics: ChildAcademics[] = [
        {
          childId: '1',
          currentGPA: 3.7,
          overallGrade: 'A-',
          attendanceRate: 94,
          subjects: [
            {
              name: 'Mathematics',
              teacher: 'Dr. Sarah Wilson',
              grade: 'A',
              marks: 178,
              totalMarks: 200
            },
            {
              name: 'Science',
              teacher: 'Prof. John Davis',
              grade: 'A-',
              marks: 165,
              totalMarks: 180
            },
            {
              name: 'English',
              teacher: 'Ms. Emily Brown',
              grade: 'B+',
              marks: 142,
              totalMarks: 160
            },
            {
              name: 'History',
              teacher: 'Mr. Robert Miller',
              grade: 'A',
              marks: 88,
              totalMarks: 100
            }
          ],
          teachers: [
            {
              id: '1',
              name: 'Dr. Sarah Wilson',
              subject: 'Mathematics',
              role: 'Class Teacher',
              email: 'sarah.wilson@school.edu',
              phone: '+1-555-0234'
            },
            {
              id: '2',
              name: 'Prof. John Davis',
              subject: 'Science',
              role: 'Subject Teacher',
              email: 'john.davis@school.edu'
            },
            {
              id: '3',
              name: 'Ms. Emily Brown',
              subject: 'English',
              role: 'Subject Teacher',
              email: 'emily.brown@school.edu'
            }
          ]
        },
        {
          childId: '2',
          currentGPA: 3.3,
          overallGrade: 'B+',
          attendanceRate: 98,
          subjects: [
            {
              name: 'Mathematics',
              teacher: 'Ms. Lisa Chen',
              grade: 'B',
              marks: 145,
              totalMarks: 180
            },
            {
              name: 'Science',
              teacher: 'Mr. David Park',
              grade: 'A',
              marks: 92,
              totalMarks: 100
            },
            {
              name: 'English',
              teacher: 'Mrs. Anna White',
              grade: 'B+',
              marks: 85,
              totalMarks: 100
            }
          ],
          teachers: [
            {
              id: '4',
              name: 'Ms. Lisa Chen',
              subject: 'Mathematics',
              role: 'Class Teacher',
              email: 'lisa.chen@school.edu',
              phone: '+1-555-0345'
            },
            {
              id: '5',
              name: 'Mr. David Park',
              subject: 'Science',
              role: 'Subject Teacher',
              email: 'david.park@school.edu'
            }
          ]
        }
      ];

      setChildren(mockChildren);
      setAcademics(mockAcademics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load children data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Children</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Children</h1>
          <p className="text-muted-foreground">
            Detailed information about your children's education and progress
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, class, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Children Cards */}
      <div className="space-y-6">
        {filteredChildren.map((child) => {
          const childAcademics = academics.find(a => a.childId === child.id);
          
          return (
            <Card key={child.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{child.name}</CardTitle>
                    <CardDescription className="text-base">
                      {child.class} • Student ID: {child.studentId}
                    </CardDescription>
                    <div className="flex gap-2 mt-2">
                      {childAcademics && (
                        <Badge className={getGradeColor(childAcademics.overallGrade)}>
                          Overall: {childAcademics.overallGrade}
                        </Badge>
                      )}
                      <Badge variant="outline">
                        Age: {calculateAge(child.dateOfBirth)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/parent/children/${child.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="p-6">
                    {childAcademics && (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
                          <div className="text-2xl font-bold text-green-600">{childAcademics.currentGPA}</div>
                          <div className="text-sm text-muted-foreground">GPA</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
                          <div className="text-2xl font-bold text-blue-600">{childAcademics.attendanceRate}%</div>
                          <div className="text-sm text-muted-foreground">Attendance</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg dark:bg-purple-950">
                          <div className="text-2xl font-bold text-purple-600">{childAcademics.subjects.length}</div>
                          <div className="text-sm text-muted-foreground">Subjects</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg dark:bg-orange-950">
                          <div className="text-2xl font-bold text-orange-600">{childAcademics.teachers.length}</div>
                          <div className="text-sm text-muted-foreground">Teachers</div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="academics" className="p-6">
                    {childAcademics && (
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          {childAcademics.subjects.map((subject, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-semibold">{subject.name}</h3>
                                <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                                <p className="text-sm text-muted-foreground">
                                  Marks: {subject.marks}/{subject.totalMarks} ({Math.round((subject.marks / subject.totalMarks) * 100)}%)
                                </p>
                              </div>
                              <Badge className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="teachers" className="p-6">
                    {childAcademics && (
                      <div className="grid gap-4">
                        {childAcademics.teachers.map((teacher) => (
                          <div key={teacher.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{teacher.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {teacher.subject} • {teacher.role}
                              </p>
                              <p className="text-sm text-muted-foreground">{teacher.email}</p>
                              {teacher.phone && (
                                <p className="text-sm text-muted-foreground">{teacher.phone}</p>
                              )}
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/parent/messages?teacher=${teacher.id}`}>
                                Message
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="personal" className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                          <p className="font-semibold">{formatDate(child.dateOfBirth)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Age</label>
                          <p className="font-semibold">{calculateAge(child.dateOfBirth)} years</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
                          <p className="font-semibold">{child.bloodGroup}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                          <p className="font-semibold">{child.emergencyContact}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="font-semibold">{child.address}</p>
                        </div>
                        {child.allergies && child.allergies.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {child.allergies.map((allergy, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {child.medicalConditions && child.medicalConditions.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Medical Conditions</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {child.medicalConditions.map((condition, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredChildren.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold mb-2">No children found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? "Try adjusting your search terms."
                : "No children are currently registered under your account."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
