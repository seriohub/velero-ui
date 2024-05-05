import { useEffect } from 'react';

import { NavLink } from '@mantine/core';

import { IconPassword } from '@tabler/icons-react';
import { openModal } from '@mantine/modals';

import { useApiGet } from '@/hooks/useApiGet';
import { UpdatePasswordForm } from './UpdatePasswordForm';

export const UpdatePassword = () => {
  const { data, getData } = useApiGet();

  useEffect(() => {
    getData('/v1/users/me/info');
  }, []);

  if (data === undefined) return <></>;

  return (
    <NavLink
      key="logout"
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
