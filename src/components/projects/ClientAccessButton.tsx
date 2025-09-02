import React, { useState } from 'react';
import styled from 'styled-components';
import { ExternalLink, Copy, Check, Share2 } from 'lucide-react';
import type { Project } from '../../types';
import { Button } from '../ui/Button';
import { generateClientAccessUrl } from '../../utils/clientAccess';
import { tokens } from '../../styles/tokens';

interface ClientAccessButtonProps {
  project: Project;
  className?: string;
}

const Container = styled.div`
  position: relative;
`;

const ShareButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const Modal = styled.div<{ $isOpen: boolean }>`
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
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: all ${tokens.transitions.fast};
`;

const ModalContent = styled.div`
  background-color: ${tokens.colors.background.elevated};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.xl};
  max-width: 500px;
  width: 90%;
  box-shadow: ${tokens.shadows.lg};
  transition: transform ${tokens.transitions.fast};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.lg};
`;

const ModalIcon = styled.div`
  color: ${tokens.colors.accent.primary};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${tokens.typography.sizes.lg};
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.text.primary};
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
`;

const Description = styled.p`
  margin: 0;
  color: ${tokens.colors.text.secondary};
  line-height: 1.5;
`;

const UrlContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: center;
`;

const UrlInput = styled.input`
  flex: 1;
  padding: ${tokens.spacing.md};
  border: 1px solid ${tokens.colors.background.secondary};
  border-radius: ${tokens.borderRadius.md};
  background-color: ${tokens.colors.background.secondary};
  color: ${tokens.colors.text.primary};
  font-size: ${tokens.typography.sizes.sm};
  font-family: monospace;
  
  &:focus {
    outline: none;
    border-color: ${tokens.colors.accent.primary};
  }
`;

const CopyButton = styled(Button)<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
  background-color: ${({ $copied }) => 
    $copied ? tokens.colors.status.success : tokens.colors.accent.primary};
  
  &:hover {
    background-color: ${({ $copied }) => 
      $copied ? tokens.colors.status.success : tokens.colors.accent.primary};
    opacity: 0.9;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${tokens.spacing.sm};
  margin-top: ${tokens.spacing.lg};
`;

const AccessInfo = styled.div`
  background-color: ${tokens.colors.status.info}15;
  border: 1px solid ${tokens.colors.status.info}30;
  border-radius: ${tokens.borderRadius.md};
  padding: ${tokens.spacing.md};
  margin-top: ${tokens.spacing.md};
`;

const AccessInfoTitle = styled.div`
  font-weight: ${tokens.typography.weights.semibold};
  color: ${tokens.colors.status.info};
  margin-bottom: ${tokens.spacing.xs};
`;

const AccessInfoText = styled.div`
  font-size: ${tokens.typography.sizes.sm};
  color: ${tokens.colors.text.secondary};
  line-height: 1.4;
`;

export const ClientAccessButton: React.FC<ClientAccessButtonProps> = ({
  project,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientUrl, setClientUrl] = useState('');

  const handleOpenModal = () => {
    // Generate client access URL
    const url = generateClientAccessUrl(project.id, project.client?.id);
    setClientUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCopied(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(clientUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = clientUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(clientUrl, '_blank');
  };

  // Only show button if client access is enabled for this project
  if (!project.settings.allowClientAccess) {
    return null;
  }

  return (
    <Container className={className}>
      <ShareButton
        variant="outline"
        size="sm"
        onClick={handleOpenModal}
      >
        <Share2 size={14} />
        Share with Client
      </ShareButton>

      <Modal $isOpen={isModalOpen} onClick={handleCloseModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalIcon>
              <ExternalLink size={20} />
            </ModalIcon>
            <ModalTitle>Share Project with Client</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <Description>
              Share this secure link with your client to give them read-only access to project progress, 
              files, and communication history.
            </Description>

            <UrlContainer>
              <UrlInput
                value={clientUrl}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <CopyButton
                $copied={copied}
                onClick={handleCopyUrl}
                size="sm"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </CopyButton>
            </UrlContainer>

            <AccessInfo>
              <AccessInfoTitle>What clients can access:</AccessInfoTitle>
              <AccessInfoText>
                • Project progress and timeline<br/>
                • Team member information<br/>
                {project.settings.enableComments && '• Communication history and comments\n'}
                {project.settings.enableFileSharing && '• Download approved files and deliverables\n'}
                • Read-only view of project details
              </AccessInfoText>
            </AccessInfo>
          </ModalBody>

          <ModalActions>
            <Button
              variant="ghost"
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink size={14} />
              Preview
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </Container>
  );
};