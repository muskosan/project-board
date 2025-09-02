import React from 'react';
import styled from 'styled-components';
import { Filter, X, Calendar, Users, MapPin } from 'lucide-react';
import type { Project } from '../../types';
import { Button } from '../ui/Button';

interface CalendarFiltersProps {
  projects: Project[];
  filters: {
    projects: string[];
    types: string[];
  };
  onFiltersChange: (filters: { projects: string[]; types: string[] }) => void;
}

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterChip = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.accent.primary : theme.colors.text.muted
  };
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.accent.primary + '20' : theme.colors.background.elevated
  };
  color: ${({ selected, theme }) => 
    selected ? theme.colors.accent.primary : theme.colors.text.secondary
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    background-color: ${({ theme }) => theme.colors.accent.primary + '10'};
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.background.secondary};
`;

const ActiveFiltersCount = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const eventTypes = [
  { id: 'meeting', label: 'Meetings', icon: Users },
  { id: 'deadline', label: 'Deadlines', icon: Calendar },
  { id: 'milestone', label: 'Milestones', icon: MapPin },
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  projects,
  filters,
  onFiltersChange,
}) => {
  const handleProjectToggle = (projectId: string) => {
    const newProjects = filters.projects.includes(projectId)
      ? filters.projects.filter(id => id !== projectId)
      : [...filters.projects, projectId];
    
    onFiltersChange({
      ...filters,
      projects: newProjects,
    });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    onFiltersChange({
      ...filters,
      types: newTypes,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      projects: [],
      types: [],
    });
  };

  const totalActiveFilters = filters.projects.length + filters.types.length;

  return (
    <FiltersContainer>
      <FilterSection>
        <FilterLabel>
          <Users size={16} />
          Filter by Project
        </FilterLabel>
        <FilterOptions>
          {projects.map(project => (
            <FilterChip
              key={project.id}
              selected={filters.projects.includes(project.id)}
              onClick={() => handleProjectToggle(project.id)}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: project.color,
                }}
              />
              {project.name}
            </FilterChip>
          ))}
        </FilterOptions>
      </FilterSection>

      <FilterSection>
        <FilterLabel>
          <Filter size={16} />
          Filter by Type
        </FilterLabel>
        <FilterOptions>
          {eventTypes.map(type => {
            const IconComponent = type.icon;
            return (
              <FilterChip
                key={type.id}
                selected={filters.types.includes(type.id)}
                onClick={() => handleTypeToggle(type.id)}
              >
                <IconComponent size={14} />
                {type.label}
              </FilterChip>
            );
          })}
        </FilterOptions>
      </FilterSection>

      <FilterActions>
        <ActiveFiltersCount>
          {totalActiveFilters > 0 
            ? `${totalActiveFilters} filter${totalActiveFilters !== 1 ? 's' : ''} active`
            : 'No filters active'
          }
        </ActiveFiltersCount>
        
        {totalActiveFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X size={14} />
            Clear All
          </Button>
        )}
      </FilterActions>
    </FiltersContainer>
  );
};