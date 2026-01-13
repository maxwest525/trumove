interface MiniCalendarProps {
  selectedDate: Date | null;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
        <span className="tru-mini-cal-month">{MONTHS[month]} {year}</span>
      </div>
      
      {/* Day names */}
      <div className="tru-mini-cal-days">
        {DAYS.map((day, idx) => (
          <span key={idx} className="tru-mini-cal-dayname">{day}</span>
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
    </div>
  );
};
