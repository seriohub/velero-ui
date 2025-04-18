import {
  Group,
  Stack,
  NavLink,
  Burger,
  ScrollArea,
  Box,
  Text,
  useComputedColorScheme,
  Tooltip,
  ActionIcon,
} from '@mantine/core';

import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
  IconLink,
  IconServer,
  IconHome,
  IconAffiliate,
  IconFolders,
  IconDog,
  IconSpy,
  IconAppWindow,
  IconZoomCode,
  IconArrowBarLeft,
  IconArrowBarRight,
  IconDatabaseExport,
  IconDatabaseImport,
  IconShield,
  IconApi,
  IconAutomation, IconPlayerPlay,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { useMediaQuery } from '@mantine/hooks';
import { useUIStatus } from '@/contexts/UIContext';
import { useServerStatus } from '@/contexts/ServerContext';

import { Version } from '@/components/Layout/Navlink/Version';
import { SwitchAgent } from '@/components/Features/Config/SwitchCluster/SwitchAgent';
import { Logo } from '@/components/Display/Logo';

import classesSimple from './Navbar.module.css';
import classesColored from './NavbarColored.module.css';

const veleroResourceLinks = [
  {
    link: '/dashboard',
    label: 'Dashboard',
    icon: IconDashboard,
    tooltip: 'Dashboard',
  },
  {
    link: '/backups',
    label: 'Backups',
    icon: IconDeviceFloppy,
    tooltip: 'Backups',
  },
  {
    link: '/restores',
    label: 'Restores',
    icon: IconRestore,
    tooltip: 'Restores',
  },
  {
    link: '/schedules',
    label: 'Schedules',
    icon: IconCalendarEvent,
    tooltip: 'Schedules',
  },
  {
    link: '/backup-storage-locations',
    label: 'Backups Locations',
    icon: IconServer,
    tooltip: 'Backups Locations',
  },
  {
    link: '/volume-snapshot-locations',
    label: 'Volume Locations',
    icon: IconDatabase,
    tooltip: 'Volume Locations',
  },
  {
    link: '/repos',
    label: 'Repositories',
    icon: IconFolders,
    tooltip: 'Repositories',
  },
  {
    link: '/pod-volume-backups',
    label: 'Pod Volume Backups',
    icon: IconDatabaseExport,
    tooltip: 'Pod Volumes Backup',
  },
  {
    link: '/pod-volume-restores',
    label: 'Pod Volume Restores',
    icon: IconDatabaseImport,
    tooltip: 'Pod Volumes Restore',
  },
];

const natsLink = [
  {
    link: '/settings/nats',
    label: 'Nats',
    icon: IconAffiliate,
    tooltip: 'Settings Nats',
  },
];

const settingsLink = [
  {
    link: '/sc-mapping',
    label: 'Storage Class Mapping',
    icon: IconLink,
    tooltip: 'Storage Class Mapping',
  },
  {
    link: '/settings/api',
    label: 'API',
    icon: IconApi,
    tooltip: 'API Settings',
  },
  {
    link: '/settings/watchdog',
    label: 'Watchdog',
    icon: IconDog,
    tooltip: 'Watchdog Settings',
  },
  {
    link: '/settings/ui',
    label: 'UI',
    icon: IconAppWindow,
    tooltip: 'UI Settings',
  },
];

const systemLink = [
  {
    link: '/vui',
    label: 'Vui',
    icon: IconPlayerPlay,
    tooltip: 'Vui',
  },
  {
    link: '/velero',
    label: 'Velero',
    icon: IconAutomation,
    tooltip: 'Velero',
  },
  /*{
    link: '/system/security',
    label: 'Security',
    icon: IconShield,
    tooltip: 'Security',
  },
  /*{
    link: '/system/agent',
    label: 'Agent',
    icon: IconSpy,
    tooltip: 'Agent',
  },*/
];

const homeLink = [
  {
    link: '/home',
    label: 'Home',
    icon: IconHome,
    tooltip: 'Home',
  },
];

const inspectLink = [
  {
    link: '/inspect/backups',
    label: 'Backups',
    icon: IconZoomCode,
    tooltip: 'Inspect Backups',
  },
];

interface NavItem {
  label: string;
  link: string;
  icon: React.ElementType;
  tooltip?: string;
}

