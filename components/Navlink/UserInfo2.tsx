import { useEffect } from 'react';

import { NavLink, rem, useComputedColorScheme } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';
import { IconPassword, IconUserCircle } from '@tabler/icons-react';
import { forwardRef } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { Group, Avatar, Text, Menu, UnstyledButton } from '@mantine/core';
import { IconActivity } from '@tabler/icons-react';
import { UpdatePassword } from './UpdatePassword';

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
        width: "100%",
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

export const UserInfo2 = () => {
  const { data, getData } = useApiGet();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    getData('/v1/users/me/info');
  }, []);
  // console.log(data);
  if (data === undefined) return <></>;

  return (
    <>
      {/*<Group wrap="nowrap" px={5} mt={25} mb={10} gap={6}>
        <Avatar size={46}>
          <IconUserCircle size={46} stroke={1} />
        </Avatar>
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {data.is_admin ? 'ADMIN' : ''}
          </Text>

          <Text fz="lg" fw={500}>
            {data.username}
          </Text>
        </div>
      </Group>*/}

<NavLink
        //href="#required-for-focus"
        label={data.username}
        leftSection={<IconUserCircle size="1.2rem" stroke={1.5} />}
        rightSection={
          <IconChevronRight size="0.8rem" stroke={1.5} className="mantine-rotate-rtl" />
        }
        variant="filled"
        //active
        
        >
          <UpdatePassword />
          </NavLink>
      
      {/*<Menu position="right-end">
        <Menu.Target>
          <UserButton
            image=""
            name={data.username}
            email=""
            isAdmin={data.is_admin ? true : false}
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconPassword style={{ width: rem(14), height: rem(14) }} />}>
            Change Password
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>*/}
    </>
  );
};
