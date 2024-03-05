'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, Stack, ScrollArea, Accordion } from '@mantine/core';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import TaskInProgress from '../../TaskInProgress/TaskInProgress';
import { AppShellMainFooter } from './AppShell.Main.Footer';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: { xs:160, sm: 180, lg: 240 }, breakpoint: 'xs', collapsed: { mobile: !opened } }}
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
            h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 20px)"
          >
            {/*<ScrollArea p={10} style={{ height: 'calc(100% - 350px)' }} offsetScrollbars bg='cyan'>*/}
            <ScrollArea p={10} style={{ height: '100%' }} offsetScrollbars>
              {children}
            </ScrollArea>

            <Accordion multiple variant="contained" radius={0} defaultValue={['RecentTask']}>
              <TaskInProgress />
              <AppShellMainFooter />
            </Accordion>
          </Stack>
        </AppShell.Main>
        <AppShell.Footer>
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
