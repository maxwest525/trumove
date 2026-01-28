import { useState, useMemo } from "react";
import { format, addDays } from "date-fns";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00 AM", "11:30 AM", "1:00 PM",
  "3:00 PM", "4:30 PM", "6:00 PM"
];

interface BookingCalendarProps {
  onSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export function BookingCalendar({ onSelect, selectedDate, selectedTime }: BookingCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [internalSelectedDate, setInternalSelectedDate] = useState<number>(0);
  const [internalSelectedTime, setInternalSelectedTime] = useState<string>("");

  const effectiveSelectedTime = selectedTime ?? internalSelectedTime;

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i + weekOffset * 7);
      return {
        index: i,
        date,
        label: i === 0 && weekOffset === 0 ? 'Today' : i === 1 && weekOffset === 0 ? 'Tomorrow' : format(date, 'EEE'),
        dateStr: format(date, 'MMM d'),
        dayOfWeek: format(date, 'EEEE'),
        slots: Math.floor(Math.random() * 6) + 3,
      };
    });
  }, [weekOffset]);

  const handleDateSelect = (index: number) => {
    setInternalSelectedDate(index);
    if (effectiveSelectedTime) {
      onSelect(dates[index].date, effectiveSelectedTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    setInternalSelectedTime(time);
    onSelect(dates[internalSelectedDate].date, time);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Choose a day
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="p-1.5 rounded-lg hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Pills */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((day) => (
          <button
            key={day.index}
            type="button"
            onClick={() => handleDateSelect(day.index)}
            className={cn(
              "flex flex-col items-center p-3 rounded-xl transition-all duration-150",
              internalSelectedDate === day.index
                ? "bg-foreground text-background shadow-lg scale-105"
                : "border border-border/60 bg-card text-foreground hover:bg-muted/50 hover:scale-102"
            )}
          >
            <span className="text-xs font-bold">{day.label}</span>
            <span className={cn(
              "text-lg font-black",
              internalSelectedDate === day.index ? "text-background" : "text-foreground"
            )}>
              {format(day.date, 'd')}
            </span>
            <span className={cn(
              "text-[10px]",
              internalSelectedDate === day.index ? "text-background/70" : "text-muted-foreground"
            )}>
              {day.slots} slots
            </span>
          </button>
        ))}
      </div>

      {/* Time Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Available times (local)
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleTimeSelect(time)}
              className={cn(
                "h-12 rounded-xl text-sm font-semibold transition-all duration-150",
                effectiveSelectedTime === time
                  ? "bg-foreground text-background shadow-lg"
                  : "border border-border/60 bg-card text-foreground hover:bg-muted/50"
              )}
            >
              {time}
            </button>
          ))}
        </div>

        {!effectiveSelectedTime && (
          <p className="text-sm text-muted-foreground">
            Select a time to continue.
          </p>
        )}
      </div>
    </div>
  );
}
