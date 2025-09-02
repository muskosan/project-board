import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter
} from 'lucide-react';
import type { CalendarEvent, Project } from '../../types';
import { Button } from '../ui/Button';
import { CalendarGrid } from './CalendarGrid';

import { EventModal } from './EventModal';
import { CalendarFilters } from './CalendarFilters';

interface CalendarViewProps {
  events: CalendarEvent[];
  projects: Project[];
  onEventCreate: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEventUpdate: (id: string, event: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
}

type ViewMode = 'month' | 'week';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MonthYear = styled.h2`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  min-width: 200px;
  text-align: center;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 2px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: none;
  background-color: ${({ active, theme }) => 
    active ? theme.colors.background.elevated : 'transparent'
  };
  color: ${({ active, theme }) => 
    active ? theme.colors.text.primary : theme.colors.text.secondary
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.elevated};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FiltersContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const CalendarContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow: auto;
`;

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  projects,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    projects: [] as string[],
    types: [] as string[],
  });

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filters.projects.length > 0 && event.projectId) {
        if (!filters.projects.includes(event.projectId)) return false;
      }
      if (filters.types.length > 0) {
        if (!filters.types.includes(event.type)) return false;
      }
      return true;
    });
  }, [events, filters]);

  // Get events for current view period
  const viewEvents = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    if (viewMode === 'month') {
      return filteredEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= startOfMonth && eventDate <= endOfMonth;
      });
    } else {
      // Week view - get current week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return filteredEvents.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      });
    }
  }, [filteredEvents, currentDate, viewMode]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEventCreate = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventSave = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedEvent) {
      onEventUpdate(selectedEvent.id, eventData);
    } else {
      onEventCreate(eventData);
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDeleteConfirm = () => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id);
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>
            <CalendarIcon size={32} />
            Calendar
          </Title>
          <Navigation>
            <Button variant="ghost" size="sm" onClick={navigatePrevious}>
              <ChevronLeft size={16} />
            </Button>
            <MonthYear>{formatMonthYear()}</MonthYear>
            <Button variant="ghost" size="sm" onClick={navigateNext}>
              <ChevronRight size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
          </Navigation>
        </HeaderLeft>
        
        <HeaderRight>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'month'} 
              onClick={() => setViewMode('month')}
            >
              Month
            </ViewButton>
            <ViewButton 
              active={viewMode === 'week'} 
              onClick={() => setViewMode('week')}
            >
              Week
            </ViewButton>
          </ViewToggle>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter size={16} />
            Filters
          </Button>
          
          <Button variant="primary" size="sm" onClick={handleEventCreate}>
            <Plus size={16} />
            New Event
          </Button>
        </HeaderRight>
      </Header>

      <Content>
        {isFiltersOpen && (
          <FiltersContainer>
            <CalendarFilters
              projects={projects}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </FiltersContainer>
        )}
        
        <CalendarContainer>
          <CalendarGrid
            viewMode={viewMode}
            currentDate={currentDate}
            events={viewEvents}
            onEventClick={handleEventClick}
            onDateClick={() => {
              // Create new event for clicked date
              setSelectedEvent(null);
              setIsEventModalOpen(true);
            }}
          />
        </CalendarContainer>
      </Content>

      {isEventModalOpen && (
        <EventModal
          event={selectedEvent}
          projects={projects}
          onSave={handleEventSave}
          onDelete={selectedEvent ? handleEventDeleteConfirm : undefined}
          onClose={() => {
            setIsEventModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </Container>
  );
};