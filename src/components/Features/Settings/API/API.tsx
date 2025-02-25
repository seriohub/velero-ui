'use client';

import React, { useEffect, useState } from 'react';

import { ScrollArea, Table } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';

import { MainStack } from '@/components/Commons/MainStack';

import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';

export function API() {
  const agentValues = useAgentStatus();

  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (agentValues.agentConfig !== undefined) {
      const rows = Object.keys(agentValues.agentConfig).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>{key}</Table.Td>
          <Table.Td>{agentValues.agentConfig[key]}</Table.Td>
        </Table.Tr>
      ));

      setRowApiConfiguration(rows);
    }
  }, [agentValues.agentConfig]);

  return (
    <MainStack>
      <Toolbar title="Backup" breadcrumbItem={[{ name: 'API' }]}>
        <ReloadData setReload={setReload} reload={reload} />
      </Toolbar>
      <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
        <Table striped highlightOnHover verticalSpacing={0}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w="400px">Name</Table.Th>
              <Table.Th>Value</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rowApiConfiguration}</Table.Tbody>
        </Table>
      </ScrollArea>
    </MainStack>
  );
}
