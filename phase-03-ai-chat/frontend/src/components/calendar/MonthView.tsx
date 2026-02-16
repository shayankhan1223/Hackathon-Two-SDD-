"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MonthView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [datesWithTasks, setDatesWithTasks] = useState<string[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    api.calendar
      .month(year, month)
      .then((res) => setDatesWithTasks(res.dates_with_tasks))
      .catch(() => {});
  }, [year, month]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday start

  const days: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  function prevMonth() {
    setCurrentDate(new Date(year, month - 2, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month, 1));
  }

  function hasTask(day: number): boolean {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return datesWithTasks.includes(dateStr);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="text-gray-500 hover:text-gray-900">
          &larr;
        </button>
        <h3 className="font-semibold">
          {monthName} {year}
        </h3>
        <button onClick={nextMonth} className="text-gray-500 hover:text-gray-900">
          &rarr;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d} className="py-1 font-medium text-gray-500">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`relative flex h-8 items-center justify-center rounded text-sm ${
              day === null
                ? ""
                : isToday(day)
                  ? "bg-blue-600 font-bold text-white"
                  : "hover:bg-gray-100"
            }`}
          >
            {day}
            {day && hasTask(day) && (
              <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
