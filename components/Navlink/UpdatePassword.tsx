import { useEffect } from 'react';

import { Avatar, NavLink } from '@mantine/core';

import { IconPassword } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { UpdatePasswordForm } from './UpdatePasswordForm';

import classes from '@/components/Layout/App/AppShell.Navbar.module.css';

export const UpdatePassword = () => {
  const { data, getData } = useApiGet();

  useEffect(() => {
    getData('/api/v1/users/me/info');
  }, []);

  if (data === undefined) return <></>;

  return (
    <NavLink
      className={classes.link}
      key="logout"
      label="Change Password"
      leftSection={
        <Avatar color="blue" radius="md">
          <IconPassword size="1.5rem" />
        </Avatar>
      }
      onClick={(event) => {
        event.preventDefault();
        openModal({
          title: 'Change Password',
          children: <UpdatePasswordForm />,
        });
      }}
      variant="filled"
    />
  );
};
