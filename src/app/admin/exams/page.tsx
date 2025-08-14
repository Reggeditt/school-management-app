import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ExamsPage() {
  // Mock data for exams
  const exams = [
    {
      id: "EXM001",
      name: "Mid-Term Examination",
      startDate: "2023-05-15",
      endDate: "2023-05-20",
      grades: ["8", "9", "10"],
      status: "Upcoming",
    },
    {
      id: "EXM002",
      name: "First Quarter Assessment",
      startDate: "2023-04-10",
      endDate: "2023-04-12",
      grades: ["8", "9", "10"],
      status: "Completed",
    },
    {
      id: "EXM003",
      name: "Science Project Evaluation",
      startDate: "2023-03-25",
      endDate: "2023-03-25",
      grades: ["10"],
      status: "Completed",
    },
    {
      id: "EXM004",
      name: "Mathematics Olympiad",
      startDate: "2023-06-05",
      endDate: "2023-06-05",
      grades: ["8", "9", "10"],
      status: "Upcoming",
    },
    {
      id: "EXM005",
      name: "Final Examination",
      startDate: "2023-07-10",
      endDate: "2023-07-20",
      grades: ["8", "9", "10"],
      status: "Scheduled",
    },
  ];

  // Mock data for exam results
  const examResults = [
    {
      examId: "EXM002",
      class: "Grade 10-A",
      subject: "Physics",
      averageScore: 78.5,
      highestScore: 95,
      lowestScore: 45,
      passPercentage: 85,
    },
    {
      examId: "EXM002",
      class: "Grade 10-A",
      subject: "Mathematics",
      averageScore: 72.3,
      highestScore: 98,
      lowestScore: 40,
      passPercentage: 80,
    },
    {
      examId: "EXM002",
      class: "Grade 10-A",
      subject: "English",
      averageScore: 81.7,
      highestScore: 96,
      lowestScore: 55,
      passPercentage: 90,
    },
    {
      examId: "EXM002",
      class: "Grade 10-B",
      subject: "Physics",
      averageScore: 75.2,
      highestScore: 92,
      lowestScore: 48,
      passPercentage: 82,
    },
    {
      examId: "EXM002",
      class: "Grade 10-B",
      subject: "Mathematics",
      averageScore: 70.8,
      highestScore: 94,
      lowestScore: 42,
      passPercentage: 78,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exams</h1>
        <div className="flex items-center gap-2">
          <Button>Create New Exam</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>
            View and manage all examinations in the school system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Grades</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Grades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>{exam.id}</TableCell>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{exam.startDate}</TableCell>
                    <TableCell>{exam.endDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {exam.grades.map((grade, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                          >
                            Grade {grade}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          exam.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : exam.status === 'Ongoing' 
                              ? 'bg-blue-100 text-blue-800' 
                              : exam.status === 'Upcoming' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {exam.status}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>
            View and analyze exam results by class and subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option value="EXM002">First Quarter Assessment</option>
                <option value="EXM003">Science Project Evaluation</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option value="">All Classes</option>
                <option value="Grade 10-A">Grade 10-A</option>
                <option value="Grade 10-B">Grade 10-B</option>
              </select>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Highest Score</TableHead>
                  <TableHead>Lowest Score</TableHead>
                  <TableHead>Pass Percentage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.class}</TableCell>
                    <TableCell className="font-medium">{result.subject}</TableCell>
                    <TableCell>{result.averageScore.toFixed(1)}</TableCell>
                    <TableCell>{result.highestScore}</TableCell>
                    <TableCell>{result.lowestScore}</TableCell>
                    <TableCell>{result.passPercentage}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Export</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}