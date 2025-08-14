import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StudentsPage() {
  // Mock data for students
  const students = [
    {
      id: "STU001",
      name: "John Doe",
      grade: "10",
      section: "A",
      gender: "Male",
      contactNumber: "+1234567890",
      email: "john.doe@example.com",
      status: "Active",
    },
    {
      id: "STU002",
      name: "Jane Smith",
      grade: "10",
      section: "B",
      gender: "Female",
      contactNumber: "+1234567891",
      email: "jane.smith@example.com",
      status: "Active",
    },
    {
      id: "STU003",
      name: "Michael Johnson",
      grade: "9",
      section: "A",
      gender: "Male",
      contactNumber: "+1234567892",
      email: "michael.johnson@example.com",
      status: "Active",
    },
    {
      id: "STU004",
      name: "Emily Williams",
      grade: "9",
      section: "B",
      gender: "Female",
      contactNumber: "+1234567893",
      email: "emily.williams@example.com",
      status: "Inactive",
    },
    {
      id: "STU005",
      name: "David Brown",
      grade: "8",
      section: "A",
      gender: "Male",
      contactNumber: "+1234567894",
      email: "david.brown@example.com",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button>Add New Student</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            Manage all students in the school system. You can add, edit, or remove students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search students..." 
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
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.contactNumber}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {student.status}
                      </span>
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
              Showing 5 of 100 students
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