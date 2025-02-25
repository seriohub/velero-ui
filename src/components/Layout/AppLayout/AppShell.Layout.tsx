'use client';

import { useDisclosure, useElementSize, useViewportSize } from '@mantine/hooks';
import {
  AppShell,
  Stack,
  Box,
  Accordion,
  useComputedColorScheme,
  ActionIcon,
  rem,
  Drawer,
} from '@mantine/core';
import { useEffect, useState } from 'react';

import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

import { useUIStatus } from '@/contexts/UIContext';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import { AppShellMainFooter } from './AppShell.Main.Footer';

import AgentError from '@/components/Features/Errors/AgentError';
import DebugAside from '@/components/Features/Debug/DebugAside';
import TaskInProgress from '@/components/Display/TaskInProgress';
import UIConfig from '@/components/Features/Config/UI/UIConfig';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const uiValues = useUIStatus();

  const [opened, { toggle }] = useDisclosure();

  const [value, setValue] = useState<string[]>([]);

  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { ref, width, height } = useElementSize();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [openedAside, { toggle: toggleAside }] = useDisclosure();

  useEffect(() => {
    const accordionValue = localStorage.getItem('accordion');
    setValue(accordionValue !== null ? accordionValue.split(',') : []);
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
        /*aside={{
          width: '300px',
          breakpoint: 'xs',
          // collapsed: { mobile: !opened },
          collapsed: { desktop: !openedAside, mobile: !openedAside },
        }}*/
        layout="alt"
      >
        <AppShell.Header>
          <AppShellHeader opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Navbar
          bg={
            uiValues.navbarColored && computedColorScheme === 'light'
              ? 'var(--mantine-primary-color-filled)'
              : undefined
          }
        >
          <AppShellNavbar opened={opened} toggle={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>
          <Stack
            justify="space-between"
            h={
              vpWidth < 768
                ? 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))'
                : 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 20px)'
            }
            gap={0}
            w={vpWidth < 768 ? '100vw' : 'calc(100vw - 240px)'}
            bg={
              uiValues.mainColored && computedColorScheme === 'light'
                ? 'var(--mantine-primary-color-light)'
                : undefined
            }
          >
            <Box
              h={
                vpWidth < 768
                  ? `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 0px`
                  : `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 20px`
              }
            >
              {children}
            </Box>
            <Box ref={ref} p={0}>
              <Accordion
                chevronPosition="left"
                multiple
                // variant="contained"
                radius={0}
                defaultValue={value}
                value={value}
                pt={0}
                onChange={(val) => {
                  setValue(val);
                  localStorage.setItem('accordion', val.toString());
                }}
                style={{
                  borderTop: '1px solid',
                  borderColor: 'var(--mantine-color-default-border)',
                }}
              >
                <AgentError />
                <TaskInProgress />
                <AppShellMainFooter />
              </Accordion>
            </Box>
          </Stack>

          {uiValues.showDebugAside && (
            <ActionIcon
              //variant="outline"
              color="red"
              aria-label="ActionIcon with size as a number"
              onClick={() => toggleAside()}
              style={{
                height: '60px',
                position: 'fixed',
                right: -5,
                top: 120,
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
        </AppShell.Main>

        <Drawer
          opened={openedAside}
          onClose={toggleAside}
          title="Debug"
          position="right"
          closeOnEscape={false}
        >
          <DebugAside />
        </Drawer>

        <Drawer
          opened={uiValues.openedUIDrawer}
          onClose={() => uiValues.toggleUIDrawer(uiValues.openedUIDrawer)}
          title="Ui Config"
          position="right"
          closeOnEscape={false}
        >
          <UIConfig />
        </Drawer>

        <AppShell.Footer visibleFrom="sm">
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
