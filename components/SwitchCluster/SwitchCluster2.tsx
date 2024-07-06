import { useContext, useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
  IconAffiliate,
  IconChevronDown,
  IconGhost,
  IconLoader,
  IconPlugConnectedX,
  IconServer,
  IconSpy,
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import classes from './SwitchCluster.module.css';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';
import { useApiGet } from '@/hooks/useApiGet';

export function SwitchCluster2() {
  const pathname = usePathname();
  const appValues = useContext(VeleroAppContexts);
  const [opened, setOpened] = useState(false);
  const [icon, setIcon] = useState(<IconLoader size={40} />);
  const router = useRouter();
  //const [selected, setSelected] = useState(data[0]);
  const items = appValues.state?.apiBackends?.map((item: any, index: number) => (
    <Menu.Item
      leftSection={<IconAffiliate width={18} height={18} />}
      onClick={() => {
        appValues.setCurrentBackend(appValues.state.apiBackends[index]);
        localStorage.setItem('cluster', index.toString());
        // router.push(`${pathname}?_=${new Date().getTime()}-${appValues.state.currentBackend.name}`);
        window.location.reload();
      }}
      key={index}
    >
      {item.name}
    </Menu.Item>
  ));

  useEffect(() => {
    //router.push(`${pathname}?c=${new Date().getTime()}-${appValues.state.currentBackend.name}`);
    router.push(`${pathname}`); //?_=${new Date().getTime()}-${appValues.state.currentBackend.name}`);
  }, [appValues.state.currentBackend]);

  /*const { data, getData } = useApiGet();
  useEffect(() => {
    getData('/online');
  }, []);*/
  useEffect(() => {
    if (appValues.state.isCore == undefined) setIcon(<IconPlugConnectedX size={40} color="lime" />);
    else if (appValues.state.isCore) setIcon(<IconServer size={40} color="lime" />);
    else if (!appValues.state.isCore) setIcon(<IconSpy size={40} color="lime" />);
  }, [appValues.state.isCore]);

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
                  {appValues.state.currentBackend.name}
                </Text>
                <Text size="xs" fw={700} truncate w="100%">
                  {appValues.state.currentBackend.url}
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
