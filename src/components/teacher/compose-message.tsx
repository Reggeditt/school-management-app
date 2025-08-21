'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact, NewMessageData } from "@/services/message.service";
import {
  Send,
  Paperclip,
  X,
  User,
  AlertTriangle,
  Clock,
  FileText
} from "lucide-react";

interface ComposeMessageProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: NewMessageData) => void;
  contacts: Contact[];
  initialRecipient?: Contact;
  replyToSubject?: string;
  loading?: boolean;
}

export function ComposeMessage({
  isOpen,
  onClose,
  onSend,
  contacts,
  initialRecipient,
  replyToSubject,
  loading = false
}: ComposeMessageProps) {
  const [formData, setFormData] = useState<NewMessageData>({
    recipientId: initialRecipient?.id || '',
    subject: replyToSubject || '',
    content: '',
    priority: 'medium',
    category: 'general',
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientId) {
      newErrors.recipientId = 'Please select a recipient';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Message content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSend(formData);
      
      // Reset form
      setFormData({
        recipientId: '',
        subject: '',
        content: '',
        priority: 'medium',
        category: 'general',
        attachments: []
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof NewMessageData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedContact = contacts.find(c => c.id === formData.recipientId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogDescription>
            Send a message to parents, students, or administrators
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select 
              value={formData.recipientId} 
              onValueChange={(value) => handleInputChange('recipientId', value)}
            >
              <SelectTrigger className={errors.recipientId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a recipient..." />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-gray-500 ml-1">
                          ({contact.type}
                          {contact.studentName && ` - ${contact.studentName}`})
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.recipientId && (
              <p className="text-sm text-red-500">{errors.recipientId}</p>
            )}
          </div>

          {/* Selected Contact Info */}
          {selectedContact && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {selectedContact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{selectedContact.name}</h4>
                    <p className="text-xs text-gray-600">
                      {selectedContact.type === 'parent' && selectedContact.studentName && (
                        <>Parent of {selectedContact.studentName} - {selectedContact.className}</>
                      )}
                      {selectedContact.type === 'student' && (
                        <>Student - {selectedContact.className}</>
                      )}
                      {selectedContact.type === 'admin' && (
                        <>Administrator</>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(value: NewMessageData['category']) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="behavior">Behavior</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Input
              placeholder="Enter message subject..."
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={errors.subject ? 'border-red-500' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Type your message here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content}</p>
            )}
            <p className="text-xs text-gray-500">
              {formData.content.length} characters
            </p>
          </div>

          {/* Attachments (placeholder) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Attachments</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Paperclip className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Drag files here or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (Feature coming soon)
              </p>
            </div>
          </div>

          {/* Quick Templates */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Templates</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedContact?.type === 'parent') {
                    setFormData(prev => ({
                      ...prev,
                      subject: prev.subject || `Update on ${selectedContact.studentName}`,
                      content: prev.content || `Dear ${selectedContact.name},\n\nI wanted to share an update about ${selectedContact.studentName}'s progress in my class.\n\n[Add your message here]\n\nBest regards,\n[Your name]`
                    }));
                  }
                }}
                disabled={!selectedContact || selectedContact.type !== 'parent'}
              >
                <FileText className="h-4 w-4 mr-1" />
                Student Update
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    subject: prev.subject || 'Parent-Teacher Conference Request',
                    content: prev.content || `Dear ${selectedContact?.name || '[Parent Name]'},\n\nI would like to schedule a parent-teacher conference to discuss your child's academic progress.\n\nPlease let me know your availability for the coming week.\n\nBest regards,\n[Your name]`
                  }));
                }}
              >
                <Clock className="h-4 w-4 mr-1" />
                Conference Request
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline">
                Save Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
