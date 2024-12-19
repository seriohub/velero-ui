'use client';

import { useEffect, useState } from 'react';

import { Group, ScrollArea, Text, Stack, Table } from '@mantine/core';

import { WatchdogTestChannel } from './watchdogTestChannel';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useWatchdogConfig } from '@/api/Watchdog/useWatchdogConfig';
import { useWatchdogCron } from '@/api/Watchdog/useWatchdogCron';
import { useWatchdogSendReport } from '@/api/Watchdog/useWatchdogSendReport';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';
import SendReport from '@/components/Actions/ToolbarActionIcons/SendReport';

export function Watchdog() {
  const { data: configuration, getWatchdogConfig, fetching } = useWatchdogConfig();
  const { data: report, watchdogSendReport, fetching: reportFetching } = useWatchdogSendReport();
  const { data: cron, getWatchdogCron } = useWatchdogCron();
  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);
  const agentValues = useAgentStatus();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 900 has been called`, `color: green; font-weight: bold;`);
    getWatchdogConfig();
    getWatchdogCron();
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 910 has been called`, `color: green; font-weight: bold;`);
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
      <Stack h="100%" gap={0} p={5}>
        <Toolbar title="Watchdog" breadcrumbItem={{ name: 'Watchdog', href: '/watchdog' }}>
          <SendReport fetching={reportFetching} requestSendReport={watchdogSendReport} />
          <RefreshDatatable setReload={setReload} reload={reload} />
        </Toolbar>
        <WatchdogTestChannel configuration={configuration} />
        <ScrollArea p={0} style={{ height: '100%' }} offsetScrollbars>
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
        </ScrollArea>
      </Stack>
    </>
  );
}
