import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chat, Notes } from '../components/chat';
import type { ChatMessage, ChatThread, Note } from '../types';
import { generateCompleteDataset } from '../utils/mockData';

const DemoContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const DemoHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DemoTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DemoDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
`;

const DemoTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: none;
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.accent.primary : 'transparent'};
  color: ${({ isActive, theme }) => 
    isActive ? 'white' : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not([data-active="true"]) {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DemoContent = styled.div`
  height: 700px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

type ActiveTab = 'chat' | 'notes';

export const ChatDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [mockData, setMockData] = useState<ReturnType<typeof generateCompleteDataset> | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();

  // Mock WebSocket simulation for real-time updates
  const [, setIsConnected] = useState(false);

  useEffect(() => {
    // Generate mock data
    const data = generateCompleteDataset();
    setMockData(data);
    
    // Select first thread by default
    if (data.chatThreads.length > 0) {
      setSelectedThreadId(data.chatThreads[0].id);
    }

    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (content: string, threadId?: string, mentions?: string[]) => {
    if (!mockData || !threadId) return;

    const currentUser = mockData.users[0]; // Use first user as current user
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      authorId: currentUser.id,
      author: currentUser,
      threadId,
      mentions: mentions || [],
      attachments: [],
      reactions: [],
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update mock data with new message
    setMockData(prev => {
      if (!prev) return prev;
      
      const updatedMessages = [...prev.chatMessages, newMessage];
      const updatedThreads = prev.chatThreads.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: newMessage,
            lastMessageId: newMessage.id,
            messageCount: thread.messageCount + 1,
            updatedAt: new Date(),
          };
        }
        return thread;
      });

      return {
        ...prev,
        chatMessages: updatedMessages,
        chatThreads: updatedThreads,
      };
    });
  };

  const handleCreateThread = (title?: string) => {
    if (!mockData) return;

    const currentUser = mockData.users[0];
    const newThread: ChatThread = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || 'New Discussion',
      participants: [currentUser.id],
      messageCount: 0,
      isArchived: false,
      createdBy: currentUser.id,
      creator: currentUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMockData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        chatThreads: [newThread, ...prev.chatThreads],
      };
    });

    setSelectedThreadId(newThread.id);
  };

  const handleCreateNote = (title: string, content: string, tags: string[]) => {
    if (!mockData) return;

    const currentUser = mockData.users[0];
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      authorId: currentUser.id,
      author: currentUser,
      tags,
      isPinned: false,
      isPublic: true,
      attachments: [],
      mentions: [],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMockData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: [newNote, ...prev.notes],
      };
    });
  };

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    setMockData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.map(note => 
          note.id === noteId 
            ? { ...note, ...updates, updatedAt: new Date() }
            : note
        ),
      };
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setMockData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.filter(note => note.id !== noteId),
      };
    });
  };

  const handlePinNote = (noteId: string, isPinned: boolean) => {
    handleUpdateNote(noteId, { isPinned });
  };

  if (!mockData) {
    return (
      <DemoContainer>
        <DemoHeader>
          <DemoTitle>Loading Chat & Notes Demo...</DemoTitle>
        </DemoHeader>
      </DemoContainer>
    );
  }

  const currentUser = mockData.users[0]; // Use first user as current user

  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>Chat & Notes System</DemoTitle>
        <DemoDescription>
          Real-time chat with message threading, document link previews, mention system, 
          and comprehensive notes management for project documentation.
        </DemoDescription>
      </DemoHeader>

      <DemoTabs>
        <TabButton
          isActive={activeTab === 'chat'}
          data-active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat & Messaging
        </TabButton>
        <TabButton
          isActive={activeTab === 'notes'}
          data-active={activeTab === 'notes'}
          onClick={() => setActiveTab('notes')}
        >
          📝 Notes & Documentation
        </TabButton>
      </DemoTabs>

      <DemoContent>
        {activeTab === 'chat' ? (
          <Chat
            currentUser={currentUser}
            threads={mockData.chatThreads}
            messages={mockData.chatMessages}
            onSendMessage={handleSendMessage}
            onCreateThread={handleCreateThread}
            onSelectThread={setSelectedThreadId}
            selectedThreadId={selectedThreadId}
          />
        ) : (
          <Notes
            notes={mockData.notes}
            currentUser={currentUser}
            onCreateNote={handleCreateNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onPinNote={handlePinNote}
          />
        )}
      </DemoContent>
    </DemoContainer>
  );
};