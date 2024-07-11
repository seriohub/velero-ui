'use client';

import { useEffect, useState } from 'react';

import { Group, ScrollArea, Text, Stack, Table } from '@mantine/core';

import { useApiGet } from '@/hooks/useApiGet';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import Toolbar from '../Toolbar';
import SendReport from '../Actions/ToolbarActionIcons/SendReport';
import { WatchdogTestChannel } from './watchdogTestChannel';
import { useAgentStatus } from '@/contexts/AgentStatusContext';

export function Watchdog() {
  const { data: configuration, getData: getConfiguration, fetching } = useApiGet();
  const { data: report, getData: sendReport, fetching: reportFetching } = useApiGet();
  const { data: cron, getData: getCron } = useApiGet();
  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 900 has been called`, `color: green; font-weight: bold;`)
    getConfiguration({ url: '/v1/watchdog/get-config' });
    getCron({ url: '/v1/watchdog/get-cron' });
  }, [reload, agentValues.isAgentAvailable]);

  /*useEffect(() => {
    getConfiguration({ url: '/v1/watchdog/get-config' });
    getCron({ url: '/v1/watchdog/get-cron' });
  }, []);*/

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.log(`%cuseEffect 910 has been called`, `color: green; font-weight: bold;`)
    if (configuration !== undefined) {
      const rows = Object.keys(configuration?.payload).map((key) => (
        <Table.Tr key={key}>
          <Table.Td>{key}</Table.Td>
          <Table.Td>{configuration?.payload[key]}</Table.Td>
        </Table.Tr>
      ));

      setRowApiConfiguration(rows);
    }
  }, [configuration]);

  return (
    <>
      <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
        <WatchdogTestChannel configuration={configuration} />

        <Stack h="100%" gap={0} p={5}>
          <Toolbar title="Watchdog Configuration">
            <RefreshDatatable setReload={setReload} reload={reload} />
            <SendReport fetching={reportFetching} sendReport={sendReport} />
          </Toolbar>
          {cron !== undefined && (
            <Group>
              <Text size="md">Full report cron</Text>
              <Text fw={800}>{cron['payload']}</Text>
            </Group>
          )}
          <Table striped highlightOnHover verticalSpacing={0}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w="400px">Name</Table.Th>
                <Table.Th>Value</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rowApiConfiguration}</Table.Tbody>
          </Table>
        </Stack>
      </ScrollArea>
    </>
  );
}
