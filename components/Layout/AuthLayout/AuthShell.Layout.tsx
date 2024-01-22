'use client';

import { AppShell, Group, Stack, Flex, Box } from '@mantine/core';

import { AuthShellHeader } from './AuthShell.Header';

interface AuthShellLayoutProps {
  children: any;
}

export default function AuthShellLayout({ children }: AuthShellLayoutProps) {
  return (
    <>
      <AppShell withBorder={false}>
        <AppShell.Main>
          <Stack
            h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 0px)"
            gap="lg"
          >
            <Flex style={{ width: '100%', minHeight: '100%' }} align="flex-start">
              <Box
                h="calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 0px)"
                w="440px"
              >
                {children}
              </Box>
              <Box w="calc(100% - 440px)">
                <Group align="flex-end" h="100%" p="md" grow>
                  <AuthShellHeader />
                </Group>
              </Box>
            </Flex>
          </Stack>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
