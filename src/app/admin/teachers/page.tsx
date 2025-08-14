import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TeachersPage() {
  // Mock data for teachers
  const teachers = [
    {
      id: "TCH001",
      name: "Dr. Robert Anderson",
      department: "Science",
      subject: "Physics",
      qualification: "Ph.D",
      contactNumber: "+1234567890",
      email: "robert.anderson@example.com",
      status: "Active",
    },
    {
      id: "TCH002",
      name: "Mrs. Sarah Johnson",
      department: "Mathematics",
      subject: "Algebra",
      qualification: "M.Sc",
      contactNumber: "+1234567891",
      email: "sarah.johnson@example.com",
      status: "Active",
    },
    {
      id: "TCH003",
      name: "Mr. James Wilson",
      department: "English",
      subject: "Literature",
      qualification: "M.A",
      contactNumber: "+1234567892",
      email: "james.wilson@example.com",
      status: "Active",
    },
    {
      id: "TCH004",
      name: "Ms. Emily Davis",
      department: "Social Studies",
      subject: "History",
      qualification: "M.Ed",
      contactNumber: "+1234567893",
      email: "emily.davis@example.com",
      status: "On Leave",
    },
    {
      id: "TCH005",
      name: "Mr. Michael Brown",
      department: "Computer Science",
      subject: "Programming",
      qualification: "B.Tech",
      contactNumber: "+1234567894",
      email: "michael.brown@example.com",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <Button>Add New Teacher</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Management</CardTitle>
          <CardDescription>
            Manage all teachers in the school system. You can add, edit, or remove teachers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Search teachers..." 
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
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
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
                  <TableHead>Department</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{teacher.subject}</TableCell>
                    <TableCell>{teacher.qualification}</TableCell>
                    <TableCell>{teacher.contactNumber}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          teacher.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : teacher.status === 'On Leave' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {teacher.status}
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
              Showing 5 of 45 teachers
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