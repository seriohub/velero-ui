import { useContext, useEffect, useState } from 'react';
import { UnstyledButton, Menu, Group, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconServer } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { revalidatePath } from 'next/cache'
import classes from './SwitchCluster.module.css';
import VeleroAppContexts from '@/contexts/VeleroAppContexts';

export function SwitchCluster2() {
  const pathname = usePathname();
  const appValues = useContext(VeleroAppContexts);
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  //const [selected, setSelected] = useState(data[0]);
  const items = appValues.state?.apiBackends?.map((item: any, index: number) => (
    <Menu.Item
      leftSection={<IconServer width={18} height={18} />}
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
    router.push(`${pathname}?_=${new Date().getTime()}-${appValues.state.currentBackend.name}`);
  }, [appValues.state.currentBackend]);

  return (
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
            <IconServer size={40} color="green" />
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
  );
}
