"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TaskResponse } from "@/lib/types";

interface DayViewProps {
  date: string;
  userCreatedAt?: string;
}

export default function DayView({ date, userCreatedAt }: DayViewProps) {
  const [pending, setPending] = useState<TaskResponse[]>([]);
  const [completed, setCompleted] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.calendar
      .day(date)
      .then((res) => {
        setPending(res.pending_tasks);
        setCompleted(res.completed_tasks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [date]);

  if (loading) return <div className="p-4 text-gray-500 text-sm">Loading...</div>;

  const isPreRegistration = userCreatedAt && date < userCreatedAt.split("T")[0];
  const isEmpty = pending.length === 0 && completed.length === 0;

  if (isPreRegistration && isEmpty) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No tasks were added by you on this date.
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No tasks for {date}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold text-sm">{date}</h4>
      {pending.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Pending</h5>
          {pending.map((t) => (
            <div key={t.id} className="rounded border p-2 mb-1 text-sm">
              {t.title}
            </div>
          ))}
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Completed</h5>
          {completed.map((t) => (
            <div key={t.id} className="rounded border p-2 mb-1 text-sm text-gray-400 line-through">
              {t.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
