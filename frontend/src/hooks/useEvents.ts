import { useState, useEffect, useCallback } from 'react';
import type { CalEvent, EventFormData } from '../types';
import { api } from '../api/client';

export function useEvents(year: number) {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents(year);
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (data: EventFormData) => {
    const event = await api.createEvent(data);
    setEvents(prev => [...prev, event]);
    return event;
  };

  const updateEvent = async (id: string, data: Partial<EventFormData>) => {
    const event = await api.updateEvent(id, data);
    setEvents(prev => prev.map(e => e.id === id ? event : e));
    return event;
  };

  const deleteEvent = async (id: string) => {
    await api.deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const getMonthEvents = (month: number) =>
    events.filter(e => e.month === month);

  return { events, loading, error, createEvent, updateEvent, deleteEvent, getMonthEvents };
}
