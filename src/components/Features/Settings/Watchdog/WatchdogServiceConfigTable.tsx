import { useState } from 'react';
import { IconPlus, IconSend, IconTrashX } from '@tabler/icons-react';
import { Group, TextInput, Table, Space, ActionIcon, Tooltip, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { useWatchdogTestService } from '@/api/Watchdog/useWatchdogTestService';
import { useWatchdogDeleteService } from '@/api/Watchdog/useWatchdogDeleteService';
import { useWatchdogAddService } from '@/api/Watchdog/useWatchdogAddService';

import { MaskedService } from '@/components/Features/Settings/Watchdog/Display/MaskedService';

interface WatchdogServiceConfigTableProps {
  services: any;
  setServices: any;
}

export default function WatchdogServiceConfigTable({
  services,
  setServices,
}: WatchdogServiceConfigTableProps) {
  const [value, setValue] = useState<string>('');
  const { watchdogDeleteService } = useWatchdogDeleteService();
  const { watchdogAddService } = useWatchdogAddService();

  const openModal = (element: string) =>
    modals.openConfirmModal({
      title: 'Please confirm your action',
      children: <Text size="sm">Delete {element.substring(0, element.indexOf(':'))} service?</Text>,

      labels: {
        confirm: 'Delete service',
        cancel: "No don't delete it",
      },
      confirmProps: { color: 'red' },

      onCancel: () => {},
      onConfirm: () => handleRemoveRow(element),
    });

  const handleRemoveRow = (element: string) => {
    watchdogDeleteService({ name: element }).then(() => {
      setServices((current: any) => current.filter((item: any) => item !== element));
    });
  };
  const { watchdogTestService } = useWatchdogTestService();

  const rows = services.map((element: any) => (
    <Table.Tr key={btoa(element)}>
      <Table.Td>
        <MaskedService service={element} />
      </Table.Td>
      <Table.Td>
        <Group gap={10}>
          <Tooltip label="Test Service">
            <ActionIcon
              size="sm"
              variant="outline"
              onClick={() => watchdogTestService({ config: element })}
            >
              <IconSend />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete Service">
            <ActionIcon size="sm" variant="outline" onClick={() => openModal(element)}>
              <IconTrashX color="red" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group mt={30}>
        <TextInput
          w="calc(100% - 100px)"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="value"
        />
        <Tooltip label="Test Service">
          <ActionIcon
            variant="outline"
            w={32}
            size={32}
            onClick={() => watchdogTestService({ config: value })}
          >
            <IconSend size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Add Service">
          <ActionIcon
            w={32}
            size={32}
            variant="outline"
            onClick={() => {
              watchdogAddService({ config: value }).then(() => {
                setServices((current: any) => [...current, value]);
                setValue('');
              });
            }}
          >
            <IconPlus size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Space my={10} />
      {services.length > 0 && (
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w="calc(100% - 100px)">Configuration</Table.Th>
              <Table.Th w={80}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </>
  );
}
