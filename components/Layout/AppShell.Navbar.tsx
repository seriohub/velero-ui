import { useState } from 'react';

import { Group, Code, Box, Stack, NavLink } from '@mantine/core';
import {
  IconDashboard,
  IconRestore,
  IconDeviceFloppy,
  IconCalendarEvent,
  IconDatabase,
} from '@tabler/icons-react';

import { useRouter, usePathname } from 'next/navigation';

import { Logo } from '../Logo';
import { Version } from '../Version';
import classes from './AppShell.Navbar.module.css';

const data = [
  { link: '/', label: 'Dashboard', icon: IconDashboard },
  { link: '/backups', label: 'Backups', icon: IconDeviceFloppy },
  { link: '/restores', label: 'Restores', icon: IconRestore },
  { link: '/schedules', label: 'Schedules', icon: IconCalendarEvent },
  { link: '/storage', label: 'Storage', icon: IconDatabase },
];

export function AppShellNavbar() {
  const [active, setActive] = useState('Dashboard');

  const router = useRouter();
  const pathname = usePathname();

  const links = data.map((item: any, index: number) => (
    <NavLink
      key={item.label}
      active={item.link === pathname || undefined}
      label={item.label}
      leftSection={<item.icon stroke={1.5} />}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
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
            {links}
          </div>
          <div className={classes.footer}>
            <Version />
          </div>
        </nav>
      </Stack>
    </>
  );
}
