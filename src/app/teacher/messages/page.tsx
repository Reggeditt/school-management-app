'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { MessageList, MessageDetail, ContactList } from "@/components/teacher/message-components";
import { ComposeMessage } from "@/components/teacher/compose-message";
import { MessageService, Message, Contact, MessageStats, NewMessageData } from "@/services/message.service";
import Link from "next/link";
import {
  MessageCircle,
  Send,
  Inbox,
  Star,
  Archive,
  AlertTriangle,
  Users,
  Plus,
  RefreshCw
} from "lucide-react";

export default function TeacherMessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messageStats, setMessageStats] = useState<MessageStats | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isComposing, setIsComposing] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState<Contact | undefined>();
  const [replySubject, setReplySubject] = useState<string>("");

  // Get teacher ID
  const teacherId = user?.uid || '';

  useEffect(() => {
    if (teacherId) {
      loadMessagesData();
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId && (searchQuery || filterCategory !== 'all')) {
      handleSearchAndFilter();
    }
  }, [teacherId, searchQuery, filterCategory]);

  const loadMessagesData = async () => {
    try {
      setLoading(true);
      
      const [messagesData, contactsData, statsData] = await Promise.all([
        MessageService.getTeacherMessages(teacherId),
        MessageService.getTeacherContacts(teacherId),
        MessageService.getMessageStats(teacherId)
      ]);
      
      setMessages(messagesData);
      setContacts(contactsData);
      setMessageStats(statsData);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = async () => {
    try {
      let filteredMessages: Message[];
      
      if (searchQuery.trim()) {
        filteredMessages = await MessageService.searchMessages(teacherId, searchQuery);
      } else {
        filteredMessages = await MessageService.filterMessages(teacherId, filterCategory);
      }
      
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error searching/filtering messages:', error);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (!message.isRead) {
      try {
        await MessageService.markAsRead(message.id);
        
        // Update local state
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        ));
        
        // Update stats
        if (messageStats) {
          setMessageStats(prev => prev ? {
            ...prev,
            unreadMessages: prev.unreadMessages - 1
          } : null);
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleToggleStar = async (messageId: string, isStarred: boolean) => {
    try {
      setUpdating(true);
      
      await MessageService.toggleStar(messageId, isStarred);
      
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isStarred } : m
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, isStarred } : null);
      }
      
      // Update stats
      if (messageStats) {
        setMessageStats(prev => prev ? {
          ...prev,
          starredMessages: isStarred ? prev.starredMessages + 1 : prev.starredMessages - 1
        } : null);
      }
      
      toast({
        title: isStarred ? "Message Starred" : "Star Removed",
        description: isStarred ? "Message added to starred." : "Message removed from starred.",
      });
      
    } catch (error) {
      console.error('Error toggling star:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleArchive = async (messageId: string, isArchived: boolean) => {
    try {
      setUpdating(true);
      
      await MessageService.toggleArchive(messageId, isArchived);
      
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isArchived } : m
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, isArchived } : null);
      }
      
      toast({
        title: isArchived ? "Message Archived" : "Message Unarchived",
        description: isArchived ? "Message moved to archive." : "Message restored from archive.",
      });
      
    } catch (error) {
      console.error('Error toggling archive:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      setUpdating(true);
      
      await MessageService.deleteMessage(messageId);
      
      // Update local state
      setMessages(prev => prev.filter(m => m.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "Message Deleted",
        description: "Message has been permanently deleted.",
      });
      
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async (messageData: NewMessageData) => {
    try {
      setUpdating(true);
      
      const newMessage = await MessageService.sendMessage(teacherId, messageData);
      
      // Add to local state
      setMessages(prev => [newMessage, ...prev]);
      
      // Update stats
      if (messageStats) {
        setMessageStats(prev => prev ? {
          ...prev,
          totalMessages: prev.totalMessages + 1
        } : null);
      }
      
      setIsComposing(false);
      setComposeRecipient(undefined);
      setReplySubject("");
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = (message: Message) => {
    const recipient = contacts.find(c => c.id === message.senderId);
    if (recipient) {
      setComposeRecipient(recipient);
      setReplySubject(`Re: ${message.subject}`);
      setIsComposing(true);
    }
  };

  const handleForward = (message: Message) => {
    setReplySubject(`Fwd: ${message.subject}`);
    setIsComposing(true);
  };

  const handleStartConversation = (contact: Contact) => {
    setComposeRecipient(contact);
    setIsComposing(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Communicate with parents, students, and administration
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadMessagesData} disabled={updating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsComposing(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {messageStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Inbox className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messageStats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                All conversations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{messageStats.unreadMessages}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Starred</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{messageStats.starredMessages}</div>
              <p className="text-xs text-muted-foreground">
                Important messages
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{messageStats.urgentMessages}</div>
              <p className="text-xs text-muted-foreground">
                High priority
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <div className="space-y-4">
              <MessageList
                messages={messages}
                selectedMessage={selectedMessage}
                onSelectMessage={handleSelectMessage}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDeleteMessage={handleDeleteMessage}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterCategory={filterCategory}
                onFilterChange={setFilterCategory}
                loading={loading}
              />
            </div>
            
            {/* Message Detail */}
            <div className="space-y-4">
              <MessageDetail
                message={selectedMessage}
                onReply={handleReply}
                onForward={handleForward}
                onToggleStar={handleToggleStar}
                onToggleArchive={handleToggleArchive}
                onDelete={handleDeleteMessage}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>
                Your students, parents, and school administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
                onStartConversation={handleStartConversation}
                loading={loading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Message Dialog */}
      <ComposeMessage
        isOpen={isComposing}
        onClose={() => {
          setIsComposing(false);
          setComposeRecipient(undefined);
          setReplySubject("");
        }}
        onSend={handleSendMessage}
        contacts={contacts}
        initialRecipient={composeRecipient}
        replyToSubject={replySubject}
        loading={updating}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/students" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Student Directory</h3>
                  <p className="text-sm text-gray-500">View all students and parents</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/classes" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Class Announcements</h3>
                  <p className="text-sm text-gray-500">Send class-wide messages</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div 
              className="block cursor-pointer" 
              onClick={() => {
                setFilterCategory('urgent');
                handleSearchAndFilter();
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Urgent Messages</h3>
                  <p className="text-sm text-gray-500">High priority communications</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
