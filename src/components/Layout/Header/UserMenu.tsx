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
import { UpdatePasswordForm } from '@/components/Features/Auth/UpdatePasswordForm';

import { useUserStatus } from '@/contexts/UserContext';
import { useUIStatus } from '@/contexts/UIContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import { useAuthLogout } from '@/hooks/user/useAuthLogout';
import { useServerStatus } from '@/contexts/ServerContext';
import { useAppStatus } from "@/contexts/AppContext";

export default function UserMenu() {
  const NEXT_PUBLIC_AUTH_ENABLED = env('NEXT_PUBLIC_AUTH_ENABLED')?.toLowerCase() !== 'false';
  const uiValues = useUIStatus();
  const appValues = useAppStatus();
  const userValues = useUserStatus();
  const agentValues = useAgentStatus();
  const serverValues = useServerStatus();

  const { logout } = useAuthLogout();

  interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }

  const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({
       image,
       name,
       email,
       icon,
       ...others
     }: UserButtonProps, ref) => (
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
            <IconUser/>
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
              {NEXT_PUBLIC_AUTH_ENABLED && serverValues.isCurrentServerControlPlane && appValues.appInfo?.auth_type === 'LDAP' && (
                <Group justify="flex-end">
                  <Badge p={2} color="var(--mantine-primary-color-filled)" radius="xs">
                    LDAP
                  </Badge>
                </Group>
              )}
              {NEXT_PUBLIC_AUTH_ENABLED && !serverValues.isCurrentServerControlPlane && appValues.appInfo?.auth_type === 'LDAP' && (
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
          <Menu.Divider/>
          <Menu.Label>Settings</Menu.Label>

          <Menu.Item
            key="updatePassword"
            disabled={
              appValues?.appInfo?.auth_enabled === 'False' ||
              appValues?.appInfo?.auth_type !== 'BUILT-IN'
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
                children: <UpdatePasswordForm/>,
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

          <Menu.Divider/>

          <Menu.Label>Debug</Menu.Label>
          <Menu.Item
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
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
              <Switch checked={uiValues.showDebugAside}/>
            </Group>
          </Menu.Item>
          {process.env.NODE_ENV === 'development' && (
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
                <Switch checked={uiValues.showBottomDebugBar}/>
              </Group>
            </Menu.Item>
          )}
          <Menu.Divider/>

          <Menu.Item
            disabled={!NEXT_PUBLIC_AUTH_ENABLED}
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
