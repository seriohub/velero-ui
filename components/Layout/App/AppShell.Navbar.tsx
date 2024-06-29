import { Group, Stack, NavLink, Divider, Avatar, Burger, ScrollArea, Box } from '@mantine/core';
import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
  IconLink,
  IconSettings,
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

export function AppShellNavbar({ opened, toggle }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const WorkaroundClustersSwitch =
    env('NEXT_PUBLIC_WORKAROUND_CLUSTERS_SWITCH')?.toLowerCase() === 'true' ? true : false;

  const links = data.map((item: any) => (
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

              <Divider />

              {links}
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
