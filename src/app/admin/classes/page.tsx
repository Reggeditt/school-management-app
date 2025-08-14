import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ClassesPage() {
  // Mock data for classes
  const classes = [
    {
      id: "CLS001",
      name: "Grade 10-A",
      classTeacher: "Dr. Robert Anderson",
      totalStudents: 32,
      room: "101",
      schedule: "8:00 AM - 2:30 PM",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"],
    },
    {
      id: "CLS002",
      name: "Grade 10-B",
      classTeacher: "Mrs. Sarah Johnson",
      totalStudents: 30,
      room: "102",
      schedule: "8:00 AM - 2:30 PM",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "History"],
    },
    {
      id: "CLS003",
      name: "Grade 9-A",
      classTeacher: "Mr. James Wilson",
      totalStudents: 35,
      room: "103",
      schedule: "8:00 AM - 2:30 PM",
      subjects: ["Biology", "Chemistry", "Mathematics", "English", "Geography"],
    },
    {
      id: "CLS004",
      name: "Grade 9-B",
      classTeacher: "Ms. Emily Davis",
      totalStudents: 33,
      room: "104",
      schedule: "8:00 AM - 2:30 PM",
      subjects: ["Biology", "Chemistry", "Mathematics", "English", "History"],
    },
    {
      id: "CLS005",
      name: "Grade 8-A",
      classTeacher: "Mr. Michael Brown",
      totalStudents: 36,
      room: "105",
      schedule: "8:00 AM - 2:30 PM",
      subjects: ["Science", "Mathematics", "English", "History", "Computer Science"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Classes</h1>
        <Button>Add New Class</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>
            Manage all classes in the school system. You can add, edit, or remove classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search classes..." 
                className="w-[300px]"
              />
              <Button variant="outline">Search</Button>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Class Teacher</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem.id}>
                    <TableCell>{classItem.id}</TableCell>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>{classItem.classTeacher}</TableCell>
                    <TableCell>{classItem.totalStudents}</TableCell>
                    <TableCell>{classItem.room}</TableCell>
                    <TableCell>{classItem.schedule}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {classItem.subjects.map((subject, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </TableCell>
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
              Showing 5 of 15 classes
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