'use client';

import { useDisclosure, useElementSize, useViewportSize } from '@mantine/hooks';
import {
  AppShell,
  Box,
  useComputedColorScheme,
  ActionIcon,
  rem,
  Drawer,
  Flex,
} from '@mantine/core';

import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

import { useEffect } from 'react';
import { useUIStatus } from '@/contexts/UIContext';

import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import { AppShellMainFooter } from './AppShell.Main.Footer';

import AgentError from '@/components/Features/Errors/AgentError';
import DebugAside from '@/components/Features/Debug/DebugAside';
import TaskInProgressAccordion from '@/components/Display/TaskInProgressAccordion';
import UIConfig from '@/components/Features/Config/UI/UIConfig';
import RouteChangeHandler from '@/components/RouteChageHandler';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const uiValues = useUIStatus();

  const [opened, { toggle }] = useDisclosure();
  const [collapsed, { toggle: toggleCollapsed, open }] = useDisclosure();

  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { ref, width, height } = useElementSize();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [openedAside, { toggle: toggleAside }] = useDisclosure();

  useEffect(() => {
    if (localStorage.getItem('navbarCollapsed') === 'true') {
      open();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('navbarCollapsed', collapsed ? 'true' : 'false');
  }, [collapsed]);

  return (
    <>
      <RouteChangeHandler />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: !collapsed ? '240px' : '60px',
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
          <AppShellHeader opened={opened} toggle={toggle} collapsed={collapsed}/>
        </AppShell.Header>
        <AppShell.Navbar
          style={{ transition: 'width 0.2s ease' }}
          bg={
            uiValues.navbarColored && computedColorScheme === 'light'
              ? 'var(--mantine-primary-color-filled)'
              : undefined
          }
        >
          <AppShellNavbar
            opened={opened}
            toggle={toggle}
            collapsed={collapsed}
            toggleCollapsed={toggleCollapsed}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Flex
            direction="column"
            justify="space-between"
            h={
              vpWidth < 768
                ? 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px))'
                : 'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 20px)'
            }
            gap={0}
            bg={
              computedColorScheme === 'light'
                ? uiValues.mainColored
                  ? 'var(--mantine-primary-color-light)'
                  : 'white'
                : 'var(--mantine-color-dark-8)'
            }
          >
            <Box
              style={{
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              {children}
            </Box>
            <Box ref={ref} p={0}>
              <AgentError />
              <TaskInProgressAccordion />
              {process.env.NODE_ENV === 'development' && <AppShellMainFooter />}
            </Box>
          </Flex>

          {uiValues.showDebugAside && (
            <ActionIcon
              color="red"
              onClick={() => toggleAside()}
              style={{
                height: '60px',
                position: 'fixed',
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
