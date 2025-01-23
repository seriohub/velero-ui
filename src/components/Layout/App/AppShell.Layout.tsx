'use client';

import {useDisclosure , useElementSize , useMediaQuery , useViewportSize} from '@mantine/hooks';
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
import { AppShellHeader } from './AppShell.Header';
import { AppShellNavbar } from './AppShell.Navbar';
import { AppShellFooter } from './AppShell.Footer';
import { AppShellMainFooter } from './AppShell.Main.Footer';

import { AgentError } from '@/components/AgentError/AgentError';
import { DebugAside } from '@/components/Debug/DebugAside';

import TaskInProgress from '@/components/Velero/TaskInProgress/TaskInProgress';
import { UIConfig } from '@/components/Config/UI/UIConfig';
import { useUIStatus } from '@/contexts/UIContext';

interface AppShellLayoutProps {
  children: any;
}

export default function AppShellLayout({ children }: AppShellLayoutProps) {
  const uiValues = useUIStatus();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
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
          //bg={computedColorScheme=='light'? 'var(--mantine-primary-color-filled)' : ''}
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
            // bg={computedColorScheme=='light'? 'var(--mantine-primary-color-light)' : ''}
            bg={
              uiValues.mainColored && computedColorScheme === 'light'
                ? 'var(--mantine-primary-color-light)'
                : undefined
            }
            //bg="blue"
          >
            <Box
              //bg='orange'
              h={
                vpWidth < 768
                  ? `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 0px`
                  : `calc(100vh - var(--app-shell-header-height, 0px) - ${height.toFixed(0)}px - 20px`
              }
              /*p={
                isMobile
                  ? 10
                  : isTablet
                    ? 10
                    : 10
              }*/
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
              //size={24}
              //color= "red"
              variant="default"
              aria-label="ActionIcon with size as a number"
              onClick={() => toggleAside()}
              style={{
                height: '60px',
                position: 'fixed',
                right: 0,
                top: 65,
                zIndex: 1000, // Assicurati che il pulsante sia sopra l'Aside
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

        {/*<AppShell.Aside>
        </AppShell.Aside>*/}
        <AppShell.Footer visibleFrom="sm">
          <AppShellFooter />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}
