'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, SimpleGrid, Space, Group, Text } from '@mantine/core';

import { IconClock, IconDeviceFloppy, IconRestore, IconCalendarEvent } from '@tabler/icons-react';
import { useViewportSize } from '@mantine/hooks';
import { useApiGet } from '@/hooks/useApiGet';
import { StatsSegments } from './items/StatsSegments';
import { UnscheduledNamespaces } from './items/UnscheduledNamspaces';
import { BackupLatest } from '../Backup/Latest';
import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import { useAgentStatus } from '@/contexts/AgentStatusContext';
import { useServerStatus } from '@/contexts/ServerStatusContext';
import ExpireIn from '../Backup/ExpireIn';
import { DataFetchedInfo } from '../DataFetchedInfo';

export function Dashboard() {
  const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getData, fetching } = useApiGet();
  const [reload, setReload] = useState(1);

  const agentValues = useAgentStatus();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 100 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload>1) {
      getData({ url: '/v1/stats/get', param: 'forced=true' });
    }
  }, [reload]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development')
      console.log(`%cuseEffect 101 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) {
      getData({ url: '/v1/stats/get' });
    }
  }, [agentValues.isAgentAvailable]);

  if (data === undefined || fetching) {
    return (
      <Stack h="100%" justify="center">
        <Center>
          <Loader color="blue" />
        </Center>
      </Stack>
    );
  }

  return (
    <>
      <ScrollArea p={0} style={{ height: '100%' }} scrollbars="y" offsetScrollbars>
        <Stack p={5} w={vpWidth < 768 ? '100vw' : 'calc(100vw - 240px)'} >
          <Stack gap={0}>
            <Toolbar title="Dashboard">
              <RefreshDatatable setReload={setReload} reload={reload} />
            </Toolbar>
            <DataFetchedInfo metadata={data?.metadata} />
            <SimpleGrid
              cols={{ base: 1, sm: 3, lg: 5 }}
              spacing={{ base: 5, sm: 10 }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              <StatsSegments
                data={data.payload.backups.stats.all}
                title="Backups"
                icon={<IconDeviceFloppy />}
              />
              <StatsSegments
                data={data.payload.backups.stats.latest}
                title="Last Schedule Backups"
                icon={<IconClock />}
              />
              <StatsSegments
                data={data.payload.restores.all}
                title="Restores"
                icon={<IconRestore />}
              />
              <StatsSegments
                data={data.payload.schedules.all}
                title="Schedules"
                icon={<IconCalendarEvent />}
              />
              <UnscheduledNamespaces
                namespaces={data.payload?.namespaces?.unscheduled}
                total={data.payload?.namespaces?.total}
              />
            </SimpleGrid>
          </Stack>
        </Stack>
        <Space h={20} />
        <BackupLatest latest={data.payload.backups.latest} reload={reload} setReload={setReload} />
      </ScrollArea>
    </>
  );
}
