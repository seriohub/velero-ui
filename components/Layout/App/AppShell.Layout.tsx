'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Stack, Box, Accordion } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { useViewportSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import { AppShellMainFooter } from './AppShell.Main.Footer';

import TaskInProgress from '../../TaskInProgress/TaskInProgress';

import { useAppState } from '@/contexts/AppStateContext';
import { AgentError } from '@/components/AgentError/AgentError';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const appValues = useAppState();

  const [opened, { toggle }] = useDisclosure();

  const [value, setValue] = useState<string[]>([]);

  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { ref, width, height } = useElementSize();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 560 has been called`, `color: green; font-weight: bold;`)
    const accordionValue = localStorage.getItem('accordion');
    setValue(accordionValue != null ? accordionValue.split(',') : []);
  }, []);

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: '240px',
          breakpoint: 'xs',
          collapsed: { mobile: !opened },
        }}
        layout="alt"
      >
        <AppShell.Header withBorder={false}>
          <AppShellHeader opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShellNavbar opened={opened} toggle={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Stack
            justify="space-between"
            h={
              vpWidth < 768
                ? `calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))`
                : `calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 20px)`
            }
            gap={0}
            w={vpWidth < 768 ? '100vw' : 'calc(100vw - 240px)'}
          >
            <Box
              h={
                vpWidth < 768
                  ? `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 0px`
                  : `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 20px`
              }
              p={0}
            >
              {children}
            </Box>
            <Box ref={ref} p={0}>
              <Accordion
                multiple
                variant="contained"
                radius={0}
                defaultValue={value}
                pt={0}
                onChange={(val) => {
                  setValue(val);
                  localStorage.setItem('accordion', val.toString());
                }}
              >
                <AgentError />
                <TaskInProgress />
                <AppShellMainFooter />
              </Accordion>
            </Box>
          </Stack>
        </AppShell.Main>
        <AppShell.Footer visibleFrom="sm">
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
