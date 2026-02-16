import { useState } from 'react';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  const nextPeriod = () => {
    const newDate = new Date(currentDate);

    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    setCurrentDate(newDate);
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);

    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const changeView = (newView: 'day' | 'week' | 'month') => {
    setView(newView);
  };

  const formatDate = (date: Date, format: 'full' | 'short' | 'numeric' = 'full') => {
    if (view === 'month') {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } else if (view === 'week') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return {
    currentDate,
    view,
    nextPeriod,
    prevPeriod,
    goToToday,
    changeView,
    formatDate,
    setCurrentDate,
  };
}
