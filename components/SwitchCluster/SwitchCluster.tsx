import { useContext, useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  IconAffiliate,
  IconChevronDown,
  IconLoader,
  IconPlugConnectedX,
  IconServer,
  IconSpy,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import classes from './SwitchCluster.module.css';

import { useServerStatus } from '@/contexts/ServerStatusContext';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

export function SwitchCluster() {
  const pathname = usePathname();
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();
  const [opened, setOpened] = useState(false);
  const [icon, setIcon] = useState(<IconLoader size={40} />);
  const router = useRouter();
  //const [selected, setSelected] = useState(data[0]);
  const items = serverValues?.servers?.map((item: any, index: number) => (
    <Menu.Item
      leftSection={<IconAffiliate width={18} height={18} />}
      onClick={() => {
        serverValues.setCurrentServerAsControlPlane(undefined);
        serverValues.setIsServerAvailable(undefined);
        agentValues.setIsAgentAvailable(undefined);
        serverValues.setCurrentBackend(serverValues.servers[index]);

        localStorage.setItem('cluster', index.toString());
        // router.push(`${pathname}?_=${new Date().getTime()}-${appValues.currentBackend.name}`);
        window.location.reload();
      }}
      key={index}
    >
      {item.name}
    </Menu.Item>
  ));

  /*useEffect(() => {
    //router.push(`${pathname}?c=${new Date().getTime()}-${appValues.currentBackend.name}`);
    router.push(`${pathname}`); //?_=${new Date().getTime()}-${appValues.currentBackend.name}`);
  }, [serverValues.currentServer]);*/

  /*const { data, getData } = useApiGet();
  useEffect(() => {
    getData('/online');
  }, []);*/

  /*useEffect(()=>{

  }, [serverValues.isServerAvailable])*/

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 852 has been called`, `color: green; font-weight: bold;`)
    if (serverValues.isCurrentServerControlPlane == undefined)
      setIcon(<IconPlugConnectedX size={40} color="red" />);
    else if (serverValues.isCurrentServerControlPlane)
      setIcon(<IconServer size={40} color="lime" />);
    else if (!serverValues.isCurrentServerControlPlane) setIcon(<IconSpy size={40} color="lime" />);
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
              {/*<Image src={selected.image} width={22} height={22} />*/}
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
            <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
    </>
  );
}
