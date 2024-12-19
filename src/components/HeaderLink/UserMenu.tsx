import { Menu, rem, Group, Switch } from '@mantine/core';
import {
  IconSettings,
  IconLogout,
  IconPasswordUser,
  IconLayoutSidebarRight,
  IconColumns1,
} from '@tabler/icons-react';

import { useUserCtx } from '@/contexts/UserContext';

import { openModal } from '@mantine/modals';

import { forwardRef } from 'react';

import { Avatar, Text, UnstyledButton } from '@mantine/core';

import { UpdatePasswordForm } from './../Navlink/UpdatePasswordForm';
import { useAppState } from '@/contexts/AppStateContext';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  //const [projectsItems, setProjectItems] = useState<React.ReactNode[]>([])
  const appValues = useAppState();
  const userValues = useUserCtx();
  const router = useRouter();

  console.log(userValues);
  // const { logout } = useAuth()

  // const { fileUrl, getPublicFile } = usePublicFile()

  //const projects = userValues.projects;

  /*const findById = (obj, targetId) => {
        return Object.values(obj).find(
            item =>
                typeof item === 'object' &&
                item !== null &&
                'id' in item &&
                item.id === targetId,
        )
    }

    const handleDataUpdate = async (key) => {
        try {
            // Esegui la chiamata PUT
            await putData('/api/project/switch', `project_id=${key}`);
        
            // Questo codice verrà eseguito dopo il successo o l'errore della richiesta
            console.log('Richiesta completata, eseguo azioni finali...');
        } catch (error) {
            // In caso di errori durante la chiamata PUT
            console.error('Errore nella chiamata PUT:', error);
        } finally {
            // Azione finale indipendentemente dal successo o dall'errore
            console.log('Azione finale post-richiesta');
            userValues.setRefreshUser(userValues.refreshUser+1)
            console.log(userValues.refreshUser+1)
            //router.refresh()
        }
    };


    useEffect(() => {
        if (projects && Object.keys(projects).length>0) {
            const tmp = Object.keys(projects)
                .filter(key => projects[key].id !== userValues?.user.current_project_id)
                .map(key => (
                    <Menu.Item
                        key={projects[key].id}
                        leftSection={
                            <IconSettings
                                style={{ width: rem(14), height: rem(14) }}
                            />
                        }
                        onClick={() => handleDataUpdate(`${projects[key]?.id}`)}>
                        {projects[key]?.display_name}
                    </Menu.Item>
                ))
                setProjectItems(tmp)
        }
    }, [userValues.projects])*/

  /*useEffect(() => {
        getPublicFile(userValues.user.profile_photo_url)
    }, [])*/

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
          <Avatar color="var(--mantine-primary-color-filled)" radius="xl">AD</Avatar>
          {/*<IconUserCircle size={40} stroke={1.4} />*/}
          {/*<div>
                                <Text fw={500} c='primary'>{`${userValues.user.firstname} ${userValues.user.lastname}`}</Text>
                                <Text size="xs" c="dimmed">
                                {userValues.user.email}
                                </Text>
                            </div>*/}

          {/*<div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>*/}

          {/*<IconChevronRight size="1rem" />*/}
          {/*<Avatar size="md" src={fileUrl} radius="xl" />*/}
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
                  `${userValues.user?.username}` /*`${userValues.user?.firstname} ${userValues.user?.lastname}`*/
                }</Text>
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
            leftSection={<IconPasswordUser style={{ width: rem(14), height: rem(14) }} />}
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
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
            onClick={(event) => {
              event.preventDefault();
              appValues.toggleUIDrawer(appValues.openedUIDrawer);
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
              appValues.setShowDebugAside(!appValues.showDebugAside);
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
              <Switch checked={appValues.showDebugAside} />
            </Group>
          </Menu.Item>
          <Menu.Item
            onClick={(event) => {
              event.preventDefault(); // Impedisce altri comportamenti
              event.stopPropagation(); // Impedisce la propagazione
              appValues.setShowBottomDebugBar(!appValues.showBottomDebugBar);
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
              <Switch checked={appValues.showBottomDebugBar} />
            </Group>
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item
            key="profile"
            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
            onClick={(event) => {
              event.preventDefault();
              localStorage.removeItem('token');
              appValues.setAuthenticated(false);
              router.push('/');
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
