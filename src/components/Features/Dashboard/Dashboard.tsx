'use client';

import React, { useEffect, useState } from 'react';

import { Box, Center, Grid, Loader, ScrollArea, SimpleGrid, Stack } from '@mantine/core';

import { IconCalendarEvent, IconCalendarTime, IconDeviceFloppy, IconHistory, IconRestore } from '@tabler/icons-react';

import { useStats } from '@/api/Stats/useStats';

import { useAgentStatus } from '@/contexts/AgentContext';

import { LatestBackupMRT } from '@/components/Features/Velero/Backups/LatestBackupMRT';
import Toolbar from '@/components/Display/Toolbar';
import ReloadData from '@/components/Inputs/ReloadData';
import { DataFetchedInfo } from '@/components/Display/DataFetchedInfo';

import { StatsSegments } from './items/StatsSegments';
import { UnscheduledNamespaces } from './items/UnscheduledNamspaces';
import { StatsSegmentsDonuts } from './items/StatsSegmentsDonuts';

export function Dashboard() {
  const {
    data,
    getStats,
    fetching,
    fetchedTime
  } = useStats();
  const [reload, setReload] = useState(1);

  const agentValues = useAgentStatus();

  useEffect(() => {
    if (agentValues.isAgentAvailable && reload > 1) {
      getStats(true);
    }
  }, [reload]);

  useEffect(() => {
    if (agentValues.isAgentAvailable) {
      getStats();
    }
  }, [agentValues.isAgentAvailable]);

  if (data === undefined) {
    return (
      <Stack h="100%" justify="center">
        <Center>
          <Loader/>
        </Center>
      </Stack>
    );
  }

  return (
    <>
      <ScrollArea p={0} style={{ height: '100%' }} scrollbars="y">
        <Stack p={10} gap="md">
          <Box>
            <Toolbar title="Dashboard" fetching={fetching}>
              <ReloadData setReload={setReload} reload={reload} fetching={fetching}/>
            </Toolbar>
          </Box>

          <SimpleGrid
            cols={{
              base: 1,
              sm: 1,
              lg: 3,
            }}
            spacing="md"
            verticalSpacing="md"
          >
            <StatsSegments
              data={data.backups.stats.all}
              title="Backups"
              icon={<IconDeviceFloppy/>}
              path="/backups"
            />
            <StatsSegments
              data={data.restores.all}
              title="Restores"
              icon={<IconRestore/>}
              path="/restores"
            />
            <StatsSegments
              data={data.schedules.all}
              title="Schedules"
              icon={<IconCalendarEvent/>}
              path="/schedules"
            />
          </SimpleGrid>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              lg: 4,
            }}
            spacing="md"
            verticalSpacing="md"
          >
            <StatsSegmentsDonuts
              data={data.backups.stats.all}
              title="Backups"
              icon={<IconDeviceFloppy/>}
              path="/backups"
            />

            <StatsSegmentsDonuts
              data={data.backups.stats.latest}
              title="Last Backups"
              icon={<IconHistory/>}
              path="/backups"
            />
            <StatsSegmentsDonuts
              data={data.restores.all}
              title="Restores"
              icon={<IconRestore/>}
              path="/restores"
            />
            <StatsSegmentsDonuts
              data={data.schedules.all}
              title="Schedules"
              icon={<IconCalendarTime/>}
              path="/schedules"
            />
          </SimpleGrid>
          {/*</Stack>*/}

          <Grid gutter="sm">
            <Grid.Col
              span={{
                base: 12,
                md: 12,
                lg: 9,
              }}
            >
              <LatestBackupMRT latest={data.backups.latest} setReload={setReload}/>
            </Grid.Col>
            <Grid.Col
              span={{
                base: 12,
                md: 12,
                lg: 3,
              }}
            >
              <UnscheduledNamespaces
                namespaces={data?.namespaces?.unscheduled}
                total={data?.namespaces?.total}
              />
            </Grid.Col>
          </Grid>
          <DataFetchedInfo fetchedTime={fetchedTime}/>
        </Stack>
      </ScrollArea>
    </>
  );
}
