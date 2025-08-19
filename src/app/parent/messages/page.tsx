'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  avatar?: string;
  department: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'sent' | 'received';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  childId?: string;
  relatedTo?: 'academic' | 'behavior' | 'attendance' | 'general' | 'event';
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  timestamp: Date;
  type: 'general' | 'academic' | 'event' | 'urgent' | 'reminder';
  targetAudience: string[];
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState({
    receiverId: "",
    subject: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    relatedTo: "general" as "academic" | "behavior" | "attendance" | "general" | "event"
  });
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    loadMessagesData();
  }, [selectedChild]);

  const loadMessagesData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          class: 'Grade 9A',
          studentId: 'STU001'
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          class: 'Grade 6B',
          studentId: 'STU002'
        }
      ];

      const mockTeachers: Teacher[] = [
        {
          id: '1',
          name: 'Dr. Sarah Wilson',
          subject: 'Mathematics',
          email: 'sarah.wilson@school.edu',
          department: 'Mathematics'
        },
        {
          id: '2',
          name: 'Ms. Emily Brown',
          subject: 'English',
          email: 'emily.brown@school.edu',
          department: 'Language Arts'
        },
        {
          id: '3',
          name: 'Prof. John Davis',
          subject: 'Science',
          email: 'john.davis@school.edu',
          department: 'Science'
        },
        {
          id: '4',
          name: 'Mr. Robert Smith',
          subject: 'History',
          email: 'robert.smith@school.edu',
          department: 'Social Studies'
        },
        {
          id: '5',
          name: 'Coach Mike Wilson',
          subject: 'Physical Education',
          email: 'mike.wilson@school.edu',
          department: 'Physical Education'
        }
      ];

      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: '1',
          receiverId: 'parent',
          senderName: 'Dr. Sarah Wilson',
          receiverName: 'Parent',
          subject: 'Emma\'s Excellent Progress in Math',
          content: 'I wanted to reach out to congratulate Emma on her outstanding performance in our recent algebra unit. She scored 95% on her test and has been very helpful to her classmates during group work. Keep up the great work!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: false,
          type: 'received',
          priority: 'medium',
          childId: '1',
          relatedTo: 'academic'
        },
        {
          id: '2',
          senderId: 'parent',
          receiverId: '2',
          senderName: 'Parent',
          receiverName: 'Ms. Emily Brown',
          subject: 'Question about upcoming project',
          content: 'Hello Ms. Brown, I wanted to ask about the book report project due next week. Emma mentioned there might be an option to do a creative presentation instead of a traditional report. Could you please clarify the requirements?',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          isRead: true,
          type: 'sent',
          priority: 'low',
          childId: '1',
          relatedTo: 'academic'
        },
        {
          id: '3',
          senderId: '3',
          receiverId: 'parent',
          senderName: 'Prof. John Davis',
          receiverName: 'Parent',
          subject: 'Science Fair Reminder',
          content: 'This is a reminder that the science fair project proposal is due this Friday. Emma has chosen a great topic about renewable energy. Please ensure she has all necessary materials for her experiment. Let me know if you need any assistance.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          isRead: true,
          type: 'received',
          priority: 'medium',
          childId: '1',
          relatedTo: 'event'
        },
        {
          id: '4',
          senderId: '5',
          receiverId: 'parent',
          senderName: 'Coach Mike Wilson',
          receiverName: 'Parent',
          subject: 'Michael\'s PE Performance',
          content: 'Michael has been doing exceptionally well in PE class. His teamwork skills have improved significantly, and he\'s showing great leadership during team sports. I\'d like to recommend him for the school\'s junior athletics program.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isRead: true,
          type: 'received',
          priority: 'medium',
          childId: '2',
          relatedTo: 'academic'
        },
        {
          id: '5',
          senderId: 'parent',
          receiverId: '4',
          senderName: 'Parent',
          receiverName: 'Mr. Robert Smith',
          subject: 'Michael\'s absence explanation',
          content: 'Dear Mr. Smith, Michael was absent from school yesterday due to a doctor\'s appointment. He will make up any missed work. Please let me know if there are any specific assignments he needs to complete.',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isRead: true,
          type: 'sent',
          priority: 'medium',
          childId: '2',
          relatedTo: 'attendance'
        }
      ];

      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'Parent-Teacher Conference Scheduling Open',
          content: 'Dear parents, scheduling for parent-teacher conferences is now open. Please log into the parent portal to book your preferred time slots. Conferences will be held from March 15-17. Each appointment is 15 minutes long.',
          author: 'Principal Anderson',
          authorRole: 'Principal',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: 'general',
          targetAudience: ['all_parents'],
          isRead: false,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Science Fair Judging Volunteers Needed',
          content: 'We are looking for parent volunteers to help judge the upcoming Science Fair on March 20th. If you have a background in science, engineering, or technology and can spare 3-4 hours, please contact the main office.',
          author: 'Ms. Jennifer Park',
          authorRole: 'Science Department Head',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          type: 'event',
          targetAudience: ['all_parents'],
          isRead: true,
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Updated School Safety Protocols',
          content: 'Following recent guidelines, we have updated our school safety protocols. All visitors must check in at the main office and receive a visitor badge. Drop-off and pick-up procedures remain the same.',
          author: 'Security Office',
          authorRole: 'School Administration',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: 'urgent',
          targetAudience: ['all_parents'],
          isRead: true,
          priority: 'high'
        },
        {
          id: '4',
          title: 'Spring Break Reading Program',
          content: 'Our annual Spring Break Reading Program starts next week. Students who read at least 5 books during the break will receive a special recognition certificate. Reading logs are available in the library.',
          author: 'Ms. Lisa Rodriguez',
          authorRole: 'Librarian',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: 'academic',
          targetAudience: ['all_parents'],
          isRead: true,
          priority: 'low'
        }
      ];

      setChildren(mockChildren);
      setTeachers(mockTeachers);
      setMessages(mockMessages);
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.receiverId || !newMessage.subject || !newMessage.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const teacher = teachers.find(t => t.id === newMessage.receiverId);
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'parent',
        receiverId: newMessage.receiverId,
        senderName: 'Parent',
        receiverName: teacher?.name || 'Teacher',
        subject: newMessage.subject,
        content: newMessage.content,
        timestamp: new Date(),
        isRead: false,
        type: 'sent',
        priority: newMessage.priority,
        childId: selectedChild !== 'all' ? selectedChild : undefined,
        relatedTo: newMessage.relatedTo
      };

      setMessages(prev => [message, ...prev]);
      setNewMessage({
        receiverId: "",
        subject: "",
        content: "",
        priority: "medium",
        relatedTo: "general"
      });
      setIsComposeOpen(false);

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const markAnnouncementAsRead = (announcementId: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === announcementId ? { ...ann, isRead: true } : ann
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'behavior': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'attendance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'event': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChild = selectedChild === 'all' || message.childId === selectedChild;
    
    return matchesSearch && matchesChild;
  });

  const unreadMessages = messages.filter(msg => !msg.isRead && msg.type === 'received').length;
  const unreadAnnouncements = announcements.filter(ann => !ann.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-3xl font-bold">Messages & Communication</h1>
          <p className="text-muted-foreground">
            Communicate with teachers and stay updated with school announcements
          </p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              ✉️ Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Compose New Message</DialogTitle>
              <DialogDescription>
                Send a message to your child's teacher
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  To
                </Label>
                <Select value={newMessage.receiverId} onValueChange={(value: string) => setNewMessage(prev => ({ ...prev, receiverId: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="col-span-3"
                  placeholder="Enter message subject"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="relatedTo" className="text-right">
                  Category
                </Label>
                <Select value={newMessage.relatedTo} onValueChange={(value: any) => setNewMessage(prev => ({ ...prev, relatedTo: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="behavior">Behavior</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="content"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  className="col-span-3"
                  placeholder="Type your message here..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendMessage}>
                Send Message
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map(child => (
              <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            placeholder="Search messages and announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <div className="text-2xl">✉️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              New messages from teachers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Announcements</CardTitle>
            <div className="text-2xl">📢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground">
              School announcements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <div className="text-2xl">💬</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">
              All conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <div className="text-2xl">👨‍🏫</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for contact
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">
            Messages {unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="announcements">
            Announcements {unreadAnnouncements > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {unreadAnnouncements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Messages</CardTitle>
              <CardDescription>
                Conversations with teachers and school staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      !message.isRead && message.type === 'received' ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                    }`}
                    onClick={() => message.type === 'received' && markAsRead(message.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{message.senderName}</span>
                            <Badge variant={message.type === 'sent' ? 'secondary' : 'default'}>
                              {message.type}
                            </Badge>
                            <Badge className={getPriorityColor(message.priority)}>
                              {message.priority}
                            </Badge>
                            {message.relatedTo && (
                              <Badge variant="outline" className={getTypeColor(message.relatedTo)}>
                                {message.relatedTo}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-sm mb-1">{message.subject}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {message.content}
                          </p>
                          {message.childId && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Regarding: {children.find(c => c.id === message.childId)?.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(message.timestamp)}
                        </div>
                        {!message.isRead && message.type === 'received' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>
                Important updates and information from the school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      !announcement.isRead ? 'border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950' : ''
                    }`}
                    onClick={() => markAnnouncementAsRead(announcement.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{announcement.title}</h4>
                          <Badge className={getTypeColor(announcement.type)}>
                            {announcement.type}
                          </Badge>
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>By {announcement.author} ({announcement.authorRole})</span>
                          <span>•</span>
                          <span>{formatTimestamp(announcement.timestamp)}</span>
                        </div>
                      </div>
                      {!announcement.isRead && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-1 ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📢</div>
                    <p>No announcements available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teacher Directory</CardTitle>
              <CardDescription>
                Contact information for your child's teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{teacher.name}</h4>
                        <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                        <p className="text-sm text-muted-foreground">{teacher.department}</p>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setNewMessage(prev => ({ ...prev, receiverId: teacher.id }));
                              setIsComposeOpen(true);
                            }}
                          >
                            Send Message
                          </Button>
                          <Button size="sm" variant="outline">
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
