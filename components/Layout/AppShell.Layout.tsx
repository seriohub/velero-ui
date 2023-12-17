'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Box, Burger, Group, Stack } from '@mantine/core';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import RecentTask from '../RecentTask/RecentTask';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        layout="alt"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <AppShellHeader />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <AppShellNavbar />
        </AppShell.Navbar>
        <AppShell.Main>
          <Stack
            h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 0px)"
            justify="space-between"
            gap="lg"
          >
            <Box p="md" style={{ height: 'calc(100% - 300px)' }}>
              {children}
            </Box>
            <Box p="md" style={{ height: '280px' }}>
              <RecentTask />
            </Box>
            <AppShellFooter />
          </Stack>
        </AppShell.Main>
        {/*<AppShell.Footer style={{ background: '#c1c3c5' }} withBorder>
          <AppShellFooter />
        </AppShell.Footer>*/}
      </AppShell>
    </>
  );
}
