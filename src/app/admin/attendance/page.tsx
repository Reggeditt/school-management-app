import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AttendancePage() {
  // Mock data for attendance
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const classes = [
    { id: "CLS001", name: "Grade 10-A" },
    { id: "CLS002", name: "Grade 10-B" },
    { id: "CLS003", name: "Grade 9-A" },
    { id: "CLS004", name: "Grade 9-B" },
    { id: "CLS005", name: "Grade 8-A" },
  ];

  // Mock attendance data for Grade 10-A
  const students = [
    { id: "STU001", name: "John Doe", status: "Present" },
    { id: "STU002", name: "Jane Smith", status: "Present" },
    { id: "STU003", name: "Michael Johnson", status: "Absent" },
    { id: "STU004", name: "Emily Williams", status: "Present" },
    { id: "STU005", name: "David Brown", status: "Late" },
    { id: "STU006", name: "Sarah Miller", status: "Present" },
    { id: "STU007", name: "James Wilson", status: "Present" },
    { id: "STU008", name: "Emma Taylor", status: "Absent" },
    { id: "STU009", name: "Daniel Anderson", status: "Present" },
    { id: "STU010", name: "Olivia Martinez", status: "Present" },
  ];

  // Calculate attendance statistics
  const totalStudents = students.length;
  const presentCount = students.filter(student => student.status === "Present").length;
  const absentCount = students.filter(student => student.status === "Absent").length;
  const lateCount = students.filter(student => student.status === "Late").length;
  const presentPercentage = (presentCount / totalStudents) * 100;
  const absentPercentage = (absentCount / totalStudents) * 100;
  const latePercentage = (lateCount / totalStudents) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <div className="flex items-center gap-2">
          <Button>Take Attendance</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount} ({presentPercentage.toFixed(1)}%)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount} ({absentPercentage.toFixed(1)}%)</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lateCount} ({latePercentage.toFixed(1)}%)</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
          <CardDescription>
            View and manage attendance for all classes. Current date: {date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
                ))}
              </select>
              <input 
                type="date" 
                className="border rounded px-2 py-1 text-sm"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          student.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : student.status === 'Late' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <select 
                          className="border rounded px-2 py-1 text-xs"
                          defaultValue={student.status}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing 10 of 32 students in Grade 10-A
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