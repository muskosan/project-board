import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { notificationVariants } from '../../utils/animations';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationProps extends NotificationData {
  onClose: (id: string) => void;
}

const NotificationContainer = styled(motion.div)<{ type: NotificationType }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 4px solid ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.status.success;
      case 'error': return theme.colors.status.error;
      case 'warning': return theme.colors.status.warning;
      case 'info': return theme.colors.accent.primary;
      default: return theme.colors.text.muted;
    }
  }};
  min-width: 320px;
  max-width: 480px;
  position: relative;
`;

const IconContainer = styled.div<{ type: NotificationType }>`
  color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.status.success;
      case 'error': return theme.colors.status.error;
      case 'warning': return theme.colors.status.warning;
      case 'info': return theme.colors.accent.primary;
      default: return theme.colors.text.muted;
    }
  }};
  flex-shrink: 0;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Message = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 2px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

const ProgressBar = styled(motion.div)<{ type: NotificationType }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.status.success;
      case 'error': return theme.colors.status.error;
      case 'warning': return theme.colors.status.warning;
      case 'info': return theme.colors.accent.primary;
      default: return theme.colors.text.muted;
    }
  }};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
`;

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'info': return Info;
    default: return Info;
  }
};

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  persistent = false,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);
  const Icon = getIcon(type);

  useEffect(() => {
    if (persistent) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setProgress((remaining / duration) * 100);

      if (remaining === 0) {
        onClose(id);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [id, duration, persistent, onClose]);

  return (
    <NotificationContainer
      type={type}
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <IconContainer type={type}>
        <Icon size={20} />
      </IconContainer>
      <Content>
        <Title>{title}</Title>
        {message && <Message>{message}</Message>}
      </Content>
      <CloseButton onClick={() => onClose(id)}>
        <X size={16} />
      </CloseButton>
      {!persistent && (
        <ProgressBar
          type={type}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: progress / 100 }}
          style={{ originX: 0 }}
        />
      )}
    </NotificationContainer>
  );
};

// Notification container component
const NotificationListContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;
  
  > * {
    pointer-events: auto;
  }
`;

interface NotificationListProps {
  notifications: NotificationData[];
  onClose: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <NotificationListContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </NotificationListContainer>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};