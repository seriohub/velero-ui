import { Avatar, NavLink } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
// import classes from '@/components/Layout/App/AppShell.Navbar.module.css';

export const Logout = () => {
  const router = useRouter();

  return (
    <NavLink
      //className={classes.link}
      key="logout"
      label="Logout"
      leftSection={<IconLogout size="1.2rem" stroke={1.5} />}
      onClick={(event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        router.push('/');
      }}
      variant="filled"
    />
  );
};
