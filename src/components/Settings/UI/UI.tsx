'use client';

import { useState } from 'react';

import { ScrollArea, Stack, Table } from '@mantine/core';

import { env } from 'next-runtime-env';

import { useServerStatus } from '@/contexts/ServerContext';
import { useAgentStatus } from '@/contexts/AgentContext';

import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';

export function UI() {
  const serverValues = useServerStatus();
  const agentValues = useAgentStatus();

  const [reload, setReload] = useState(1);
  //const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);

  /*useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 490 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) getAgentConfiguration();
  }, [reload, agentValues.isAgentAvailable]);*/

  const uiConfiguration = [
    {
      name: 'NEXT_PUBLIC_REFRESH_DATATABLE_AFTER',
      value: env('NEXT_PUBLIC_REFRESH_DATATABLE_AFTER'),
    },
    { name: 'NEXT_PUBLIC_REFRESH_RECENT', value: env('NEXT_PUBLIC_REFRESH_RECENT') },
    { name: 'NEXT_PUBLIC_VELERO_API_URL', value: serverValues.currentServer?.url },
    { name: 'NEXT_PUBLIC_VELERO_API_WS', value: serverValues.currentServer?.ws },
    {
      name: 'NEXT_PUBLIC_FRONT_END_BUILD_VERSION',
      value: env('NEXT_PUBLIC_FRONT_END_BUILD_VERSION'),
    },
    { name: 'NEXT_PUBLIC_FRONT_END_BUILD_DATE', value: env('NEXT_PUBLIC_FRONT_END_BUILD_DATE') },
  ];

  const rowUiConfiguration = uiConfiguration.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.value}</Table.Td>
    </Table.Tr>
  ));

  /*useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 500 has been called`, `color: green; font-weight: bold;`);
    //if (configuration !== undefined) {
      const rows = Object.keys(agentValues.agentConfig).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>{key}</Table.Td>
          <Table.Td>{agentValues.agentConfig[key]}</Table.Td>
        </Table.Tr>
      ));

      setRowApiConfiguration(rows);
    //}
  }, [agentValues.agentConfig]);*/

  return (
    <>
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Backup" breadcrumbItem={{ name: 'API', href: '/api-config' }}>
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
            <Table.Tbody>{rowUiConfiguration}</Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </>
  );
}
