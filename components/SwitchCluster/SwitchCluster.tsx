'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Combobox, useCombobox, InputBase, Group, Avatar, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/contexts/AppStateContext';
import { IconServer } from '@tabler/icons-react';
import { ClusterInfo } from '../ClusterInfo';

export function SwitchCluster() {
  const pathname = usePathname();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const appValues = useAppState();

  {
    /*<Combobox.Option value={index.toString()} key={index}>
      {item.name}
    </Combobox.Option>*/
  }
  const options = appValues?.servers?.map((item: any, index: number) => (
    <Combobox.Option
      value={index.toString()}
      key={index} /*active={index === Number(localStorage.getItem('cluster'))}*/
    >
      <Group gap="xs">
        <IconServer size={20} />
        <span>{item.name}</span>
      </Group>
    </Combobox.Option>
  ));

  const router = useRouter();
  useEffect(() => {
    // router.push(`${pathname}?id=${new Date().getTime()}`)
    router.push(`${pathname}?_=${new Date().getTime()}-${appValues?.currentServer?.name}`);
  }, [appValues.currentServer?.name]);

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        appValues.setCurrentBackend(appValues.servers[val]);
        localStorage.setItem('cluster', val);
        combobox.closeDropdown();
        //window.location.reload();
      }}
    >
      <Combobox.Target>
        <InputBase
          label="Cluster"
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          <Group wrap="nowrap" gap={0}>
            <Avatar size={46}>
              <IconServer size={46} stroke={1} />
            </Avatar>
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                {appValues.currentServer.name}
              </Text>
              <Text size="xs" fw={700}>
                {appValues.currentServer.url}
              </Text>
            </div>
          </Group>
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
