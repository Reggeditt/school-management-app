import { DatabaseService } from '@/lib/database-services';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'parent' | 'student' | 'admin' | 'teacher';
  recipientId: string;
  recipientName?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  attachments?: string[];
  threadId?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'general' | 'academic' | 'behavior' | 'attendance' | 'urgent';
}

export interface Contact {
  id: string;
  name: string;
  type: 'parent' | 'student' | 'admin';
  studentName?: string;
  className?: string;
  email: string;
  phone?: string;
  lastContact?: string;
  isOnline: boolean;
  unreadCount: number;
}

export interface MessageThread {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  isArchived: boolean;
}

export interface MessageStats {
  totalMessages: number;
  unreadMessages: number;
  starredMessages: number;
  urgentMessages: number;
  todayMessages: number;
}

export interface NewMessageData {
  recipientId: string;
  subject: string;
  content: string;
  priority: Message['priority'];
  category: Message['category'];
  attachments?: string[];
}

export class MessageService {
  
  /**
   * Get all messages for a teacher
   */
  static async getTeacherMessages(teacherId: string): Promise<Message[]> {
    try {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll generate mock data
      
      const messages: Message[] = [
        {
          id: 'msg_1',
          senderId: 'parent_sarah_johnson',
          senderName: 'Sarah Johnson',
          senderType: 'parent',
          recipientId: teacherId,
          recipientName: 'Teacher',
          subject: 'Question about Math homework',
          content: 'Hello, I wanted to ask about the math homework assigned yesterday. My daughter Alice is having trouble with problem #5. Could you provide some additional guidance? She spent over an hour on it but is still confused about the concept.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          priority: 'medium',
          category: 'academic'
        },
        {
          id: 'msg_2',
          senderId: 'parent_michael_smith',
          senderName: 'Michael Smith',
          senderType: 'parent',
          recipientId: teacherId,
          subject: 'Attendance concern - Bob Smith',
          content: 'Hi, I noticed that Bob was marked absent yesterday, but he was definitely in school. I dropped him off myself and he mentioned attending your math class. Could you please check the attendance records? This might affect his participation grade.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isStarred: true,
          isArchived: false,
          priority: 'high',
          category: 'attendance'
        },
        {
          id: 'msg_3',
          senderId: 'admin_principal',
          senderName: 'Principal Davis',
          senderType: 'admin',
          recipientId: teacherId,
          subject: 'Parent-Teacher Conference Schedule',
          content: 'Please review the attached schedule for next week\'s parent-teacher conferences. Your conferences are scheduled for Tuesday and Thursday afternoons. Let me know if you need any adjustments or have scheduling conflicts.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isStarred: false,
          isArchived: false,
          attachments: ['conference_schedule.pdf'],
          priority: 'medium',
          category: 'general'
        },
        {
          id: 'msg_4',
          senderId: 'parent_lisa_wilson',
          senderName: 'Lisa Wilson',
          senderType: 'parent',
          recipientId: teacherId,
          subject: 'Thank you note - David Wilson',
          content: 'I wanted to thank you for the extra help you provided to David last week. His confidence in math has really improved! He came home excited about solving equations for the first time. Your patience and teaching methods are making a real difference.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          isStarred: false,
          isArchived: false,
          priority: 'low',
          category: 'general'
        },
        {
          id: 'msg_5',
          senderId: 'parent_jennifer_brown',
          senderName: 'Jennifer Brown',
          senderType: 'parent',
          recipientId: teacherId,
          subject: 'URGENT: Emma feeling unwell in class',
          content: 'Emma texted me that she\'s feeling nauseous during your class. Please send her to the nurse\'s office if she hasn\'t already gone. I\'m on my way to pick her up. Thank you for your understanding.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          priority: 'high',
          category: 'urgent'
        },
        {
          id: 'msg_6',
          senderId: 'student_alex_chen',
          senderName: 'Alex Chen',
          senderType: 'student',
          recipientId: teacherId,
          subject: 'Makeup test request',
          content: 'Hi, I was absent during the quiz last Friday due to a medical appointment. Could I schedule a makeup test? I have the doctor\'s note and can take it any day this week after school.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          priority: 'medium',
          category: 'academic'
        }
      ];
      
      return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching teacher messages:', error);
      throw error;
    }
  }

