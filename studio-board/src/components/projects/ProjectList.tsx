import React, { useState, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import type { Project, ProjectStatus, Priority } from '../../types';
import { ProjectCard } from './ProjectCard';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProjectListProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  className?: string;
}

interface FilterState {
  search: string;
  status: ProjectStatus[];
  priority: Priority[];
  tags: string[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.heading};
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 2px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ active, theme }) => active && css`
    background-color: ${theme.colors.background.elevated};
    color: ${theme.colors.text.primary};
    box-shadow: ${theme.shadows.sm};
  `}
  
  ${({ active, theme }) => !active && css`
    color: ${theme.colors.text.secondary};
    
    &:hover {
      color: ${theme.colors.text.primary};
    }
  `}
`;

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterBadge = styled(Badge)<{ active: boolean }>`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ active, theme }) => active && css`
    background-color: ${theme.colors.accent.primary};
    color: white;
    border-color: ${theme.colors.accent.primary};
  `}
  
  ${({ active, theme }) => !active && css`
    background-color: ${theme.colors.background.secondary};
    color: ${theme.colors.text.secondary};
    border-color: transparent;
    
    &:hover {
      background-color: ${theme.colors.background.primary};
      color: ${theme.colors.text.primary};
    }
  `}
`;

const SortSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const SortButton = styled(Button)<{ active: boolean }>`
  ${({ active, theme }) => active && css`
    background-color: ${theme.colors.accent.primary};
    color: white;
  `}
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const ResultsCount = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ClearFilters = styled(Button)`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const ProjectGrid = styled.div<{ variant: 'grid' | 'list' }>`
  ${({ variant }) => variant === 'grid' && css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns: 1fr;
    }
  `}
  
  ${({ variant }) => variant === 'list' && css`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  margin: 0;
`;

// Utility functions
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const sortOptions: { value: string; label: string }[] = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' },
  { value: 'due-asc', label: 'Due Date (Soon)' },
  { value: 'due-desc', label: 'Due Date (Later)' },
  { value: 'progress-desc', label: 'Progress (High)' },
  { value: 'progress-asc', label: 'Progress (Low)' },
  { value: 'status', label: 'Status' },
];

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectSelect,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    priority: [],
    tags: [],
  });
  const [sortBy, setSortBy] = useState<string>('created-desc');

  const debouncedSearch = useDebounce(filters.search, 300);

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = 
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          project.client?.name.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(project.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(project.priority)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => project.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'created-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'created-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'due-asc':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'due-desc':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'progress-desc':
          return b.progress - a.progress;
        case 'progress-asc':
          return a.progress - b.progress;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, debouncedSearch, filters, sortBy]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleStatusFilter = useCallback((status: ProjectStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  }, []);

  const togglePriorityFilter = useCallback((priority: Priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority]
    }));
  }, []);

  const toggleTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      status: [],
      priority: [],
      tags: [],
    });
  }, []);

  const hasActiveFilters = debouncedSearch || 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.tags.length > 0;

  return (
    <Container className={className}>
      <Header>
        <Title>Projects</Title>
        <HeaderActions>
          <ViewToggle>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              List
            </ViewButton>
          </ViewToggle>
        </HeaderActions>
      </Header>

      <FiltersSection>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <Input
              type="search"
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>
        </FilterRow>

        <FilterRow>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterBadges>
              {statusOptions.map(option => (
                <FilterBadge
                  key={option.value}
                  active={filters.status.includes(option.value)}
                  onClick={() => toggleStatusFilter(option.value)}
                  size="sm"
                >
                  {option.label}
                </FilterBadge>
              ))}
            </FilterBadges>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Priority</FilterLabel>
            <FilterBadges>
              {priorityOptions.map(option => (
                <FilterBadge
                  key={option.value}
                  active={filters.priority.includes(option.value)}
                  onClick={() => togglePriorityFilter(option.value)}
                  size="sm"
                >
                  {option.label}
                </FilterBadge>
              ))}
            </FilterBadges>
          </FilterGroup>
        </FilterRow>

        {allTags.length > 0 && (
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Tags</FilterLabel>
              <FilterBadges>
                {allTags.slice(0, 10).map(tag => (
                  <FilterBadge
                    key={tag}
                    active={filters.tags.includes(tag)}
                    onClick={() => toggleTagFilter(tag)}
                    size="sm"
                  >
                    {tag}
                  </FilterBadge>
                ))}
                {allTags.length > 10 && (
                  <FilterBadge active={false} size="sm">
                    +{allTags.length - 10} more
                  </FilterBadge>
                )}
              </FilterBadges>
            </FilterGroup>
          </FilterRow>
        )}

        <SortSection>
          <FilterLabel>Sort by:</FilterLabel>
          {sortOptions.map(option => (
            <SortButton
              key={option.value}
              variant="ghost"
              size="sm"
              active={sortBy === option.value}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </SortButton>
          ))}
        </SortSection>
      </FiltersSection>

      <ResultsHeader>
        <ResultsCount>
          {filteredAndSortedProjects.length} of {projects.length} projects
        </ResultsCount>
        {hasActiveFilters && (
          <ClearFilters
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
          >
            Clear Filters
          </ClearFilters>
        )}
      </ResultsHeader>

      {filteredAndSortedProjects.length === 0 ? (
        <EmptyState>
          {hasActiveFilters ? (
            <>
              <EmptyTitle>No projects match your filters</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search criteria or clearing some filters.
              </EmptyDescription>
            </>
          ) : (
            <>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>
                Create your first project to get started.
              </EmptyDescription>
            </>
          )}
        </EmptyState>
      ) : (
        <ProjectGrid variant={viewMode}>
          {filteredAndSortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              variant={viewMode}
              onSelect={onProjectSelect}
            />
          ))}
        </ProjectGrid>
      )}
    </Container>
  );
};