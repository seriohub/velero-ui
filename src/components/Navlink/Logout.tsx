import { useAppState } from '@/contexts/AppStateContext';
import { NavLink } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const Logout = () => {
  const appValues = useAppState();
  const router = useRouter();

  return (
    <NavLink
      key="logout"
      label="Logout"
      leftSection={<IconLogout size="1.4rem" stroke={1.5} />}
      onClick={(event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        appValues.setAuthenticated(false);
        router.push('/');
      }}
      //variant="filled"
    />
  );
};
