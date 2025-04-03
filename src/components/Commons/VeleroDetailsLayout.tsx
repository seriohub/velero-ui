'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { Box, Card, Grid } from '@mantine/core';
import { PageScrollArea } from '@/components/Commons/PageScrollArea';
import { useUIStatus } from '@/contexts/UIContext';

interface VeleroDetailsLayoutProps {
  toolbar: ReactNode;
  details: ReactNode;
  manifest: ReactNode;
  tabs?: (height: number) => ReactNode;
}

export function VeleroDetailsLayout({
                                      toolbar,
                                      details,
                                      manifest,
                                      tabs,
                                    }: VeleroDetailsLayoutProps) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const [tabHeaderHeight, setTabHeaderHeight] = useState(0);
  const uiValues = useUIStatus();

  useEffect(() => {
    const updateHeight = () => {
      if (tabListRef.current) {
        setTabHeaderHeight(tabListRef.current.offsetHeight - 42);
      }
    };

    // Initial Call
    updateHeight();

    // Resize Listener
    window.addEventListener('resize', updateHeight);

    // Clean listener
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [uiValues.showTaskInProgress]);

  return (
    <PageScrollArea>
      {toolbar}

      <Grid gutter="xs">
        <Grid.Col span={{
          base: 12,
          md: 12,
          lg: 4
        }}><Box h={500}>{details}</Box></Grid.Col>
        <Grid.Col span={{
          base: 12,
          md: 12,
          lg: 8
        }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={500}>
            <Card.Section withBorder inheritPadding p="sm" h={500}>
              <Box h={480}>
                {manifest}
              </Box>
            </Card.Section>
          </Card>
        </Grid.Col>
      </Grid>

      {tabs && (
        <Box style={{
          flex: 1,
          overflowY: 'auto'
        }} mt="xs">
          <Card shadow="sm" radius="md" withBorder p={0} h="100%" ref={tabListRef}>
            {tabs(tabHeaderHeight)}
          </Card>
        </Box>
      )}
    </PageScrollArea>
  );
}
