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
        navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
        layout="alt"
        withBorder={false}
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
          <Stack h="calc(100vh - 100px)" justify="space-between" gap="lg">
            {children}

            <Box style={{ height: '280px' }}>
              <RecentTask />
            </Box>

            <AppShellFooter />
          </Stack>
        </AppShell.Main>
        {/*<AppShell.Footer p={0} style={{ background: '#010101' }}>
          <AppShellFooter />
        </AppShell.Footer>*/}
      </AppShell>
    </>
  );
}
