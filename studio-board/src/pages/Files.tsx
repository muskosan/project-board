import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { FileItem } from '../types';
import { 
  FileGrid, 
  FolderNavigation, 
  FileVersions 
} from '../components/files';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  FolderPlus 
} from 'lucide-react';
import { generateMockFileItem, generateMockUser } from '../utils/mockData';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl} 0;
  
  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled(Input)`
  padding-left: ${({ theme }) => theme.spacing.xl};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.text.muted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.accent.primary : 'transparent'};
  color: ${({ theme, active }) => 
    active ? 'white' : theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.accent.primary : theme.colors.background.secondary};
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
`;

const SidePanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.elevated};
  border-left: 1px solid ${({ theme }) => theme.colors.text.muted}33;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  transition: right ${({ theme }) => theme.transitions.normal};
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
`;

type ViewMode = 'grid' | 'list';

// Mock file versions for demonstration
const generateMockVersions = (file: FileItem, count: number = 3) => {
  const versions = [];
  const mockUser = generateMockUser();
  
  for (let i = count; i >= 1; i--) {
    versions.push({
      ...file,
      version: i,
      uploadedBy: mockUser.id,
      uploader: mockUser,
      uploadedAt: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000),
      changeDescription: i === count ? 'Initial version' : `Updated version ${i}`,
      isCurrentVersion: i === count,
    });
  }
  
  return versions;
};

export const Files: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const initializeFiles = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock files and folders
      const mockFiles = Array.from({ length: 15 }, () => generateMockFileItem());
      
      // Ensure we have some folders
      mockFiles[0] = { ...mockFiles[0], type: 'folder', name: 'Project Assets' };
      mockFiles[1] = { ...mockFiles[1], type: 'folder', name: 'Design Files' };
      mockFiles[2] = { ...mockFiles[2], type: 'folder', name: 'Documentation' };
      
      setFiles(mockFiles);
      setLoading(false);
    };

    initializeFiles();
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = (fileList: FileList) => {
    const newFiles: FileItem[] = [];
    const progress: Record<string, number> = {};

    Array.from(fileList).forEach((file, index) => {
      const fileItem: FileItem = {
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: 'file',
        size: file.size,
        mimeType: file.type,
        lastModified: new Date(),
        version: 1,
        parentId: currentPath.length > 0 ? currentPath[currentPath.length - 1].id : undefined,
      };

      newFiles.push(fileItem);
      progress[file.name] = 0;

      // Simulate upload progress
      const interval = setInterval(() => {
        progress[file.name] += Math.random() * 30;
        if (progress[file.name] >= 100) {
          progress[file.name] = 100;
          clearInterval(interval);
        }
        setUploadProgress({ ...progress });
      }, 200);
    });

    setFiles(prev => [...prev, ...newFiles]);
    setUploadProgress(progress);

    // Clear progress after completion
    setTimeout(() => {
      setUploadProgress({});
    }, 3000);
  };

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  const handleFileDelete = (file: FileItem) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setFiles(prev => prev.filter(f => f.id !== file.id));
    }
  };

  const handleFileRename = (file: FileItem, newName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, name: newName } : f
    ));
  };

  const handleFileDownload = (file: FileItem) => {
    // In a real app, this would trigger a download
    console.log('Downloading file:', file.name);
    alert(`Downloading ${file.name}...`);
  };

  const handleFileShare = (file: FileItem) => {
    // In a real app, this would open a share dialog
    console.log('Sharing file:', file.name);
    alert(`Share link copied for ${file.name}!`);
  };

  const handleFolderOpen = (folder: FileItem) => {
    setCurrentPath(prev => [...prev, folder]);
    // In a real app, you would fetch the folder contents here
  };

  const handleNavigate = (folder: FileItem | null) => {
    if (folder === null) {
      setCurrentPath([]);
    } else {
      const folderIndex = currentPath.findIndex(f => f.id === folder.id);
      if (folderIndex !== -1) {
        setCurrentPath(prev => prev.slice(0, folderIndex + 1));
      }
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: 'folder',
        lastModified: new Date(),
        parentId: currentPath.length > 0 ? currentPath[currentPath.length - 1].id : undefined,
      };
      setFiles(prev => [...prev, newFolder]);
    }
  };

  // const handleShowVersions = (file: FileItem) => {
  //   setSelectedFile(file);
  //   setShowVersions(true);
  // };

  return (
    <Container>
      <Header>
        <h1>Files</h1>
        <HeaderActions>
          <Button variant="outline" onClick={handleCreateFolder}>
            <FolderPlus size={16} />
            New Folder
          </Button>
          <Button variant="primary">
            <Plus size={16} />
            Upload Files
          </Button>
        </HeaderActions>
      </Header>

      <Toolbar>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <Button variant="ghost" size="sm">
          <Filter size={16} />
          Filter
        </Button>

        <ViewToggle>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </ViewButton>
        </ViewToggle>
      </Toolbar>

      <Content>
        <FolderNavigation
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />

        <FileGrid
          items={filteredFiles}
          onUpload={handleUpload}
          onSelect={handleFileSelect}
          onDelete={handleFileDelete}
          onRename={handleFileRename}
          onDownload={handleFileDownload}
          onShare={handleFileShare}
          onFolderOpen={handleFolderOpen}
          loading={loading}
          uploadProgress={uploadProgress}
        />
      </Content>

      <SidePanel isOpen={showVersions && selectedFile !== null}>
        {selectedFile && (
          <FileVersions
            file={selectedFile}
            versions={generateMockVersions(selectedFile)}
            onDownloadVersion={handleFileDownload}
            onPreviewVersion={handleFileSelect}
            onRestoreVersion={(version) => {
              console.log('Restoring version:', version.version);
              alert(`Restored to version ${version.version}`);
              setShowVersions(false);
            }}
          />
        )}
      </SidePanel>
    </Container>
  );
};