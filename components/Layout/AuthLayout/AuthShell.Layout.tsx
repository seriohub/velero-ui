'use client';

import { AppShell, Group, Stack, Flex, Box } from '@mantine/core';

import { AuthShellHeader } from './AuthShell.Header';
import { AppShellFooter } from '../App/AppShell.Footer';
import { DiagnosticInfo } from '@/components/DiagnosticInfo';

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
              <Stack w="calc(100% - 440px)" h="100%" justify="space-between">
                <Group align="flex-end" p="md" grow>
                  <AuthShellHeader />
                </Group>
                <DiagnosticInfo />
              </Stack>
              
            </Flex>
          </Stack>
        </AppShell.Main>
        <AppShell.Footer>
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
