import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';
import type { CalendarEvent } from '../../types';

interface CalendarEventCardProps {
  event: CalendarEvent;
  variant?: 'compact' | 'detailed';
  onClick?: (event: React.MouseEvent) => void;
}

const eventTypeColors = {
  deadline: '#EF4444',
  meeting: '#3B82F6',
  milestone: '#10B981',
};

const EventCard = styled.div<{ 
  variant: 'compact' | 'detailed';
  eventType: keyof typeof eventTypeColors;
  color: string;
}>`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ variant, theme }) => 
    variant === 'compact' ? theme.spacing.xs : theme.spacing.sm
  };
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-left: 3px solid ${({ color }) => color};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  ${({ variant }) => variant === 'compact' && css`
    min-height: 20px;
    display: flex;
    align-items: center;
  `}
  
  ${({ variant }) => variant === 'detailed' && css`
    min-height: 60px;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  `}
`;

const EventTitle = styled.div<{ variant: 'compact' | 'detailed' }>`
  font-size: ${({ variant, theme }) => 
    variant === 'compact' ? theme.typography.sizes.xs : theme.typography.sizes.sm
  };
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ variant, theme }) => 
    variant === 'compact' ? '0' : theme.spacing.xs
  };
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${({ variant }) => variant === 'compact' ? 'nowrap' : 'normal'};
  display: ${({ variant }) => variant === 'compact' ? 'block' : '-webkit-box'};
  -webkit-line-clamp: ${({ variant }) => variant === 'compact' ? 'none' : '2'};
  -webkit-box-orient: vertical;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EventType = styled.span<{ eventType: keyof typeof eventTypeColors }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ eventType }) => eventTypeColors[eventType]};
  text-transform: capitalize;
`;

const ProjectTag = styled.span`
  background-color: ${({ theme }) => theme.colors.accent.primary}20;
  color: ${({ theme }) => theme.colors.accent.primary};
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const TimeRange = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const HoverExpansion = styled.div<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 10;
  opacity: ${({ show }) => show ? 1 : 0};
  visibility: ${({ show }) => show ? 'visible' : 'hidden'};
  transform: translateY(${({ show }) => show ? '0' : '-10px'});
  transition: all ${({ theme }) => theme.transitions.fast};
  max-width: 300px;
`;

const ExpandedTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const ExpandedDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  line-height: 1.4;
`;

const ExpandedMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  event,
  variant = 'compact',
  onClick,
}) => {
  const [showExpansion, setShowExpansion] = useState(false);
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeRange = () => {
    const start = formatTime(new Date(event.start));
    const end = formatTime(new Date(event.end));
    return `${start} - ${end}`;
  };

  const getEventTypeIcon = () => {
    switch (event.type) {
      case 'deadline':
        return <Calendar size={12} />;
      case 'meeting':
        return <Users size={12} />;
      case 'milestone':
        return <MapPin size={12} />;
      default:
        return <Calendar size={12} />;
    }
  };

  return (
    <EventCard
      variant={variant}
      eventType={event.type}
      color={event.color}
      onClick={onClick}
      onMouseEnter={() => variant === 'compact' && setShowExpansion(true)}
      onMouseLeave={() => setShowExpansion(false)}
    >
      <EventTitle variant={variant}>
        {event.title}
      </EventTitle>
      
      {variant === 'detailed' && (
        <EventMeta>
          <MetaRow>
            <Clock size={12} />
            {formatTimeRange()}
          </MetaRow>
          
          <MetaRow>
            <EventType eventType={event.type}>
              {getEventTypeIcon()}
              {event.type}
            </EventType>
            
            {event.project && (
              <ProjectTag>
                {event.project.name}
              </ProjectTag>
            )}
          </MetaRow>
          
          {event.description && (
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6B6B6B',
              marginTop: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {event.description}
            </div>
          )}
        </EventMeta>
      )}
      
      {variant === 'compact' && (
        <TimeRange>
          {formatTime(new Date(event.start))}
        </TimeRange>
      )}
      
      {variant === 'compact' && (
        <HoverExpansion show={showExpansion}>
          <ExpandedTitle>{event.title}</ExpandedTitle>
          
          {event.description && (
            <ExpandedDescription>
              {event.description}
            </ExpandedDescription>
          )}
          
          <ExpandedMeta>
            <MetaRow>
              <Clock size={14} />
              {formatTimeRange()}
            </MetaRow>
            
            <MetaRow>
              <EventType eventType={event.type}>
                {getEventTypeIcon()}
                {event.type}
              </EventType>
            </MetaRow>
            
            {event.project && (
              <MetaRow>
                <ProjectTag>
                  {event.project.name}
                </ProjectTag>
              </MetaRow>
            )}
            
            {event.attendees.length > 0 && (
              <MetaRow>
                <Users size={14} />
                {event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}
              </MetaRow>
            )}
          </ExpandedMeta>
        </HoverExpansion>
      )}
    </EventCard>
  );
};