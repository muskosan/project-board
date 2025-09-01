import React from 'react';
import styled from 'styled-components';
import { 
  Heading, 
  Text, 
  Label, 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  Badge 
} from '../components/ui';

const DemoContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ComponentDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FlexRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

export const DesignSystemDemo: React.FC = () => {
  return (
    <DemoContainer>
      <Heading level={1}>Design System Demo</Heading>
      <Text color="secondary" size="lg">
        A showcase of all the foundational UI components in StudioBoard
      </Text>

      <Section>
        <Heading level={2}>Typography</Heading>
        <ComponentGrid>
          <Card>
            <CardHeader>
              <Heading level={3}>Headings</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <Heading level={1}>Heading 1</Heading>
                <Heading level={2}>Heading 2</Heading>
                <Heading level={3}>Heading 3</Heading>
                <Heading level={4}>Heading 4</Heading>
                <Heading level={5}>Heading 5</Heading>
                <Heading level={6}>Heading 6</Heading>
              </ComponentDemo>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3}>Text & Labels</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <Text size="xl">Extra large text</Text>
                <Text size="lg">Large text</Text>
                <Text>Base text</Text>
                <Text size="sm">Small text</Text>
                <Text size="xs">Extra small text</Text>
                <Text color="secondary">Secondary text</Text>
                <Text color="muted">Muted text</Text>
                <Label>Form label</Label>
              </ComponentDemo>
            </CardContent>
          </Card>
        </ComponentGrid>
      </Section>

      <Section>
        <Heading level={2}>Buttons</Heading>
        <ComponentGrid>
          <Card>
            <CardHeader>
              <Heading level={3}>Button Variants</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <FlexRow>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </FlexRow>
                <FlexRow>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary" loading>Loading</Button>
                </FlexRow>
              </ComponentDemo>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3}>Button Sizes</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <FlexRow>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </FlexRow>
                <Button fullWidth>Full Width Button</Button>
              </ComponentDemo>
            </CardContent>
          </Card>
        </ComponentGrid>
      </Section>

      <Section>
        <Heading level={2}>Form Components</Heading>
        <ComponentGrid>
          <Card>
            <CardHeader>
              <Heading level={3}>Input Fields</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <div>
                  <Label htmlFor="input1">Default Input</Label>
                  <Input id="input1" placeholder="Enter text..." />
                </div>
                <div>
                  <Label htmlFor="input2">Filled Input</Label>
                  <Input id="input2" variant="filled" placeholder="Enter text..." />
                </div>
                <div>
                  <Label htmlFor="input3">Error State</Label>
                  <Input id="input3" error placeholder="Invalid input" />
                </div>
                <div>
                  <Label htmlFor="input4">Disabled Input</Label>
                  <Input id="input4" disabled placeholder="Disabled" />
                </div>
              </ComponentDemo>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3}>Input Sizes</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <Input size="sm" placeholder="Small input" />
                <Input size="md" placeholder="Medium input" />
                <Input size="lg" placeholder="Large input" />
              </ComponentDemo>
            </CardContent>
          </Card>
        </ComponentGrid>
      </Section>

      <Section>
        <Heading level={2}>Cards</Heading>
        <ComponentGrid>
          <Card variant="default">
            <CardHeader>
              <Heading level={3}>Default Card</Heading>
            </CardHeader>
            <CardContent>
              <Text>This is a default card with subtle shadow.</Text>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card variant="elevated" hover>
            <CardHeader>
              <Heading level={3}>Elevated Card</Heading>
            </CardHeader>
            <CardContent>
              <Text>This card has more prominent shadow and hover effects.</Text>
            </CardContent>
          </Card>

          <Card variant="outlined" clickable>
            <CardHeader>
              <Heading level={3}>Outlined Card</Heading>
            </CardHeader>
            <CardContent>
              <Text>This card has a border instead of shadow and is clickable.</Text>
            </CardContent>
          </Card>
        </ComponentGrid>
      </Section>

      <Section>
        <Heading level={2}>Badges</Heading>
        <ComponentGrid>
          <Card>
            <CardHeader>
              <Heading level={3}>Badge Variants</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <FlexRow>
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                </FlexRow>
                <FlexRow>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </FlexRow>
              </ComponentDemo>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heading level={3}>Badge Sizes</Heading>
            </CardHeader>
            <CardContent>
              <ComponentDemo>
                <FlexRow>
                  <Badge size="sm" variant="primary">Small</Badge>
                  <Badge size="md" variant="primary">Medium</Badge>
                  <Badge size="lg" variant="primary">Large</Badge>
                </FlexRow>
              </ComponentDemo>
            </CardContent>
          </Card>
        </ComponentGrid>
      </Section>
    </DemoContainer>
  );
};