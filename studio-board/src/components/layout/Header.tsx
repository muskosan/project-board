import React from 'react';
import styled from 'styled-components';
import { tokens } from '../../styles/tokens';

const HeaderContainer = styled.header`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${tokens.spacing.xl};
  background-color: ${tokens.colors.background.elevated};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.lg};
`;

const Logo = styled.h1`
  font-size: ${tokens.typography.sizes.xl};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.text.primary};
  font-family: ${tokens.typography.fonts.heading};
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.lg};
  transition: background-color ${tokens.transitions.fast};
  cursor: pointer;

  &:hover {
    background-color: ${tokens.colors.background.secondary};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${tokens.colors.accent.primary}, ${tokens.colors.accent.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${tokens.typography.weights.medium};
  font-size: ${tokens.typography.sizes.sm};
`;

const UserName = styled.span`
  font-size: ${tokens.typography.sizes.sm};
  font-weight: ${tokens.typography.weights.medium};
  color: ${tokens.colors.text.primary};

  @media (max-width: ${tokens.breakpoints.mobile}) {
    display: none;
  }
`;

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <LeftSection>
        <Logo>StudioBoard</Logo>
      </LeftSection>
      <RightSection>
        <UserSection>
          <Avatar>JD</Avatar>
          <UserName>John Doe</UserName>
        </UserSection>
      </RightSection>
    </HeaderContainer>
  );
};
