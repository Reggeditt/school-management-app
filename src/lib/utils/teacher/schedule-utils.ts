/**
 * Utility functions for schedule management and generation
 */

export interface ScheduleEvent {
  id: string;
  classId: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  classroom: string;
  studentCount: number;
  color: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

/**
 * Standard time slots for school schedule
 */
export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { start: '08:00', end: '09:00' },
  { start: '09:15', end: '10:15' },
  { start: '10:30', end: '11:30' },
  { start: '11:45', end: '12:45' },
  { start: '14:00', end: '15:00' },
  { start: '15:15', end: '16:15' },
];

/**
 * Standard classroom names
 */
export const DEFAULT_CLASSROOMS = [
  'Room 101', 'Room 102', 'Room 103', 'Lab A', 'Lab B', 'Auditorium', 'Library'
];

/**
 * Color schemes for different classes
 */
export const CLASS_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
  'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
];

/**
 * Day names
 */
export const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Get current week dates starting from Monday
 */
export function getCurrentWeekDates(weekOffset: number = 0): Date[] {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7));
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

/**
 * Generate mock schedule for teacher classes
 */
export function generateMockSchedule(classes: any[]): ScheduleEvent[] {
  const schedule: ScheduleEvent[] = [];

  classes.forEach((classItem, classIndex) => {
    // Generate 2-3 sessions per class throughout the week
    const sessionsPerWeek = Math.floor(Math.random() * 2) + 2; // 2-3 sessions
    
    for (let i = 0; i < sessionsPerWeek; i++) {
      const dayOfWeek = (classIndex * 2 + i + 1) % 5 + 1; // Monday to Friday
      const timeSlot = DEFAULT_TIME_SLOTS[Math.floor(Math.random() * DEFAULT_TIME_SLOTS.length)];
      
      schedule.push({
        id: `${classItem.id}-${dayOfWeek}-${i}`,
        classId: classItem.id,
        className: classItem.name,
        subject: classItem.subjects?.[0] || 'General',
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        dayOfWeek,
        classroom: DEFAULT_CLASSROOMS[classIndex % DEFAULT_CLASSROOMS.length],
        studentCount: classItem.students?.length || 0,
        color: CLASS_COLORS[classIndex % CLASS_COLORS.length]
      });
    }
  });

  return schedule.sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startTime.localeCompare(b.startTime);
  });
}

/**
 * Get events for a specific day
 */
export function getEventsForDay(schedule: ScheduleEvent[], dayOfWeek: number): ScheduleEvent[] {
  return schedule.filter(event => event.dayOfWeek === dayOfWeek);
}

/**
 * Get event at specific time slot
 */
export function getEventAtTime(
  schedule: ScheduleEvent[], 
  dayOfWeek: number, 
  timeSlot: string
): ScheduleEvent | undefined {
  return schedule.find(event => 
    event.dayOfWeek === dayOfWeek && 
    event.startTime <= timeSlot && 
    event.endTime > timeSlot
  );
}

/**
 * Get today's schedule statistics
 */
export function getTodayStats(schedule: ScheduleEvent[]): {
  totalClasses: number;
  totalStudents: number;
  nextClass: ScheduleEvent | undefined;
  currentClass: ScheduleEvent | undefined;
} {
  const today = new Date().getDay();
  const todayEvents = getEventsForDay(schedule, today);
  const currentTime = new Date().toTimeString().slice(0, 5);

  return {
    totalClasses: todayEvents.length,
    totalStudents: todayEvents.reduce((sum, event) => sum + event.studentCount, 0),
    nextClass: todayEvents.find(event => event.startTime > currentTime),
    currentClass: todayEvents.find(event => 
      event.startTime <= currentTime && event.endTime > currentTime
    )
  };
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Check if a time slot conflicts with existing events
 */
export function hasScheduleConflict(
  schedule: ScheduleEvent[],
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  excludeEventId?: string
): boolean {
  return schedule.some(event => {
    if (excludeEventId && event.id === excludeEventId) return false;
    if (event.dayOfWeek !== dayOfWeek) return false;
    
    // Check for time overlap
    return (startTime < event.endTime && endTime > event.startTime);
  });
}
