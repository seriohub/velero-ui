'use client';

import { useEffect, useState } from 'react';
import { Group, Table, Text } from '@mantine/core';
import { IconAlertSquareRounded, IconArrowRight } from '@tabler/icons-react';
import { MaskedConfiguration } from '@/components/Features/Settings/Watchdog/Display/MaskedConfiguration';

interface Props {
  deployConfiguration: Record<string, any>;
  userConfiguration: Record<string, any>;
}

// List of keys whose values should be masked
const maskedKeys = ['APPRISE'];

export function WatchdogDeployConfigs({ deployConfiguration, userConfiguration }: Props) {
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);

  // Function to determine if a key has changed
  function hasChanged(key: string): boolean {
    return (
      userConfiguration?.[key] !== undefined &&
      deployConfiguration?.[key] !== undefined &&
      userConfiguration[key] !== deployConfiguration[key]
    );
  }

  // Function to mask sensitive values
  function maskValue(key: string, value: any): any {
    //return maskedKeys.includes(key) ? '••••••' : String(value);
    return maskedKeys.includes(key) ? <MaskedConfiguration service={value} /> : String(value);
  }

  useEffect(() => {
    if (deployConfiguration) {
      const rows = Object.keys(deployConfiguration).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>
            <Group gap={5}>
              {hasChanged(key) && (
                <IconAlertSquareRounded
                  size={18}
                  color="var(--mantine-primary-color-light-color)"
                />
              )}
              {key}
            </Group>
          </Table.Td>
          <Table.Td>
            <Group gap={5}>
              {maskValue(key, deployConfiguration[key])}
              {hasChanged(key) && (
                <>
                  <Text size="sm" c="var(--mantine-primary-color-light-color)"></Text>{' '}
                  <IconArrowRight size={18} color="var(--mantine-primary-color-light-color)" />
                  <Text>{maskValue(key, userConfiguration[key])}</Text>
                </>
              )}
            </Group>
          </Table.Td>
        </Table.Tr>
      ));
      setRowApiConfiguration(rows);
    }
  }, [deployConfiguration, userConfiguration]);

  return (
    <Table striped highlightOnHover verticalSpacing={0}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w="400px">Name</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rowApiConfiguration}</Table.Tbody>
    </Table>
  );
}
