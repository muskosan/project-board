import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock, MapPin, Users, Trash2, Save } from 'lucide-react';
import type { CalendarEvent, Project, CalendarEventType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface EventModalProps {
  event?: CalendarEvent | null;
  projects: Project[];
  onSave: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Modal = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.primary}20;
  }
`;

const DateTimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ color: string; selected: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.text.primary : 'transparent'
  };
  background-color: ${({ color }) => color};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const eventColors = [
  '#D2691E', '#5F9EA0', '#CD853F', '#4682B4', '#9370DB', '#20B2AA',
  '#FF6347', '#32CD32', '#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD'
];

export const EventModal: React.FC<EventModalProps> = ({
  event,
  projects,
  onSave,
  onDelete,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: 'meeting' as CalendarEventType,
    projectId: '',
    color: eventColors[0],
    attendees: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      setFormData({
        title: event.title,
        description: event.description || '',
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16),
        type: event.type,
        projectId: event.projectId || '',
        color: event.color,
        attendees: event.attendees,
      });
    } else {
      // Set default start time to current time rounded to next hour
      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(now.getHours() + 1, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);
      
      setFormData(prev => ({
        ...prev,
        start: startTime.toISOString().slice(0, 16),
        end: endTime.toISOString().slice(0, 16),
      }));
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.start) {
      newErrors.start = 'Start time is required';
    }
    
    if (!formData.end) {
      newErrors.end = 'End time is required';
    }
    
    if (formData.start && formData.end) {
      const startDate = new Date(formData.start);
      const endDate = new Date(formData.end);
      
      if (endDate <= startDate) {
        newErrors.end = 'End time must be after start time';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      start: new Date(formData.start),
      end: new Date(formData.end),
      type: formData.type,
      projectId: formData.projectId || undefined,
      project: formData.projectId ? projects.find(p => p.id === formData.projectId) : undefined,
      color: formData.color,
      attendees: formData.attendees,
      createdBy: 'current-user', // In real app, get from auth context
    };
    
    onSave(eventData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal padding="lg">
        <Header>
          <Title>
            <Calendar size={24} />
            {event ? 'Edit Event' : 'New Event'}
          </Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              <Calendar size={16} />
              Event Title
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter event title"
              error={errors.title}
            />
          </FormGroup>

          <FormGroup>
            <Label>Event Description</Label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter event description (optional)"
            />
          </FormGroup>

          <DateTimeRow>
            <FormGroup>
              <Label>
                <Clock size={16} />
                Start Time
              </Label>
              <Input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => handleInputChange('start', e.target.value)}
                error={errors.start}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Clock size={16} />
                End Time
              </Label>
              <Input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => handleInputChange('end', e.target.value)}
                error={errors.end}
              />
            </FormGroup>
          </DateTimeRow>

          <FormGroup>
            <Label>
              <MapPin size={16} />
              Event Type
            </Label>
            <Select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as CalendarEventType)}
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="milestone">Milestone</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <Users size={16} />
              Project (Optional)
            </Label>
            <Select
              value={formData.projectId}
              onChange={(e) => handleInputChange('projectId', e.target.value)}
            >
              <option value="">No project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Event Color</Label>
            <ColorPicker>
              {eventColors.map(color => (
                <ColorOption
                  key={color}
                  type="button"
                  color={color}
                  selected={formData.color === color}
                  onClick={() => handleInputChange('color', color)}
                />
              ))}
            </ColorPicker>
          </FormGroup>

          <Actions>
            <div>
              {onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onDelete}
                  style={{ color: '#EF4444' }}
                >
                  <Trash2 size={16} />
                  Delete Event
                </Button>
              )}
            </div>

            <ActionGroup>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <Save size={16} />
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </ActionGroup>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};