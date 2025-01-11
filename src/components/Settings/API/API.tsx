'use client';

import { useEffect, useState } from 'react';

import { ScrollArea, Stack, Table } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import { useAgentConfiguration } from '@/api/Agent/useAgentConfiguration';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

export function API() {
  const agentValues = useAgentStatus();

  // const { data: configuration, getAgentConfiguration, fetching } = useAgentConfiguration();
  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);

  /*useEffect(() => {
    if (agentValues.isAgentAvailable) getAgentConfiguration();
  }, [reload, agentValues.isAgentAvailable]);*/

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
    <Stack h="100%" gap={0} p={5}>
      <Toolbar title="Backup" breadcrumbItem={{ name: 'API', href: '/settings/api' }}>
        <RefreshDatatable setReload={setReload} reload={reload} />
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
    </Stack>
  );
}
