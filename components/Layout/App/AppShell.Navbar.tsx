import { Group, Stack, NavLink, Divider, Avatar, Burger, ScrollArea } from '@mantine/core';
import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
  IconLink,
  IconSettings,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { Logo } from '../../Logo';
import { Version } from '@/components/Navlink/Version';
import classes from './AppShell.Navbar.module.css';
import { UserInfo } from '@/components/Navlink/UserInfo';
import { UpdatePassword } from '@/components/Navlink/UpdatePassword';
import { Logout } from '@/components/Navlink/Logout';
import path from 'path';

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

  const links = data.map((item: any) => (
    <NavLink
      className={classes.link}
      key={item.label}
      active={item.link === pathname || undefined}
      label={item.label}
      leftSection={
        <Avatar color="blue" radius="md">
          <item.icon size="1.5rem" />
        </Avatar>
      }
      onClick={(event) => {
        event.preventDefault();
        router.push(item.link);
        toggle();
      }}
      variant="filled"
    />
  ));
  console.log(pathname)

  return (
    <>
    <ScrollArea p={0} style={{ height: '100hv', w:'100vw' }} maw="100vw" scrollbars="y">
      <Stack justify="space-between" style={{ height: '100vh' }} p={0}>
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Group className={classes.header} justify="space-between">
              <Logo />
              <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
            </Group>
            <UserInfo />
            
            {links}
            
          </div>
          <Version />
          <div className={classes.footer}>
            <NavLink
              className={classes.link}
              key="configuration"
              active={'/configuration' === pathname || undefined}
              label="Configuration"
              leftSection={
                <Avatar color="blue" radius="md">
                  <IconSettings size="1.5rem" />
                </Avatar>
              }
              onClick={(event) => {
                event.preventDefault();
                router.push('/configuration');
              }}
              variant="filled"
            />
            <NavLink
              className={classes.link}
              key="watchdog"
              active={'/watchdog' === pathname || undefined}
              label="Watchdog"
              leftSection={
                <Avatar color="blue" radius="md">
                  <IconSettings size="1.5rem" />
                </Avatar>
              }
              onClick={(event) => {
                event.preventDefault();
                router.push('/watchdog');
              }}
              variant="filled"
            />
            <UpdatePassword />
            <Logout />
          </div>
        </nav>
      </Stack>
      </ScrollArea>
    </>
  );
}
