'use client';

import { AppShell, Stack, Box, Flex, ActionIcon, rem, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { AuthShellHeader } from './AuthShell.Header';

import { AppShellFooter } from '@/components/Layout/AppLayout/AppShell.Footer';
import { LoginSponsorMessage } from '@/components/Commons/Sponsor/LoginSponsorMessage';

import DebugAside from '@/components/Features/Debug/DebugAside';

interface AuthShellLayoutProps {
  children: any;
}

export default function AuthShellLayout({ children }: AuthShellLayoutProps) {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [openedAside, { toggle: toggleAside }] = useDisclosure();
  return (
    <>
      <AppShell withBorder={false}>
        <AppShell.Main>
          <Flex
            //bg="green"
            h={isMobile ? 'auto' : 'calc(100vh - 24px)'}
            mih={isMobile ? 'calc(100vh - 24px)' : 'auto'}
            //p={0}
            //mb={100}
            //gap="md"
            justify="flex-start"
            align="flex-start"
            // direction={isMobile ? 'column' : 'row'}
            wrap="wrap"
          >
            <Box
              px={20}
              pt={isMobile ? '1rem' : '12rem'}
              maw="480px"
              w={isMobile ? '100%' : '480px'}
              h="calc(100vh - 24px)"
              //bg="red"
            >
              {children}
            </Box>

            <Stack
              visibleFrom="md"
              flex={1}
              align="flex-end"
              justify="space-between"
              h="calc(100vh - 24px)"
            >
              <AuthShellHeader />

              <Box p={20}>
                <LoginSponsorMessage />
              </Box>
            </Stack>

            {process.env.NODE_ENV === 'development' && (
              <ActionIcon
                color="red"
                onClick={() => toggleAside()}
                style={{
                  position: 'fixed',
                  height: '60px',
                  right: -5,
                  top: 160,
                  zIndex: 1000,
                }}
              >
                {openedAside ? (
                  <IconArrowRight
                    style={{
                      width: rem(24),
                      height: rem(24),
                    }}
                  />
                ) : (
                  <IconArrowLeft
                    style={{
                      width: rem(24),
                      height: rem(24),
                    }}
                  />
                )}
              </ActionIcon>
            )}
          </Flex>
          <Drawer
            opened={openedAside}
            onClose={toggleAside}
            title="Debug"
            position="right"
            closeOnEscape={false}
          >
            <DebugAside />
          </Drawer>
        </AppShell.Main>
        <AppShell.Footer>
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
