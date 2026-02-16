"use client";

interface WeekViewProps {
  dates: Date[];
  datesWithTasks?: string[];
  onDateClick?: (date: Date) => void;
}

export default function WeekView({ dates, datesWithTasks = [], onDateClick }: WeekViewProps) {
  function hasTask(date: Date): boolean {
    const dateStr = date.toISOString().split("T")[0];
    return datesWithTasks.includes(dateStr);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
        <div key={d} className="text-center text-xs font-medium text-gray-500">
          {d}
        </div>
      ))}
      {dates.map((date, i) => {
        const dateStr = date.toISOString().split("T")[0];
        const isToday = dateStr === today;
        return (
          <button
            key={i}
            onClick={() => onDateClick?.(date)}
            className={`relative flex flex-col items-center rounded p-2 text-sm ${
              isToday ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            <span>{date.getDate()}</span>
            {hasTask(date) && (
              <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