  /**
   * Get teacher's contacts
   */
  static async getTeacherContacts(teacherId: string): Promise<Contact[]> {
    try {
      const contacts: Contact[] = [
        {
          id: 'parent_sarah_johnson',
          name: 'Sarah Johnson',
          type: 'parent',
          studentName: 'Alice Johnson',
          className: 'Grade 10A',
          email: 'sarah.johnson@email.com',
          phone: '+1-555-0123',
          lastContact: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isOnline: true,
          unreadCount: 1
        },
        {
          id: 'parent_michael_smith',
          name: 'Michael Smith',
          type: 'parent',
          studentName: 'Bob Smith',
          className: 'Grade 10A',
          email: 'michael.smith@email.com',
          phone: '+1-555-0124',
          lastContact: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          isOnline: false,
          unreadCount: 0
        },
        {
          id: 'parent_lisa_wilson',
          name: 'Lisa Wilson',
          type: 'parent',
          studentName: 'David Wilson',
          className: 'Grade 10B',
          email: 'lisa.wilson@email.com',
          phone: '+1-555-0125',
          lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          isOnline: false,
          unreadCount: 0
        },
        {
          id: 'parent_jennifer_brown',
          name: 'Jennifer Brown',
          type: 'parent',
          studentName: 'Emma Brown',
          className: 'Grade 9B',
          email: 'jennifer.brown@email.com',
          phone: '+1-555-0126',
          lastContact: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isOnline: true,
          unreadCount: 1
        },
        {
          id: 'student_alex_chen',
          name: 'Alex Chen',
          type: 'student',
          className: 'Grade 10A',
          email: 'alex.chen@school.edu',
          lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isOnline: false,
          unreadCount: 1
        },
        {
          id: 'admin_principal',
          name: 'Principal Davis',
          type: 'admin',
          email: 'principal@school.edu',
          phone: '+1-555-0100',
          lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          isOnline: false,
          unreadCount: 0
        }
      ];
      
      return contacts.sort((a, b) => new Date(b.lastContact || 0).getTime() - new Date(a.lastContact || 0).getTime());
    } catch (error) {
      console.error('Error fetching teacher contacts:', error);
      throw error;
    }
  }

  /**
   * Get message statistics
   */
  static async getMessageStats(teacherId: string): Promise<MessageStats> {
    try {
      const messages = await this.getTeacherMessages(teacherId);
      const today = new Date().toISOString().split('T')[0];
      
      return {
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.isRead).length,
        starredMessages: messages.filter(m => m.isStarred).length,
        urgentMessages: messages.filter(m => m.priority === 'high' || m.category === 'urgent').length,
        todayMessages: messages.filter(m => m.timestamp.startsWith(today)).length
      };
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  }

  /**
   * Send a new message
   */
  static async sendMessage(teacherId: string, messageData: NewMessageData): Promise<Message> {
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: teacherId,
        senderName: 'Teacher', // Would be fetched from user profile
        senderType: 'teacher',
        recipientId: messageData.recipientId,
        subject: messageData.subject,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        isArchived: false,
        attachments: messageData.attachments,
        priority: messageData.priority,
        category: messageData.category
      };
      
      // In a real implementation, this would save to Firestore
      console.log('Sending message:', newMessage);
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  static async markAsRead(messageId: string): Promise<void> {
    try {
      // In a real implementation, this would update Firestore
      console.log(`Marking message ${messageId} as read`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Toggle message star status
   */
  static async toggleStar(messageId: string, isStarred: boolean): Promise<void> {
    try {
      // In a real implementation, this would update Firestore
      console.log(`${isStarred ? 'Starring' : 'Unstarring'} message ${messageId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error toggling message star:', error);
      throw error;
    }
  }

  /**
   * Archive/unarchive message
   */
  static async toggleArchive(messageId: string, isArchived: boolean): Promise<void> {
    try {
      // In a real implementation, this would update Firestore
      console.log(`${isArchived ? 'Archiving' : 'Unarchiving'} message ${messageId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error toggling message archive:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      // In a real implementation, this would delete from Firestore
      console.log(`Deleting message ${messageId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Search messages
   */
  static async searchMessages(teacherId: string, query: string): Promise<Message[]> {
    try {
      const messages = await this.getTeacherMessages(teacherId);
      
      if (!query.trim()) {
        return messages;
      }
      
      const searchTerm = query.toLowerCase();
      return messages.filter(message => 
        message.subject.toLowerCase().includes(searchTerm) ||
        message.content.toLowerCase().includes(searchTerm) ||
        message.senderName.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Filter messages by category
   */
  static async filterMessages(teacherId: string, category: string): Promise<Message[]> {
    try {
      const messages = await this.getTeacherMessages(teacherId);
      
      if (category === 'all') {
        return messages;
      }
      
      if (category === 'unread') {
        return messages.filter(m => !m.isRead);
      }
      
      if (category === 'starred') {
        return messages.filter(m => m.isStarred);
      }
      
      if (category === 'archived') {
        return messages.filter(m => m.isArchived);
      }
      
      return messages.filter(m => m.category === category);
    } catch (error) {
      console.error('Error filtering messages:', error);
      throw error;
    }
  }
}
