import { useEffect } from 'react';

import { NavLink } from '@mantine/core';

import { IconPassword } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';

import { UpdatePasswordForm } from './UpdatePasswordForm';
import { useUserInfo } from '@/api/User/useUserInfo';

export const UpdatePassword = () => {
  const { data, getUserInfo } = useUserInfo();

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 605 has been called`, `color: green; font-weight: bold;`);
    getUserInfo();
  }, []);

  if (data === undefined) return <></>;

  return (
    <NavLink
      key="change password"
      label="Change Password"
      leftSection={<IconPassword size="1.4rem" stroke={1.5} />}
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
