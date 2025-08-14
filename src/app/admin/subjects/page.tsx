import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SubjectsPage() {
  // Mock data for subjects
  const subjects = [
    {
      id: "SUB001",
      name: "Physics",
      department: "Science",
      grade: "10",
      teachers: ["Dr. Robert Anderson", "Mr. David Clark"],
      totalClasses: 4,
      totalStudents: 125,
    },
    {
      id: "SUB002",
      name: "Mathematics",
      department: "Mathematics",
      grade: "All",
      teachers: ["Mrs. Sarah Johnson", "Mr. Thomas Lee"],
      totalClasses: 10,
      totalStudents: 320,
    },
    {
      id: "SUB003",
      name: "English Literature",
      department: "English",
      grade: "9-10",
      teachers: ["Mr. James Wilson"],
      totalClasses: 6,
      totalStudents: 190,
    },
    {
      id: "SUB004",
      name: "History",
      department: "Social Studies",
      grade: "8-9",
      teachers: ["Ms. Emily Davis"],
      totalClasses: 4,
      totalStudents: 140,
    },
    {
      id: "SUB005",
      name: "Computer Science",
      department: "Computer Science",
      grade: "8-10",
      teachers: ["Mr. Michael Brown"],
      totalClasses: 6,
      totalStudents: 180,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <Button>Add New Subject</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Management</CardTitle>
          <CardDescription>
            Manage all subjects in the school system. You can add, edit, or remove subjects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search subjects..." 
                className="w-[300px]"
              />
              <Button variant="outline">Search</Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Departments</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Computer Science">Computer Science</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Teachers</TableHead>
                  <TableHead>Total Classes</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>{subject.id}</TableCell>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.department}</TableCell>
                    <TableCell>{subject.grade}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {subject.teachers.map((teacher, index) => (
                          <span key={index}>{teacher}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{subject.totalClasses}</TableCell>
                    <TableCell>{subject.totalStudents}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing 5 of 20 subjects
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}