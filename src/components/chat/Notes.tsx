import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { Note, User } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface NotesProps {
  notes: Note[];
  currentUser: User;
  projectId?: string;
  onCreateNote: (title: string, content: string, tags: string[]) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
  onPinNote: (noteId: string, isPinned: boolean) => void;
  className?: string;
}

const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const NotesHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.primary};
  background-color: ${({ theme }) => theme.colors.background.elevated};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SearchInput = styled(Input)`
  max-width: 300px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterTab = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  ${({ isActive, theme }) => isActive && css`
    background-color: ${theme.colors.accent.primary};
    color: white;
  `}
  
  &:hover:not([data-active="true"]) {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const NotesContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NoteCard = styled.div<{ isPinned: boolean }>`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  ${({ isPinned, theme }) => isPinned && css`
    border-color: ${theme.colors.accent.primary};
    box-shadow: ${theme.shadows.sm};
  `}
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.3;
`;

const NoteActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  
  ${NoteCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.muted};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const PinIcon = styled.div<{ isPinned: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  font-size: 16px;
  color: ${({ isPinned, theme }) => isPinned ? theme.colors.accent.primary : 'transparent'};
`;

const NoteContent = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteTag = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.accent.primary}20;
  color: ${({ theme }) => theme.colors.accent.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const NoteAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AuthorAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: white;
`;

const NoteDate = styled.div``;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  grid-column: 1 / -1;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.muted};
  max-width: 400px;
`;

// Create Note Modal
const CreateNoteModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isVisible }) => isVisible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.muted};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

type FilterType = 'all' | 'pinned' | 'recent' | 'mine';

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

const getInitials = (user: User): string => {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
};

export const Notes: React.FC<NotesProps> = ({
  notes,
  currentUser,
  projectId: _projectId,
  onCreateNote,
  onUpdateNote: _onUpdateNote,
  onDeleteNote,
  onPinNote,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');

  // Filter and search notes
  const filteredNotes = notes.filter(note => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Type filter
    switch (activeFilter) {
      case 'pinned':
        return note.isPinned;
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(note.updatedAt) > weekAgo;
      case 'mine':
        return note.authorId === currentUser.id;
      default:
        return true;
    }
  });

  // Sort notes: pinned first, then by update date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    
    const tags = newNoteTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    onCreateNote(newNoteTitle.trim(), newNoteContent.trim(), tags);
    
    // Reset form
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setShowCreateModal(false);
  };

  const handleCancelCreate = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTags('');
    setShowCreateModal(false);
  };

  return (
    <>
      <NotesContainer className={className}>
        <NotesHeader>
          <HeaderTop>
            <HeaderTitle>Notes</HeaderTitle>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              + New Note
            </Button>
          </HeaderTop>
          
          <SearchInput
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <FilterTabs>
            <FilterTab
              isActive={activeFilter === 'all'}
              data-active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All
            </FilterTab>
            <FilterTab
              isActive={activeFilter === 'pinned'}
              data-active={activeFilter === 'pinned'}
              onClick={() => setActiveFilter('pinned')}
            >
              Pinned
            </FilterTab>
            <FilterTab
              isActive={activeFilter === 'recent'}
              data-active={activeFilter === 'recent'}
              onClick={() => setActiveFilter('recent')}
            >
              Recent
            </FilterTab>
            <FilterTab
              isActive={activeFilter === 'mine'}
              data-active={activeFilter === 'mine'}
              onClick={() => setActiveFilter('mine')}
            >
              Mine
            </FilterTab>
          </FilterTabs>
        </NotesHeader>

        <NotesContent>
          <NotesGrid>
            {sortedNotes.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>📝</EmptyStateIcon>
                <EmptyStateTitle>
                  {searchQuery || activeFilter !== 'all' 
                    ? 'No notes found' 
                    : 'No notes yet'
                  }
                </EmptyStateTitle>
                <EmptyStateText>
                  {searchQuery || activeFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first note to start documenting your project.'
                  }
                </EmptyStateText>
                {!searchQuery && activeFilter === 'all' && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create Note
                  </Button>
                )}
              </EmptyState>
            ) : (
              sortedNotes.map(note => (
                <NoteCard key={note.id} isPinned={note.isPinned}>
                  <PinIcon isPinned={note.isPinned}>📌</PinIcon>
                  
                  <NoteHeader>
                    <NoteTitle>{note.title}</NoteTitle>
                    <NoteActions>
                      <ActionButton
                        onClick={() => onPinNote(note.id, !note.isPinned)}
                        title={note.isPinned ? 'Unpin note' : 'Pin note'}
                      >
                        📌
                      </ActionButton>
                      <ActionButton
                        onClick={() => onDeleteNote(note.id)}
                        title="Delete note"
                      >
                        🗑️
                      </ActionButton>
                    </NoteActions>
                  </NoteHeader>

                  <NoteContent>{note.content}</NoteContent>

                  {note.tags.length > 0 && (
                    <NoteTags>
                      {note.tags.map(tag => (
                        <NoteTag key={tag}>{tag}</NoteTag>
                      ))}
                    </NoteTags>
                  )}

                  <NoteMeta>
                    <NoteAuthor>
                      <AuthorAvatar>
                        {note.author?.avatar ? (
                          <img 
                            src={note.author.avatar} 
                            alt="" 
                            style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                          />
                        ) : (
                          getInitials(note.author || currentUser)
                        )}
                      </AuthorAvatar>
                      {note.author?.firstName} {note.author?.lastName}
                    </NoteAuthor>
                    <NoteDate>{formatDate(new Date(note.updatedAt))}</NoteDate>
                  </NoteMeta>
                </NoteCard>
              ))
            )}
          </NotesGrid>
        </NotesContent>
      </NotesContainer>

      <CreateNoteModal isVisible={showCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New Note</ModalTitle>
            <CloseButton onClick={handleCancelCreate}>
              ✕
            </CloseButton>
          </ModalHeader>

          <FormField>
            <FormLabel>Title</FormLabel>
            <Input
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Enter note title..."
              autoFocus
            />
          </FormField>

          <FormField>
            <FormLabel>Content</FormLabel>
            <TextArea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note content here..."
            />
          </FormField>

          <FormField>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <Input
              value={newNoteTags}
              onChange={(e) => setNewNoteTags(e.target.value)}
              placeholder="design, meeting, ideas..."
            />
          </FormField>

          <ModalActions>
            <Button variant="ghost" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateNote}
              disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
            >
              Create Note
            </Button>
          </ModalActions>
        </ModalContent>
      </CreateNoteModal>
    </>
  );
};