'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Download, 
  FileText, 
  Video,
  Search,
  Filter,
  ExternalLink,
  Upload
} from 'lucide-react';

export default function TeacherResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Access teaching materials, curriculum guides, and educational resources
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search resources by title, subject, or type..."
            className="pl-10"
          />
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>

        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Resource Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Curriculum Guides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Curriculum Guides
            </CardTitle>
            <CardDescription>
              Official curriculum and lesson plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Mathematics Grade 10</h4>
                  <p className="text-sm text-muted-foreground">Complete curriculum guide</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Lesson Plans - Algebra</h4>
                  <p className="text-sm text-muted-foreground">Weekly lesson templates</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Teaching Materials
            </CardTitle>
            <CardDescription>
              Worksheets, presentations, and handouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Algebra Worksheets</h4>
                  <p className="text-sm text-muted-foreground">Practice problems and solutions</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Geometry Presentations</h4>
                  <p className="text-sm text-muted-foreground">Interactive slide decks</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Video Resources
            </CardTitle>
            <CardDescription>
              Educational videos and tutorials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Math Concepts Explained</h4>
                  <p className="text-sm text-muted-foreground">Video tutorial series</p>
                  <Badge variant="secondary" className="mt-1">
                    15 videos
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Teaching Techniques</h4>
                  <p className="text-sm text-muted-foreground">Professional development</p>
                  <Badge variant="secondary" className="mt-1">
                    8 videos
                  </Badge>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added</CardTitle>
          <CardDescription>
            Latest resources and materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Recent Resources</h3>
              <p className="text-muted-foreground">
                New teaching resources and materials will appear here when they're added.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}