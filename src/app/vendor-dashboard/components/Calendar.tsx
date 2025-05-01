import { useState, useEffect } from 'react';
import styles from '../styles.module.css';
import { Timestamp } from 'firebase/firestore';

interface CalendarEvent {
  id: string;
  eventName: string;
  startDate: Timestamp;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar = ({ events }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Get first day of the month
      const firstDay = new Date(year, month, 1);
      // Get last day of the month
      const lastDay = new Date(year, month + 1, 0);
      
      // Get the day of week for the first day (0-6)
      const firstDayOfWeek = firstDay.getDay();
      
      // Calculate days from previous month to show
      const daysFromPrevMonth = firstDayOfWeek;
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      
      const days: Date[] = [];
      
      // Add days from previous month
      for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthLastDay - i));
      }
      
      // Add days from current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
      }
      
      // Add days from next month if needed
      const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
      
      setCalendarDays(days);
    };

    generateCalendarDays();
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = event.startDate.toDate();
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button onClick={prevMonth} className={styles.calendarButton}>&lt;</button>
        <h3>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className={styles.calendarButton}>&gt;</button>
      </div>

      <div className={styles.calendarGrid}>
        {weekDays.map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
        
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          
          return (
            <div
              key={index}
              className={`${styles.calendarDay} ${!isCurrentMonthDay ? styles.otherMonth : ''}`}
            >
              <span className={styles.dayNumber}>{date.getDate()}</span>
              {dayEvents.length > 0 && (
                <div className={styles.eventList}>
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`${styles.eventItem} ${styles[`status${event.status}`]}`}
                    >
                      {event.eventName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 