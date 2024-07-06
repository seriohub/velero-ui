import { useContext, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';

import { IconAffiliate, IconChevronDown, IconSpy } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import classes from './SwitchCluster.module.css';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export function SwitchAgent() {
  const pathname = usePathname();
  const appValues = useContext(VeleroAppContexts);
  const [opened, setOpened] = useState(false);

  const items =
    appValues?.state?.agents?.map((item: any, index: number) => (
      <Menu.Item
        leftSection={<IconSpy width={18} height={18} />}
        onClick={() => {
          // console.log(appValues.state.agents, index);
          appValues.setCurrentAgent(appValues.state.agents[index]);
          localStorage.setItem('agent', index.toString());
          // router.push(`${pathname}?_=${new Date().getTime()}-${appValues.state.currentBackend.name}`);
          window.location.reload();
        }}
        key={index}
      >
        {item.name}
      </Menu.Item>
    )) || [];

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
                  {appValues.state.currentAgent?.name}
                </Text>
                <Text size="xs" fw={700} truncate w="80%">
                  {appValues.state.currentAgent?.url}
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
