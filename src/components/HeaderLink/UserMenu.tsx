import { Menu, rem, Group, Switch, Avatar, Text, UnstyledButton, Badge } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconPasswordUser,
  IconLayoutSidebarRight,
  IconColumns1,
  IconUser,
} from '@tabler/icons-react';

import { openModal } from '@mantine/modals';

import { forwardRef } from 'react';

import { env } from 'next-runtime-env';
import { UpdatePasswordForm } from '@/components/Navlink/UpdatePasswordForm';

import { useUserStatus } from '@/contexts/UserContext';
import { useUIStatus } from '@/contexts/UIContext';

import { useAuthLogout } from '@/hooks/user/useAuthLogout';
import { useAgentStatus } from '@/contexts/AgentContext';

export default function UserMenu() {
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';
  const uiValues = useUIStatus();

  const userValues = useUserStatus();
  const agentValues = useAgentStatus();

  const { logout } = useAuthLogout();

  interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }

  const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
      <UnstyledButton
        ref={ref}
        style={{
          // padding: 'var(--mantine-spacing-md)',
          color: 'var(--mantine-color-text)',
          borderRadius: 'var(--mantine-radius-sm)',
        }}
        {...others}
      >
        <Group>
          <Avatar color="var(--mantine-primary-color-filled)" radius="xl">
            <IconUser />
          </Avatar>
        </Group>
      </UnstyledButton>
    )
  );

  return (
    <>
      <Menu
        shadow="md"
        width={240}
        position="bottom-end"
        /*trigger="hover"*/ transitionProps={{ exitDuration: 0 }}
        withinPortal
      >
        <Menu.Target>
          <UserButton
            image={userValues?.user?.profile_photo_url}
            name={userValues?.user?.display_name}
            email={userValues?.user?.email}
          />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Group grow>
              <Text fw={500} c="primary">
                {`${userValues.user?.username}`}
              </Text>
              {NEXT_PUBLIC_AUTH_ENABLED && agentValues.agentInfo?.auth_type === 'LDAP' && (
                <Group justify="flex-end">
                  <Badge p={2} color="var(--mantine-primary-color-filled)" radius="xs">
                    LDAP
                  </Badge>
                </Group>
              )}
            </Group>
            <Text size="xs" c="dimmed">
              {userValues.user?.email}
            </Text>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Label>Settings</Menu.Label>

          <Menu.Item
            key="updatePassword"
            disabled={
              agentValues?.agentInfo?.auth_enabled === 'False' ||
              agentValues?.agentInfo?.auth_type !== 'BUILT-IN'
            }
            leftSection={
              <IconPasswordUser
                style={{
                  width: rem(14),
                  height: rem(14),
                }}
              />
            }
            onClick={(event) => {
              event.preventDefault();
              openModal({
                title: 'Change Password',
                children: <UpdatePasswordForm />,
              });
            }}
          >
            Update Password
          </Menu.Item>

          <Menu.Item
            key="uiconfig"
            leftSection={
              <IconSettings
                style={{
                  width: rem(14),
                  height: rem(14),
                }}
              />
            }
            onClick={(event) => {
              event.preventDefault();
              uiValues.toggleUIDrawer(uiValues.openedUIDrawer);
            }}
          >
            UI Config
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Debug</Menu.Label>
          <Menu.Item
            onClick={(event) => {
              event.preventDefault(); // Impedisce altri comportamenti
              event.stopPropagation(); // Impedisce la propagazione
              uiValues.setShowDebugAside(!uiValues.showDebugAside);
            }}
            closeMenuOnClick={false}
            leftSection={
              <IconLayoutSidebarRight
                style={{
                  width: rem(14),
                  height: rem(14),
                }}
              />
            }
          >
            <Group w="100%" justify="space-between">
              Context Debug
              <Switch checked={uiValues.showDebugAside} />
            </Group>
          </Menu.Item>
          <Menu.Item
            onClick={(event) => {
              event.preventDefault(); // Impedisce altri comportamenti
              event.stopPropagation(); // Impedisce la propagazione
              uiValues.setShowBottomDebugBar(!uiValues.showBottomDebugBar);
            }}
            closeMenuOnClick={false}
            leftSection={
              <IconColumns1
                style={{
                  width: rem(14),
                  height: rem(14),
                }}
              />
            }
          >
            <Group w="100%" justify="space-between">
              Debug Bar
              <Switch checked={uiValues.showBottomDebugBar} />
            </Group>
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            disabled={agentValues?.agentInfo?.auth_enabled === 'False'}
            key="profile"
            leftSection={
              <IconLogout
                style={{
                  width: rem(14),
                  height: rem(14),
                }}
              />
            }
            onClick={(event) => {
              event.preventDefault();
              logout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
