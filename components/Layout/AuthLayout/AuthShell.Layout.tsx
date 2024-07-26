'use client';

import { AppShell, Group, Stack, Box, em, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { AuthShellHeader } from './AuthShell.Header';
import { AppShellFooter } from '../App/AppShell.Footer';

interface AuthShellLayoutProps {
  children: any;
}

export default function AuthShellLayout({ children }: AuthShellLayoutProps) {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  return (
    <>
      <AppShell withBorder={false}>
        <AppShell.Main>
          <Group align="flex-end" p="sm">
            <AuthShellHeader />
          </Group>

          <Flex
            h={
              isMobile
                ? 'auto'
                : 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 100px)'
            }
            p="xs"
            mb={100}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="wrap"
          >
            <Box pt="10rem" w="450">
              {children}
            </Box>
            <Stack pt="2rem" justify="flex-end" mih={isMobile ? 'auto' : '100%'}></Stack>
          </Flex>
        </AppShell.Main>
        <AppShell.Footer>
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
