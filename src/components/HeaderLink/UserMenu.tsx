import { Menu, rem, Group, Switch, Avatar, Text, UnstyledButton } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconPasswordUser,
  IconLayoutSidebarRight,
  IconColumns1,
} from '@tabler/icons-react';

import { openModal } from '@mantine/modals';

import { forwardRef } from 'react';

import { UpdatePasswordForm } from '@/components/Navlink/UpdatePasswordForm';

import { useUserStatus } from '@/contexts/UserContext';
import { useUIStatus } from '@/contexts/UIContext';

import { useAuthLogout } from '@/hooks/user/useAuthLogout';

export default function UserMenu() {
  //const [projectsItems, setProjectItems] = useState<React.ReactNode[]>([])
  const uiValues = useUIStatus();

  const userValues = useUserStatus();

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
            AD
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
            <Group>
              <div>
                <Text fw={500} c="primary">{
                  `${userValues.user?.username}`
                }
                </Text>
                <Text size="xs" c="dimmed">
                  {userValues.user?.email}
                </Text>
              </div>
            </Group>
          </Menu.Label>
          <Menu.Divider />
          <Menu.Label>Settings</Menu.Label>

          <Menu.Item
            key="updatePassword"
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
