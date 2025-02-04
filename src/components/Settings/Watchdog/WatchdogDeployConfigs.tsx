'use client';

import { useEffect, useState } from 'react';
import { Group, Table } from '@mantine/core';
import { IconAlertSquareRounded } from '@tabler/icons-react';

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
  function maskValue(key: string, value: any): string {
    return maskedKeys.includes(key) ? '••••••' : String(value);
  }

  useEffect(() => {
    if (deployConfiguration) {
      const rows = Object.keys(deployConfiguration).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>
            <Group gap={5}>
              {hasChanged(key) && <IconAlertSquareRounded size={16} color="orange" />}
              {key}
            </Group>
          </Table.Td>
          <Table.Td>{maskValue(key, deployConfiguration[key])}</Table.Td>
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
