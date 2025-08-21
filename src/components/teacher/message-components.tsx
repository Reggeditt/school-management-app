'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Message, Contact } from "@/services/message.service";
import {
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Clock,
  AlertTriangle,
  User,
  MessageCircle
} from "lucide-react";

interface MessageListProps {
  messages: Message[];
  selectedMessage: Message | null;
  onSelectMessage: (message: Message) => void;
  onToggleStar: (messageId: string, isStarred: boolean) => void;
  onToggleArchive: (messageId: string, isArchived: boolean) => void;
  onDeleteMessage: (messageId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterCategory: string;
  onFilterChange: (category: string) => void;
  loading?: boolean;
}

interface MessageDetailProps {
  message: Message | null;
  onReply: (message: Message) => void;
  onForward: (message: Message) => void;
  onToggleStar: (messageId: string, isStarred: boolean) => void;
  onToggleArchive: (messageId: string, isArchived: boolean) => void;
  onDelete: (messageId: string) => void;
}

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  onStartConversation: (contact: Contact) => void;
  loading?: boolean;
}

function MessageItem({ 
  message, 
  isSelected, 
  onSelect, 
  onToggleStar, 
  onToggleArchive, 
  onDelete 
}: {
  message: Message;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStar: (messageId: string, isStarred: boolean) => void;
  onToggleArchive: (messageId: string, isArchived: boolean) => void;
  onDelete: (messageId: string) => void;
}) {
  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Message['category']) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'behavior': return 'bg-orange-100 text-orange-800';
      case 'attendance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      } ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {message.senderName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`text-sm truncate ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
                  {message.senderName}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {message.senderType}
                </Badge>
                {message.priority === 'high' && (
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                )}
              </div>
              
              <p className={`text-sm truncate ${!message.isRead ? 'font-medium' : 'text-gray-600'}`}>
                {message.subject}
              </p>
              
              <p className="text-xs text-gray-500 truncate mt-1">
                {message.content.substring(0, 80)}...
              </p>
              
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(message.category)}`}>
                  {message.category}
                </Badge>
                {message.attachments && message.attachments.length > 0 && (
                  <Paperclip className="h-3 w-3 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(message.id, !message.isStarred);
                }}
              >
                <Star className={`h-3 w-3 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleArchive(message.id, !message.isArchived);
                }}
              >
                <Archive className={`h-3 w-3 ${message.isArchived ? 'text-blue-500' : 'text-gray-400'}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(message.id);
                }}
              >
                <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MessageList({
  messages,
  selectedMessage,
  onSelectMessage,
  onToggleStar,
  onToggleArchive,
  onDeleteMessage,
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  loading = false
}: MessageListProps) {
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All Messages' },
    { value: 'unread', label: 'Unread' },
    { value: 'starred', label: 'Starred' },
    { value: 'archived', label: 'Archived' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'academic', label: 'Academic' },
    { value: 'behavior', label: 'Behavior' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'general', label: 'General' }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Messages</DialogTitle>
              <DialogDescription>
                Choose a category to filter your messages
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map(option => (
                <Button
                  key={option.value}
                  variant={filterCategory === option.value ? "default" : "outline"}
                  onClick={() => {
                    onFilterChange(option.value);
                    setShowFilters(false);
                  }}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">No Messages Found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms.' : 'You have no messages in this category.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isSelected={selectedMessage?.id === message.id}
              onSelect={() => onSelectMessage(message)}
              onToggleStar={onToggleStar}
              onToggleArchive={onToggleArchive}
              onDelete={onDeleteMessage}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function MessageDetail({
  message,
  onReply,
  onForward,
  onToggleStar,
  onToggleArchive,
  onDelete
}: MessageDetailProps) {
  if (!message) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">Select a Message</h3>
          <p className="text-gray-500">
            Choose a message from the list to view its details
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {message.senderName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{message.subject}</CardTitle>
              <p className="text-sm text-gray-600">
                From: {message.senderName} ({message.senderType})
              </p>
              <p className="text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(message.priority)}>
              {message.priority} priority
            </Badge>
            <Badge variant="outline">
              {message.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {message.content}
          </p>
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
            <div className="space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{attachment}</span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <div className="border-t p-4">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button onClick={() => onReply(message)}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" onClick={() => onForward(message)}>
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onToggleStar(message.id, !message.isStarred)}
            >
              <Star className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="outline"
              onClick={() => onToggleArchive(message.id, !message.isArchived)}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(message.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ContactList({
  contacts,
  selectedContact,
  onSelectContact,
  onStartConversation,
  loading = false
}: ContactListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <Card 
          key={contact.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelectContact(contact)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-sm">{contact.name}</h3>
                  <p className="text-xs text-gray-600">
                    {contact.type === 'parent' && contact.studentName && (
                      <span>Parent of {contact.studentName}</span>
                    )}
                    {contact.type === 'student' && (
                      <span>Student - {contact.className}</span>
                    )}
                    {contact.type === 'admin' && (
                      <span>Administrator</span>
                    )}
                  </p>
                  {contact.lastContact && (
                    <p className="text-xs text-gray-500">
                      Last: {new Date(contact.lastContact).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                {contact.unreadCount > 0 && (
                  <Badge variant="default" className="text-xs">
                    {contact.unreadCount}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartConversation(contact);
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
