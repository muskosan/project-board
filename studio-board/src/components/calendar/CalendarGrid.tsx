import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { CalendarEvent } from '../../types';
import { CalendarEventCard } from './CalendarEventCard';

interface CalendarGridProps {
  viewMode: 'month' | 'week';
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WeekHeaderCell = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  flex: 1;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const DayCell = styled.div<{ 
  isToday: boolean; 
  isCurrentMonth: boolean; 
  hasEvents: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  padding: ${({ theme }) => theme.spacing.md};
  min-height: 120px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
  
  ${({ isCurrentMonth, theme }) => !isCurrentMonth && `
    opacity: 0.4;
    background-color: ${theme.colors.background.secondary};
  `}
  
  ${({ isToday, theme }) => isToday && `
    background-color: ${theme.colors.accent.primary}10;
    border: 2px solid ${theme.colors.accent.primary};
  `}
`;

const WeekDayCell = styled.div<{ 
  isToday: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 400px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.text.muted};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  
  ${({ isToday, theme }) => isToday && `
    background-color: ${theme.colors.accent.primary}10;
    border-color: ${theme.colors.accent.primary};
  `}
`;

const DayNumber = styled.div<{ isToday: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${({ isToday, theme }) => isToday && `
    color: ${theme.colors.accent.primary};
    font-weight: ${theme.typography.weights.semibold};
  `}
`;

const WeekDayNumber = styled.div<{ isToday: boolean }>`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  ${({ isToday, theme }) => isToday && `
    color: ${theme.colors.accent.primary};
  `}
`;

const EventsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
`;

const MoreEventsIndicator = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  viewMode,
  currentDate,
  events,
  onEventClick,
  onDateClick,
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    
    if (viewMode === 'month') {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const startOfCalendar = new Date(startOfMonth);
      startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
      
      for (let i = 0; i < 42; i++) {
        const day = new Date(startOfCalendar);
        day.setDate(startOfCalendar.getDate() + i);
        days.push(day);
      }
    } else {
      // Week view
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
    }
    
    return days;
  }, [currentDate, viewMode]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.start);
      const dateKey = eventDate.toDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    // Sort events by start time
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => 
        new Date(a.start).getTime() - new Date(b.start).getTime()
      );
    });
    
    return grouped;
  }, [events]);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const getDayEvents = (date: Date) => {
    return eventsByDate[date.toDateString()] || [];
  };

  const renderMonthView = () => (
    <>
      <WeekHeader>
        {weekDays.map(day => (
          <WeekHeaderCell key={day}>{day}</WeekHeaderCell>
        ))}
      </WeekHeader>
      
      <MonthGrid>
        {calendarDays.map((date, index) => {
          const dayEvents = getDayEvents(date);
          const visibleEvents = dayEvents.slice(0, 3);
          const hasMoreEvents = dayEvents.length > 3;
          
          return (
            <DayCell
              key={index}
              isToday={isToday(date)}
              isCurrentMonth={isCurrentMonth(date)}
              hasEvents={dayEvents.length > 0}
              onClick={() => onDateClick(date)}
            >
              <DayNumber isToday={isToday(date)}>
                {date.getDate()}
              </DayNumber>
              
              <EventsContainer>
                {visibleEvents.map(event => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    variant="compact"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  />
                ))}
                
                {hasMoreEvents && (
                  <MoreEventsIndicator>
                    +{dayEvents.length - 3} more
                  </MoreEventsIndicator>
                )}
              </EventsContainer>
            </DayCell>
          );
        })}
      </MonthGrid>
    </>
  );

  const renderWeekView = () => (
    <>
      <WeekHeader>
        {weekDays.map((day, index) => (
          <WeekHeaderCell key={day}>
            {day} {calendarDays[index]?.getDate()}
          </WeekHeaderCell>
        ))}
      </WeekHeader>
      
      <WeekGrid>
        {calendarDays.map((date, index) => {
          const dayEvents = getDayEvents(date);
          
          return (
            <WeekDayCell
              key={index}
              isToday={isToday(date)}
              onClick={() => onDateClick(date)}
            >
              <WeekDayNumber isToday={isToday(date)}>
                {date.getDate()}
              </WeekDayNumber>
              
              <EventsContainer>
                {dayEvents.map(event => (
                  <CalendarEventCard
                    key={event.id}
                    event={event}
                    variant="detailed"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  />
                ))}
              </EventsContainer>
            </WeekDayCell>
          );
        })}
      </WeekGrid>
    </>
  );

  return (
    <GridContainer>
      {viewMode === 'month' ? renderMonthView() : renderWeekView()}
    </GridContainer>
  );
};