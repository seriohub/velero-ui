import { Group, Code, Stack, NavLink, Divider, Avatar } from '@mantine/core';
import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { Logo } from '../../Logo';
import { Version } from '@/components/Navlink/Version';
import classes from './AppShell.Navbar.module.css';
import { UserInfo } from '@/components/Navlink/UserInfo';
import { UpdatePassword } from '@/components/Navlink/UpdatePassword';
import { Logout } from '@/components/Navlink/Logout';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/backups', label: 'Backups', icon: IconDeviceFloppy },
  { link: '/restores', label: 'Restores', icon: IconRestore },
  { link: '/schedules', label: 'Schedules', icon: IconCalendarEvent },
  { link: '/storage', label: 'Storage', icon: IconDatabase },
];

export function AppShellNavbar() {
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
      }}
      variant="filled"
    />
  ));

  return (
    <>
      <Stack justify="space-between" style={{ height: '100%' }}>
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Group className={classes.header} justify="space-between">
              <Logo />
              <Code fw={700}>develop</Code>
            </Group>
            <Divider />
            <UserInfo />
            {links}
          </div>
          <div className={classes.footer}>
            <Version />
            <Divider />
            <UpdatePassword />
            <Logout />
          </div>
        </nav>
      </Stack>
    </>
  );
}
