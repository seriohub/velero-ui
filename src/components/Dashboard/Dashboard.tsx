'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Loader, Center, ScrollArea, SimpleGrid, Grid } from '@mantine/core';

import { IconClock, IconDeviceFloppy, IconRestore, IconCalendarEvent } from '@tabler/icons-react';
import { useViewportSize } from '@mantine/hooks';

import { StatsSegments } from './items/StatsSegments';
import { UnscheduledNamespaces } from './items/UnscheduledNamspaces';
import { BackupLatest } from '../Velero/Backup/Latest';
import Toolbar from '../Toolbar';
import RefreshDatatable from '../Actions/ToolbarActionIcons/RefreshDatatable';
import { useAgentStatus } from '@/contexts/AgentContext';
import { DataFetchedInfo } from '../DataFetchedInfo';
import { useStats } from '@/api/Stats/useStats';
import { StatsSegmentsDonuts } from './items/StatsSegmentsDonuts';

export function Dashboard() {
  // const { height: vpHeight, width: vpWidth } = useViewportSize();
  const { data, getStats, fetching } = useStats();
  const [reload, setReload] = useState(1);

  const agentValues = useAgentStatus();

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 100 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable && reload > 1) {
      getStats(true);
    }
  }, [reload]);

  useEffect(() => {
    // if (process.env.NODE_ENV === 'development')
    //  console.log(`%cuseEffect 101 has been called`, `color: green; font-weight: bold;`);
    if (agentValues.isAgentAvailable) {
      getStats();
    }
  }, [agentValues.isAgentAvailable]);

  if (data === undefined) {
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
      <ScrollArea p={0} style={{ height: '100%' }} scrollbars="y">
        <Stack p={10}>
          <Toolbar title="Dashboard" fetching={fetching}>
            <RefreshDatatable setReload={setReload} reload={reload} fetching={fetching} />
          </Toolbar>
          <DataFetchedInfo metadata={data?.metadata} />
          <SimpleGrid
            cols={{ base: 1, sm: 1, lg: 3 }}
            spacing={{ base: 10, sm: 18 }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <StatsSegments
              data={data.payload.backups.stats.all}
              title="Backups"
              icon={<IconDeviceFloppy />}
              path="/backups"
            />
            <StatsSegments
              data={data.payload.restores.all}
              title="Restores"
              icon={<IconRestore />}
              path="/restores"
            />
            <StatsSegments
              data={data.payload.schedules.all}
              title="Schedules"
              icon={<IconCalendarEvent />}
              path="/schedules"
            />
          </SimpleGrid>
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 4 }}
            spacing={{ base: 10, sm: 18 }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
          >
            <StatsSegmentsDonuts
              data={data.payload.backups.stats.all}
              title="Backups"
              icon={<IconDeviceFloppy />}
              path="/backups"
            />

            <StatsSegmentsDonuts
              data={data.payload.backups.stats.latest}
              title="Last Backups"
              icon={<IconClock />}
              path="/backups"
            />
            <StatsSegmentsDonuts
              data={data.payload.restores.all}
              title="Restores"
              icon={<IconRestore />}
              path="/restores"
            />
            <StatsSegmentsDonuts
              data={data.payload.schedules.all}
              title="Schedules"
              icon={<IconCalendarEvent />}
              path="/schedules"
            />
          </SimpleGrid>
          {/*</Stack>*/}

          <Grid gutter={{ base: 10, sm: 18 }}>
            <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
              <BackupLatest
                latest={data.payload.backups.latest}
                reload={reload}
                setReload={setReload}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
              <UnscheduledNamespaces
                namespaces={data.payload?.namespaces?.unscheduled}
                total={data.payload?.namespaces?.total}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </ScrollArea>
    </>
  );
}
