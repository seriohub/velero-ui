'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, em, Stack, ScrollArea, Accordion, Box } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import { useViewportSize } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import TaskInProgress from '../../TaskInProgress/TaskInProgress';
import { AppShellMainFooter } from './AppShell.Main.Footer';
import { useEffect } from 'react';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  const isMobile = useMediaQuery(`(max-width: ${em(48)})`);
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { ref, width, height } = useElementSize();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          //width: { xs: 160, sm: 180, lg: 240 },
          width: "240px",
          breakpoint: 'xs',
          collapsed: { mobile: !opened },
        }}
        layout="alt"
      >
        <AppShell.Header>
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
            w={vpWidth < 768 ? "100vw" : "calc(100vw - 240px)"}
          >
            {/*<ScrollArea p={5} style={{ height: '100%' }} offsetScrollbars scrollbars="y">*/}
            <Box
              h={vpWidth < 768 ? 
                `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 0px`:
                `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 20px`
              }
              //mah={`calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 40px`}
              p={0}
            >
              {children}
            </Box>
            {/*</ScrollArea>*/}

            <Box ref={ref} p={0}>
              <Accordion multiple variant="contained" radius={0} defaultValue={['RecentTask']} pt={0}>
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
