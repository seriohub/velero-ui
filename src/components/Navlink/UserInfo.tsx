import { useEffect } from 'react';

import { NavLink, useComputedColorScheme } from '@mantine/core';

import { IconUserCircle } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Group, Avatar, Text, UnstyledButton } from '@mantine/core';

import { UpdatePassword } from './UpdatePassword';
import { useUserInfo } from '@/api/User/useUserInfo';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  isAdmin: boolean;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, isAdmin, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      variant="filled"
      ref={ref}
      style={{
        width: '100%',
        padding: '5px',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />
        {/*<IconUserCircle size={46} stroke={1} />*/}

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {isAdmin ? 'ADMIN' : ''}
          </Text>
        </div>

        {icon || <IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);

export const UserInfo = () => {
  const { data, getUserInfo } = useUserInfo();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 620 has been called`, `color: green; font-weight: bold;`);
    getUserInfo();
  }, []);
  // console.log(data);
  if (data === undefined) return <></>;

  return (
    <NavLink
      //href="#required-for-focus"
      label={data.username}
      leftSection={<IconUserCircle size="1.4rem" stroke={1.5} />}
      rightSection={<IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />}
      variant="filled"
      //active
    >
      <UpdatePassword />
    </NavLink>
  );
};
