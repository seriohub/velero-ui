import {
  Group,
  Stack,
  NavLink,
  Divider,
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
} from '@tabler/icons-react';
import { env } from 'next-runtime-env';
import { useRouter, usePathname } from 'next/navigation';

import { Logo } from '../../Logo';
import { Version } from '@/components/Navlink/Version';
import { Logout } from '@/components/Navlink/Logout';
import { UserInfo2 } from '@/components/Navlink/UserInfo2';

import { useAppState } from '@/contexts/AppStateContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

import { SwitchAgent } from '@/components/SwitchCluster/SwitchAgent';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/backups', label: 'Backups', icon: IconDeviceFloppy },
  { link: '/restores', label: 'Restores', icon: IconRestore },
  { link: '/schedules', label: 'Schedules', icon: IconCalendarEvent },
  { link: '/backup-locations', label: 'Backup Location', icon: IconDatabase },
  { link: '/storage-locations', label: 'Storage Location', icon: IconDatabase },
  { link: '/repos', label: 'Repositories', icon: IconDatabase },
  { link: '/sc-mapping', label: 'SC mapping', icon: IconLink },
];

const natsLink = [{ link: '/nats', label: 'Nats', icon: IconAffiliate }];
const homeLink = [{ link: '/home', label: 'Home', icon: IconHome }];

interface NavItem {
  label: string;
  link: string;
  icon: React.ElementType;
}

interface Props {
  data: NavItem[];
  pathname: string;
  router: any;
  toggle: () => void;
  disabled: boolean;
}
const generateNavLinks = (
  data: NavItem[],
  pathname: string,
  router: any,
  toggle: () => void,
  disabled: boolean = false
) => {
  return data.map((item: NavItem) => (
    <NavLink
      // className={classes.link}
      key={item.label}
      active={item.link === pathname || undefined}
      label={item.label}
      disabled={disabled}
      leftSection={<item.icon size="1.2rem" stroke={1.5} />}
      onClick={(event) => {
        event.preventDefault();
        router.push(item.link);
        toggle();
      }}
      variant="filled"
    />
  ));
};

export function AppShellNavbar({ opened, toggle }: any) {
  const appValues = useAppState();
  const serverValues = useServerStatus();
  const router = useRouter();
  const pathname = usePathname();

  const computedColorScheme = useComputedColorScheme();

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
              <Box p={5} mt={5} mb={5}>
                {home}
              </Box>
              {/*)}*/}
              {/*<Divider />*/}
              {/*<SwitchCluster2 />*/}
              {
                /*isCore && (*/
                <Box p={5} mt={5} mb={5}>
                  <>
                    {/*<SwitchCluster />*/}
                    <SwitchAgent />
                  </>
                </Box>
                /*)} */
              }

              {links}

              <Space h={20} />
              {/*isCore && (
                <>*/}
              <Text ml="12" size="sm">
                Settings
              </Text>
              {nats}
              {/*</>
              )}*/}
            </>
          </Box>

          <Box>
            <Divider />
            <Version />
            <Divider />
            <NavLink
              key="configuration"
              active={'/configuration' === pathname || undefined}
              label="Configuration"
              leftSection={<IconSettings size="1.2rem" stroke={1.5} />}
              onClick={(event) => {
                event.preventDefault();
                router.push('/configuration');
              }}
              variant="filled"
            />
            <NavLink
              key="watchdog"
              active={'/watchdog' === pathname || undefined}
              label="Watchdog"
              leftSection={<IconSettings size="1.2rem" stroke={1.5} />}
              onClick={(event) => {
                event.preventDefault();
                router.push('/watchdog');
              }}
              variant="filled"
            />

            <Divider />
            {/*<UserInfo />*/}
            <UserInfo2 />

            <Logout />
          </Box>
        </Stack>
      </ScrollArea>
    </>
  );
}
