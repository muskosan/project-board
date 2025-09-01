import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Project } from '../types';
import { ProjectList, ProjectDetail } from '../components/projects';
import { generateCompleteDataset } from '../utils/mockData';

const ProjectsContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`;

const ListContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with mock data
    const loadProjects = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dataset = generateCompleteDataset();
        setProjects(dataset.projects);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <LoadingContainer>
        Loading projects...
      </LoadingContainer>
    );
  }

  if (selectedProject) {
    return (
      <ProjectsContainer>
        <ProjectDetail
          project={selectedProject}
          onBack={handleBackToList}
        />
      </ProjectsContainer>
    );
  }

  return (
    <ProjectsContainer>
      <ListContainer>
        <ProjectList
          projects={projects}
          onProjectSelect={handleProjectSelect}
        />
      </ListContainer>
    </ProjectsContainer>
  );
};
