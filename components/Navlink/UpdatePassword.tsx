import { useEffect } from 'react';

import { NavLink } from '@mantine/core';

import { IconPassword } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { UpdatePasswordForm } from './UpdatePasswordForm';

export const UpdatePassword = () => {
  const { data, getData } = useApiGet();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 605 has been called`, `color: green; font-weight: bold;`)
    getData({ url: '/v1/users/me/info', target: 'static' });
  }, []);

  if (data === undefined) return <></>;

  return (
    <NavLink
      key="change password"
      label="Change Password"
      leftSection={<IconPassword size="1.2rem" stroke={1.5} />}
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
