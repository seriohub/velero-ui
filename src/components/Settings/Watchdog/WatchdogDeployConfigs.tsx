'use client';

import { useEffect, useState } from 'react';

import { Table } from '@mantine/core';

export function WatchdogDeployConfigs({ deployConfiguration }: any) {
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    if (deployConfiguration !== undefined && deployConfiguration !== null) {
      const rows = Object.keys(deployConfiguration?.payload).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>{key}</Table.Td>
          <Table.Td>{deployConfiguration?.payload[key]}</Table.Td>
        </Table.Tr>
      ));
      setRowApiConfiguration(rows);
    }
  }, [deployConfiguration]);

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
