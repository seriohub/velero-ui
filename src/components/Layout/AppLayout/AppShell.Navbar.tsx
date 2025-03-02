import {
  Group,
  Stack,
  NavLink,
  Burger,
  ScrollArea,
  Box,
  Text,
  useComputedColorScheme,
} from '@mantine/core';

import {
  IconDashboard ,
  IconRestore ,
  IconDeviceFloppy ,
  IconCalendarEvent ,
  IconDatabase ,
  IconLink ,
  IconSettings ,
  IconServer ,
  IconHome ,
  IconAffiliate ,
  IconFolders ,
  IconDog ,
  IconSpy ,
  IconInfoCircle ,
  IconAppWindow , IconZoomCode ,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { useUIStatus } from '@/contexts/UIContext';
import { useServerStatus } from '@/contexts/ServerContext';

import { Version } from '@/components/Layout/Navlink/Version';
import { SwitchAgent } from '@/components/Features/Config/SwitchCluster/SwitchAgent';
import { Logo } from '@/components/Display/Logo';

import classesSimple from './Navbar.module.css';
import classesColored from './NavbarColored.module.css';

const data = [
  {
    link: '/dashboard',
    label: 'Dashboard',
    icon: IconDashboard,
  },
  {
    link: '/backups',
    label: 'Backups',
    icon: IconDeviceFloppy,
  },
  {
    link: '/restores',
    label: 'Restores',
    icon: IconRestore,
  },
  {
    link: '/schedules',
    label: 'Schedules',
    icon: IconCalendarEvent,
  },
  {
    link: '/backup-storage-locations',
    label: 'Backups Locations',
    icon: IconServer,
  },
  {
    link: '/volume-snapshot-locations',
    label: 'Volume Locations',
    icon: IconDatabase,
  },
  {
    link: '/repos',
    label: 'Repositories',
    icon: IconFolders,
  },
  {
    link: '/sc-mapping',
    label: 'SC mapping',
    icon: IconLink,
  },
];

const natsLink = [
  {
    link: '/settings/nats',
    label: 'Nats',
    icon: IconAffiliate,
  },
];
const homeLink = [
  {
    link: '/home',
    label: 'Home',
    icon: IconHome,
  },
];

interface NavItem {
  label: string;
  link: string;
  icon: React.ElementType;
}

export function AppShellNavbar({ opened, toggle }: any) {
  const serverValues = useServerStatus();
  const uiValues = useUIStatus();

  const router = useRouter();
  const pathname = usePathname();

  const computedColorScheme = useComputedColorScheme();

  const generateNavLinks = (
    data: NavItem[],
    pathname: string,
    router: any,
    toggle: () => void,
    disabled: boolean = false
  ) =>
    data.map((item: NavItem) => (
      <NavLink
        className={
          computedColorScheme === 'light'
            ? uiValues.navbarColored
              ? classesColored.link
              : classesSimple.link
            : classesSimple.link
        }
        key={item.label}
        active={item.link === pathname || undefined}
        label={item.label}
        disabled={disabled}
        leftSection={
          <item.icon
            className={
              computedColorScheme === 'light'
                ? uiValues.navbarColored
                  ? classesColored.linkIcon
                  : classesSimple.linkIcon
                : classesSimple.linkIcon
            }
          />
        }
        onClick={(event) => {
          event.preventDefault();
          router.push(item.link);
          toggle();
        }}
      />
    ));

  const links = generateNavLinks(data, pathname, router, toggle);

  const home = generateNavLinks(
    homeLink,
    pathname,
    router,
    toggle,
    serverValues.isCurrentServerControlPlane !== true
  );
  const nats = generateNavLinks(
    natsLink,
    pathname,
    router,
    toggle,
    serverValues.isCurrentServerControlPlane !== true
  );

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
        // bg={computedColorScheme == 'light' ? '#FCFCFC' : ''}
      >
        <Stack justify="space-between" style={{ height: '100vh' }}>
          <Box p={0}>
            <>
              <Group justify="space-between">
                <Logo />
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
              </Group>

              {/*isCore && (*/}
              <Box p={5}>{home}</Box>

              <Box mt={20}>
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
                  <SwitchAgent />
                </Box>
              </Box>

              <Box mt={20}>
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
                <Box p={5}>{links}</Box>
              </Box>

              <Box mt={10}>
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
                <Box p={5} mt={0}>
                  <NavLink
                    className={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="inspect-backups"
                    active={pathname === '/inspect/backups' || undefined}
                    label="Backups"
                    leftSection={
                      <IconZoomCode
                        className={
                          computedColorScheme === 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/inspect/backups');
                    }}
                    color={
                      uiValues.navbarColored && computedColorScheme === 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                </Box>
              </Box>

              <Box mt={10}>
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
                <Box p={5} mt={0}>
                  {nats}
                  <NavLink
                    className={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="api-settings"
                    active={pathname === '/settings/api' || undefined}
                    label="API"
                    leftSection={
                      <IconSettings
                        className={
                          computedColorScheme === 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/settings/api');
                    }}
                    color={
                      uiValues.navbarColored && computedColorScheme === 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                  <NavLink
                    className={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="watchdog"
                    active={pathname === '/settings/watchdog' || undefined}
                    label="Watchdog"
                    leftSection={
                      <IconDog
                        className={
                          computedColorScheme === 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/settings/watchdog');
                    }}
                    color={
                      uiValues.navbarColored && computedColorScheme === 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                  <NavLink
                    className={
                      computedColorScheme === 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="ui"
                    active={pathname === '/settings/ui' || undefined}
                    label="UI"
                    leftSection={
                      <IconAppWindow
                        className={
                          computedColorScheme === 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/settings/ui');
                    }}
                    color={
                      uiValues.navbarColored && computedColorScheme === 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                </Box>

                {/* system */}
                <Box mt={10}>
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
                  <Box p={5} mt={0}>
                    <NavLink
                      className={
                        computedColorScheme === 'light'
                          ? uiValues.navbarColored
                            ? classesColored.link
                            : classesSimple.link
                          : classesSimple.link
                      }
                      key="security"
                      active={pathname === '/system/security' || undefined}
                      label="Security"
                      leftSection={
                        <IconInfoCircle
                          className={
                            computedColorScheme === 'light'
                              ? uiValues.navbarColored
                                ? classesColored.linkIcon
                                : classesSimple.linkIcon
                              : classesSimple.linkIcon
                          }
                        />
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        router.push('/system//security');
                      }}
                      //variant="filled"
                      // autoContrast
                      color={
                        uiValues.navbarColored && computedColorScheme === 'light'
                          ? 'var(--mantine-color-white)'
                          : undefined
                      }
                    />
                    <NavLink
                      className={
                        computedColorScheme === 'light'
                          ? uiValues.navbarColored
                            ? classesColored.link
                            : classesSimple.link
                          : classesSimple.link
                      }
                      key="core"
                      active={pathname === '/system/core' || undefined}
                      label="Core"
                      disabled
                      leftSection={
                        <IconServer
                          className={
                            computedColorScheme === 'light'
                              ? uiValues.navbarColored
                                ? classesColored.linkIcon
                                : classesSimple.linkIcon
                              : classesSimple.linkIcon
                          }
                        />
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        router.push('/system/core');
                      }}
                      //variant="filled"
                      // autoContrast
                      color={
                        uiValues.navbarColored && computedColorScheme === 'light'
                          ? 'var(--mantine-color-white)'
                          : undefined
                      }
                    />
                    <NavLink
                      className={
                        computedColorScheme === 'light'
                          ? uiValues.navbarColored
                            ? classesColored.link
                            : classesSimple.link
                          : classesSimple.link
                      }
                      key="agent"
                      active={pathname === '/system/agent' || undefined}
                      label="Agent"
                      leftSection={
                        <IconSpy
                          className={
                            computedColorScheme === 'light'
                              ? uiValues.navbarColored
                                ? classesColored.linkIcon
                                : classesSimple.linkIcon
                              : classesSimple.linkIcon
                          }
                        />
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        router.push('/system/agent');
                      }}
                      //variant="filled"
                      // autoContrast
                      color={
                        uiValues.navbarColored && computedColorScheme === 'light'
                          ? 'var(--mantine-color-white)'
                          : undefined
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </>
          </Box>

          <Box>
            <Version />
          </Box>
        </Stack>
      </ScrollArea>
    </>
  );
}
