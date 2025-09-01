import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  Calendar,
  Files,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { tokens } from '../../styles/tokens';


const SidebarContainer = styled.aside<{ $isExpanded: boolean; $isMobile: boolean }>`
  width: ${({ $isExpanded, $isMobile }) => {
    if ($isMobile) return $isExpanded ? '100%' : '0';
    return $isExpanded ? '240px' : '64px';
  }};
  background-color: ${tokens.colors.background.elevated};
  border-right: 1px solid ${tokens.colors.background.secondary};
  transition: all ${tokens.transitions.normal};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: ${({ $isMobile, $isExpanded }) => 
    $isMobile && $isExpanded ? tokens.shadows.lg : 'none'};

  @media (max-width: ${tokens.breakpoints.tablet}) {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    z-index: 50;
    transform: ${({ $isExpanded }) => 
      $isExpanded ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: all ${tokens.transitions.fast};

  @media (min-width: ${tokens.breakpoints.tablet}) {
    display: none;
  }
`;

const ToggleButton = styled.button<{ $isMobile: boolean }>`
  position: ${({ $isMobile }) => ($isMobile ? 'fixed' : 'absolute')};
  top: ${({ $isMobile }) => ($isMobile ? '20px' : tokens.spacing.lg)};
  ${({ $isMobile }) => ($isMobile ? 'left: 20px;' : 'right: -12px;')}
  width: 24px;
  height: 24px;
  background-color: ${tokens.colors.background.elevated};
  border: 1px solid ${tokens.colors.background.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${tokens.colors.text.secondary};
  transition: all ${tokens.transitions.fast};
  z-index: 101;
  cursor: pointer;

  &:hover {
    background-color: ${tokens.colors.background.secondary};
    transform: scale(1.1);
  }

  @media (max-width: ${tokens.breakpoints.tablet}) {
    display: ${({ $isMobile }) => ($isMobile ? 'flex' : 'none')};
  }

  @media (min-width: ${tokens.breakpoints.tablet}) {
    display: ${({ $isMobile }) => ($isMobile ? 'none' : 'flex')};
  }
`;

const Navigation = styled.nav<{ $isExpanded: boolean }>`
  padding: ${tokens.spacing.xl} 0 ${tokens.spacing.lg} 0;
  flex: 1;
  overflow-y: auto;
  
  /* Custom scrollbar for navigation */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${tokens.colors.text.muted};
    border-radius: 2px;
  }
`;

const NavItem = styled(NavLink)<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  color: ${tokens.colors.text.secondary};
  transition: all ${tokens.transitions.fast};
  position: relative;
  text-decoration: none;
  border-radius: 0;
  margin: 0 ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.md};

  &:hover {
    background-color: ${tokens.colors.background.secondary};
    color: ${tokens.colors.text.primary};
    transform: translateX(2px);
  }

  &.active {
    background-color: ${tokens.colors.accent.primary}15;
    color: ${tokens.colors.accent.primary};
    font-weight: ${tokens.typography.weights.medium};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background-color: ${tokens.colors.accent.primary};
      border-radius: 0 2px 2px 0;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: ${({ $isExpanded }) =>
      $isExpanded ? tokens.spacing.md : '0'};
    flex-shrink: 0;
    transition: transform ${tokens.transitions.fast};
  }

  span {
    opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
    transform: ${({ $isExpanded }) => 
      $isExpanded ? 'translateX(0)' : 'translateX(-10px)'};
    transition: all ${tokens.transitions.normal};
    white-space: nowrap;
    font-size: ${tokens.typography.sizes.sm};
    font-weight: ${tokens.typography.weights.medium};
  }

  ${({ $isExpanded }) => !$isExpanded && `
    justify-content: center;
    
    &:hover {
      &::after {
        content: attr(data-label);
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        background-color: ${tokens.colors.text.primary};
        color: ${tokens.colors.background.elevated};
        padding: ${tokens.spacing.sm} ${tokens.spacing.md};
        border-radius: ${tokens.borderRadius.md};
        font-size: ${tokens.typography.sizes.xs};
        white-space: nowrap;
        z-index: 1000;
        margin-left: ${tokens.spacing.sm};
        box-shadow: ${tokens.shadows.md};
      }
    }
  `}
`;

const NavSection = styled.div`
  margin-bottom: ${tokens.spacing.lg};
`;

const SectionTitle = styled.div<{ $isExpanded: boolean }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  font-size: ${tokens.typography.sizes.xs};
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: opacity ${tokens.transitions.normal};
  margin-bottom: ${tokens.spacing.sm};
`;

const navigationSections = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/' },
      { id: 'projects', label: 'Projects', path: '/projects' },
      { id: 'tasks', label: 'Tasks', path: '/tasks' },
    ]
  },
  {
    title: 'Collaboration',
    items: [
      { id: 'chat', label: 'Chat', path: '/chat' },
      { id: 'calendar', label: 'Calendar', path: '/calendar' },
      { id: 'files', label: 'Files', path: '/files' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Settings', path: '/settings' },
    ]
  }
];

const iconMap = {
  dashboard: Home,
  projects: FolderOpen,
  tasks: CheckSquare,
  chat: MessageSquare,
  calendar: Calendar,
  files: Files,
  settings: Settings,
};

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change in mobile
  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Overlay $isVisible={isMobile && isExpanded} onClick={toggleSidebar} />
      
      <ToggleButton onClick={toggleSidebar} $isMobile={false}>
        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </ToggleButton>

      <ToggleButton onClick={toggleSidebar} $isMobile={true}>
        {isExpanded ? <X size={16} /> : <Menu size={16} />}
      </ToggleButton>

      <SidebarContainer $isExpanded={isExpanded} $isMobile={isMobile}>
        <Navigation $isExpanded={isExpanded}>
          {navigationSections.map((section) => (
            <NavSection key={section.title}>
              <SectionTitle $isExpanded={isExpanded}>
                {section.title}
              </SectionTitle>
              {section.items.map((item) => {
                const Icon = iconMap[item.id as keyof typeof iconMap];
                return (
                  <NavItem 
                    key={item.id} 
                    to={item.path} 
                    $isExpanded={isExpanded}
                    data-label={item.label}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </NavItem>
                );
              })}
            </NavSection>
          ))}
        </Navigation>
      </SidebarContainer>
    </>
  );
};
