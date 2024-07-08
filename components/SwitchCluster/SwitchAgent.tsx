import { useContext, useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';

import { IconAffiliate, IconChevronDown, IconSpy } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import classes from './SwitchCluster.module.css';
import { useAppState } from '@/contexts/AppStateContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';

export function SwitchAgent() {
  const pathname = usePathname();
  const appValues = useAppState();
  const [opened, setOpened] = useState(false);
  const isServerAvailable = useServerStatus();

  const items =
    appValues?.agents?.map((item: any, index: number) => (
      <Menu.Item
        leftSection={<IconSpy width={18} height={18} />}
        onClick={() => {
          // console.log(appValues.agents, index);
          if (appValues.agents != null) {
            appValues.setCurrentAgent(appValues.agents[index]);
            localStorage.setItem('agent', index.toString());
            // router.push(`${pathname}?_=${new Date().getTime()}-${appValues.currentBackend.name}`);
            window.location.reload();
          }
        }}
        key={index}
      >
        {item.name}
      </Menu.Item>
    )) || [];

    useEffect(()=>{

    }, [isServerAvailable])

  return (
    <>
      <Menu
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        radius="md"
        width="target"
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton
            className={classes.control}
            data-expanded={opened || undefined}
            w="100%"
            px={5}
            py={15}
          >
            <Group gap={3}>
              {/*<Image src={selected.image} width={22} height={22} />*/}
              <IconSpy size={40} />
              <div>
                <Text fz="sm" tt="uppercase" fw={700} truncate w="80%">
                  {appValues.currentAgent?.name}
                </Text>
                <Text size="xs" fw={700} truncate w="80%">
                  {appValues.currentAgent?.url}
                </Text>
              </div>
            </Group>
            <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </>
  );
}
