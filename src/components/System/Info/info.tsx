'use client';

import { useEffect } from 'react';

import { ScrollArea, Stack, Box, Table } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { DiagnosticAgentInfoData } from '@/components/Diagnostic/DiagnosticAgentInfoData';
import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

const elements = [
  { name: 'API', runningMode: '' },
  { name: 'WATCHDOG', runningMode: '' },
  { name: 'UI', runningMode: process.env.NODE_ENV },
];

export function Info() {
  const { reload, setReload } = useDiagnosticAgent();

  const agentValues = useAgentStatus();

  useEffect(() => {}, [reload, agentValues.isAgentAvailable]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.runningMode}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Info" breadcrumbItem={{ name: 'Application info', href: '/info' }}>
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>

        <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
          <Table w={600}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Component</Table.Th>
                <Table.Th>Running mode</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </>
  );
}
