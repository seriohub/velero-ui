import {
  Group,
  Stack,
  NavLink,
  Divider,
  Avatar,
  Burger,
  ScrollArea,
  Box,
  Text,
  Space,
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
} from '@tabler/icons-react';
import { env } from 'next-runtime-env';
import { useRouter, usePathname } from 'next/navigation';

import { Logo } from '../../Logo';
import { Version } from '@/components/Navlink/Version';
//import classes from './AppShell.Navbar.module.css';
import { UserInfo } from '@/components/Navlink/UserInfo';
import { UpdatePassword } from '@/components/Navlink/UpdatePassword';
import { Logout } from '@/components/Navlink/Logout';
import { ClusterInfo } from '@/components/ClusterInfo';
import { SwitchCluster } from '@/components/SwitchCluster/SwitchCluster';
import { SwitchCluster2 } from '@/components/SwitchCluster/SwitchCluster2';
import { UserInfo2 } from '@/components/Navlink/UserInfo2';
import { useContext } from 'react';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
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

const settings = [{ link: '/environments', label: 'Environments', icon: IconServer }];

const home = [{ link: '/home', label: 'Home', icon: IconHome }];

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
}
const generateNavLinks = (data: NavItem[], pathname: string, router: any, toggle: () => void) => {
  return data.map((item: NavItem) => (
    <NavLink
      // className={classes.link}
      key={item.label}
      active={item.link === pathname || undefined}
      label={item.label}
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
  const appValues = useContext(VeleroAppContexts);
  const router = useRouter();
  const pathname = usePathname();

  const isCore = appValues.state.isCore;

  const links = generateNavLinks(data, pathname, router, toggle);
  const homeLink = generateNavLinks(home, pathname, router, toggle);
  const settingsLinks = generateNavLinks(settings, pathname, router, toggle);

  return (
    <>
      <ScrollArea p={0} style={{ height: '100vh', w: '100vw' }} maw="100vw" scrollbars="y">
        <Stack justify="space-between" style={{ height: '100vh' }}>
          <Box p={0}>
            <>
              <Group justify="space-between">
                <Logo />
                <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
              </Group>
              {isCore && (
                <Box p={5} mt={5} mb={5}>
                  {homeLink}
                </Box>
              )}
              {/*<Divider />*/}
              {/*<SwitchCluster2 />*/}
              {isCore && (
                <Box p={5} mt={5} mb={5}>
                  <>
                    {/*<SwitchCluster />*/}
                    <SwitchAgent />
                  </>
                </Box>
              )}

              {links}

              <Space h={20} />
              {isCore && (
                <>
                  <Text ml="12" size="sm">
                    Settings
                  </Text>
                  {settingsLinks}
                </>
              )}
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
