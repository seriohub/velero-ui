import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import {
  TextInput,
  Text,
  Table,
  Space,
  ActionIcon,
  Input,
  Flex,
  Button,
  Card,
} from '@mantine/core';

interface ConfigurationOptionsProps {
  label: string;
  config: any;
  setConfig: any;
  labelKey?: string;
  labelValue?: string;
  description?: string;
}

export default function ConfigurationOptions({
  label = '',
  config,
  setConfig,
  labelKey = 'key',
  labelValue = 'value',
  description = '',
}: ConfigurationOptionsProps) {
  const [key_, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const handleRemoveRow = (keyToRemove: string) => {
    setConfig((current: any) => {
      // Creiamo una copia dell'oggetto senza la chiave da rimuovere
      const updatedConfig = { ...current };
      delete updatedConfig[keyToRemove];
      return updatedConfig;
    });
  };

  const rows = Object.keys(config).map((key) => {
    return (
      <Table.Tr key={key}>
        <Table.Td>
          <Text size="sm">{key}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{config[key]}</Text>
        </Table.Td>
        <Table.Td>
          <Button size="compact-xs" color="red" onClick={() => handleRemoveRow(key)}>
            Remove
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card p={10} withBorder bg="transparent">
      <Input.Wrapper label={label} description={description}>
        <Flex justify="space-between" gap={5} mt={4}>
          <Input.Wrapper w={500}>
            <TextInput
              onChange={(e) => setKey(e.target.value)}
              value={key_}
              placeholder={labelKey}
            />
          </Input.Wrapper>

          <Input.Wrapper w={500}>
            <TextInput
              onChange={(e) => setValue(e.target.value)}
              value={value}
              placeholder={labelValue}
            />
          </Input.Wrapper>

          <ActionIcon
            w={32}
            h={34}
            maw={32}
            size={32}
            variant="default"
            onClick={() => {
              setConfig(() => ({
                ...config,
                [key_]: value,
              }));
              setKey('');
              setValue('');
            }}
          >
            <IconPlus size={18} stroke={1.5} />
          </ActionIcon>
        </Flex>
      </Input.Wrapper>

      <Space my={4} />
      {Object.keys(config).length > 0 && (
        <Table withTableBorder bg="var(--mantine-color-body)">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={600}>
                <Text size="sm">{labelKey}</Text>
              </Table.Th>
              <Table.Th w={600}>
                <Text size="sm">{labelValue}</Text>
              </Table.Th>
              <Table.Th w={30}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Card>
  );
}
