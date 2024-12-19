import {
  Group,
  Stack,
  NavLink,
  Burger,
  ScrollArea,
  Box,
  Text,
  Space,
  useComputedColorScheme,
} from '@mantine/core';
import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
  IconLink,
  IconSettings,
  IconServer,
  IconHome,
  IconAffiliate,
  IconFolders,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { Version } from '@/components/Navlink/Version';
import { useServerStatus } from '@/contexts/ServerStatusContext';

import { SwitchAgent } from '@/components/SwitchCluster/SwitchAgent';
import { Logo } from '@/components/Logo';
import { useUIState } from '@/contexts/UIStateContext';

import classesSimple from './Navbar.module.css';
import classesColored from './NavbarColored.module.css';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/backups', label: 'Backups', icon: IconDeviceFloppy },
  { link: '/restores', label: 'Restores', icon: IconRestore },
  { link: '/schedules', label: 'Schedules', icon: IconCalendarEvent },
  { link: '/backup-locations', label: 'Backup Location', icon: IconServer },
  { link: '/storage-locations', label: 'Snapshot Location', icon: IconDatabase },
  { link: '/repos', label: 'Repositories', icon: IconFolders },
  { link: '/sc-mapping', label: 'SC mapping', icon: IconLink },
];

const natsLink = [{ link: '/nats', label: 'Nats', icon: IconAffiliate }];
const homeLink = [{ link: '/home', label: 'Home', icon: IconHome }];

interface NavItem {
  label: string;
  link: string;
  icon: React.ElementType;
}

export function AppShellNavbar({ opened, toggle }: any) {
  const serverValues = useServerStatus();
  const uiValues = useUIState();

  const router = useRouter();
  const pathname = usePathname();

  const computedColorScheme = useComputedColorScheme();

  const generateNavLinks = (
    data: NavItem[],
    pathname: string,
    router: any,
    toggle: () => void,
    disabled: boolean = false
  ) => {
    return data.map((item: NavItem) => (
      <NavLink
        //className={classes.link}
        //className={classesSimple.link}
        className={
          computedColorScheme == 'light'
            ? uiValues.navbarColored
              ? classesColored.link
              : classesSimple.link
            : classesSimple.link
        }
        // className={classes.link}
        /*style={{
          color:
            uiValues.navbarColor && computedColorScheme == 'light'
              ? 'white'
              : undefined,
        }}*/
        key={item.label}
        active={item.link === pathname || undefined}
        label={item.label}
        disabled={disabled}
        leftSection={
          <item.icon
            className={
              computedColorScheme == 'light'
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
        //autoContrast
        /*color={
          uiValues.navbarColor && computedColorScheme == 'light'
            ? 'white'
            : undefined
        }*/
        //variant="filled"
        // variant="subtle"
      />
    ));
  };

  const links = generateNavLinks(data, pathname, router, toggle);

  const home = generateNavLinks(
    homeLink,
    pathname,
    router,
    toggle,
    serverValues.isCurrentServerControlPlane != true
  );
  const nats = generateNavLinks(
    natsLink,
    pathname,
    router,
    toggle,
    serverValues.isCurrentServerControlPlane != true
  );

  return (
    <>
      <ScrollArea
        p={0}
        style={{ height: '100vh', w: '100vw' }}
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
              {/*)}*/}
              {/*<Divider />*/}
              {/*<SwitchCluster2 />*/}
              {/*<SwitchCluster />*/}
              {
                /*isCore && (*/
                <Box mt={20}>
                  <Text
                    ml="12"
                    size="xs"
                    c={
                      computedColorScheme == 'light'
                        ? uiValues.navbarColored
                          ? 'white'
                          : undefined
                        : undefined
                    }
                  >
                    Kubernetes cluster
                  </Text>
                  <Box p={5}>
                    <SwitchAgent />
                  </Box>
                </Box>
                /*)} */
              }
              <Box mt={20}>
                <Text
                  ml="12"
                  size="xs"
                  c={
                    computedColorScheme == 'light'
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

              {/*isCore && (
                <>*/}
              <Box mt={10}>
                <Text
                  ml="12"
                  size="xs"
                  c={
                    computedColorScheme == 'light'
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
                      computedColorScheme == 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="configuration"
                    active={'/configuration' === pathname || undefined}
                    label="Configuration"
                    leftSection={
                      <IconSettings
                        className={
                          computedColorScheme == 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/configuration');
                    }}
                    //variant="filled"
                    // autoContrast
                    color={
                      uiValues.navbarColored && computedColorScheme == 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                  <NavLink
                    className={
                      computedColorScheme == 'light'
                        ? uiValues.navbarColored
                          ? classesColored.link
                          : classesSimple.link
                        : classesSimple.link
                    }
                    key="watchdog"
                    active={'/watchdog' === pathname || undefined}
                    label="Watchdog"
                    leftSection={
                      <IconSettings
                        className={
                          computedColorScheme == 'light'
                            ? uiValues.navbarColored
                              ? classesColored.linkIcon
                              : classesSimple.linkIcon
                            : classesSimple.linkIcon
                        }
                      />
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      router.push('/watchdog');
                    }}
                    //variant="filled"
                    // autoContrast
                    color={
                      uiValues.navbarColored && computedColorScheme == 'light'
                        ? 'var(--mantine-color-white)'
                        : undefined
                    }
                  />
                </Box>
              </Box>

              {/*</>
              )}*/}
            </>
          </Box>

          <Box>
            <Version />

            {/*<UserInfo2 />

            <Logout />*/}
          </Box>
        </Stack>
      </ScrollArea>
    </>
  );
}
