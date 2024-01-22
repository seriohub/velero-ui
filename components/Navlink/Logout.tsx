import { Avatar, NavLink } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import classes from '@/components/Layout/App/AppShell.Navbar.module.css';

export const Logout = () => {
  const router = useRouter();

  return (
    <NavLink
      className={classes.link}
      key="logout"
      label="Logout"
      leftSection={
        <Avatar color="blue" radius="md">
          <IconLogout size="1.5rem" />
        </Avatar>
      }
      onClick={(event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        router.push('/');
      }}
      variant="filled"
    />
  );
};
