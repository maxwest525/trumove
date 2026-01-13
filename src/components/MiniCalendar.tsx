import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  selectedDate: Date | null;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const MiniCalendar = ({ selectedDate }: MiniCalendarProps) => {
  const displayDate = selectedDate || new Date();
  const month = displayDate.getMonth();
  const year = displayDate.getFullYear();
  const selectedDay = selectedDate?.getDate();
  
  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="tru-mini-calendar">
      {/* Header */}
      <div className="tru-mini-cal-header">
        <ChevronLeft className="tru-mini-cal-nav" />
        <span className="tru-mini-cal-month">{MONTHS[month]} {year}</span>
        <ChevronRight className="tru-mini-cal-nav" />
      </div>
      
      {/* Day names */}
      <div className="tru-mini-cal-days">
        {DAYS.map(day => (
          <span key={day} className="tru-mini-cal-dayname">{day}</span>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="tru-mini-cal-grid">
        {calendarDays.map((day, idx) => (
          <span 
            key={idx} 
            className={`tru-mini-cal-day ${day === selectedDay ? "is-selected" : ""} ${day === null ? "is-empty" : ""}`}
          >
            {day}
          </span>
        ))}
      </div>
      
      {/* Selected date display */}
      {selectedDate && (
        <div className="tru-mini-cal-selected">
          <span className="tru-mini-cal-selected-label">Move Date</span>
          <span className="tru-mini-cal-selected-date">
            {MONTHS[month].slice(0, 3)} {selectedDay}, {year}
          </span>
        </div>
      )}
    </div>
  );
};