export function AppShellNavbar({
                                 opened,
                                 toggle,
                                 collapsed,
                                 toggleCollapsed
                               }: any) {
  const serverValues = useServerStatus();
  const uiValues = useUIStatus();
  const isNavbarHidden = useMediaQuery('(max-width: 576px)');
  const router = useRouter();
  const pathname = usePathname();

  const computedColorScheme = useComputedColorScheme();

  const generateNavLinks = (data: NavItem[], disabled: boolean = false) =>
    data.map((item: NavItem) => (
      <NavLink
        w={collapsed ? '50px' : '230px'}
        //mt={0}
        className={
          computedColorScheme === 'light'
            ? uiValues.navbarColored
              ? classesColored.link
              : classesSimple.link
            : classesSimple.link
        }
        key={item.label}
        active={item.link === pathname || undefined}
        label={!collapsed || isNavbarHidden ? item.label : ''}
        disabled={disabled}
        leftSection={
          <>
            {!collapsed && (
              <item.icon
                className={
                  computedColorScheme === 'light'
                    ? uiValues.navbarColored
                      ? classesColored.linkIcon
                      : classesSimple.linkIcon
                    : classesSimple.linkIcon
                }
              />
            )}
            {collapsed && (
              <Tooltip label={item.tooltip}>
                <item.icon
                  className={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? classesColored.linkIcon
                        : classesSimple.linkIcon
                      : classesSimple.linkIcon
                  }
                />
              </Tooltip>
            )}
          </>
        }
        onClick={(event) => {
          event.preventDefault();
          router.push(item.link);
        }}
      />
    ));

  return (
    <>
      <ScrollArea
        p={0}
        style={{
          height: '100vh',
          w: '100vw',
        }}
        maw="100vw"
        scrollbars="y"
      >
        <Stack
          justify="space-between"
          style={{ height: '100vh' }}
          p={0}
          w={!collapsed ? '240px' : '60'}
        >
          <Box p={0}>
            <Group justify="space-between" h={60} p={5}>
              {!collapsed && <Logo/>}
              {!isNavbarHidden && (
                <Tooltip label={collapsed ? 'Expand' : 'Collapse'}>
                  <ActionIcon
                    variant="transparent"
                    p={4}
                    w={50}
                    h={50}
                    tabIndex={-1}
                    onClick={() => toggleCollapsed()}
                    className={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    size="xl"
                  >
                    {!collapsed && <IconArrowBarLeft/>}
                    {collapsed && <IconArrowBarRight/>}
                  </ActionIcon>
                </Tooltip>
              )}
              {isNavbarHidden && (
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  color={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? 'white'
                        : 'var(--mantine-primary-color-filled)'
                      : 'white'
                  }
                />
              )}
            </Group>

            {serverValues.isCurrentServerControlPlane && (
              <Box p={5}>
                {generateNavLinks(homeLink, serverValues.isCurrentServerControlPlane !== true)}
              </Box>
            )}

            {serverValues.isCurrentServerControlPlane && !collapsed && (
              <Box mt={5}>
                <Text
                  ml="12"
                  size="sm"
                  fw={600}
                  c={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? 'white'
                        : undefined
                      : undefined
                  }
                >
                  Cluster
                </Text>
                <Box p={5}>
                  <SwitchAgent/>
                </Box>
              </Box>
            )}

            <Box mt={5}>
              {(!collapsed || isNavbarHidden) && (
                <Text
                  ml="12"
                  size="sm"
                  fw={600}
                  c={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? 'white'
                        : undefined
                      : undefined
                  }
                >
                  Velero resource
                </Text>
              )}
              <Box p={5} mt={0}>
                {generateNavLinks(veleroResourceLinks)}
              </Box>
            </Box>

            <Box mt={5}>
              {(!collapsed || isNavbarHidden) && (
                <Text
                  size="sm"
                  fw={600}
                  ml="12"
                  c={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? 'white'
                        : undefined
                      : undefined
                  }
                >
                  Inspect
                </Text>
              )}
              <Box p={5} mt={0}>
                {generateNavLinks(inspectLink)}
              </Box>
            </Box>

            <Box mt={5}>
              {(!collapsed || isNavbarHidden) && (
                <Text
                  size="sm"
                  fw={600}
                  ml="12"
                  c={
                    computedColorScheme === 'light'
                      ? uiValues.navbarColored
                        ? 'white'
                        : undefined
                      : undefined
                  }
                >
                  Settings
                </Text>
              )}
              <Box p={5} mt={0}>
                {serverValues.isCurrentServerControlPlane && generateNavLinks(natsLink, serverValues.isCurrentServerControlPlane !== true)}
                {generateNavLinks(settingsLink)}
              </Box>

              {/* system */}
              <Box mt={5}>
                {(!collapsed || isNavbarHidden) && (
                  <Text
                    size="sm"
                    fw={600}
                    ml="12"
                    c={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? 'white'
                          : undefined
                        : undefined
                    }
                  >
                    System
                  </Text>
                )}
                <Box p={5} mt={0}>
                  {generateNavLinks(systemLink)}
                </Box>
              </Box>
            </Box>
          </Box>

          {(!collapsed || isNavbarHidden) && (
            <Box>
              <Version/>
            </Box>
          )}
        </Stack>
      </ScrollArea>
    </>
  );
}
