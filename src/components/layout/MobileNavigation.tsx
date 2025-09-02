import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  FolderOpen,
  CheckSquare,
  MessageSquare,
  Calendar,
  Files,
  Settings,
  X,
} from 'lucide-react';
import { tokens } from '../../styles/tokens';
import { useSwipeGesture } from '../../utils/responsive';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const NavigationPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 80vw;
  background-color: ${tokens.colors.background.elevated};
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: ${tokens.shadows.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${tokens.spacing.lg};
  border-bottom: 1px solid ${tokens.colors.background.secondary};
`;

const Logo = styled.h2`
  font-family: ${tokens.typography.fonts.heading};
  font-size: ${tokens.typography.sizes.lg};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${tokens.touch.minTarget};
  height: ${tokens.touch.minTarget};
  border: none;
  background: none;
  color: ${tokens.colors.text.secondary};
  border-radius: ${tokens.borderRadius.md};
  cursor: pointer;
  transition: all ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${tokens.spacing.lg} 0;
  overflow-y: auto;
  
  /* Touch scrolling optimization */
  -webkit-overflow-scrolling: touch;
`;

const NavSection = styled.div`
  margin-bottom: ${tokens.spacing.xl};
`;

const SectionTitle = styled.div`
  padding: ${tokens.spacing.sm} ${tokens.spacing.lg};
  font-size: ${tokens.typography.sizes.xs};
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${tokens.spacing.sm};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${tokens.spacing.md} ${tokens.spacing.lg};
  color: ${tokens.colors.text.secondary};
  text-decoration: none;
  transition: all ${tokens.transitions.fast};
  position: relative;
  margin: 0 ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.md};
  min-height: ${tokens.touch.minTarget};
  
  /* Touch-friendly spacing */
  margin-bottom: ${tokens.touch.spacing};
  
  &:hover {
    background-color: ${tokens.colors.background.secondary};
    color: ${tokens.colors.text.primary};
  }
  
  &:active {
    transform: scale(0.98);
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
    margin-right: ${tokens.spacing.md};
    flex-shrink: 0;
  }

  span {
    font-size: ${tokens.typography.sizes.base};
    font-weight: ${tokens.typography.weights.medium};
  }
`;

const navigationSections = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/', icon: Home },
      { id: 'projects', label: 'Projects', path: '/projects', icon: FolderOpen },
      { id: 'tasks', label: 'Tasks', path: '/tasks', icon: CheckSquare },
    ]
  },
  {
    title: 'Collaboration',
    items: [
      { id: 'chat', label: 'Chat', path: '/chat', icon: MessageSquare },
      { id: 'calendar', label: 'Calendar', path: '/calendar', icon: Calendar },
      { id: 'files', label: 'Files', path: '/files', icon: Files },
    ]
  },
  {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' }
};

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  const swipeGestures = useSwipeGesture(onClose, undefined, 50);

  const handleNavItemClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <NavigationPanel
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            {...swipeGestures}
          >
            <Header>
              <Logo>StudioBoard</Logo>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </Header>
            
            <Navigation>
              {navigationSections.map((section) => (
                <NavSection key={section.title}>
                  <SectionTitle>{section.title}</SectionTitle>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavItem 
                        key={item.id} 
                        to={item.path}
                        onClick={handleNavItemClick}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </NavItem>
                    );
                  })}
                </NavSection>
              ))}
            </Navigation>
          </NavigationPanel>
        </>
      )}
    </AnimatePresence>
  );
};