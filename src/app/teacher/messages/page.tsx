'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Users, Search, Plus } from 'lucide-react';

export default function TeacherMessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Load teacher's messages
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with students, parents, and colleagues
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          All Conversations
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder message cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Class 10A Parents</CardTitle>
              <Badge variant="secondary">Group</Badge>
            </div>
            <CardDescription>
              Last message: 2 hours ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                "Thank you for the update about tomorrow's test..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">25 participants</span>
                <Badge variant="outline" className="text-xs">3 unread</Badge>
              </div>
              <Button className="w-full mt-4" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                Open Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Sarah Johnson (Parent)</CardTitle>
              <Badge variant="outline">Direct</Badge>
            </div>
            <CardDescription>
              Last message: 1 day ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                "Could you please provide extra practice materials for..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Student: Emma Johnson</span>
                <Badge variant="destructive" className="text-xs">1 unread</Badge>
              </div>
              <Button className="w-full mt-4" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Reply
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mathematics Department</CardTitle>
              <Badge variant="secondary">Group</Badge>
            </div>
            <CardDescription>
              Last message: 3 days ago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                "Meeting scheduled for next week to discuss curriculum..."
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">8 members</span>
                <Badge variant="outline" className="text-xs">All read</Badge>
              </div>
              <Button className="w-full mt-4" size="sm" variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" />
                View Thread
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add more placeholder cards as needed */}
      </div>

      {/* Empty State */}
      {messages.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start communicating with students and parents to build better relationships.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Your First Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}