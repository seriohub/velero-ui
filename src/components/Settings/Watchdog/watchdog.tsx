'use client';

import { useEffect, useState } from 'react';

import { Group, ScrollArea, Text, Table, Mark, useComputedColorScheme } from '@mantine/core';

import { WatchdogTestChannel } from './watchdogTestChannel';
import { useAgentStatus } from '@/contexts/AgentContext';
import { useWatchdogConfig } from '@/api/Watchdog/useWatchdogConfig';
import { useWatchdogCron } from '@/api/Watchdog/useWatchdogCron';
import { useWatchdogSendReport } from '@/api/Watchdog/useWatchdogSendReport';
import Toolbar from '@/components/Toolbar';
import RefreshDatatable from '@/components/Actions/ToolbarActionIcons/RefreshDatatable';
import SendReport from '@/components/Actions/ToolbarActionIcons/SendReport';
import { MainStack } from '@/components/Velero/MainStack';

export function Watchdog() {
  const { data: configuration, getWatchdogConfig } = useWatchdogConfig();
  const { data: report, watchdogSendReport, fetching: reportFetching } = useWatchdogSendReport();
  const { data: cron, getWatchdogCron } = useWatchdogCron();
  const [reload, setReload] = useState(1);
  const [rowApiConfiguration, setRowApiConfiguration] = useState<React.ReactNode[]>([]);
  const agentValues = useAgentStatus();
  const computedColorScheme = useComputedColorScheme();

  useEffect(() => {
    getWatchdogConfig();
    getWatchdogCron();
  }, [reload, agentValues.isAgentAvailable]);

  useEffect(() => {
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
    <MainStack>
      <Toolbar title="Watchdog" breadcrumbItem={[{ name: 'Watchdog' }]}>
        <SendReport fetching={reportFetching} requestSendReport={watchdogSendReport} />
        <RefreshDatatable setReload={setReload} reload={reload} />
      </Toolbar>
      <WatchdogTestChannel configuration={configuration} />
      {cron !== undefined && (
        <Group my={10} gap={8}>
          <Text size="md">Full report cron</Text>
          <Text size="md">
            <Mark
              color={
                computedColorScheme === 'light'
                  ? 'var(--mantine-primary-color-3)'
                  : 'var(--mantine-primary-color-5)'
              }
            >
              {cron['payload']}
            </Mark>
          </Text>
        </Group>
      )}
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
