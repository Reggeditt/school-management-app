import { DatabaseService } from '@/lib/database-services';

export interface ScheduleItem {
  id: string;
  title: string;
  className: string;
  subject: string;
  time: string;
  duration: number; // in minutes
  room: string;
  studentsCount: number;
  type: 'class' | 'meeting' | 'event';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  description?: string;
  teacherId: string;
  date: string;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  items: ScheduleItem[];
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];
  totalHours: number;
  totalClasses: number;
}

export interface ScheduleStats {
  totalClasses: number;
  totalHours: number;
  upcomingClasses: number;
  completedToday: number;
  nextClass?: {
    title: string;
    time: string;
    room: string;
    className: string;
  };
}

export class ScheduleService {
  
  /**
   * Get teacher's weekly schedule
   */
  static async getWeeklySchedule(teacherId: string, weekStart: Date): Promise<WeekSchedule> {
    try {
      // In a real implementation, this would fetch from Firestore
      // For now, we'll generate mock data based on teacher's classes
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const days: DaySchedule[] = [];
      let totalHours = 0;
      let totalClasses = 0;
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        
        const daySchedule: DaySchedule = {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          items: await this.generateDaySchedule(teacherId, date, i)
        };
        
        totalClasses += daySchedule.items.filter(item => item.type === 'class').length;
        totalHours += daySchedule.items.reduce((sum, item) => sum + (item.duration / 60), 0);
        
        days.push(daySchedule);
      }
      
      return {
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0],
        days,
        totalHours: Math.round(totalHours * 10) / 10,
        totalClasses
      };
    } catch (error) {
      console.error('Error fetching weekly schedule:', error);
      throw error;
    }
  }

  /**
   * Get schedule statistics for teacher
   */
  static async getScheduleStats(teacherId: string): Promise<ScheduleStats> {
    try {
      const today = new Date();
      const weekStart = this.getWeekStart(today);
      const weekSchedule = await this.getWeeklySchedule(teacherId, weekStart);
      
      const todaySchedule = weekSchedule.days.find(day => 
        day.date === today.toISOString().split('T')[0]
      );
      
      const allItems = weekSchedule.days.flatMap(day => day.items);
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const upcomingClasses = allItems.filter(item => 
        item.type === 'class' && 
        (item.date > today.toISOString().split('T')[0] || 
         (item.date === today.toISOString().split('T')[0] && item.time > currentTime))
      ).length;
      
      const completedToday = todaySchedule?.items.filter(item => 
        item.status === 'completed'
      ).length || 0;
      
      // Find next class
      const nextClass = allItems
        .filter(item => 
          item.type === 'class' && 
          (item.date > today.toISOString().split('T')[0] || 
           (item.date === today.toISOString().split('T')[0] && item.time > currentTime))
        )
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];
      
      return {
        totalClasses: weekSchedule.totalClasses,
        totalHours: weekSchedule.totalHours,
        upcomingClasses,
        completedToday,
        nextClass: nextClass ? {
          title: nextClass.title,
          time: nextClass.time,
          room: nextClass.room,
          className: nextClass.className
        } : undefined
      };
    } catch (error) {
      console.error('Error fetching schedule stats:', error);
      throw error;
    }
  }

  /**
   * Get today's schedule for teacher
   */
  static async getTodaySchedule(teacherId: string): Promise<DaySchedule> {
    try {
      const today = new Date();
      const dayIndex = today.getDay();
      
      return {
        date: today.toISOString().split('T')[0],
        dayName: today.toLocaleDateString('en-US', { weekday: 'long' }),
        items: await this.generateDaySchedule(teacherId, today, dayIndex)
      };
    } catch (error) {
      console.error('Error fetching today schedule:', error);
      throw error;
    }
  }

  /**
   * Update schedule item status
   */
  static async updateScheduleStatus(itemId: string, status: ScheduleItem['status']): Promise<void> {
    try {
      // In a real implementation, this would update Firestore
      console.log(`Updating schedule item ${itemId} status to ${status}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating schedule status:', error);
      throw error;
    }
  }

  /**
   * Create new schedule item
   */
  static async createScheduleItem(item: Omit<ScheduleItem, 'id'>): Promise<ScheduleItem> {
    try {
      const newItem: ScheduleItem = {
        ...item,
        id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // In a real implementation, this would save to Firestore
      console.log('Creating schedule item:', newItem);
      
      return newItem;
    } catch (error) {
      console.error('Error creating schedule item:', error);
      throw error;
    }
  }

  /**
   * Generate mock day schedule
   */
  static async generateDaySchedule(teacherId: string, date: Date, dayIndex: number): Promise<ScheduleItem[]> {
    // Skip weekends for most classes
    if (dayIndex === 0 || dayIndex === 6) {
      return [];
    }

    const items: ScheduleItem[] = [];
    const dateStr = date.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Monday, Wednesday, Friday - Grade 10A Math
    if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) {
      const status = this.getScheduleStatus(dateStr, '09:00', today, currentTime);
      items.push({
        id: `${teacherId}_${dateStr}_1`,
        title: 'Mathematics Class',
        className: 'Grade 10A',
        subject: 'Mathematics',
        time: '09:00',
        duration: 60,
        room: 'Room 201',
        studentsCount: 28,
        type: 'class',
        status,
        description: 'Algebra and Geometry fundamentals',
        teacherId,
        date: dateStr
      });
    }

    // Tuesday, Thursday - Grade 9B Science
    if (dayIndex === 2 || dayIndex === 4) {
      const status = this.getScheduleStatus(dateStr, '10:00', today, currentTime);
      items.push({
        id: `${teacherId}_${dateStr}_2`,
        title: 'Science Class',
        className: 'Grade 9B',
        subject: 'Science',
        time: '10:00',
        duration: 60,
        room: 'Lab 1',
        studentsCount: 25,
        type: 'class',
        status,
        description: 'Physics and Chemistry experiments',
        teacherId,
        date: dateStr
      });
    }

    // Monday, Wednesday, Friday afternoon - Grade 10B Math
    if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) {
      const status = this.getScheduleStatus(dateStr, '14:00', today, currentTime);
      items.push({
        id: `${teacherId}_${dateStr}_3`,
        title: 'Mathematics Class',
        className: 'Grade 10B',
        subject: 'Mathematics',
        time: '14:00',
        duration: 60,
        room: 'Room 201',
        studentsCount: 30,
        type: 'class',
        status,
        description: 'Advanced algebra topics',
        teacherId,
        date: dateStr
      });
    }

    // Weekly staff meeting on Wednesday
    if (dayIndex === 3) {
      const status = this.getScheduleStatus(dateStr, '16:00', today, currentTime);
      items.push({
        id: `${teacherId}_${dateStr}_4`,
        title: 'Staff Meeting',
        className: 'All Staff',
        subject: 'Administration',
        time: '16:00',
        duration: 90,
        room: 'Conference Room',
        studentsCount: 0,
        type: 'meeting',
        status,
        description: 'Weekly staff coordination meeting',
        teacherId,
        date: dateStr
      });
    }

    return items.sort((a, b) => a.time.localeCompare(b.time));
  }

  /**
   * Get schedule item status based on date and time
   */
  private static getScheduleStatus(itemDate: string, itemTime: string, today: string, currentTime: string): ScheduleItem['status'] {
    if (itemDate < today) {
      return 'completed';
    } else if (itemDate === today) {
      if (itemTime < currentTime) {
        return 'completed';
      } else {
        // Check if class is within the next hour (could be in progress)
        const [itemHour, itemMinute] = itemTime.split(':').map(Number);
        const [currentHour, currentMinute] = currentTime.split(':').map(Number);
        const itemMinutes = itemHour * 60 + itemMinute;
        const currentMinutes = currentHour * 60 + currentMinute;
        
        if (currentMinutes >= itemMinutes && currentMinutes <= itemMinutes + 60) {
          return 'in-progress';
        }
      }
    }
    return 'scheduled';
  }

  /**
   * Get start of week (Sunday)
   */
  private static getWeekStart(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  /**
   * Export schedule to CSV
   */
  static async exportSchedule(teacherId: string, weekStart: Date): Promise<string> {
    try {
      const schedule = await this.getWeeklySchedule(teacherId, weekStart);
      
      const headers = ['Date', 'Day', 'Time', 'Title', 'Class', 'Subject', 'Room', 'Duration (min)', 'Students', 'Type', 'Status'];
      const rows = [headers.join(',')];
      
      schedule.days.forEach(day => {
        day.items.forEach(item => {
          const row = [
            day.date,
            day.dayName,
            item.time,
            `"${item.title}"`,
            `"${item.className}"`,
            `"${item.subject}"`,
            `"${item.room}"`,
            item.duration.toString(),
            item.studentsCount.toString(),
            item.type,
            item.status
          ];
          rows.push(row.join(','));
        });
      });
      
      return rows.join('\n');
    } catch (error) {
      console.error('Error exporting schedule:', error);
      throw error;
    }
  }
}
