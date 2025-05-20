import { useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';

import {
  IconAffiliate,
  IconChevronDown,
  IconLoader,
  IconPlugConnectedX,
  IconServer,
  IconSpy,
} from '@tabler/icons-react';

import { useServerStatus } from '@/contexts/ServerContext';
import classes from './SwitchCluster.module.css';

export function SwitchCluster() {
  const serverValues = useServerStatus();

  const [opened, setOpened] = useState(false);
  const [icon, setIcon] = useState(<IconLoader size={40}/>);

  //const [selected, setSelected] = useState(data[0]);
  const items = serverValues?.servers?.map((item: any, index: number) => (
    <Menu.Item
      leftSection={<IconAffiliate width={18} height={18}/>}
      onClick={() => {
        serverValues.setCurrentServerAsControlPlane(undefined);

        serverValues.setCurrentBackend(serverValues.servers[index]);
        localStorage.setItem('cluster', index.toString());

        window.location.reload();
      }}
      key={index}
    >
      {item.name}
    </Menu.Item>
  ));

  useEffect(() => {
    if (serverValues.isCurrentServerControlPlane === undefined) {
      setIcon(<IconPlugConnectedX size={40} color="red"/>);
    } else if (serverValues.isCurrentServerControlPlane) {
      setIcon(<IconServer size={40} color="#40c057"/>);
    } else if (!serverValues.isCurrentServerControlPlane) {
      setIcon(<IconSpy size={40} color="#40c057"/>);
    }
  }, [serverValues.isCurrentServerControlPlane]);

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
            <Group gap="xs">
              {icon}
              <div>
                <Text fz="sm" tt="uppercase" fw={700} truncate w="100%">
                  {serverValues?.currentServer?.name}
                </Text>
                <Text size="xs" fw={700} truncate w="100%">
                  {serverValues?.currentServer?.url}
                </Text>
              </div>
            </Group>
            <IconChevronDown size="1rem" className={classes.icon} stroke={1.5}/>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </>
  );
}
