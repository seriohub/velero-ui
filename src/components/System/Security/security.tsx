'use client';

import { useEffect } from 'react';

import { List, rem, ScrollArea, Stack, Table, ThemeIcon } from '@mantine/core';

import { useAgentStatus } from '@/contexts/AgentContext';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

import { useDiagnosticAgent } from '@/hooks/diagnostic/useDiagnosticAgent';

import { TableStatusItem } from '../TableStatusItem';

export function Security() {
  const { reload, setReload } = useDiagnosticAgent();

  const agentValues = useAgentStatus();

  const elements = [
    { component: 'API', description: 'Running mode', value: '...' },
    { component: 'WATCHDOG', description: 'Running mode', value: '...' },
    {
      component: 'UI',
      description: 'Running mode',
      value: process.env.NODE_ENV,
      status: (
        <TableStatusItem
          label="Running mode"
          value={`${process.env.NODE_ENV}`}
          ok={process.env.NODE_ENV !== 'development'}
        />
      ),
    },
    {
      component: 'UI',
      description: 'Logger enabled',
      value: process.env.NEXT_PUBLIC_LOGGER_ENABLED,
      status: (
        <TableStatusItem
          label="Logger Enabled"
          value={`${process.env.NEXT_PUBLIC_LOGGER_ENABLED}`}
          ok={process.env.NEXT_PUBLIC_LOGGER_ENABLED?.toLocaleLowerCase() !== 'true'}
        />
      ),
    },
    {
      component: 'UI/CORE - UI/API',
      description: 'HTTPS',
      value: location.protocol,
      status: (
        <TableStatusItem
          label="Logger Enabled"
          value={location.protocol}
          ok={location.protocol === 'https:'}
        />
      ),
    },
  ];

  // useEffect(() => {}, [reload, agentValues.isAgentAvailable]);

  const rows = elements.map((element) => (
    <Table.Tr key={element.component}>
      <Table.Td>{element.component}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.value}</Table.Td>
      <Table.Td>{element.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Info" breadcrumbItem={{ name: 'Security', href: '/info' }}>
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>

        <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
          <Table w={600}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Component</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Value</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </>
  );
}
