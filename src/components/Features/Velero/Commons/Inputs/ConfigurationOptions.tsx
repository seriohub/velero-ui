import { useState } from 'react';
import { IconPlus, IconTrashX } from '@tabler/icons-react';
import { Group, TextInput, Text, Table, Space, ActionIcon, Tooltip, Box } from '@mantine/core';

import { ConfigurationOptionsField } from '@/components/Features/Velero/Commons/Inputs/ConfigurationOptionsField';

interface BslConfigurationTableProps {
  config: any;
  setConfig: any;
}

export default function ConfigurationOptions({ config, setConfig }: BslConfigurationTableProps) {
  const [key1, setKey1] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [search, setSearch] = useState('');

  const handleRemoveRow = (keyToRemove: string) => {
    setConfig((current: any) => current.filter((item: any) => item.key !== keyToRemove));
  };

  const rows = config.map((element: any) => (
    <Table.Tr key={element.key}>
      <Table.Td>{element.key}</Table.Td>
      <Table.Td>{element.value}</Table.Td>
      <Table.Td>
        <Tooltip label="Delete">
          <ActionIcon size="sm" variant="outline" onClick={() => handleRemoveRow(element.key)}>
            <IconTrashX color="red" />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Text size="sm" fw={700}>
        Add key/value
      </Text>
      <Group>
        <Box w={320}>
          <ConfigurationOptionsField
            setKey={setKey1}
            key1={key1}
            search={search}
            setSearch={setSearch}
          />
        </Box>

        <TextInput
          w={320}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          placeholder="value"
        />

        <ActionIcon
          w={32}
          size={32}
          variant="outline"
          onClick={() => {
            setConfig((current: any) => [
              ...current,
              {
                key: key1,
                value,
              },
            ]);
            setKey1('');
            setSearch('');
            setValue('');
          }}
        >
          <IconPlus size={18} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Space my={10} />
      {config.length > 0 && (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={300}>Key</Table.Th>
              <Table.Th w={300}>Value</Table.Th>
              <Table.Th w={50}>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </>
  );
}
