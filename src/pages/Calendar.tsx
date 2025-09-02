import React, { useState, useEffect } from 'react';
import { CalendarView } from '../components/calendar';
import type { CalendarEvent, Project } from '../types';
import { generateCompleteDataset } from '../utils/mockData';

export const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to load data
    const loadData = async () => {
      try {
        // In a real app, this would be API calls
        const dataset = generateCompleteDataset();
        setEvents(dataset.calendarEvents);
        setProjects(dataset.projects);
      } catch (error) {
        console.error('Failed to load calendar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEventCreate = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setEvents(prev => [...prev, newEvent]);
  };

  const handleEventUpdate = (id: string, eventData: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...eventData, updatedAt: new Date() }
        : event
    ));
  };

  const handleEventDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        fontSize: '1.125rem',
        color: '#6B6B6B'
      }}>
        Loading calendar...
      </div>
    );
  }

  return (
    <CalendarView
      events={events}
      projects={projects}
      onEventCreate={handleEventCreate}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
};